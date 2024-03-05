import { Decimal, Decimalish } from "./Decimal";
import { ModuleAdjustmentParams, ModuleCreationParams } from "./Module";
import { TrenReceipt, SendableTren, SentTrenTransaction } from "./SendableTren";

import {
  CollateralGainTransferDetails,
  LiquidationDetails,
  RedemptionDetails,
  StabilityDepositChangeDetails,
  StabilityPoolGainsWithdrawalDetails,
  ModuleAdjustmentDetails,
  ModuleClosureDetails,
  ModuleCreationDetails
} from "./TransactableTren";

/**
 * A transaction that has been prepared for sending.
 *
 * @remarks
 * Implemented by {@link @tren/lib-ethers#PopulatedEthersTrenTransaction}.
 *
 * @public
 */
export interface PopulatedTrenTransaction<
  P = unknown,
  T extends SentTrenTransaction = SentTrenTransaction
> {

  /** Implementation-specific populated transaction object. */
  readonly rawPopulatedTransaction: P;

  /**
   * Send the transaction.
   *
   * @returns An object that implements {@link @tren/lib-base#SentTrenTransaction}.
   */
  send(): Promise<T>;
}

/**
 * A redemption transaction that has been prepared for sending.
 *
 * @remarks
 * The Tren protocol fulfills redemptions by repaying the debt of Modules in ascending order of
 * their collateralization ratio, and taking a portion of their collateral in exchange. Due to the
 * {@link @tren/lib-base#TrenUSD_MINIMUM_DEBT | minimum debt} requirement that Modules must fulfill,
 * some TrenUSD amounts are not possible to redeem exactly.
 *
 * When {@link @tren/lib-base#PopulatableTren.redeemTrenUSD | redeemTrenUSD()} is called with an
 * amount that can't be fully redeemed, the amount will be truncated (see the `redeemableTrenUSDAmount`
 * property). When this happens, the redeemer can either redeem the truncated amount by sending the
 * transaction unchanged, or prepare a new transaction by
 * {@link @tren/lib-base#PopulatedRedemption.increaseAmountByMinimumNetDebt | increasing the amount}
 * to the next lowest possible value, which is the sum of the truncated amount and
 * {@link @tren/lib-base#TrenUSD_MINIMUM_NET_DEBT}.
 *
 * @public
 */
export interface PopulatedRedemption<P = unknown, S = unknown, R = unknown>
  extends PopulatedTrenTransaction<
    P,
    SentTrenTransaction<S, TrenReceipt<R, RedemptionDetails>>
  > {

  /** Amount of TrenUSD the redeemer is trying to redeem. */
  readonly attemptedTrenUSDAmount: Decimal;

  /** Maximum amount of TrenUSD that is currently redeemable from `attemptedTrenUSDAmount`. */
  readonly redeemableTrenUSDAmount: Decimal;

  /** Whether `redeemableTrenUSDAmount` is less than `attemptedTrenUSDAmount`. */
  readonly isTruncated: boolean;

  /**
   * Prepare a new transaction by increasing the attempted amount to the next lowest redeemable
   * value.
   *
   * @param maxRedemptionRate - Maximum acceptable
   *                            {@link @tren/lib-base#Fees.redemptionRate | redemption rate} to
   *                            use in the new transaction.
   *
   * @remarks
   * If `maxRedemptionRate` is omitted, the original transaction's `maxRedemptionRate` is reused
   * unless that was also omitted, in which case the current redemption rate (based on the increased
   * amount) plus 0.1% is used as maximum acceptable rate.
   */
  increaseAmountByMinimumNetDebt(
    maxRedemptionRate?: Decimalish
  ): Promise<PopulatedRedemption<P, S, R>>;
}

/** @internal */
export type _PopulatableFrom<T, P> = {
  [M in keyof T]: T[M] extends (...args: infer A) => Promise<infer U>
  ? U extends SentTrenTransaction
  ? (...args: A) => Promise<PopulatedTrenTransaction<P, U>>
  : never
  : never;
};

/**
 * Prepare Tren transactions for sending.
 *
 * @remarks
 * The functions return an object implementing {@link PopulatedTrenTransaction}, which can be
 * used to send the transaction and get a {@link SentTrenTransaction}.
 *
 * Implemented by {@link @tren/lib-ethers#PopulatableEthersTren}.
 *
 * @public
 */
export interface PopulatableTren<R = unknown, S = unknown, P = unknown>
  extends _PopulatableFrom<SendableTren<R, S>, P> {
  // Methods re-declared for documentation purposes

  /** {@inheritDoc TransactableTren.openModule} */
  openModule(
    params: ModuleCreationParams<Decimalish>,
    maxBorrowingRate?: Decimalish
  ): Promise<
    PopulatedTrenTransaction<
      P,
      SentTrenTransaction<S, TrenReceipt<R, ModuleCreationDetails>>
    >
  >;

  /** {@inheritDoc TransactableTren.closeModule} */
  closeModule(): Promise<
    PopulatedTrenTransaction<P, SentTrenTransaction<S, TrenReceipt<R, ModuleClosureDetails>>>
  >;

  /** {@inheritDoc TransactableTren.adjustModule} */
  adjustModule(
    params: ModuleAdjustmentParams<Decimalish>,
    maxBorrowingRate?: Decimalish
  ): Promise<
    PopulatedTrenTransaction<
      P,
      SentTrenTransaction<S, TrenReceipt<R, ModuleAdjustmentDetails>>
    >
  >;

  /** {@inheritDoc TransactableTren.depositCollateral} */
  depositCollateral(
    amount: Decimalish
  ): Promise<
    PopulatedTrenTransaction<
      P,
      SentTrenTransaction<S, TrenReceipt<R, ModuleAdjustmentDetails>>
    >
  >;

  /** {@inheritDoc TransactableTren.withdrawCollateral} */
  withdrawCollateral(
    amount: Decimalish
  ): Promise<
    PopulatedTrenTransaction<
      P,
      SentTrenTransaction<S, TrenReceipt<R, ModuleAdjustmentDetails>>
    >
  >;

  /** {@inheritDoc TransactableTren.borrowTrenUSD} */
  borrowTrenUSD(
    amount: Decimalish,
    maxBorrowingRate?: Decimalish
  ): Promise<
    PopulatedTrenTransaction<
      P,
      SentTrenTransaction<S, TrenReceipt<R, ModuleAdjustmentDetails>>
    >
  >;

  /** {@inheritDoc TransactableTren.repayTrenUSD} */
  repayTrenUSD(
    amount: Decimalish
  ): Promise<
    PopulatedTrenTransaction<
      P,
      SentTrenTransaction<S, TrenReceipt<R, ModuleAdjustmentDetails>>
    >
  >;

  /** @internal */
  setPrice(
    price: Decimalish
  ): Promise<PopulatedTrenTransaction<P, SentTrenTransaction<S, TrenReceipt<R, void>>>>;

  /** {@inheritDoc TransactableTren.liquidate} */
  liquidate(
    address: string | string[]
  ): Promise<
    PopulatedTrenTransaction<P, SentTrenTransaction<S, TrenReceipt<R, LiquidationDetails>>>
  >;

  /** {@inheritDoc TransactableTren.liquidateUpTo} */
  liquidateUpTo(
    maximumNumberOfModulesToLiquidate: number
  ): Promise<
    PopulatedTrenTransaction<P, SentTrenTransaction<S, TrenReceipt<R, LiquidationDetails>>>
  >;

  /** {@inheritDoc TransactableTren.depositTrenUSDInStabilityPool} */
  depositTrenUSDInStabilityPool(
    amount: Decimalish,
    frontendTag?: string
  ): Promise<
    PopulatedTrenTransaction<
      P,
      SentTrenTransaction<S, TrenReceipt<R, StabilityDepositChangeDetails>>
    >
  >;

  /** {@inheritDoc TransactableTren.withdrawTrenUSDFromStabilityPool} */
  withdrawTrenUSDFromStabilityPool(
    amount: Decimalish
  ): Promise<
    PopulatedTrenTransaction<
      P,
      SentTrenTransaction<S, TrenReceipt<R, StabilityDepositChangeDetails>>
    >
  >;

  /** {@inheritDoc TransactableTren.withdrawGainsFromStabilityPool} */
  withdrawGainsFromStabilityPool(): Promise<
    PopulatedTrenTransaction<
      P,
      SentTrenTransaction<S, TrenReceipt<R, StabilityPoolGainsWithdrawalDetails>>
    >
  >;

  /** {@inheritDoc TransactableTren.transferCollateralGainToModule} */
  transferCollateralGainToModule(): Promise<
    PopulatedTrenTransaction<
      P,
      SentTrenTransaction<S, TrenReceipt<R, CollateralGainTransferDetails>>
    >
  >;

  /** {@inheritDoc TransactableTren.sendTrenUSD} */
  sendTrenUSD(
    toAddress: string,
    amount: Decimalish
  ): Promise<PopulatedTrenTransaction<P, SentTrenTransaction<S, TrenReceipt<R, void>>>>;

  /** {@inheritDoc TransactableTren.redeemTrenUSD} */
  redeemTrenUSD(
    amount: Decimalish,
    maxRedemptionRate?: Decimalish
  ): Promise<PopulatedRedemption<P, S, R>>;

  /** {@inheritDoc TransactableTren.claimCollateralSurplus} */
  claimCollateralSurplus(): Promise<
    PopulatedTrenTransaction<P, SentTrenTransaction<S, TrenReceipt<R, void>>>
  >;

  /** {@inheritDoc TransactableTren.withdrawGainsFromStaking} */
  withdrawGainsFromStaking(): Promise<
    PopulatedTrenTransaction<P, SentTrenTransaction<S, TrenReceipt<R, void>>>
  >;

  /** {@inheritDoc TransactableTren.approveUniTokens} */
  approveUniTokens(
    allowance?: Decimalish
  ): Promise<PopulatedTrenTransaction<P, SentTrenTransaction<S, TrenReceipt<R, void>>>>;

  /** {@inheritDoc TransactableTren.stakeUniTokens} */
  stakeUniTokens(
    amount: Decimalish
  ): Promise<PopulatedTrenTransaction<P, SentTrenTransaction<S, TrenReceipt<R, void>>>>;

  /** {@inheritDoc TransactableTren.unstakeUniTokens} */
  unstakeUniTokens(
    amount: Decimalish
  ): Promise<PopulatedTrenTransaction<P, SentTrenTransaction<S, TrenReceipt<R, void>>>>;

  /** {@inheritDoc TransactableTren.exitLiquidityMining} */
  exitLiquidityMining(): Promise<
    PopulatedTrenTransaction<P, SentTrenTransaction<S, TrenReceipt<R, void>>>
  >;

  /** {@inheritDoc TransactableTren.registerFrontend} */
  registerFrontend(
    kickbackRate: Decimalish
  ): Promise<PopulatedTrenTransaction<P, SentTrenTransaction<S, TrenReceipt<R, void>>>>;
}
