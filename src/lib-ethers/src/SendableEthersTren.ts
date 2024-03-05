import {
  CollateralGainTransferDetails,
  Decimalish,
  LiquidationDetails,
  RedemptionDetails,
  SendableTren,
  StabilityDepositChangeDetails,
  StabilityPoolGainsWithdrawalDetails,
  ModuleAdjustmentDetails,
  ModuleAdjustmentParams,
  ModuleClosureDetails,
  ModuleCreationDetails,
  ModuleCreationParams
} from "@/lib-base";

import {
  EthersTransactionOverrides,
  EthersTransactionReceipt,
  EthersTransactionResponse
} from "./types";

import {
  BorrowingOperationOptionalParams,
  PopulatableEthersTren,
  PopulatedEthersTrenTransaction,
  SentEthersTrenTransaction
} from "./PopulatableEthersTren";

const sendTransaction = <T>(tx: PopulatedEthersTrenTransaction<T>) => tx.send();

/**
 * Ethers-based implementation of {@link @tren/lib-base#SendableTren}.
 *
 * @public
 */
export class SendableEthersTren
  implements SendableTren<EthersTransactionReceipt, EthersTransactionResponse> {
  private _populate: PopulatableEthersTren;

  constructor(populatable: PopulatableEthersTren) {
    this._populate = populatable;
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.openModule} */
  async openModule(
    params: ModuleCreationParams<Decimalish>,
    maxBorrowingRateOrOptionalParams?: Decimalish | BorrowingOperationOptionalParams,
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<ModuleCreationDetails>> {
    return this._populate
      .openModule(params, maxBorrowingRateOrOptionalParams, overrides)
      .then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.closeModule} */
  closeModule(
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<ModuleClosureDetails>> {
    return this._populate.closeModule(overrides).then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.adjustModule} */
  adjustModule(
    params: ModuleAdjustmentParams<Decimalish>,
    maxBorrowingRateOrOptionalParams?: Decimalish | BorrowingOperationOptionalParams,
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<ModuleAdjustmentDetails>> {
    return this._populate
      .adjustModule(params, maxBorrowingRateOrOptionalParams, overrides)
      .then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.depositCollateral} */
  depositCollateral(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<ModuleAdjustmentDetails>> {
    return this._populate.depositCollateral(amount, overrides).then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.withdrawCollateral} */
  withdrawCollateral(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<ModuleAdjustmentDetails>> {
    return this._populate.withdrawCollateral(amount, overrides).then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.borrowTrenUSD} */
  borrowTrenUSD(
    amount: Decimalish,
    maxBorrowingRate?: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<ModuleAdjustmentDetails>> {
    return this._populate.borrowTrenUSD(amount, maxBorrowingRate, overrides).then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.repayTrenUSD} */
  repayTrenUSD(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<ModuleAdjustmentDetails>> {
    return this._populate.repayTrenUSD(amount, overrides).then(sendTransaction);
  }

  /** @internal */
  setPrice(
    price: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<void>> {
    return this._populate.setPrice(price, overrides).then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.liquidate} */
  liquidate(
    address: string | string[],
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<LiquidationDetails>> {
    return this._populate.liquidate(address, overrides).then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.liquidateUpTo} */
  liquidateUpTo(
    maximumNumberOfModulesToLiquidate: number,
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<LiquidationDetails>> {
    return this._populate
      .liquidateUpTo(maximumNumberOfModulesToLiquidate, overrides)
      .then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.depositTrenUSDInStabilityPool} */
  depositTrenUSDInStabilityPool(
    amount: Decimalish,
    frontendTag?: string,
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<StabilityDepositChangeDetails>> {
    return this._populate
      .depositTrenUSDInStabilityPool(amount, frontendTag, overrides)
      .then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.withdrawTrenUSDFromStabilityPool} */
  withdrawTrenUSDFromStabilityPool(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<StabilityDepositChangeDetails>> {
    return this._populate.withdrawTrenUSDFromStabilityPool(amount, overrides).then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.withdrawGainsFromStabilityPool} */
  withdrawGainsFromStabilityPool(
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<StabilityPoolGainsWithdrawalDetails>> {
    return this._populate.withdrawGainsFromStabilityPool(overrides).then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.transferCollateralGainToModule} */
  transferCollateralGainToModule(
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<CollateralGainTransferDetails>> {
    return this._populate.transferCollateralGainToModule(overrides).then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.sendTrenUSD} */
  sendTrenUSD(
    toAddress: string,
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<void>> {
    return this._populate.sendTrenUSD(toAddress, amount, overrides).then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.redeemTrenUSD} */
  redeemTrenUSD(
    amount: Decimalish,
    maxRedemptionRate?: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<RedemptionDetails>> {
    return this._populate.redeemTrenUSD(amount, maxRedemptionRate, overrides).then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.claimCollateralSurplus} */
  claimCollateralSurplus(
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<void>> {
    return this._populate.claimCollateralSurplus(overrides).then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.withdrawGainsFromStaking} */
  withdrawGainsFromStaking(
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<void>> {
    return this._populate.withdrawGainsFromStaking(overrides).then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.registerFrontend} */
  registerFrontend(
    kickbackRate: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<void>> {
    return this._populate.registerFrontend(kickbackRate, overrides).then(sendTransaction);
  }

  /** @internal */
  _mintUniToken(
    amount: Decimalish,
    address?: string,
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<void>> {
    return this._populate._mintUniToken(amount, address, overrides).then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.approveUniTokens} */
  approveUniTokens(
    allowance?: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<void>> {
    return this._populate.approveUniTokens(allowance, overrides).then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.stakeUniTokens} */
  stakeUniTokens(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<void>> {
    return this._populate.stakeUniTokens(amount, overrides).then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.unstakeUniTokens} */
  unstakeUniTokens(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<void>> {
    return this._populate.unstakeUniTokens(amount, overrides).then(sendTransaction);
  }

  /** {@inheritDoc @tren/lib-base#SendableTren.exitLiquidityMining} */
  exitLiquidityMining(
    overrides?: EthersTransactionOverrides
  ): Promise<SentEthersTrenTransaction<void>> {
    return this._populate.exitLiquidityMining(overrides).then(sendTransaction);
  }
}
