import { BlockTag } from "@ethersproject/abstract-provider";

import {
  Decimal,
  Fees,
  FrontendStatus,
  TrenStore,
  ReadableTren,
  StabilityDeposit,
  Module,
  ModuleListingParams,
  ModuleWithPendingRedistribution,
  UserModule,
  UserModuleStatus
} from "@/lib-base";

import { MultiModuleGetter } from "../types";

import { decimalify, numberify, panic } from "./_utils";
import { EthersCallOverrides, EthersProvider, EthersSigner } from "./types";

import {
  EthersTrenConnection,
  EthersTrenConnectionOptionalParams,
  EthersTrenStoreOption,
  _connect,
  _getBlockTimestamp,
  _getContracts,
  _requireAddress,
  _requireFrontendAddress
} from "./EthersTrenConnection";

import { BlockPolledTrenStore } from "./BlockPolledTrenStore";

// TODO: these are constant in the contracts, so it doesn't make sense to make a call for them,
// but to avoid having to update them here when we change them in the contracts, we could read
// them once after deployment and save them to TrenDeployment.
const MINUTE_DECAY_FACTOR = Decimal.from("0.999037758833783000");
const BETA = Decimal.from(2);

enum BackendModuleStatus {
  nonExistent,
  active,
  closedByOwner,
  closedByLiquidation,
  closedByRedemption
}

const userModuleStatusFrom = (backendStatus: BackendModuleStatus): UserModuleStatus =>
  backendStatus === BackendModuleStatus.nonExistent
    ? "nonExistent"
    : backendStatus === BackendModuleStatus.active
      ? "open"
      : backendStatus === BackendModuleStatus.closedByOwner
        ? "closedByOwner"
        : backendStatus === BackendModuleStatus.closedByLiquidation
          ? "closedByLiquidation"
          : backendStatus === BackendModuleStatus.closedByRedemption
            ? "closedByRedemption"
            : panic(new Error(`invalid backendStatus ${backendStatus}`));

const convertToDate = (timestamp: number) => new Date(timestamp * 1000);

const validSortingOptions = ["ascendingCollateralRatio", "descendingCollateralRatio"];

const expectPositiveInt = <K extends string>(obj: { [P in K]?: number }, key: K) => {
  if (obj[key] !== undefined) {
    if (!Number.isInteger(obj[key])) {
      throw new Error(`${key} must be an integer`);
    }

    if ((obj as any)[key] < 0) {
      throw new Error(`${key} must not be negative`);
    }
  }
};

/**
 * Ethers-based implementation of {@link @tren/lib-base#ReadableTren}.
 *
 * @public
 */
export class ReadableEthersTren implements ReadableTren {
  readonly connection: EthersTrenConnection;

  /** @internal */
  constructor(connection: EthersTrenConnection) {
    this.connection = connection;
  }

  /** @internal */
  static _from(
    connection: EthersTrenConnection & { useStore: "blockPolled" }
  ): ReadableEthersTrenWithStore<BlockPolledTrenStore>;

  /** @internal */
  static _from(connection: EthersTrenConnection): ReadableEthersTren;

  /** @internal */
  static _from(connection: EthersTrenConnection): ReadableEthersTren {
    const readable = new ReadableEthersTren(connection);

    return connection.useStore === "blockPolled"
      ? new _BlockPolledReadableEthersTren(readable)
      : readable;
  }

  /** @internal */
  static connect(
    signerOrProvider: EthersSigner | EthersProvider,
    optionalParams: EthersTrenConnectionOptionalParams & { useStore: "blockPolled" }
  ): Promise<ReadableEthersTrenWithStore<BlockPolledTrenStore>>;

  static connect(
    signerOrProvider: EthersSigner | EthersProvider,
    optionalParams?: EthersTrenConnectionOptionalParams
  ): Promise<ReadableEthersTren>;

  /**
   * Connect to the Tren protocol and create a `ReadableEthersTren` object.
   *
   * @param signerOrProvider - Ethers `Signer` or `Provider` to use for connecting to the Ethereum
   *                           network.
   * @param optionalParams - Optional parameters that can be used to customize the connection.
   */
  static async connect(
    signerOrProvider: EthersSigner | EthersProvider,
    optionalParams?: EthersTrenConnectionOptionalParams
  ): Promise<ReadableEthersTren> {
    return ReadableEthersTren._from(await _connect(signerOrProvider, optionalParams));
  }

  /**
   * Check whether this `ReadableEthersTren` is a {@link ReadableEthersTrenWithStore}.
   */
  hasStore(): this is ReadableEthersTrenWithStore;

  /**
   * Check whether this `ReadableEthersTren` is a
   * {@link ReadableEthersTrenWithStore}\<{@link BlockPolledTrenStore}\>.
   */
  hasStore(store: "blockPolled"): this is ReadableEthersTrenWithStore<BlockPolledTrenStore>;

  hasStore(): boolean {
    return false;
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getTotalRedistributed} */
  async getTotalRedistributed(overrides?: EthersCallOverrides): Promise<Module> {
    const { moduleManager } = _getContracts(this.connection);

    const [collateral, debt] = await Promise.all([
      moduleManager.L_ETH({ ...overrides }).then(decimalify),
      moduleManager.L_TrenUSDDebt({ ...overrides }).then(decimalify)
    ]);

    return new Module(collateral, debt);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getModuleBeforeRedistribution} */
  async getModuleBeforeRedistribution(
    address?: string,
    overrides?: EthersCallOverrides
  ): Promise<ModuleWithPendingRedistribution> {
    address ??= _requireAddress(this.connection);
    const { moduleManager } = _getContracts(this.connection);

    const [module, snapshot] = await Promise.all([
      moduleManager.Modules(address, { ...overrides }),
      moduleManager.rewardSnapshots(address, { ...overrides })
    ]);

    if (module.status === BackendModuleStatus.active) {
      return new ModuleWithPendingRedistribution(
        address,
        userModuleStatusFrom(module.status),
        decimalify(module.coll),
        decimalify(module.debt),
        decimalify(module.stake),
        new Module(decimalify(snapshot.ETH), decimalify(snapshot.TrenUSDDebt))
      );
    } else {
      return new ModuleWithPendingRedistribution(address, userModuleStatusFrom(module.status));
    }
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getModule} */
  async getModule(address?: string, overrides?: EthersCallOverrides): Promise<UserModule> {
    const [module, totalRedistributed] = await Promise.all([
      this.getModuleBeforeRedistribution(address, overrides),
      this.getTotalRedistributed(overrides)
    ]);

    return module.applyRedistribution(totalRedistributed);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getNumberOfModules} */
  async getNumberOfModules(overrides?: EthersCallOverrides): Promise<number> {
    const { moduleManager } = _getContracts(this.connection);

    return (await moduleManager.getModuleOwnersCount({ ...overrides })).toNumber();
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getPrice} */
  getPrice(overrides?: EthersCallOverrides): Promise<Decimal> {
    const { priceFeed } = _getContracts(this.connection);

    return priceFeed.callStatic.fetchPrice({ ...overrides }).then(decimalify);
  }

  /** @internal */
  async _getActivePool(overrides?: EthersCallOverrides): Promise<Module> {
    const { activePool } = _getContracts(this.connection);

    const [activeCollateral, activeDebt] = await Promise.all(
      [
        activePool.getETH({ ...overrides }),
        activePool.getTrenUSDDebt({ ...overrides })
      ].map(getBigNumber => getBigNumber.then(decimalify))
    );

    return new Module(activeCollateral, activeDebt);
  }

  /** @internal */
  async _getDefaultPool(overrides?: EthersCallOverrides): Promise<Module> {
    const { defaultPool } = _getContracts(this.connection);

    const [liquidatedCollateral, closedDebt] = await Promise.all(
      [
        defaultPool.getETH({ ...overrides }),
        defaultPool.getTrenUSDDebt({ ...overrides })
      ].map(getBigNumber => getBigNumber.then(decimalify))
    );

    return new Module(liquidatedCollateral, closedDebt);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getTotal} */
  async getTotal(overrides?: EthersCallOverrides): Promise<Module> {
    const [activePool, defaultPool] = await Promise.all([
      this._getActivePool(overrides),
      this._getDefaultPool(overrides)
    ]);

    return activePool.add(defaultPool);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getStabilityDeposit} */
  async getStabilityDeposit(
    address?: string,
    overrides?: EthersCallOverrides
  ): Promise<StabilityDeposit> {
    address ??= _requireAddress(this.connection);
    const { stabilityPool } = _getContracts(this.connection);

    const [
      { frontEndTag, initialValue },
      currentTrenUSD,
      collateralGain
    ] = await Promise.all([
      stabilityPool.deposits(address, { ...overrides }),
      stabilityPool.getCompoundedTrenUSDDeposit(address, { ...overrides }),
      stabilityPool.getDepositorETHGain(address, { ...overrides })
    ]);

    return new StabilityDeposit(
      decimalify(initialValue),
      decimalify(currentTrenUSD),
      decimalify(collateralGain),
      frontEndTag
    );
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getTrenUSDInStabilityPool} */
  getTrenUSDInStabilityPool(overrides?: EthersCallOverrides): Promise<Decimal> {
    const { stabilityPool } = _getContracts(this.connection);

    return stabilityPool.getTotalTrenUSDDeposits({ ...overrides }).then(decimalify);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getTrenUSDBalance} */
  getTrenUSDBalance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    address ??= _requireAddress(this.connection);
    const { trenUSDToken } = _getContracts(this.connection);

    return trenUSDToken.balanceOf(address, { ...overrides }).then(decimalify);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getUniTokenBalance} */
  getUniTokenBalance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    address ??= _requireAddress(this.connection);
    const { uniToken } = _getContracts(this.connection);

    return uniToken.balanceOf(address, { ...overrides }).then(decimalify);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getUniTokenAllowance} */
  getUniTokenAllowance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    address ??= _requireAddress(this.connection);
    const { uniToken, unipool } = _getContracts(this.connection);

    return uniToken.allowance(address, (unipool as any).address, { ...overrides }).then(decimalify);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getLiquidityMiningStake} */
  getLiquidityMiningStake(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    address ??= _requireAddress(this.connection);
    const { unipool } = _getContracts(this.connection);

    return unipool.balanceOf(address, { ...overrides }).then(decimalify);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getTotalStakedUniTokens} */
  getTotalStakedUniTokens(overrides?: EthersCallOverrides): Promise<Decimal> {
    const { unipool } = _getContracts(this.connection);

    return unipool.totalSupply({ ...overrides }).then(decimalify);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getCollateralSurplusBalance} */
  getCollateralSurplusBalance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    address ??= _requireAddress(this.connection);
    const { collSurplusPool } = _getContracts(this.connection);

    return collSurplusPool.getCollateral(address, { ...overrides }).then(decimalify);
  }

  /** @internal */
  getModules(
    params: ModuleListingParams & { beforeRedistribution: true },
    overrides?: EthersCallOverrides
  ): Promise<ModuleWithPendingRedistribution[]>;

  /** {@inheritDoc @tren/lib-base#ReadableTren.(getModules:2)} */
  getModules(params: ModuleListingParams, overrides?: EthersCallOverrides): Promise<UserModule[]>;

  async getModules(
    params: ModuleListingParams,
    overrides?: EthersCallOverrides
  ): Promise<UserModule[]> {
    const { multiModuleGetter } = _getContracts(this.connection);

    expectPositiveInt(params, "first");
    expectPositiveInt(params, "startingAt");

    if (!validSortingOptions.includes(params.sortedBy)) {
      throw new Error(
        `sortedBy must be one of: ${validSortingOptions.map(x => `"${x}"`).join(", ")}`
      );
    }

    const [totalRedistributed, backendModules] = await Promise.all([
      params.beforeRedistribution ? undefined : this.getTotalRedistributed({ ...overrides }),
      multiModuleGetter.getMultipleSortedModules(
        params.sortedBy === "descendingCollateralRatio"
          ? params.startingAt ?? 0
          : -((params.startingAt ?? 0) + 1),
        params.first,
        { ...overrides }
      )
    ]);

    const modules = mapBackendModules(backendModules);

    if (totalRedistributed) {
      return modules.map(module => module.applyRedistribution(totalRedistributed));
    } else {
      return modules;
    }
  }

  /** @internal */
  _getBlockTimestamp(blockTag?: BlockTag): Promise<number> {
    return _getBlockTimestamp(this.connection, blockTag);
  }

  /** @internal */
  async _getFeesFactory(
    overrides?: EthersCallOverrides
  ): Promise<(blockTimestamp: number, recoveryMode: boolean) => Fees> {
    const { moduleManager } = _getContracts(this.connection);

    const [lastFeeOperationTime, baseRateWithoutDecay] = await Promise.all([
      moduleManager.lastFeeOperationTime({ ...overrides }),
      moduleManager.baseRate({ ...overrides }).then(decimalify)
    ]);

    return (blockTimestamp, recoveryMode) =>
      new Fees(
        baseRateWithoutDecay,
        MINUTE_DECAY_FACTOR,
        BETA,
        convertToDate(lastFeeOperationTime.toNumber()),
        convertToDate(blockTimestamp),
        recoveryMode
      );
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getFees} */
  async getFees(overrides?: EthersCallOverrides): Promise<Fees> {
    const [createFees, total, price, blockTimestamp] = await Promise.all([
      this._getFeesFactory(overrides),
      this.getTotal(overrides),
      this.getPrice(overrides),
      this._getBlockTimestamp(overrides?.blockTag)
    ]);

    return createFees(blockTimestamp, total.collateralRatioIsBelowCritical(price));
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getFrontendStatus} */
  async getFrontendStatus(
    address?: string,
    overrides?: EthersCallOverrides
  ): Promise<FrontendStatus> {
    address ??= _requireFrontendAddress(this.connection);
    const { stabilityPool } = _getContracts(this.connection);

    const { registered, kickbackRate } = await stabilityPool.frontEnds(address, { ...overrides });

    return registered
      ? { status: "registered", kickbackRate: decimalify(kickbackRate) }
      : { status: "unregistered" };
  }
}

type Resolved<T> = T extends Promise<infer U> ? U : T;
type BackendModules = Resolved<ReturnType<MultiModuleGetter["getMultipleSortedModules"]>>;

const mapBackendModules = (modules: BackendModules): ModuleWithPendingRedistribution[] =>
  modules.map(
    module =>
      new ModuleWithPendingRedistribution(
        module.owner,
        "open", // These Modules are coming from the SortedModules list, so they must be open
        decimalify(module.coll),
        decimalify(module.debt),
        decimalify(module.stake),
        new Module(decimalify(module.snapshotETH), decimalify(module.snapshotTrenUSDDebt))
      )
  );

/**
 * Variant of {@link ReadableEthersTren} that exposes a {@link @tren/lib-base#TrenStore}.
 *
 * @public
 */
export interface ReadableEthersTrenWithStore<T extends TrenStore = TrenStore>
  extends ReadableEthersTren {

  /** An object that implements TrenStore. */
  readonly store: T;
}

class _BlockPolledReadableEthersTren
  implements ReadableEthersTrenWithStore<BlockPolledTrenStore> {
  readonly connection: EthersTrenConnection;
  readonly store: BlockPolledTrenStore;

  private readonly _readable: ReadableEthersTren;

  constructor(readable: ReadableEthersTren) {
    const store = new BlockPolledTrenStore(readable);

    this.store = store;
    this.connection = readable.connection;
    this._readable = readable;
  }

  private _blockHit(overrides?: EthersCallOverrides): boolean {
    return (
      !overrides ||
      overrides.blockTag === undefined ||
      overrides.blockTag === this.store.state.blockTag
    );
  }

  private _userHit(address?: string, overrides?: EthersCallOverrides): boolean {
    return (
      this._blockHit(overrides) &&
      (address === undefined || address === this.store.connection.userAddress)
    );
  }

  private _frontendHit(address?: string, overrides?: EthersCallOverrides): boolean {
    return (
      this._blockHit(overrides) &&
      (address === undefined || address === this.store.connection.frontendTag)
    );
  }

  hasStore(store?: EthersTrenStoreOption): boolean {
    return store === undefined || store === "blockPolled";
  }

  async getTotalRedistributed(overrides?: EthersCallOverrides): Promise<Module> {
    return this._blockHit(overrides)
      ? this.store.state.totalRedistributed
      : this._readable.getTotalRedistributed(overrides);
  }

  async getModuleBeforeRedistribution(
    address?: string,
    overrides?: EthersCallOverrides
  ): Promise<ModuleWithPendingRedistribution> {
    return this._userHit(address, overrides)
      ? this.store.state.moduleBeforeRedistribution
      : this._readable.getModuleBeforeRedistribution(address, overrides);
  }

  async getModule(address?: string, overrides?: EthersCallOverrides): Promise<UserModule> {
    return this._userHit(address, overrides)
      ? this.store.state.module
      : this._readable.getModule(address, overrides);
  }

  async getNumberOfModules(overrides?: EthersCallOverrides): Promise<number> {
    return this._blockHit(overrides)
      ? this.store.state.numberOfModules
      : this._readable.getNumberOfModules(overrides);
  }

  async getPrice(overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._blockHit(overrides) ? this.store.state.price : this._readable.getPrice(overrides);
  }

  async getTotal(overrides?: EthersCallOverrides): Promise<Module> {
    return this._blockHit(overrides) ? this.store.state.total : this._readable.getTotal(overrides);
  }

  async getStabilityDeposit(
    address?: string,
    overrides?: EthersCallOverrides
  ): Promise<StabilityDeposit> {
    return this._userHit(address, overrides)
      ? this.store.state.stabilityDeposit
      : this._readable.getStabilityDeposit(address, overrides);
  }

  async getTrenUSDInStabilityPool(overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._blockHit(overrides)
      ? this.store.state.trenUSDInStabilityPool
      : this._readable.getTrenUSDInStabilityPool(overrides);
  }

  async getTrenUSDBalance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._userHit(address, overrides)
      ? this.store.state.trenUSDBalance
      : this._readable.getTrenUSDBalance(address, overrides);
  }

  async getUniTokenBalance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._userHit(address, overrides)
      ? this.store.state.uniTokenBalance
      : this._readable.getUniTokenBalance(address, overrides);
  }

  async getUniTokenAllowance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._userHit(address, overrides)
      ? this.store.state.uniTokenAllowance
      : this._readable.getUniTokenAllowance(address, overrides);
  }

  async getLiquidityMiningStake(
    address?: string,
    overrides?: EthersCallOverrides
  ): Promise<Decimal> {
    return this._userHit(address, overrides)
      ? this.store.state.liquidityMiningStake
      : this._readable.getLiquidityMiningStake(address, overrides);
  }

  async getTotalStakedUniTokens(overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._blockHit(overrides)
      ? this.store.state.totalStakedUniTokens
      : this._readable.getTotalStakedUniTokens(overrides);
  }

  async getCollateralSurplusBalance(
    address?: string,
    overrides?: EthersCallOverrides
  ): Promise<Decimal> {
    return this._userHit(address, overrides)
      ? this.store.state.collateralSurplusBalance
      : this._readable.getCollateralSurplusBalance(address, overrides);
  }

  async _getBlockTimestamp(blockTag?: BlockTag): Promise<number> {
    return this._blockHit({ blockTag })
      ? this.store.state.blockTimestamp
      : this._readable._getBlockTimestamp(blockTag);
  }

  async _getFeesFactory(
    overrides?: EthersCallOverrides
  ): Promise<(blockTimestamp: number, recoveryMode: boolean) => Fees> {
    return this._blockHit(overrides)
      ? this.store.state._feesFactory
      : this._readable._getFeesFactory(overrides);
  }

  async getFees(overrides?: EthersCallOverrides): Promise<Fees> {
    return this._blockHit(overrides) ? this.store.state.fees : this._readable.getFees(overrides);
  }

  async getFrontendStatus(
    address?: string,
    overrides?: EthersCallOverrides
  ): Promise<FrontendStatus> {
    return this._frontendHit(address, overrides)
      ? this.store.state.frontend
      : this._readable.getFrontendStatus(address, overrides);
  }

  getModules(
    params: ModuleListingParams & { beforeRedistribution: true },
    overrides?: EthersCallOverrides
  ): Promise<ModuleWithPendingRedistribution[]>;

  getModules(params: ModuleListingParams, overrides?: EthersCallOverrides): Promise<UserModule[]>;

  getModules(params: ModuleListingParams, overrides?: EthersCallOverrides): Promise<UserModule[]> {
    return this._readable.getModules(params, overrides);
  }

  _getActivePool(): Promise<Module> {
    throw new Error("Method not implemented.");
  }

  _getDefaultPool(): Promise<Module> {
    throw new Error("Method not implemented.");
  }

}
