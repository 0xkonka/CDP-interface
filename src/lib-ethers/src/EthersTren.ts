import { BlockTag } from "@ethersproject/abstract-provider";

import {
  CollateralGainTransferDetails,
  Decimal,
  Decimalish,
  FailedReceipt,
  Fees,
  FrontendStatus,
  LiquidationDetails,
  TrenStore,
  RedemptionDetails,
  StabilityDeposit,
  StabilityDepositChangeDetails,
  StabilityPoolGainsWithdrawalDetails,
  TransactableTren,
  TransactionFailedError,
  Module,
  ModuleAdjustmentDetails,
  ModuleAdjustmentParams,
  ModuleClosureDetails,
  ModuleCreationDetails,
  ModuleCreationParams,
  ModuleListingParams,
  ModuleWithPendingRedistribution,
  UserModule
} from "@/lib-base";

import {
  EthersTrenConnection,
  EthersTrenConnectionOptionalParams,
  EthersTrenStoreOption,
  _connect,
  _usingStore
} from "./EthersTrenConnection";

import {
  EthersCallOverrides,
  EthersProvider,
  EthersSigner,
  EthersTransactionOverrides,
  EthersTransactionReceipt
} from "./types";

import {
  BorrowingOperationOptionalParams,
  PopulatableEthersTren,
  SentEthersTrenTransaction
} from "./PopulatableEthersTren";
import { ReadableEthersTren, ReadableEthersTrenWithStore } from "./ReadableEthersTren";
import { SendableEthersTren } from "./SendableEthersTren";
import { BlockPolledTrenStore } from "./BlockPolledTrenStore";

/**
 * Thrown by {@link EthersTren} in case of transaction failure.
 *
 * @public
 */
export class EthersTransactionFailedError extends TransactionFailedError<
  FailedReceipt<EthersTransactionReceipt>
> {
  constructor(message: string, failedReceipt: FailedReceipt<EthersTransactionReceipt>) {
    super("EthersTransactionFailedError", message, failedReceipt);
  }
}

const waitForSuccess = async <T>(tx: SentEthersTrenTransaction<T>) => {
  const receipt = await tx.waitForReceipt();

  if (receipt.status !== "succeeded") {
    throw new EthersTransactionFailedError("Transaction failed", receipt);
  }

  return receipt.details;
};

/**
 * Convenience class that combines multiple interfaces of the library in one object.
 *
 * @public
 */
export class EthersTren implements ReadableEthersTren, TransactableTren {
  /** Information about the connection to the Tren protocol. */
  readonly connection: EthersTrenConnection;

  /** Can be used to create populated (unsigned) transactions. */
  readonly populate: PopulatableEthersTren;

  /** Can be used to send transactions without waiting for them to be mined. */
  readonly send: SendableEthersTren;

  private _readable: ReadableEthersTren;

  /** @internal */
  constructor(readable: ReadableEthersTren) {
    this._readable = readable;
    this.connection = readable.connection;
    this.populate = new PopulatableEthersTren(readable);
    this.send = new SendableEthersTren(this.populate);
  }

  /** @internal */
  static _from(
    connection: EthersTrenConnection & { useStore: "blockPolled" }
  ): EthersTrenWithStore<BlockPolledTrenStore>;

  /** @internal */
  static _from(connection: EthersTrenConnection): EthersTren;

  /** @internal */
  static _from(connection: EthersTrenConnection): EthersTren {
    if (_usingStore(connection)) {
      return new _EthersTrenWithStore(ReadableEthersTren._from(connection));
    } else {
      return new EthersTren(ReadableEthersTren._from(connection));
    }
  }

  /** @internal */
  static connect(
    signerOrProvider: EthersSigner | EthersProvider,
    optionalParams: EthersTrenConnectionOptionalParams & { useStore: "blockPolled" }
  ): Promise<EthersTrenWithStore<BlockPolledTrenStore>>;

  /**
   * Connect to the Tren protocol and create an `EthersTren` object.
   *
   * @param signerOrProvider - Ethers `Signer` or `Provider` to use for connecting to the Ethereum
   *                           network.
   * @param optionalParams - Optional parameters that can be used to customize the connection.
   */
  static connect(
    signerOrProvider: EthersSigner | EthersProvider,
    optionalParams?: EthersTrenConnectionOptionalParams
  ): Promise<EthersTren>;

  static async connect(
    signerOrProvider: EthersSigner | EthersProvider,
    optionalParams?: EthersTrenConnectionOptionalParams
  ): Promise<EthersTren> {
    return EthersTren._from(await _connect(signerOrProvider, optionalParams));
  }

  /**
   * Check whether this `EthersTren` is an {@link EthersTrenWithStore}.
   */
  hasStore(): this is EthersTrenWithStore;

  /**
   * Check whether this `EthersTren` is an
   * {@link EthersTrenWithStore}\<{@link BlockPolledTrenStore}\>.
   */
  hasStore(store: "blockPolled"): this is EthersTrenWithStore<BlockPolledTrenStore>;

  hasStore(): boolean {
    return false;
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getTotalRedistributed} */
  getTotalRedistributed(overrides?: EthersCallOverrides): Promise<Module> {
    return this._readable.getTotalRedistributed(overrides);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getModuleBeforeRedistribution} */
  getModuleBeforeRedistribution(
    address?: string,
    overrides?: EthersCallOverrides
  ): Promise<ModuleWithPendingRedistribution> {
    return this._readable.getModuleBeforeRedistribution(address, overrides);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getModule} */
  getModule(address?: string, overrides?: EthersCallOverrides): Promise<UserModule> {
    return this._readable.getModule(address, overrides);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getNumberOfModules} */
  getNumberOfModules(overrides?: EthersCallOverrides): Promise<number> {
    return this._readable.getNumberOfModules(overrides);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getPrice} */
  getPrice(overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getPrice(overrides);
  }

  /** @internal */
  _getActivePool(overrides?: EthersCallOverrides): Promise<Module> {
    return this._readable._getActivePool(overrides);
  }

  /** @internal */
  _getDefaultPool(overrides?: EthersCallOverrides): Promise<Module> {
    return this._readable._getDefaultPool(overrides);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getTotal} */
  getTotal(overrides?: EthersCallOverrides): Promise<Module> {
    return this._readable.getTotal(overrides);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getStabilityDeposit} */
  getStabilityDeposit(address?: string, overrides?: EthersCallOverrides): Promise<StabilityDeposit> {
    return this._readable.getStabilityDeposit(address, overrides);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getTrenUSDInStabilityPool} */
  getTrenUSDInStabilityPool(overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getTrenUSDInStabilityPool(overrides);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getTrenUSDBalance} */
  getTrenUSDBalance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getTrenUSDBalance(address, overrides);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getUniTokenBalance} */
  getUniTokenBalance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getUniTokenBalance(address, overrides);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getUniTokenAllowance} */
  getUniTokenAllowance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getUniTokenAllowance(address, overrides);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getLiquidityMiningStake} */
  getLiquidityMiningStake(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getLiquidityMiningStake(address, overrides);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getTotalStakedUniTokens} */
  getTotalStakedUniTokens(overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getTotalStakedUniTokens(overrides);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getCollateralSurplusBalance} */
  getCollateralSurplusBalance(address?: string, overrides?: EthersCallOverrides): Promise<Decimal> {
    return this._readable.getCollateralSurplusBalance(address, overrides);
  }

  /** @internal */
  getModules(
    params: ModuleListingParams & { beforeRedistribution: true },
    overrides?: EthersCallOverrides
  ): Promise<ModuleWithPendingRedistribution[]>;

  /** {@inheritDoc @tren/lib-base#ReadableTren.(getModules:2)} */
  getModules(params: ModuleListingParams, overrides?: EthersCallOverrides): Promise<UserModule[]>;

  getModules(params: ModuleListingParams, overrides?: EthersCallOverrides): Promise<UserModule[]> {
    return this._readable.getModules(params, overrides);
  }

  /** @internal */
  _getBlockTimestamp(blockTag?: BlockTag): Promise<number> {
    return this._readable._getBlockTimestamp(blockTag);
  }

  /** @internal */
  _getFeesFactory(
    overrides?: EthersCallOverrides
  ): Promise<(blockTimestamp: number, recoveryMode: boolean) => Fees> {
    return this._readable._getFeesFactory(overrides);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getFees} */
  getFees(overrides?: EthersCallOverrides): Promise<Fees> {
    return this._readable.getFees(overrides);
  }

  /** {@inheritDoc @tren/lib-base#ReadableTren.getFrontendStatus} */
  getFrontendStatus(address?: string, overrides?: EthersCallOverrides): Promise<FrontendStatus> {
    return this._readable.getFrontendStatus(address, overrides);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.openModule}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  openModule(
    params: ModuleCreationParams<Decimalish>,
    maxBorrowingRateOrOptionalParams?: Decimalish | BorrowingOperationOptionalParams,
    overrides?: EthersTransactionOverrides
  ): Promise<ModuleCreationDetails> {
    return this.send
      .openModule(params, maxBorrowingRateOrOptionalParams, overrides)
      .then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.closeModule}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  closeModule(overrides?: EthersTransactionOverrides): Promise<ModuleClosureDetails> {
    return this.send.closeModule(overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.adjustModule}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  adjustModule(
    params: ModuleAdjustmentParams<Decimalish>,
    maxBorrowingRateOrOptionalParams?: Decimalish | BorrowingOperationOptionalParams,
    overrides?: EthersTransactionOverrides
  ): Promise<ModuleAdjustmentDetails> {
    return this.send
      .adjustModule(params, maxBorrowingRateOrOptionalParams, overrides)
      .then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.depositCollateral}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  depositCollateral(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<ModuleAdjustmentDetails> {
    return this.send.depositCollateral(amount, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.withdrawCollateral}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  withdrawCollateral(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<ModuleAdjustmentDetails> {
    return this.send.withdrawCollateral(amount, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.borrowTrenUSD}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  borrowTrenUSD(
    amount: Decimalish,
    maxBorrowingRate?: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<ModuleAdjustmentDetails> {
    return this.send.borrowTrenUSD(amount, maxBorrowingRate, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.repayTrenUSD}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  repayTrenUSD(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<ModuleAdjustmentDetails> {
    return this.send.repayTrenUSD(amount, overrides).then(waitForSuccess);
  }

  /** @internal */
  setPrice(price: Decimalish, overrides?: EthersTransactionOverrides): Promise<void> {
    return this.send.setPrice(price, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.liquidate}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  liquidate(
    address: string | string[],
    overrides?: EthersTransactionOverrides
  ): Promise<LiquidationDetails> {
    return this.send.liquidate(address, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.liquidateUpTo}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  liquidateUpTo(
    maximumNumberOfModulesToLiquidate: number,
    overrides?: EthersTransactionOverrides
  ): Promise<LiquidationDetails> {
    return this.send.liquidateUpTo(maximumNumberOfModulesToLiquidate, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.depositTrenUSDInStabilityPool}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  depositTrenUSDInStabilityPool(
    amount: Decimalish,
    frontendTag?: string,
    overrides?: EthersTransactionOverrides
  ): Promise<StabilityDepositChangeDetails> {
    return this.send.depositTrenUSDInStabilityPool(amount, frontendTag, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.withdrawTrenUSDFromStabilityPool}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  withdrawTrenUSDFromStabilityPool(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<StabilityDepositChangeDetails> {
    return this.send.withdrawTrenUSDFromStabilityPool(amount, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.withdrawGainsFromStabilityPool}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  withdrawGainsFromStabilityPool(
    overrides?: EthersTransactionOverrides
  ): Promise<StabilityPoolGainsWithdrawalDetails> {
    return this.send.withdrawGainsFromStabilityPool(overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.transferCollateralGainToModule}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  transferCollateralGainToModule(
    overrides?: EthersTransactionOverrides
  ): Promise<CollateralGainTransferDetails> {
    return this.send.transferCollateralGainToModule(overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.sendTrenUSD}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  sendTrenUSD(
    toAddress: string,
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<void> {
    return this.send.sendTrenUSD(toAddress, amount, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.redeemTrenUSD}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  redeemTrenUSD(
    amount: Decimalish,
    maxRedemptionRate?: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<RedemptionDetails> {
    return this.send.redeemTrenUSD(amount, maxRedemptionRate, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.claimCollateralSurplus}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  claimCollateralSurplus(overrides?: EthersTransactionOverrides): Promise<void> {
    return this.send.claimCollateralSurplus(overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.withdrawGainsFromStaking}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  withdrawGainsFromStaking(overrides?: EthersTransactionOverrides): Promise<void> {
    return this.send.withdrawGainsFromStaking(overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.registerFrontend}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  registerFrontend(kickbackRate: Decimalish, overrides?: EthersTransactionOverrides): Promise<void> {
    return this.send.registerFrontend(kickbackRate, overrides).then(waitForSuccess);
  }

  /** @internal */
  _mintUniToken(
    amount: Decimalish,
    address?: string,
    overrides?: EthersTransactionOverrides
  ): Promise<void> {
    return this.send._mintUniToken(amount, address, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.approveUniTokens}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  approveUniTokens(allowance?: Decimalish, overrides?: EthersTransactionOverrides): Promise<void> {
    return this.send.approveUniTokens(allowance, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.stakeUniTokens}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  stakeUniTokens(amount: Decimalish, overrides?: EthersTransactionOverrides): Promise<void> {
    return this.send.stakeUniTokens(amount, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.unstakeUniTokens}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  unstakeUniTokens(amount: Decimalish, overrides?: EthersTransactionOverrides): Promise<void> {
    return this.send.unstakeUniTokens(amount, overrides).then(waitForSuccess);
  }

  /**
   * {@inheritDoc @tren/lib-base#TransactableTren.exitLiquidityMining}
   *
   * @throws
   * Throws {@link EthersTransactionFailedError} in case of transaction failure.
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  exitLiquidityMining(overrides?: EthersTransactionOverrides): Promise<void> {
    return this.send.exitLiquidityMining(overrides).then(waitForSuccess);
  }
}

/**
 * Variant of {@link EthersTren} that exposes a {@link @tren/lib-base#TrenStore}.
 *
 * @public
 */
export interface EthersTrenWithStore<T extends TrenStore = TrenStore>
  extends EthersTren {

  /** An object that implements TrenStore. */
  readonly store: T;
}

class _EthersTrenWithStore<T extends TrenStore = TrenStore>
  extends EthersTren
  implements EthersTrenWithStore<T> {
  readonly store: T;

  constructor(readable: ReadableEthersTrenWithStore<T>) {
    super(readable);

    this.store = readable.store;
  }

  hasStore(store?: EthersTrenStoreOption): boolean {
    return store === undefined || store === this.connection.useStore;
  }
}
