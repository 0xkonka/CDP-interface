import { Decimal } from "./Decimal";
import { Module, ModuleWithPendingRedistribution, UserModule } from "./Module";
import { StabilityDeposit } from "./StabilityDeposit";
import { Fees } from "./Fees";

/**
 * Represents whether an address has been registered as a Tren frontend.
 *
 * @remarks
 * Returned by the {@link ReadableTren.getFrontendStatus | getFrontendStatus()} function.
 *
 * When `status` is `"registered"`, `kickbackRate` gives the frontend's kickback rate as a
 * {@link Decimal} between 0 and 1.
 *
 * @public
 */
export type FrontendStatus =
  | { status: "unregistered" }
  | { status: "registered"; kickbackRate: Decimal };

/**
 * Parameters of the {@link ReadableTren.(getModules:2) | getModules()} function.
 *
 * @public
 */
export interface ModuleListingParams {

  /** Number of Modules to retrieve. */
  readonly first: number;

  /** How the Modules should be sorted. */
  readonly sortedBy: "ascendingCollateralRatio" | "descendingCollateralRatio";

  /** Index of the first Module to retrieve from the sorted list. */
  readonly startingAt?: number;

  /**
   * When set to `true`, the retrieved Modules won't include the liquidation shares received since
   * the last time they were directly modified.
   *
   * @remarks
   * Changes the type of returned Modules to {@link ModuleWithPendingRedistribution}.
   */
  readonly beforeRedistribution?: boolean;
}

/**
 * Read the state of the Tren protocol.
 *
 * @remarks
 * Implemented by {@link @tren/lib-ethers#EthersTren}.
 *
 * @public
 */
export interface ReadableTren {

  /**
   * Get the total collateral and debt per stake that has been liquidated through redistribution.
   *
   * @remarks
   * Needed when dealing with instances of {@link @tren/lib-base#ModuleWithPendingRedistribution}.
   */
  getTotalRedistributed(): Promise<Module>;

  /**
   * Get a Module in its state after the last direct modification.
   *
   * @param address - Address that owns the Module.
   *
   * @remarks
   * The current state of a Module can be fetched using
   * {@link @tren/lib-base#ReadableTren.getModule | getModule()}.
   */
  getModuleBeforeRedistribution(address?: string): Promise<ModuleWithPendingRedistribution>;

  /**
   * Get the current state of a Module.
   *
   * @param address - Address that owns the Module.
   */
  getModule(address?: string): Promise<UserModule>;

  /**
   * Get number of Modules that are currently open.
   */
  getNumberOfModules(): Promise<number>;

  /**
   * Get the current price of the native currency (e.g. Ether) in USD.
   */
  getPrice(): Promise<Decimal>;

  /**
   * Get the total amount of collateral and debt in the Tren system.
   */
  getTotal(): Promise<Module>;

  /**
   * Get the current state of a Stability Deposit.
   *
   * @param address - Address that owns the Stability Deposit.
   */
  getStabilityDeposit(address?: string): Promise<StabilityDeposit>;

  /**
   * Get the total amount of TrenUSD currently deposited in the Stability Pool.
   */
  getTrenUSDInStabilityPool(): Promise<Decimal>;

  /**
   * Get the amount of TrenUSD held by an address.
   *
   * @param address - Address whose balance should be retrieved.
   */
  getTrenUSDBalance(address?: string): Promise<Decimal>;

  /**
   * Get the amount of Uniswap ETH/TrenUSD LP tokens held by an address.
   *
   * @param address - Address whose balance should be retrieved.
   */
  getUniTokenBalance(address?: string): Promise<Decimal>;

  /**
   * Get the liquidity mining contract's allowance of a holder's Uniswap ETH/TrenUSD LP tokens.
   *
   * @param address - Address holding the Uniswap ETH/TrenUSD LP tokens.
   */
  getUniTokenAllowance(address?: string): Promise<Decimal>;

  /**
   * Get the amount of Uniswap ETH/TrenUSD LP tokens currently staked by an address in liquidity mining.
   *
   * @param address - Address whose LP stake should be retrieved.
   */
  getLiquidityMiningStake(address?: string): Promise<Decimal>;

  /**
   * Get the total amount of Uniswap ETH/TrenUSD LP tokens currently staked in liquidity mining.
   */
  getTotalStakedUniTokens(): Promise<Decimal>;

  /**
   * Get the amount of leftover collateral available for withdrawal by an address.
   *
   * @remarks
   * When a Module gets liquidated or redeemed, any collateral it has above 110% (in case of
   * liquidation) or 100% collateralization (in case of redemption) gets sent to a pool, where it
   * can be withdrawn from using
   * {@link @tren/lib-base#TransactableTren.claimCollateralSurplus | claimCollateralSurplus()}.
   */
  getCollateralSurplusBalance(address?: string): Promise<Decimal>;

  /** @internal */
  getModules(
    params: ModuleListingParams & { beforeRedistribution: true }
  ): Promise<ModuleWithPendingRedistribution[]>;

  /**
   * Get a slice from the list of Modules.
   *
   * @param params - Controls how the list is sorted, and where the slice begins and ends.
   * @returns Pairs of owner addresses and their Modules.
   */
  getModules(params: ModuleListingParams): Promise<UserModule[]>;

  /**
   * Get a calculator for current fees.
   */
  getFees(): Promise<Fees>;

  /**
   * Check whether an address is registered as a Tren frontend, and what its kickback rate is.
   *
   * @param address - Address to check.
   */
  getFrontendStatus(address?: string): Promise<FrontendStatus>;
}
