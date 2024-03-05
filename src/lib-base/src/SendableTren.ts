import { Decimalish } from "./Decimal";
import { ModuleAdjustmentParams, ModuleCreationParams } from "./Module";

import {
  CollateralGainTransferDetails,
  LiquidationDetails,
  RedemptionDetails,
  StabilityDepositChangeDetails,
  StabilityPoolGainsWithdrawalDetails,
  TransactableTren,
  ModuleAdjustmentDetails,
  ModuleClosureDetails,
  ModuleCreationDetails
} from "./TransactableTren";

/**
 * A transaction that has already been sent.
 *
 * @remarks
 * Implemented by {@link @tren/lib-ethers#SentEthersTrenTransaction}.
 *
 * @public
 */
export interface SentTrenTransaction<S = unknown, T extends TrenReceipt = TrenReceipt> {

  /** Implementation-specific sent transaction object. */
  readonly rawSentTransaction: S;

  /**
   * Check whether the transaction has been mined, and whether it was successful.
   *
   * @remarks
   * Unlike {@link @tren/lib-base#SentTrenTransaction.waitForReceipt | waitForReceipt()},
   * this function doesn't wait for the transaction to be mined.
   */
  getReceipt(): Promise<T>;

  /**
   * Wait for the transaction to be mined, and check whether it was successful.
   *
   * @returns Either a {@link @tren/lib-base#FailedReceipt} or a
   *          {@link @tren/lib-base#SuccessfulReceipt}.
   */
  waitForReceipt(): Promise<Extract<T, MinedReceipt>>;
}

/**
 * Indicates that the transaction hasn't been mined yet.
 *
 * @remarks
 * Returned by {@link SentTrenTransaction.getReceipt}.
 *
 * @public
 */
export type PendingReceipt = { status: "pending" };

/** @internal */
export const _pendingReceipt: PendingReceipt = { status: "pending" };

/**
 * Indicates that the transaction has been mined, but it failed.
 *
 * @remarks
 * The `rawReceipt` property is an implementation-specific transaction receipt object.
 *
 * Returned by {@link SentTrenTransaction.getReceipt} and
 * {@link SentTrenTransaction.waitForReceipt}.
 *
 * @public
 */
export type FailedReceipt<R = unknown> = { status: "failed"; rawReceipt: R };

/** @internal */
export const _failedReceipt = <R>(rawReceipt: R): FailedReceipt<R> => ({
  status: "failed",
  rawReceipt
});

/**
 * Indicates that the transaction has succeeded.
 *
 * @remarks
 * The `rawReceipt` property is an implementation-specific transaction receipt object.
 *
 * The `details` property may contain more information about the transaction.
 * See the return types of {@link TransactableTren} functions for the exact contents of `details`
 * for each type of Tren transaction.
 *
 * Returned by {@link SentTrenTransaction.getReceipt} and
 * {@link SentTrenTransaction.waitForReceipt}.
 *
 * @public
 */
export type SuccessfulReceipt<R = unknown, D = unknown> = {
  status: "succeeded";
  rawReceipt: R;
  details: D;
};

/** @internal */
export const _successfulReceipt = <R, D>(
  rawReceipt: R,
  details: D,
  toString?: () => string
): SuccessfulReceipt<R, D> => ({
  status: "succeeded",
  rawReceipt,
  details,
  ...(toString ? { toString } : {})
});

/**
 * Either a {@link FailedReceipt} or a {@link SuccessfulReceipt}.
 *
 * @public
 */
export type MinedReceipt<R = unknown, D = unknown> = FailedReceipt<R> | SuccessfulReceipt<R, D>;

/**
 * One of either a {@link PendingReceipt}, a {@link FailedReceipt} or a {@link SuccessfulReceipt}.
 *
 * @public
 */
export type TrenReceipt<R = unknown, D = unknown> = PendingReceipt | MinedReceipt<R, D>;

/** @internal */
export type _SendableFrom<T, R, S> = {
  [M in keyof T]: T[M] extends (...args: infer A) => Promise<infer D>
  ? (...args: A) => Promise<SentTrenTransaction<S, TrenReceipt<R, D>>>
  : never;
};

/**
 * Send Tren transactions.
 *
 * @remarks
 * The functions return an object implementing {@link SentTrenTransaction}, which can be used
 * to monitor the transaction and get its details when it succeeds.
 *
 * Implemented by {@link @tren/lib-ethers#SendableEthersTren}.
 *
 * @public
 */
export interface SendableTren<R = unknown, S = unknown>
  extends _SendableFrom<TransactableTren, R, S> {
  // Methods re-declared for documentation purposes

  /** {@inheritDoc TransactableTren.openModule} */
  openModule(
    params: ModuleCreationParams<Decimalish>,
    maxBorrowingRate?: Decimalish
  ): Promise<SentTrenTransaction<S, TrenReceipt<R, ModuleCreationDetails>>>;

  /** {@inheritDoc TransactableTren.closeModule} */
  closeModule(): Promise<SentTrenTransaction<S, TrenReceipt<R, ModuleClosureDetails>>>;

  /** {@inheritDoc TransactableTren.adjustModule} */
  adjustModule(
    params: ModuleAdjustmentParams<Decimalish>,
    maxBorrowingRate?: Decimalish
  ): Promise<SentTrenTransaction<S, TrenReceipt<R, ModuleAdjustmentDetails>>>;

  /** {@inheritDoc TransactableTren.depositCollateral} */
  depositCollateral(
    amount: Decimalish
  ): Promise<SentTrenTransaction<S, TrenReceipt<R, ModuleAdjustmentDetails>>>;

  /** {@inheritDoc TransactableTren.withdrawCollateral} */
  withdrawCollateral(
    amount: Decimalish
  ): Promise<SentTrenTransaction<S, TrenReceipt<R, ModuleAdjustmentDetails>>>;

  /** {@inheritDoc TransactableTren.borrowTrenUSD} */
  borrowTrenUSD(
    amount: Decimalish,
    maxBorrowingRate?: Decimalish
  ): Promise<SentTrenTransaction<S, TrenReceipt<R, ModuleAdjustmentDetails>>>;

  /** {@inheritDoc TransactableTren.repayTrenUSD} */
  repayTrenUSD(
    amount: Decimalish
  ): Promise<SentTrenTransaction<S, TrenReceipt<R, ModuleAdjustmentDetails>>>;

  /** @internal */
  setPrice(price: Decimalish): Promise<SentTrenTransaction<S, TrenReceipt<R, void>>>;

  /** {@inheritDoc TransactableTren.liquidate} */
  liquidate(
    address: string | string[]
  ): Promise<SentTrenTransaction<S, TrenReceipt<R, LiquidationDetails>>>;

  /** {@inheritDoc TransactableTren.liquidateUpTo} */
  liquidateUpTo(
    maximumNumberOfModulesToLiquidate: number
  ): Promise<SentTrenTransaction<S, TrenReceipt<R, LiquidationDetails>>>;

  /** {@inheritDoc TransactableTren.depositTrenUSDInStabilityPool} */
  depositTrenUSDInStabilityPool(
    amount: Decimalish,
    frontendTag?: string
  ): Promise<SentTrenTransaction<S, TrenReceipt<R, StabilityDepositChangeDetails>>>;

  /** {@inheritDoc TransactableTren.withdrawTrenUSDFromStabilityPool} */
  withdrawTrenUSDFromStabilityPool(
    amount: Decimalish
  ): Promise<SentTrenTransaction<S, TrenReceipt<R, StabilityDepositChangeDetails>>>;

  /** {@inheritDoc TransactableTren.withdrawGainsFromStabilityPool} */
  withdrawGainsFromStabilityPool(): Promise<
    SentTrenTransaction<S, TrenReceipt<R, StabilityPoolGainsWithdrawalDetails>>
  >;

  /** {@inheritDoc TransactableTren.transferCollateralGainToModule} */
  transferCollateralGainToModule(): Promise<
    SentTrenTransaction<S, TrenReceipt<R, CollateralGainTransferDetails>>
  >;

  /** {@inheritDoc TransactableTren.sendTrenUSD} */
  sendTrenUSD(
    toAddress: string,
    amount: Decimalish
  ): Promise<SentTrenTransaction<S, TrenReceipt<R, void>>>;

  /** {@inheritDoc TransactableTren.redeemTrenUSD} */
  redeemTrenUSD(
    amount: Decimalish,
    maxRedemptionRate?: Decimalish
  ): Promise<SentTrenTransaction<S, TrenReceipt<R, RedemptionDetails>>>;

  /** {@inheritDoc TransactableTren.claimCollateralSurplus} */
  claimCollateralSurplus(): Promise<SentTrenTransaction<S, TrenReceipt<R, void>>>;

  /** {@inheritDoc TransactableTren.withdrawGainsFromStaking} */
  withdrawGainsFromStaking(): Promise<SentTrenTransaction<S, TrenReceipt<R, void>>>;

  /** {@inheritDoc TransactableTren.approveUniTokens} */
  approveUniTokens(
    allowance?: Decimalish
  ): Promise<SentTrenTransaction<S, TrenReceipt<R, void>>>;

  /** {@inheritDoc TransactableTren.stakeUniTokens} */
  stakeUniTokens(amount: Decimalish): Promise<SentTrenTransaction<S, TrenReceipt<R, void>>>;

  /** {@inheritDoc TransactableTren.unstakeUniTokens} */
  unstakeUniTokens(amount: Decimalish): Promise<SentTrenTransaction<S, TrenReceipt<R, void>>>;

  /** {@inheritDoc TransactableTren.exitLiquidityMining} */
  exitLiquidityMining(): Promise<SentTrenTransaction<S, TrenReceipt<R, void>>>;

  /** {@inheritDoc TransactableTren.registerFrontend} */
  registerFrontend(
    kickbackRate: Decimalish
  ): Promise<SentTrenTransaction<S, TrenReceipt<R, void>>>;
}
