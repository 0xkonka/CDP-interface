import { JsonFragment, LogDescription } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { Log } from "@ethersproject/abstract-provider";

import {
  Contract,
  ContractInterface,
  ContractFunction,
  Overrides,
  CallOverrides,
  PopulatedTransaction,
  ContractTransaction
} from "@ethersproject/contracts";

import activePoolAbi from "../abi/ActivePool.json";
import borrowerOperationsAbi from "../abi/BorrowerOperations.json";
import moduleManagerAbi from "../abi/ModuleManager.json";
import trenUSDTokenAbi from "../abi/TrenUSDToken.json";
import collSurplusPoolAbi from "../abi/CollSurplusPool.json";
import communityIssuanceAbi from "../abi/CommunityIssuance.json";
import defaultPoolAbi from "../abi/DefaultPool.json";
import hintHelpersAbi from "../abi/HintHelpers.json";
import lockupContractFactoryAbi from "../abi/LockupContractFactory.json";
import multiModuleGetterAbi from "../abi/MultiModuleGetter.json";
import priceFeedAbi from "../abi/PriceFeed.json";
import priceFeedTestnetAbi from "../abi/PriceFeedTestnet.json";
import sortedModulesAbi from "../abi/SortedModules.json";
import stabilityPoolAbi from "../abi/StabilityPool.json";
import gasPoolAbi from "../abi/GasPool.json";
import unipoolAbi from "../abi/Unipool.json";
import iERC20Abi from "../abi/IERC20.json";
import erc20MockAbi from "../abi/ERC20Mock.json";

import {
  ActivePool,
  BorrowerOperations,
  ModuleManager,
  TrenUSDToken,
  CollSurplusPool,
  CommunityIssuance,
  DefaultPool,
  HintHelpers,
  LockupContractFactory,
  MultiModuleGetter,
  PriceFeed,
  PriceFeedTestnet,
  SortedModules,
  StabilityPool,
  GasPool,
  Unipool,
  ERC20Mock,
  IERC20
} from "../types";

import { EthersProvider, EthersSigner } from "./types";

export interface _TypedLogDescription<T> extends Omit<LogDescription, "args"> {
  args: T;
}

type BucketOfFunctions = Record<string, (...args: unknown[]) => never>;

// Removes unsafe index signatures from an Ethers contract type
export type _TypeSafeContract<T> = Pick<
  T,
  {
    [P in keyof T]: BucketOfFunctions extends T[P] ? never : P;
  } extends {
    [_ in keyof T]: infer U;
  }
  ? U
  : never
>;

type EstimatedContractFunction<R = unknown, A extends unknown[] = unknown[], O = Overrides> = (
  overrides: O,
  adjustGas: (gas: BigNumber) => BigNumber,
  ...args: A
) => Promise<R>;

type CallOverridesArg = [overrides?: CallOverrides];

type TypedContract<T extends Contract, U, V> = _TypeSafeContract<T> &
  U &
  {
    [P in keyof V]: V[P] extends (...args: infer A) => unknown
    ? (...args: A) => Promise<ContractTransaction>
    : never;
  } & {
    readonly callStatic: {
      [P in keyof V]: V[P] extends (...args: [...infer A, never]) => infer R
      ? (...args: [...A, ...CallOverridesArg]) => R
      : never;
    };

    readonly estimateGas: {
      [P in keyof V]: V[P] extends (...args: infer A) => unknown
      ? (...args: A) => Promise<BigNumber>
      : never;
    };

    readonly populateTransaction: {
      [P in keyof V]: V[P] extends (...args: infer A) => unknown
      ? (...args: A) => Promise<PopulatedTransaction>
      : never;
    };

    readonly estimateAndPopulate: {
      [P in keyof V]: V[P] extends (...args: [...infer A, infer O | undefined]) => unknown
      ? EstimatedContractFunction<PopulatedTransaction, A, O>
      : never;
    };
  };

const buildEstimatedFunctions = <T>(
  estimateFunctions: Record<string, ContractFunction<BigNumber>>,
  functions: Record<string, ContractFunction<T>>
): Record<string, EstimatedContractFunction<T>> =>
  Object.fromEntries(
    Object.keys(estimateFunctions).map(functionName => [
      functionName,
      async (overrides, adjustEstimate, ...args) => {
        if (overrides.gasLimit === undefined) {
          const estimatedGas = await estimateFunctions[functionName](...args, overrides);

          overrides = {
            ...overrides,
            gasLimit: adjustEstimate(estimatedGas)
          };
        }

        return functions[functionName](...args, overrides);
      }
    ])
  );

export class _TrenContract extends Contract {
  readonly estimateAndPopulate: Record<string, EstimatedContractFunction<PopulatedTransaction>>;

  constructor(
    addressOrName: string,
    contractInterface: ContractInterface,
    signerOrProvider?: EthersSigner | EthersProvider
  ) {
    super(addressOrName, contractInterface, signerOrProvider);

    // this.estimateAndCall = buildEstimatedFunctions(this.estimateGas, this);
    this.estimateAndPopulate = buildEstimatedFunctions(this.estimateGas, this.populateTransaction);
  }

  extractEvents(logs: Log[], name: string): _TypedLogDescription<unknown>[] {
    return logs
      .filter(log => log.address === this.address)
      .map(log => this.interface.parseLog(log))
      .filter(e => e.name === name);
  }
}

/** @internal */
export type _TypedTrenContract<T = unknown, U = unknown> = TypedContract<_TrenContract, T, U>;

/** @internal */
export interface _TrenContracts {
  activePool: ActivePool;
  borrowerOperations: BorrowerOperations;
  moduleManager: ModuleManager;
  trenUSDToken: TrenUSDToken;
  collSurplusPool: CollSurplusPool;
  communityIssuance: CommunityIssuance;
  defaultPool: DefaultPool;
  hintHelpers: HintHelpers;
  lockupContractFactory: LockupContractFactory;
  multiModuleGetter: MultiModuleGetter;
  priceFeed: PriceFeed | PriceFeedTestnet;
  sortedModules: SortedModules;
  stabilityPool: StabilityPool;
  gasPool: GasPool;
  unipool: Unipool;
  uniToken: IERC20 | ERC20Mock;
}

/** @internal */
export const _priceFeedIsTestnet = (
  priceFeed: PriceFeed | PriceFeedTestnet
): priceFeed is PriceFeedTestnet => "setPrice" in priceFeed;

/** @internal */
export const _uniTokenIsMock = (uniToken: IERC20 | ERC20Mock): uniToken is ERC20Mock =>
  "mint" in uniToken;

type TrenContractsKey = keyof _TrenContracts;

/** @internal */
export type _TrenContractAddresses = Record<TrenContractsKey, string>;

type TrenContractAbis = Record<TrenContractsKey, JsonFragment[]>;

const getAbi = (priceFeedIsTestnet: boolean, uniTokenIsMock: boolean): TrenContractAbis => ({
  activePool: activePoolAbi,
  borrowerOperations: borrowerOperationsAbi,
  moduleManager: moduleManagerAbi,
  trenUSDToken: trenUSDTokenAbi,
  communityIssuance: communityIssuanceAbi,
  defaultPool: defaultPoolAbi,
  hintHelpers: hintHelpersAbi,
  lockupContractFactory: lockupContractFactoryAbi,
  multiModuleGetter: multiModuleGetterAbi,
  priceFeed: priceFeedIsTestnet ? priceFeedTestnetAbi : priceFeedAbi,
  sortedModules: sortedModulesAbi,
  stabilityPool: stabilityPoolAbi,
  gasPool: gasPoolAbi,
  collSurplusPool: collSurplusPoolAbi,
  unipool: unipoolAbi,
  uniToken: uniTokenIsMock ? erc20MockAbi : iERC20Abi
});

const mapTrenContracts = <T, U>(
  contracts: Record<TrenContractsKey, T>,
  f: (t: T, key: TrenContractsKey) => U
) =>
  Object.fromEntries(
    Object.entries(contracts).map(([key, t]) => [key, f(t, key as TrenContractsKey)])
  ) as Record<TrenContractsKey, U>;

/** @internal */
export interface _TrenDeploymentJSON {
  readonly chainId: number;
  readonly addresses: _TrenContractAddresses;
  readonly version: string;
  readonly deploymentDate: number;
  readonly startBlock: number;
  readonly bootstrapPeriod: number;  readonly _priceFeedIsTestnet: boolean;
  readonly _uniTokenIsMock: boolean;
  readonly _isDev: boolean;
}

/** @internal */
export const _connectToContracts = (
  signerOrProvider: EthersSigner | EthersProvider,
  { addresses, _priceFeedIsTestnet, _uniTokenIsMock }: _TrenDeploymentJSON
): _TrenContracts => {
  const abi = getAbi(_priceFeedIsTestnet, _uniTokenIsMock);

  return mapTrenContracts(
    addresses,
    (address, key) =>
      new _TrenContract(address, abi[key], signerOrProvider) as _TypedTrenContract
  ) as _TrenContracts;
};
