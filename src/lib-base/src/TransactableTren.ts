import { Decimal, Decimalish } from "./Decimal";
import { Module, ModuleAdjustmentParams, ModuleClosureParams, ModuleCreationParams } from "./Module";
import { StabilityDepositChange } from "./StabilityDeposit";
import { FailedReceipt } from "./SendableTren";

/**
 * Thrown by {@link TransactableTren} functions in case of transaction failure.
 *
 * @public
 */
export class TransactionFailedError<T extends FailedReceipt = FailedReceipt> extends Error {
  readonly failedReceipt: T;

  /** @internal */
  constructor(name: string, message: string, failedReceipt: T) {
    super(message);
    this.name = name;
    this.failedReceipt = failedReceipt;
  }
}

/**
 * Details of an {@link TransactableTren.openModule | openModule()} transaction.
 *
 * @public
 */
export interface ModuleCreationDetails {

  /** How much was deposited and borrowed. */
  params: ModuleCreationParams<Decimal>;

  /** The Module that was created by the transaction. */
  newModule: Module;

  /** Amount of TrenUSD added to the Module's debt as borrowing fee. */
  fee: Decimal;
}

/**
 * Details of an {@link TransactableTren.adjustModule | adjustModule()} transaction.
 *
 * @public
 */
export interface ModuleAdjustmentDetails {

  /** Parameters of the adjustment. */
  params: ModuleAdjustmentParams<Decimal>;

  /** New state of the adjusted Module directly after the transaction. */
  newModule: Module;

  /** Amount of TrenUSD added to the Module's debt as borrowing fee. */
  fee: Decimal;
}

/**
 * Details of a {@link TransactableTren.closeModule | closeModule()} transaction.
 *
 * @public
 */
export interface ModuleClosureDetails {

  /** How much was withdrawn and repaid. */
  params: ModuleClosureParams<Decimal>;
}

/**
 * Details of a {@link TransactableTren.liquidate | liquidate()} or
 * {@link TransactableTren.liquidateUpTo | liquidateUpTo()} transaction.
 *
 * @public
 */
export interface LiquidationDetails {

  /** Addresses whose Modules were liquidated by the transaction. */
  liquidatedAddresses: string[];

  /** Total collateral liquidated and debt cleared by the transaction. */
  totalLiquidated: Module;

  /** Amount of TrenUSD paid to the liquidator as gas compensation. */
  trenUSDGasCompensation: Decimal;

  /** Amount of native currency (e.g. Ether) paid to the liquidator as gas compensation. */
  collateralGasCompensation: Decimal;
}

/**
 * Details of a {@link TransactableTren.redeemTrenUSD | redeemTrenUSD()} transaction.
 *
 * @public
 */
export interface RedemptionDetails {

  /** Amount of TrenUSD the redeemer tried to redeem. */
  attemptedTrenUSDAmount: Decimal;

  /**
   * Amount of TrenUSD that was actually redeemed by the transaction.
   *
   * @remarks
   * This can end up being lower than `attemptedTrenUSDAmount` due to interference from another
   * transaction that modifies the list of Modules.
   *
   * @public
   */
  actualTrenUSDAmount: Decimal;

  /** Amount of collateral (e.g. Ether) taken from Modules by the transaction. */
  collateralTaken: Decimal;

  /** Amount of native currency (e.g. Ether) deducted as fee from collateral taken. */
  fee: Decimal;
}

/**
 * Details of a
 * {@link TransactableTren.withdrawGainsFromStabilityPool | withdrawGainsFromStabilityPool()}
 * transaction.
 *
 * @public
 */
export interface StabilityPoolGainsWithdrawalDetails {

  /** Amount of TrenUSD burned from the deposit by liquidations since the last modification. */
  trenUSDLoss: Decimal;

  /** Amount of TrenUSD in the deposit directly after this transaction. */
  newTrenUSDDeposit: Decimal;

  /** Amount of native currency (e.g. Ether) paid out to the depositor in this transaction. */
  collateralGain: Decimal;
}

/**
 * Details of a
 * {@link TransactableTren.depositTrenUSDInStabilityPool | depositTrenUSDInStabilityPool()} or
 * {@link TransactableTren.withdrawTrenUSDFromStabilityPool | withdrawTrenUSDFromStabilityPool()}
 * transaction.
 *
 * @public
 */
export interface StabilityDepositChangeDetails extends StabilityPoolGainsWithdrawalDetails {

  /** Change that was made to the deposit by this transaction. */
  change: StabilityDepositChange<Decimal>;
}

/**
 * Details of a
 * {@link TransactableTren.transferCollateralGainToModule | transferCollateralGainToModule()}
 * transaction.
 *
 * @public
 */
export interface CollateralGainTransferDetails extends StabilityPoolGainsWithdrawalDetails {

  /** New state of the depositor's Module directly after the transaction. */
  newModule: Module;
}

/**
 * Send Tren transactions and wait for them to succeed.
 *
 * @remarks
 * The functions return the details of the transaction (if any), or throw an implementation-specific
 * subclass of {@link TransactionFailedError} in case of transaction failure.
 *
 * Implemented by {@link @tren/lib-ethers#EthersTren}.
 *
 * @public
 */
export interface TransactableTren {

  /**
   * Open a new Module by depositing collateral and borrowing TrenUSD.
   *
   * @param params - How much to deposit and borrow.
   * @param maxBorrowingRate - Maximum acceptable
   *                           {@link @tren/lib-base#Fees.borrowingRate | borrowing rate}.
   *
   * @throws
   * Throws {@link TransactionFailedError} in case of transaction failure.
   *
   * @remarks
   * If `maxBorrowingRate` is omitted, the current borrowing rate plus 0.5% is used as maximum
   * acceptable rate.
   */
  openModule(
    params: ModuleCreationParams<Decimalish>,
    maxBorrowingRate?: Decimalish
  ): Promise<ModuleCreationDetails>;

  /**
   * Close existing Module by repaying all debt and withdrawing all collateral.
   *
   * @throws
   * Throws {@link TransactionFailedError} in case of transaction failure.
   */
  closeModule(): Promise<ModuleClosureDetails>;

  /**
   * Adjust existing Module by changing its collateral, debt, or both.
   *
   * @param params - Parameters of the adjustment.
   * @param maxBorrowingRate - Maximum acceptable
   *                           {@link @tren/lib-base#Fees.borrowingRate | borrowing rate} if
   *                           `params` includes `borrowTrenUSD`.
   *
   * @throws
   * Throws {@link TransactionFailedError} in case of transaction failure.
   *
   * @remarks
   * The transaction will fail if the Module's debt would fall below
   * {@link @tren/lib-base#TrenUSD_MINIMUM_DEBT}.
   *
   * If `maxBorrowingRate` is omitted, the current borrowing rate plus 0.5% is used as maximum
   * acceptable rate.
   */
  adjustModule(
    params: ModuleAdjustmentParams<Decimalish>,
    maxBorrowingRate?: Decimalish
  ): Promise<ModuleAdjustmentDetails>;

  /**
   * Adjust existing Module by depositing more collateral.
   *
   * @param amount - The amount of collateral to add to the Module's existing collateral.
   *
   * @throws
   * Throws {@link TransactionFailedError} in case of transaction failure.
   *
   * @remarks
   * Equivalent to:
   *
   * ```typescript
   * adjustModule({ depositCollateral: amount })
   * ```
   */
  depositCollateral(amount: Decimalish): Promise<ModuleAdjustmentDetails>;

  /**
   * Adjust existing Module by withdrawing some of its collateral.
   *
   * @param amount - The amount of collateral to withdraw from the Module.
   *
   * @throws
   * Throws {@link TransactionFailedError} in case of transaction failure.
   *
   * @remarks
   * Equivalent to:
   *
   * ```typescript
   * adjustModule({ withdrawCollateral: amount })
   * ```
   */
  withdrawCollateral(amount: Decimalish): Promise<ModuleAdjustmentDetails>;

  /**
   * Adjust existing Module by borrowing more TrenUSD.
   *
   * @param amount - The amount of TrenUSD to borrow.
   * @param maxBorrowingRate - Maximum acceptable
   *                           {@link @tren/lib-base#Fees.borrowingRate | borrowing rate}.
   *
   * @throws
   * Throws {@link TransactionFailedError} in case of transaction failure.
   *
   * @remarks
   * Equivalent to:
   *
   * ```typescript
   * adjustModule({ borrowTrenUSD: amount }, maxBorrowingRate)
   * ```
   */
  borrowTrenUSD(amount: Decimalish, maxBorrowingRate?: Decimalish): Promise<ModuleAdjustmentDetails>;

  /**
   * Adjust existing Module by repaying some of its debt.
   *
   * @param amount - The amount of TrenUSD to repay.
   *
   * @throws
   * Throws {@link TransactionFailedError} in case of transaction failure.
   *
   * @remarks
   * Equivalent to:
   *
   * ```typescript
   * adjustModule({ repayTrenUSD: amount })
   * ```
   */
  repayTrenUSD(amount: Decimalish): Promise<ModuleAdjustmentDetails>;

  /** @internal */
  setPrice(price: Decimalish): Promise<void>;

  /**
   * Liquidate one or more undercollateralized Modules.
   *
   * @param address - Address or array of addresses whose Modules to liquidate.
   *
   * @throws
   * Throws {@link TransactionFailedError} in case of transaction failure.
   */
  liquidate(address: string | string[]): Promise<LiquidationDetails>;

  /**
   * Liquidate the least collateralized Modules up to a maximum number.
   *
   * @param maximumNumberOfModulesToLiquidate - Stop after liquidating this many Modules.
   *
   * @throws
   * Throws {@link TransactionFailedError} in case of transaction failure.
   */
  liquidateUpTo(maximumNumberOfModulesToLiquidate: number): Promise<LiquidationDetails>;

  /**
   * Make a new Stability Deposit, or top up existing one.
   *
   * @param amount - Amount of TrenUSD to add to new or existing deposit.
   *
   * @throws
   * Throws {@link TransactionFailedError} in case of transaction failure.
   *
   * @remarks
   * The `frontendTag` parameter is only effective when making a new deposit.
   *
   * As a side-effect, the transaction will also pay out an existing Stability Deposit's
   * {@link @tren/lib-base#StabilityDeposit.collateralGain | collateral gain}
   */
  depositTrenUSDInStabilityPool(
    amount: Decimalish,
    frontendTag?: string
  ): Promise<StabilityDepositChangeDetails>;

  /**
   * Withdraw TrenUSD from Stability Deposit.
   *
   * @param amount - Amount of TrenUSD to withdraw.
   *
   * @throws
   * Throws {@link TransactionFailedError} in case of transaction failure.
   *
   * @remarks
   * As a side-effect, the transaction will also pay out the Stability Deposit's
   * {@link @tren/lib-base#StabilityDeposit.collateralGain | collateral gain}
   */
  withdrawTrenUSDFromStabilityPool(amount: Decimalish): Promise<StabilityDepositChangeDetails>;

  /**
   *
   * @throws
   * Throws {@link TransactionFailedError} in case of transaction failure.
   */
  withdrawGainsFromStabilityPool(): Promise<StabilityPoolGainsWithdrawalDetails>;

  /**
   * Transfer {@link @tren/lib-base#StabilityDeposit.collateralGain | collateral gain} from
   * Stability Deposit to Module.
   *
   * @throws
   * Throws {@link TransactionFailedError} in case of transaction failure.
   *
   * @remarks
   * The collateral gain is transfered to the Module as additional collateral.
   */
  transferCollateralGainToModule(): Promise<CollateralGainTransferDetails>;

  /**
   * Send TrenUSD tokens to an address.
   *
   * @param toAddress - Address of receipient.
   * @param amount - Amount of TrenUSD to send.
   *
   * @throws
   * Throws {@link TransactionFailedError} in case of transaction failure.
   */
  sendTrenUSD(toAddress: string, amount: Decimalish): Promise<void>;

  /**
   * Redeem TrenUSD to native currency (e.g. Ether) at face value.
   *
   * @param amount - Amount of TrenUSD to be redeemed.
   * @param maxRedemptionRate - Maximum acceptable
   *                            {@link @tren/lib-base#Fees.redemptionRate | redemption rate}.
   *
   * @throws
   * Throws {@link TransactionFailedError} in case of transaction failure.
   *
   * @remarks
   * If `maxRedemptionRate` is omitted, the current redemption rate (based on `amount`) plus 0.1%
   * is used as maximum acceptable rate.
   */
  redeemTrenUSD(amount: Decimalish, maxRedemptionRate?: Decimalish): Promise<RedemptionDetails>;

  /**
   * Claim leftover collateral after a liquidation or redemption.
   *
   * @remarks
   * Use {@link @tren/lib-base#ReadableTren.getCollateralSurplusBalance | getCollateralSurplusBalance()}
   * to check the amount of collateral available for withdrawal.
   *
   * @throws
   * Throws {@link TransactionFailedError} in case of transaction failure.
   */
  claimCollateralSurplus(): Promise<void>;

  /**
   * Allow the liquidity mining contract to use Uniswap ETH/TrenUSD LP tokens for
   * {@link @tren/lib-base#TransactableTren.stakeUniTokens | staking}.
   *
   * @param allowance - Maximum amount of LP tokens that will be transferrable to liquidity mining
   *                    (`2^256 - 1` by default).
   *
   * @remarks
   * Must be performed before calling
   * {@link @tren/lib-base#TransactableTren.stakeUniTokens | stakeUniTokens()}.
   *
   * @throws
   * Throws {@link TransactionFailedError} in case of transaction failure.
   */
  approveUniTokens(allowance?: Decimalish): Promise<void>;

  /**
   * Withdraw Uniswap ETH/TrenUSD LP tokens from liquidity mining.
   *
   * @param amount - Amount of LP tokens to withdraw.
   *
   * @throws
   * Throws {@link TransactionFailedError} in case of transaction failure.
   */
  unstakeUniTokens(amount: Decimalish): Promise<void>;

  /**
   * Withdraw all staked LP tokens from liquidity mining and claim reward.
   *
   * @throws
   * Throws {@link TransactionFailedError} in case of transaction failure.
   */
  exitLiquidityMining(): Promise<void>;

}
