import assert from "assert";

import { Decimal } from "./Decimal";
import { StabilityDeposit } from "./StabilityDeposit";
import { Module, ModuleWithPendingRedistribution, UserModule } from "./Module";
import { Fees } from "./Fees";
import { FrontendStatus } from "./ReadableTren";

/**
 * State variables read from the blockchain.
 *
 * @public
 */
export interface TrenStoreBaseState {

  /** Status of currently used frontend. */
  frontend: FrontendStatus;

  /** Status of user's own frontend. */
  ownFrontend: FrontendStatus;

  /** Number of Modules that are currently open. */
  numberOfModules: number;

  /** User's native currency balance (e.g. Ether). */
  accountBalance: Decimal;

  /** User's TrenUSD token balance. */
  trenUSDBalance: Decimal;

  /** User's Uniswap ETH/TrenUSD LP token balance. */
  uniTokenBalance: Decimal;

  /** The liquidity mining contract's allowance of user's Uniswap ETH/TrenUSD LP tokens. */
  uniTokenAllowance: Decimal;

  /** Amount of Uniswap ETH/TrenUSD LP tokens the user has staked in liquidity mining. */
  liquidityMiningStake: Decimal;

  /** Total amount of Uniswap ETH/TrenUSD LP tokens currently staked in liquidity mining. */
  totalStakedUniTokens: Decimal;

  /**
   * Amount of leftover collateral available for withdrawal to the user.
   *
   * @remarks
   * See {@link ReadableTren.getCollateralSurplusBalance | getCollateralSurplusBalance()} for
   * more information.
   */
  collateralSurplusBalance: Decimal;

  /** Current price of the native currency (e.g. Ether) in USD. */
  price: Decimal;

  /** Total amount of TrenUSD currently deposited in the Stability Pool. */
  trenUSDInStabilityPool: Decimal;

  /** Total collateral and debt in the Tren system. */
  total: Module;

  /**
   * Total collateral and debt per stake that has been liquidated through redistribution.
   *
   * @remarks
   * Needed when dealing with instances of {@link ModuleWithPendingRedistribution}.
   */
  totalRedistributed: Module;

  /**
   * User's Module in its state after the last direct modification.
   *
   * @remarks
   * The current state of the user's Module can be found as
   * {@link TrenStoreDerivedState.module | module}.
   */
  moduleBeforeRedistribution: ModuleWithPendingRedistribution;

  /** User's stability deposit. */
  stabilityDeposit: StabilityDeposit;

  /** @internal */
  _feesInNormalMode: Fees;


  /** @internal */
  _riskiestModuleBeforeRedistribution: ModuleWithPendingRedistribution;
}

/**
 * State variables derived from {@link TrenStoreBaseState}.
 *
 * @public
 */
export interface TrenStoreDerivedState {

  /** Current state of user's Module */
  module: UserModule;

  /** Calculator for current fees. */
  fees: Fees;

  /**
   * Current borrowing rate.
   *
   * @remarks
   * A value between 0 and 1.
   *
   * @example
   * For example a value of 0.01 amounts to a borrowing fee of 1% of the borrowed amount.
   */
  borrowingRate: Decimal;

  /**
   * Current redemption rate.
   *
   * @remarks
   * Note that the actual rate paid by a redemption transaction will depend on the amount of TrenUSD
   * being redeemed.
   *
   * Use {@link Fees.redemptionRate} to calculate a precise redemption rate.
   */
  redemptionRate: Decimal;

  /**
   * Whether there are any Modules with collateral ratio below the
   * {@link MINIMUM_COLLATERAL_RATIO | minimum}.
   */
  haveUndercollateralizedModules: boolean;
}

/**
 * Type of {@link TrenStore}'s {@link TrenStore.state | state}.
 *
 * @remarks
 * It combines all properties of {@link TrenStoreBaseState} and {@link TrenStoreDerivedState}
 * with optional extra state added by the particular `TrenStore` implementation.
 *
 * The type parameter `T` may be used to type the extra state.
 *
 * @public
 */
export type TrenStoreState<T = unknown> = TrenStoreBaseState & TrenStoreDerivedState & T;

/**
 * Parameters passed to {@link TrenStore} listeners.
 *
 * @remarks
 * Use the {@link TrenStore.subscribe | subscribe()} function to register a listener.

 * @public
 */
export interface TrenStoreListenerParams<T = unknown> {

  /** The entire previous state. */
  newState: TrenStoreState<T>;

  /** The entire new state. */
  oldState: TrenStoreState<T>;

  /** Only the state variables that have changed. */
  stateChange: Partial<TrenStoreState<T>>;
}

const strictEquals = <T>(a: T, b: T) => a === b;
const eq = <T extends { eq(that: T): boolean }>(a: T, b: T) => a.eq(b);
const equals = <T extends { equals(that: T): boolean }>(a: T, b: T) => a.equals(b);

const frontendStatusEquals = (a: FrontendStatus, b: FrontendStatus) =>
  a.status === "unregistered"
    ? b.status === "unregistered"
    : b.status === "registered" && a.kickbackRate.eq(b.kickbackRate);

const showFrontendStatus = (x: FrontendStatus) =>
  x.status === "unregistered"
    ? '{ status: "unregistered" }'
    : `{ status: "registered", kickbackRate: ${x.kickbackRate} }`;

const wrap = <A extends unknown[], R>(f: (...args: A) => R) => (...args: A) => f(...args);

const difference = <T>(a: T, b: T) =>
  Object.fromEntries(
    Object.entries(a as any).filter(([key, value]) => value !== (b as Record<string, unknown>)[key])
  ) as Partial<T>;

/**
 * Abstract base class of Tren data store implementations.
 *
 * @remarks
 * The type parameter `T` may be used to type extra state added to {@link TrenStoreState} by the
 * subclass.
 *
 * Implemented by {@link @tren/lib-ethers#BlockPolledTrenStore}.
 *
 * @public
 */
export abstract class TrenStore<T = any> {
  /** Turn console logging on/off. */
  logging = false;

  /**
   * Called after the state is fetched for the first time.
   *
   * @remarks
   * See {@link TrenStore.start | start()}.
   */
  onLoaded?: () => void;

  /** @internal */
  protected _loaded = false;

  private _baseState?: TrenStoreBaseState;
  private _derivedState?: TrenStoreDerivedState;
  private _extraState?: T;

  private _updateTimeoutId: ReturnType<typeof setTimeout> | undefined;
  private _listeners = new Set<(params: TrenStoreListenerParams<T>) => void>();

  /**
   * The current store state.
   *
   * @remarks
   * Should not be accessed before the store is loaded. Assign a function to
   * {@link TrenStore.onLoaded | onLoaded} to get a callback when this happens.
   *
   * See {@link TrenStoreState} for the list of properties returned.
   */
  get state(): TrenStoreState<T> {
    return Object.assign({}, this._baseState, this._derivedState, this._extraState);
  }

  /** @internal */
  protected abstract _doStart(): () => void;

  /**
   * Start monitoring the blockchain for Tren state changes.
   *
   * @remarks
   * The {@link TrenStore.onLoaded | onLoaded} callback will be called after the state is fetched
   * for the first time.
   *
   * Use the {@link TrenStore.subscribe | subscribe()} function to register listeners.
   *
   * @returns Function to stop the monitoring.
   */
  start(): () => void {
    const doStop = this._doStart();

    return () => {
      doStop();

      this._cancelUpdateIfScheduled();
    };
  }

  private _cancelUpdateIfScheduled() {
    if (this._updateTimeoutId !== undefined) {
      clearTimeout(this._updateTimeoutId);
    }
  }

  private _scheduleUpdate() {
    this._cancelUpdateIfScheduled();

    this._updateTimeoutId = setTimeout(() => {
      this._updateTimeoutId = undefined;
      this._update();
    }, 30000);
  }

  private _logUpdate<U>(name: string, next: U, show?: (next: U) => string): U {
    if (this.logging) {
      console.log(`${name} updated to ${show ? show(next) : next}`);
    }

    return next;
  }

  private _updateIfChanged<U>(
    equals: (a: U, b: U) => boolean,
    name: string,
    prev: U,
    next?: U,
    show?: (next: U) => string
  ): U {
    return next !== undefined && !equals(prev, next) ? this._logUpdate(name, next, show) : prev;
  }

  private _silentlyUpdateIfChanged<U>(equals: (a: U, b: U) => boolean, prev: U, next?: U): U {
    return next !== undefined && !equals(prev, next) ? next : prev;
  }

  private _updateFees(name: string, prev: Fees, next?: Fees): Fees {
    if (next && !next.equals(prev)) {
      // Filter out fee update spam that happens on every new block by only logging when string
      // representation changes.
      if (`${next}` !== `${prev}`) {
        this._logUpdate(name, next);
      }
      return next;
    } else {
      return prev;
    }
  }

  private _reduce(
    baseState: TrenStoreBaseState,
    baseStateUpdate: Partial<TrenStoreBaseState>
  ): TrenStoreBaseState {
    return {
      frontend: this._updateIfChanged(
        frontendStatusEquals,
        "frontend",
        baseState.frontend,
        baseStateUpdate.frontend,
        showFrontendStatus
      ),

      ownFrontend: this._updateIfChanged(
        frontendStatusEquals,
        "ownFrontend",
        baseState.ownFrontend,
        baseStateUpdate.ownFrontend,
        showFrontendStatus
      ),

      numberOfModules: this._updateIfChanged(
        strictEquals,
        "numberOfModules",
        baseState.numberOfModules,
        baseStateUpdate.numberOfModules
      ),

      accountBalance: this._updateIfChanged(
        eq,
        "accountBalance",
        baseState.accountBalance,
        baseStateUpdate.accountBalance
      ),

      trenUSDBalance: this._updateIfChanged(
        eq,
        "trenUSDBalance",
        baseState.trenUSDBalance,
        baseStateUpdate.trenUSDBalance
      ),

      uniTokenBalance: this._updateIfChanged(
        eq,
        "uniTokenBalance",
        baseState.uniTokenBalance,
        baseStateUpdate.uniTokenBalance
      ),

      uniTokenAllowance: this._updateIfChanged(
        eq,
        "uniTokenAllowance",
        baseState.uniTokenAllowance,
        baseStateUpdate.uniTokenAllowance
      ),

      liquidityMiningStake: this._updateIfChanged(
        eq,
        "liquidityMiningStake",
        baseState.liquidityMiningStake,
        baseStateUpdate.liquidityMiningStake
      ),

      totalStakedUniTokens: this._updateIfChanged(
        eq,
        "totalStakedUniTokens",
        baseState.totalStakedUniTokens,
        baseStateUpdate.totalStakedUniTokens
      ),

      collateralSurplusBalance: this._updateIfChanged(
        eq,
        "collateralSurplusBalance",
        baseState.collateralSurplusBalance,
        baseStateUpdate.collateralSurplusBalance
      ),

      price: this._updateIfChanged(eq, "price", baseState.price, baseStateUpdate.price),

      trenUSDInStabilityPool: this._updateIfChanged(
        eq,
        "trenUSDInStabilityPool",
        baseState.trenUSDInStabilityPool,
        baseStateUpdate.trenUSDInStabilityPool
      ),

      total: this._updateIfChanged(equals, "total", baseState.total, baseStateUpdate.total),

      totalRedistributed: this._updateIfChanged(
        equals,
        "totalRedistributed",
        baseState.totalRedistributed,
        baseStateUpdate.totalRedistributed
      ),

      moduleBeforeRedistribution: this._updateIfChanged(
        equals,
        "moduleBeforeRedistribution",
        baseState.moduleBeforeRedistribution,
        baseStateUpdate.moduleBeforeRedistribution
      ),

      stabilityDeposit: this._updateIfChanged(
        equals,
        "stabilityDeposit",
        baseState.stabilityDeposit,
        baseStateUpdate.stabilityDeposit
      ),

      _feesInNormalMode: this._silentlyUpdateIfChanged(
        equals,
        baseState._feesInNormalMode,
        baseStateUpdate._feesInNormalMode
      ),

      _riskiestModuleBeforeRedistribution: this._silentlyUpdateIfChanged(
        equals,
        baseState._riskiestModuleBeforeRedistribution,
        baseStateUpdate._riskiestModuleBeforeRedistribution
      )
    };
  }

  private _derive({
    moduleBeforeRedistribution,
    totalRedistributed,
    _feesInNormalMode,
    total,
    price,
    _riskiestModuleBeforeRedistribution
  }: TrenStoreBaseState): TrenStoreDerivedState {
    const fees = _feesInNormalMode._setRecoveryMode(total.collateralRatioIsBelowCritical(price));

    return {
      module: moduleBeforeRedistribution.applyRedistribution(totalRedistributed),
      fees,
      borrowingRate: fees.borrowingRate(),
      redemptionRate: fees.redemptionRate(),
      haveUndercollateralizedModules: _riskiestModuleBeforeRedistribution
        .applyRedistribution(totalRedistributed)
        .collateralRatioIsBelowMinimum(price)
    };
  }

  private _reduceDerived(
    derivedState: TrenStoreDerivedState,
    derivedStateUpdate: TrenStoreDerivedState
  ): TrenStoreDerivedState {
    return {
      fees: this._updateFees("fees", derivedState.fees, derivedStateUpdate.fees),

      module: this._updateIfChanged(equals, "module", derivedState.module, derivedStateUpdate.module),

      borrowingRate: this._silentlyUpdateIfChanged(
        eq,
        derivedState.borrowingRate,
        derivedStateUpdate.borrowingRate
      ),

      redemptionRate: this._silentlyUpdateIfChanged(
        eq,
        derivedState.redemptionRate,
        derivedStateUpdate.redemptionRate
      ),

      haveUndercollateralizedModules: this._updateIfChanged(
        strictEquals,
        "haveUndercollateralizedModules",
        derivedState.haveUndercollateralizedModules,
        derivedStateUpdate.haveUndercollateralizedModules
      )
    };
  }

  /** @internal */
  protected abstract _reduceExtra(extraState: T, extraStateUpdate: Partial<T>): T;

  private _notify(params: TrenStoreListenerParams<T>) {
    // Iterate on a copy of `_listeners`, to avoid notifying any new listeners subscribed by
    // existing listeners, as that could result in infinite loops.
    //
    // Before calling a listener from our copy of `_listeners`, check if it has been removed from
    // the original set. This way we avoid calling listeners that have already been unsubscribed
    // by an earlier listener callback.
    [...this._listeners].forEach(listener => {
      if (this._listeners.has(listener)) {
        listener(params);
      }
    });
  }

  /**
   * Register a state change listener.
   *
   * @param listener - Function that will be called whenever state changes.
   * @returns Function to unregister this listener.
   */
  subscribe(listener: (params: TrenStoreListenerParams<T>) => void): () => void {
    const uniqueListener = wrap(listener);

    this._listeners.add(uniqueListener);

    return () => {
      this._listeners.delete(uniqueListener);
    };
  }

  /** @internal */
  protected _load(baseState: TrenStoreBaseState, extraState?: T): void {
    assert(!this._loaded);

    this._baseState = baseState;
    this._derivedState = this._derive(baseState);
    this._extraState = extraState;
    this._loaded = true;

    this._scheduleUpdate();

    if (this.onLoaded) {
      this.onLoaded();
    }
  }

  /** @internal */
  protected _update(
    baseStateUpdate?: Partial<TrenStoreBaseState>,
    extraStateUpdate?: Partial<T>
  ): void {
    assert(this._baseState && this._derivedState);

    const oldState = this.state;

    if (baseStateUpdate) {
      this._baseState = this._reduce(this._baseState, baseStateUpdate);
    }

    // Always running this lets us derive state based on passage of time, like baseRate decay
    this._derivedState = this._reduceDerived(this._derivedState, this._derive(this._baseState));

    if (extraStateUpdate) {
      assert(this._extraState);
      this._extraState = this._reduceExtra(this._extraState, extraStateUpdate);
    }

    this._scheduleUpdate();

    this._notify({
      newState: this.state,
      oldState,
      stateChange: difference(this.state, oldState)
    });
  }
}
