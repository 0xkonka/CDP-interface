import { Block, BlockTag } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";

import { Decimal } from "@/lib-base";

import devOrNull from "../deployments/dev.json";
import goerli from "../deployments/goerli.json";
import kovan from "../deployments/kovan.json";
import rinkeby from "../deployments/rinkeby.json";
import ropsten from "../deployments/ropsten.json";
import mainnet from "../deployments/mainnet.json";
import kiln from "../deployments/kiln.json";
import sepolia from "../deployments/sepolia.json";

import { numberify, panic } from "./_utils";
import { EthersProvider, EthersSigner } from "./types";

import {
  _connectToContracts,
  _TrenContractAddresses,
  _TrenContracts,
  _TrenDeploymentJSON
} from "./contracts";

import { _connectToMulticall, _Multicall } from "./_Multicall";

const dev = devOrNull as _TrenDeploymentJSON | null;

const deployments: {
  [chainId: number]: _TrenDeploymentJSON | undefined;
} = {
  [mainnet.chainId]: mainnet,
  [ropsten.chainId]: ropsten,
  [rinkeby.chainId]: rinkeby,
  [goerli.chainId]: goerli,
  [kovan.chainId]: kovan,
  [kiln.chainId]: kiln,
  [sepolia.chainId]: sepolia,

  ...(dev !== null ? { [dev.chainId]: dev } : {})
};

declare const brand: unique symbol;

const branded = <T>(t: Omit<T, typeof brand>): T => t as T;

/**
 * Information about a connection to the Tren protocol.
 *
 * @remarks
 * Provided for debugging / informational purposes.
 *
 * Exposed through {@link ReadableEthersTren.connection} and {@link EthersTren.connection}.
 *
 * @public
 */
export interface EthersTrenConnection extends EthersTrenConnectionOptionalParams {

  /** Ethers `Provider` used for connecting to the network. */
  readonly provider: EthersProvider;

  /** Ethers `Signer` used for sending transactions. */
  readonly signer?: EthersSigner;

  /** Chain ID of the connected network. */
  readonly chainId: number;

  /** Version of the Tren contracts (Git commit hash). */
  readonly version: string;

  /** Date when the Tren contracts were deployed. */
  readonly deploymentDate: Date;

  /** Number of block in which the first Tren contract was deployed. */
  readonly startBlock: number;

  /** Time period (in seconds) after `deploymentDate` during which redemptions are disabled. */
  readonly bootstrapPeriod: number;


  /** A mapping of Tren contracts' names to their addresses. */
  readonly addresses: Record<string, string>;

  /** @internal */
  readonly _priceFeedIsTestnet: boolean;

  /** @internal */
  readonly _isDev: boolean;

  /** @internal */
  readonly [brand]: unique symbol;
}

/** @internal */
export interface _InternalEthersTrenConnection extends EthersTrenConnection {
  readonly addresses: _TrenContractAddresses;
  readonly _contracts: _TrenContracts;
  readonly _multicall?: _Multicall;
}

const connectionFrom = (
  provider: EthersProvider,
  signer: EthersSigner | undefined,
  _contracts: _TrenContracts,
  _multicall: _Multicall | undefined,
  {
    deploymentDate,
    ...deployment
  }: _TrenDeploymentJSON,
  optionalParams?: EthersTrenConnectionOptionalParams
): _InternalEthersTrenConnection => {
  if (
    optionalParams &&
    optionalParams.useStore !== undefined &&
    !validStoreOptions.includes(optionalParams.useStore)
  ) {
    throw new Error(`Invalid useStore value ${optionalParams.useStore}`);
  }

  return branded({
    provider,
    signer,
    _contracts,
    _multicall,
    deploymentDate: new Date(deploymentDate),
    ...deployment,
    ...optionalParams
  });
};

/** @internal */
export const _getContracts = (connection: EthersTrenConnection): _TrenContracts =>
  (connection as _InternalEthersTrenConnection)._contracts;

const getMulticall = (connection: EthersTrenConnection): _Multicall | undefined =>
  (connection as _InternalEthersTrenConnection)._multicall;

const getTimestampFromBlock = ({ timestamp }: Block) => timestamp;

/** @internal */
export const _getBlockTimestamp = (
  connection: EthersTrenConnection,
  blockTag: BlockTag = "latest"
): Promise<number> =>
  // Get the timestamp via a contract call whenever possible, to make it batchable with other calls
  getMulticall(connection)?.getCurrentBlockTimestamp({ blockTag }).then(numberify) ??
  _getProvider(connection).getBlock(blockTag).then(getTimestampFromBlock);

/** @internal */
export const _requireSigner = (connection: EthersTrenConnection): EthersSigner =>
  connection.signer ?? panic(new Error("Must be connected through a Signer"));

/** @internal */
export const _getProvider = (connection: EthersTrenConnection): EthersProvider =>
  connection.provider;

// TODO parameterize error message?
/** @internal */
export const _requireAddress = (
  connection: EthersTrenConnection,
  overrides?: { from?: string }
): string =>
  overrides?.from ?? connection.userAddress ?? panic(new Error("A user address is required"));

/** @internal */
export const _requireFrontendAddress = (connection: EthersTrenConnection): string =>
  connection.frontendTag ?? panic(new Error("A frontend address is required"));

/** @internal */
export const _usingStore = (
  connection: EthersTrenConnection
): connection is EthersTrenConnection & { useStore: EthersTrenStoreOption } =>
  connection.useStore !== undefined;

/**
 * Thrown when trying to connect to a network where Tren is not deployed.
 *
 * @remarks
 * Thrown by {@link ReadableEthersTren.(connect:2)} and {@link EthersTren.(connect:2)}.
 *
 * @public
 */
export class UnsupportedNetworkError extends Error {
  /** Chain ID of the unsupported network. */
  readonly chainId: number;

  /** @internal */
  constructor(chainId: number) {
    super(`Unsupported network (chainId = ${chainId})`);
    this.name = "UnsupportedNetworkError";
    this.chainId = chainId;
  }
}

const getProviderAndSigner = (
  signerOrProvider: EthersSigner | EthersProvider
): [provider: EthersProvider, signer: EthersSigner | undefined] => {
  const provider: EthersProvider = Signer.isSigner(signerOrProvider)
    ? signerOrProvider.provider ?? panic(new Error("Signer must have a Provider"))
    : signerOrProvider;

  const signer = Signer.isSigner(signerOrProvider) ? signerOrProvider : undefined;

  return [provider, signer];
};

/** @internal */
export const _connectToDeployment = (
  deployment: _TrenDeploymentJSON,
  signerOrProvider: EthersSigner | EthersProvider,
  optionalParams?: EthersTrenConnectionOptionalParams
): EthersTrenConnection =>
  connectionFrom(
    ...getProviderAndSigner(signerOrProvider),
    _connectToContracts(signerOrProvider, deployment),
    undefined,
    deployment,
    optionalParams
  );

/**
 * Possible values for the optional
 * {@link EthersTrenConnectionOptionalParams.useStore | useStore}
 * connection parameter.
 *
 * @remarks
 * Currently, the only supported value is `"blockPolled"`, in which case a
 * {@link BlockPolledTrenStore} will be created.
 *
 * @public
 */
export type EthersTrenStoreOption = "blockPolled";

const validStoreOptions = ["blockPolled"];

/**
 * Optional parameters of {@link ReadableEthersTren.(connect:2)} and
 * {@link EthersTren.(connect:2)}.
 *
 * @public
 */
export interface EthersTrenConnectionOptionalParams {

  /**
   * Address whose Module, Stability Deposit, Stake and balances will be read by default.
   *
   * @remarks
   * For example {@link EthersTren.getModule | getModule(address?)} will return the Module owned by
   * `userAddress` when the `address` parameter is omitted.
   *
   * Should be omitted when connecting through a {@link EthersSigner | Signer}. Instead `userAddress`
   * will be automatically determined from the `Signer`.
   */
  readonly userAddress?: string;

  /**
   * Address that will receive rewards from newly created Stability Deposits by default.
   *
   * @remarks
   * For example
   * {@link EthersTren.depositTrenUSDInStabilityPool | depositTrenUSDInStabilityPool(amount, frontendTag?)}
   * will tag newly made Stability Deposits with this address when its `frontendTag` parameter is
   * omitted.
   */
  readonly frontendTag?: string;

  /**
   * Create a {@link @tren/lib-base#TrenStore} and expose it as the `store` property.
   *
   * @remarks
   * When set to one of the available {@link EthersTrenStoreOption | options},
   * {@link ReadableEthersTren.(connect:2) | ReadableEthersTren.connect()} will return a
   * {@link ReadableEthersTrenWithStore}, while
   * {@link EthersTren.(connect:2) | EthersTren.connect()} will return an
   * {@link EthersTrenWithStore}.
   *
   * Note that the store won't start monitoring the blockchain until its
   * {@link @tren/lib-base#TrenStore.start | start()} function is called.
   */
  readonly useStore?: EthersTrenStoreOption;
}

/** @internal */
export function _connectByChainId<T>(
  provider: EthersProvider,
  signer: EthersSigner | undefined,
  chainId: number,
  optionalParams: EthersTrenConnectionOptionalParams & { useStore: T }
): EthersTrenConnection & { useStore: T };

/** @internal */
export function _connectByChainId(
  provider: EthersProvider,
  signer: EthersSigner | undefined,
  chainId: number,
  optionalParams?: EthersTrenConnectionOptionalParams
): EthersTrenConnection;

/** @internal */
export function _connectByChainId(
  provider: EthersProvider,
  signer: EthersSigner | undefined,
  chainId: number,
  optionalParams?: EthersTrenConnectionOptionalParams
): EthersTrenConnection {
  const deployment: _TrenDeploymentJSON =
    deployments[chainId] ?? panic(new UnsupportedNetworkError(chainId));

  return connectionFrom(
    provider,
    signer,
    _connectToContracts(provider, deployment),
    _connectToMulticall(provider, chainId),
    deployment,
    optionalParams
  );
}

/** @internal */
export const _connect = async (
  signerOrProvider: EthersSigner | EthersProvider,
  optionalParams?: EthersTrenConnectionOptionalParams
): Promise<EthersTrenConnection> => {
  const [provider, signer] = getProviderAndSigner(signerOrProvider);

  if (signer) {
    if (optionalParams?.userAddress !== undefined) {
      throw new Error("Can't override userAddress when connecting through Signer");
    }

    optionalParams = {
      ...optionalParams,
      userAddress: await signer.getAddress()
    };
  }

  return _connectByChainId(provider, signer, (await provider.getNetwork()).chainId, optionalParams);
};
