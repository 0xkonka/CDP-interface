/* eslint-disable */
import assert from "assert";

import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";
import { Log } from "@ethersproject/abstract-provider";
import { ErrorCode } from "@ethersproject/logger";
import { Transaction } from "@ethersproject/transactions";

import {
  CollateralGainTransferDetails,
  Decimal,
  Decimalish,
  LiquidationDetails,
  TrenReceipt,
  TrenUSD_MINIMUM_DEBT,
  TrenUSD_MINIMUM_NET_DEBT,
  MinedReceipt,
  PopulatableTren,
  PopulatedTrenTransaction,
  PopulatedRedemption,
  RedemptionDetails,
  SentTrenTransaction,
  StabilityDepositChangeDetails,
  StabilityPoolGainsWithdrawalDetails,
  Module,
  ModuleAdjustmentDetails,
  ModuleAdjustmentParams,
  ModuleClosureDetails,
  ModuleCreationDetails,
  ModuleCreationParams,
  ModuleWithPendingRedistribution,
  _failedReceipt,
  _normalizeModuleAdjustment,
  _normalizeModuleCreation,
  _pendingReceipt,
  _successfulReceipt
} from "@/lib-base";

import {
  EthersPopulatedTransaction,
  EthersTransactionOverrides,
  EthersTransactionReceipt,
  EthersTransactionResponse
} from "./types";

import {
  EthersTrenConnection,
  _getContracts,
  _requireAddress,
  _requireSigner
} from "./EthersTrenConnection";

import { decimalify, promiseAllValues } from "./_utils";
import { _priceFeedIsTestnet, _uniTokenIsMock } from "./contracts";
import { logsToString } from "./parseLogs";
import { ReadableEthersTren } from "./ReadableEthersTren";

const bigNumberMax = (a: BigNumber, b?: BigNumber) => (b?.gt(a) ? b : a);

// With 70 iterations redemption costs about ~10M gas, and each iteration accounts for ~138k more
/** @internal */
export const _redeemMaxIterations = 70;

const defaultBorrowingRateSlippageTolerance = Decimal.from(0.005); // 0.5%
const defaultRedemptionRateSlippageTolerance = Decimal.from(0.001); // 0.1%
const defaultBorrowingFeeDecayToleranceMinutes = 10;

const noDetails = () => undefined;

const compose = <T, U, V>(f: (_: U) => V, g: (_: T) => U) => (_: T) => f(g(_));

const id = <T>(t: T) => t;

// Takes ~6-7K (use 10K to be safe) to update lastFeeOperationTime, but the cost of calculating the
// decayed baseRate increases logarithmically with time elapsed since the last update.
const addGasForBaseRateUpdate = (maxMinutesSinceLastUpdate = 10) => (gas: BigNumber) =>
  gas.add(10000 + 1414 * Math.ceil(Math.log2(maxMinutesSinceLastUpdate + 1)));

// First traversal in ascending direction takes ~50K, then ~13.5K per extra step.
// 80K should be enough for 3 steps, plus some extra to be safe.
const addGasForPotentialListTraversal = (gas: BigNumber) => gas.add(80000);

const addGasForUnipoolRewardUpdate = (gas: BigNumber) => gas.add(20000);

// To get the best entropy available, we'd do something like:
//
// const bigRandomNumber = () =>
//   BigNumber.from(
//     `0x${Array.from(crypto.getRandomValues(new Uint32Array(8)))
//       .map(u32 => u32.toString(16).padStart(8, "0"))
//       .join("")}`
//   );
//
// However, Window.crypto is browser-specific. Since we only use this for randomly picking Modules
// during the search for hints, Math.random() will do fine, too.
//
// This returns a random integer between 0 and Number.MAX_SAFE_INTEGER
const randomInteger = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

// Maximum number of trials to perform in a single getApproxHint() call. If the number of trials
// required to get a statistically "good" hint is larger than this, the search for the hint will
// be broken up into multiple getApproxHint() calls.
//
// This should be low enough to work with popular public Ethereum providers like Infura without
// triggering any fair use limits.
const maxNumberOfTrialsAtOnce = 2500;

function* generateTrials(totalNumberOfTrials: number) {
  assert(Number.isInteger(totalNumberOfTrials) && totalNumberOfTrials > 0);

  while (totalNumberOfTrials) {
    const numberOfTrials = Math.min(totalNumberOfTrials, maxNumberOfTrialsAtOnce);
    yield numberOfTrials;

    totalNumberOfTrials -= numberOfTrials;
  }
}

/** @internal */
export enum _RawErrorReason {
  TRANSACTION_FAILED = "transaction failed",
  TRANSACTION_CANCELLED = "cancelled",
  TRANSACTION_REPLACED = "replaced",
  TRANSACTION_REPRICED = "repriced"
}

const transactionReplacementReasons: unknown[] = [
  _RawErrorReason.TRANSACTION_CANCELLED,
  _RawErrorReason.TRANSACTION_REPLACED,
  _RawErrorReason.TRANSACTION_REPRICED
];

interface RawTransactionFailedError extends Error {
  code: ErrorCode.CALL_EXCEPTION;
  reason: _RawErrorReason.TRANSACTION_FAILED;
  transactionHash: string;
  transaction: Transaction;
  receipt: EthersTransactionReceipt;
}

/** @internal */
export interface _RawTransactionReplacedError extends Error {
  code: ErrorCode.TRANSACTION_REPLACED;
  reason:
  | _RawErrorReason.TRANSACTION_CANCELLED
  | _RawErrorReason.TRANSACTION_REPLACED
  | _RawErrorReason.TRANSACTION_REPRICED;
  cancelled: boolean;
  hash: string;
  replacement: EthersTransactionResponse;
  receipt: EthersTransactionReceipt;
}

const hasProp = <T, P extends string>(o: T, p: P): o is T & { [_ in P]: unknown } => p in (o as any);

const isTransactionFailedError = (error: Error): error is RawTransactionFailedError =>
  hasProp(error, "code") &&
  error.code === ErrorCode.CALL_EXCEPTION &&
  hasProp(error, "reason") &&
  error.reason === _RawErrorReason.TRANSACTION_FAILED;

const isTransactionReplacedError = (error: Error): error is _RawTransactionReplacedError =>
  hasProp(error, "code") &&
  error.code === ErrorCode.TRANSACTION_REPLACED &&
  hasProp(error, "reason") &&
  transactionReplacementReasons.includes(error.reason);

/**
 * Thrown when a transaction is cancelled or replaced by a different transaction.
 *
 * @public
 */
export class EthersTransactionCancelledError extends Error {
  readonly rawReplacementReceipt: EthersTransactionReceipt;
  readonly rawError: Error;

  /** @internal */
  constructor(rawError: _RawTransactionReplacedError) {
    assert(rawError.reason !== _RawErrorReason.TRANSACTION_REPRICED);

    super(`Transaction ${rawError.reason}`);
    this.name = "TransactionCancelledError";
    this.rawReplacementReceipt = rawError.receipt;
    this.rawError = rawError;
  }
}

/**
 * A transaction that has already been sent.
 *
 * @remarks
 * Returned by {@link SendableEthersTren} functions.
 *
 * @public
 */
export class SentEthersTrenTransaction<T = unknown>
  implements
  SentTrenTransaction<EthersTransactionResponse, TrenReceipt<EthersTransactionReceipt, T>> {
  /** Ethers' representation of a sent transaction. */
  readonly rawSentTransaction: EthersTransactionResponse;

  private readonly _connection: EthersTrenConnection;
  private readonly _parse: (rawReceipt: EthersTransactionReceipt) => T;

  /** @internal */
  constructor(
    rawSentTransaction: EthersTransactionResponse,
    connection: EthersTrenConnection,
    parse: (rawReceipt: EthersTransactionReceipt) => T
  ) {
    this.rawSentTransaction = rawSentTransaction;
    this._connection = connection;
    this._parse = parse;
  }

  private _receiptFrom(rawReceipt: EthersTransactionReceipt | null) {
    return rawReceipt
      ? rawReceipt.status
        ? _successfulReceipt(rawReceipt, this._parse(rawReceipt), () =>
          logsToString(rawReceipt, _getContracts(this._connection))
        )
        : _failedReceipt(rawReceipt)
      : _pendingReceipt;
  }

  private async _waitForRawReceipt(confirmations?: number) {
    try {
      return await this.rawSentTransaction.wait(confirmations);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (isTransactionFailedError(error)) {
          return error.receipt;
        }

        if (isTransactionReplacedError(error)) {
          if (error.cancelled) {
            throw new EthersTransactionCancelledError(error);
          } else {
            return error.receipt;
          }
        }
      }

      throw error;
    }
  }

  /** {@inheritDoc @tren/lib-base#SentTrenTransaction.getReceipt} */
  async getReceipt(): Promise<TrenReceipt<EthersTransactionReceipt, T>> {
    return this._receiptFrom(await this._waitForRawReceipt(0));
  }

  /**
   * {@inheritDoc @tren/lib-base#SentTrenTransaction.waitForReceipt}
   *
   * @throws
   * Throws {@link EthersTransactionCancelledError} if the transaction is cancelled or replaced.
   */
  async waitForReceipt(): Promise<MinedReceipt<EthersTransactionReceipt, T>> {
    const receipt = this._receiptFrom(await this._waitForRawReceipt());

    assert(receipt.status !== "pending");
    return receipt;
  }
}

/**
 * Optional parameters of a transaction that borrows TrenUSD.
 *
 * @public
 */
export interface BorrowingOperationOptionalParams {

  /**
   * Maximum acceptable {@link @tren/lib-base#Fees.borrowingRate | borrowing rate}
   * (default: current borrowing rate plus 0.5%).
   */
  maxBorrowingRate?: Decimalish;

  /**
   * Control the amount of extra gas included attached to the transaction.
   *
   * @remarks
   * Transactions that borrow TrenUSD must pay a variable borrowing fee, which is added to the Module's
   * debt. This fee increases whenever a redemption occurs, and otherwise decays exponentially.
   * Due to this decay, a Module's collateral ratio can end up being higher than initially calculated
   * if the transaction is pending for a long time. When this happens, the backend has to iterate
   * over the sorted list of Modules to find a new position for the Module, which costs extra gas.
   *
   * The SDK can estimate how much the gas costs of the transaction may increase due to this decay,
   * and can include additional gas to ensure that it will still succeed, even if it ends up pending
   * for a relatively long time. This parameter specifies the length of time that should be covered
   * by the extra gas.
   *
   * Default: 10 minutes.
   */
  borrowingFeeDecayToleranceMinutes?: number;
}

const normalizeBorrowingOperationOptionalParams = (
  maxBorrowingRateOrOptionalParams: Decimalish | BorrowingOperationOptionalParams | undefined,
  currentBorrowingRate: Decimal | undefined
): {
  maxBorrowingRate: Decimal;
  borrowingFeeDecayToleranceMinutes: number;
} => {
  if (maxBorrowingRateOrOptionalParams === undefined) {
    return {
      maxBorrowingRate:
        currentBorrowingRate?.add(defaultBorrowingRateSlippageTolerance) ?? Decimal.ZERO,
      borrowingFeeDecayToleranceMinutes: defaultBorrowingFeeDecayToleranceMinutes
    };
  } else if (
    typeof maxBorrowingRateOrOptionalParams === "number" ||
    typeof maxBorrowingRateOrOptionalParams === "string" ||
    maxBorrowingRateOrOptionalParams instanceof Decimal
  ) {
    return {
      maxBorrowingRate: Decimal.from(maxBorrowingRateOrOptionalParams),
      borrowingFeeDecayToleranceMinutes: defaultBorrowingFeeDecayToleranceMinutes
    };
  } else {
    const { maxBorrowingRate, borrowingFeeDecayToleranceMinutes } = maxBorrowingRateOrOptionalParams;

    return {
      maxBorrowingRate:
        maxBorrowingRate !== undefined
          ? Decimal.from(maxBorrowingRate)
          : currentBorrowingRate?.add(defaultBorrowingRateSlippageTolerance) ?? Decimal.ZERO,

      borrowingFeeDecayToleranceMinutes:
        borrowingFeeDecayToleranceMinutes ?? defaultBorrowingFeeDecayToleranceMinutes
    };
  }
};

/**
 * A transaction that has been prepared for sending.
 *
 * @remarks
 * Returned by {@link PopulatableEthersTren} functions.
 *
 * @public
 */
export class PopulatedEthersTrenTransaction<T = unknown>
  implements
  PopulatedTrenTransaction<EthersPopulatedTransaction, SentEthersTrenTransaction<T>> {
  /** Unsigned transaction object populated by Ethers. */
  readonly rawPopulatedTransaction: EthersPopulatedTransaction;

  /**
   * Extra gas added to the transaction's `gasLimit` on top of the estimated minimum requirement.
   *
   * @remarks
   * Gas estimation is based on blockchain state at the latest block. However, most transactions
   * stay in pending state for several blocks before being included in a block. This may increase
   * the actual gas requirements of certain Tren transactions by the time they are eventually
   * mined, therefore the Tren SDK increases these transactions' `gasLimit` by default (unless
   * `gasLimit` is {@link EthersTransactionOverrides | overridden}).
   *
   * Note: even though the SDK includes gas headroom for many transaction types, currently this
   * property is only implemented for {@link PopulatableEthersTren.openModule | openModule()},
   * {@link PopulatableEthersTren.adjustModule | adjustModule()} and its aliases.
   */
  readonly gasHeadroom?: number;

  private readonly _connection: EthersTrenConnection;
  private readonly _parse: (rawReceipt: EthersTransactionReceipt) => T;

  /** @internal */
  constructor(
    rawPopulatedTransaction: EthersPopulatedTransaction,
    connection: EthersTrenConnection,
    parse: (rawReceipt: EthersTransactionReceipt) => T,
    gasHeadroom?: number
  ) {
    this.rawPopulatedTransaction = rawPopulatedTransaction;
    this._connection = connection;
    this._parse = parse;

    if (gasHeadroom !== undefined) {
      this.gasHeadroom = gasHeadroom;
    }
  }

  /** {@inheritDoc @tren/lib-base#PopulatedTrenTransaction.send} */
  async send(): Promise<SentEthersTrenTransaction<T>> {
    return new SentEthersTrenTransaction(
      await _requireSigner(this._connection).sendTransaction(this.rawPopulatedTransaction),
      this._connection,
      this._parse
    );
  }
}

/**
 * {@inheritDoc @tren/lib-base#PopulatedRedemption}
 *
 * @public
 */
export class PopulatedEthersRedemption
  extends PopulatedEthersTrenTransaction<RedemptionDetails>
  implements
  PopulatedRedemption<
    EthersPopulatedTransaction,
    EthersTransactionResponse,
    EthersTransactionReceipt
  > {
  /** {@inheritDoc @tren/lib-base#PopulatedRedemption.attemptedTrenUSDAmount} */
  readonly attemptedTrenUSDAmount: Decimal;

  /** {@inheritDoc @tren/lib-base#PopulatedRedemption.redeemableTrenUSDAmount} */
  readonly redeemableTrenUSDAmount: Decimal;

  /** {@inheritDoc @tren/lib-base#PopulatedRedemption.isTruncated} */
  readonly isTruncated: boolean;

  private readonly _increaseAmountByMinimumNetDebt?: (
    maxRedemptionRate?: Decimalish
  ) => Promise<PopulatedEthersRedemption>;

  /** @internal */
  constructor(
    rawPopulatedTransaction: EthersPopulatedTransaction,
    connection: EthersTrenConnection,
    attemptedTrenUSDAmount: Decimal,
    redeemableTrenUSDAmount: Decimal,
    increaseAmountByMinimumNetDebt?: (
      maxRedemptionRate?: Decimalish
    ) => Promise<PopulatedEthersRedemption>
  ) {
    const { moduleManager } = _getContracts(connection);

    super(
      rawPopulatedTransaction,
      connection,

      ({ logs }) =>
        moduleManager
          .extractEvents(logs, "Redemption")
          .map(({ args: { _ETHSent, _ETHFee, _actualTrenUSDAmount, _attemptedTrenUSDAmount } }) => ({
            attemptedTrenUSDAmount: decimalify(_attemptedTrenUSDAmount),
            actualTrenUSDAmount: decimalify(_actualTrenUSDAmount),
            collateralTaken: decimalify(_ETHSent),
            fee: decimalify(_ETHFee)
          }))[0]
    );

    this.attemptedTrenUSDAmount = attemptedTrenUSDAmount;
    this.redeemableTrenUSDAmount = redeemableTrenUSDAmount;
    this.isTruncated = redeemableTrenUSDAmount.lt(attemptedTrenUSDAmount);
    this._increaseAmountByMinimumNetDebt = increaseAmountByMinimumNetDebt;
  }

  /** {@inheritDoc @tren/lib-base#PopulatedRedemption.increaseAmountByMinimumNetDebt} */
  increaseAmountByMinimumNetDebt(
    maxRedemptionRate?: Decimalish
  ): Promise<PopulatedEthersRedemption> {
    if (!this._increaseAmountByMinimumNetDebt) {
      throw new Error(
        "PopulatedEthersRedemption: increaseAmountByMinimumNetDebt() can " +
        "only be called when amount is truncated"
      );
    }

    return this._increaseAmountByMinimumNetDebt(maxRedemptionRate);
  }
}

/** @internal */
export interface _ModuleChangeWithFees<T> {
  params: T;
  newModule: Module;
  fee: Decimal;
}

/**
 * Ethers-based implementation of {@link @tren/lib-base#PopulatableTren}.
 *
 * @public
 */
export class PopulatableEthersTren
  implements
  PopulatableTren<
    EthersTransactionReceipt,
    EthersTransactionResponse,
    EthersPopulatedTransaction
  > {
  private readonly _readable: ReadableEthersTren;

  constructor(readable: ReadableEthersTren) {
    this._readable = readable;
  }

  private _wrapSimpleTransaction(
    rawPopulatedTransaction: EthersPopulatedTransaction
  ): PopulatedEthersTrenTransaction<void> {
    return new PopulatedEthersTrenTransaction(
      rawPopulatedTransaction,
      this._readable.connection,
      noDetails
    );
  }

  private _wrapModuleChangeWithFees<T>(
    params: T,
    rawPopulatedTransaction: EthersPopulatedTransaction,
    gasHeadroom?: number
  ): PopulatedEthersTrenTransaction<_ModuleChangeWithFees<T>> {
    const { borrowerOperations } = _getContracts(this._readable.connection);

    return new PopulatedEthersTrenTransaction(
      rawPopulatedTransaction,
      this._readable.connection,

      ({ logs }) => {
        const [newModule] = borrowerOperations
          .extractEvents(logs, "ModuleUpdated")
          .map(({ args: { _coll, _debt } }) => new Module(decimalify(_coll), decimalify(_debt)));

        const [fee] = borrowerOperations
          .extractEvents(logs, "TrenUSDBorrowingFeePaid")
          .map(({ args: { _TrenUSDFee } }) => decimalify(_TrenUSDFee));

        return {
          params,
          newModule,
          fee
        };
      },

      gasHeadroom
    );
  }

  private async _wrapModuleClosure(
    rawPopulatedTransaction: EthersPopulatedTransaction
  ): Promise<PopulatedEthersTrenTransaction<ModuleClosureDetails>> {
    const { activePool, trenUSDToken } = _getContracts(this._readable.connection);

    return new PopulatedEthersTrenTransaction(
      rawPopulatedTransaction,
      this._readable.connection,

      ({ logs, from: userAddress }) => {
        const [repayTrenUSD] = trenUSDToken
          .extractEvents(logs, "Transfer")
          .filter(({ args: { from, to } }) => from === userAddress && to === AddressZero)
          .map(({ args: { value } }) => decimalify(value));

        const [withdrawCollateral] = activePool
          .extractEvents(logs, "EtherSent")
          .filter(({ args: { _to } }) => _to === userAddress)
          .map(({ args: { _amount } }) => decimalify(_amount));

        return {
          params: repayTrenUSD.nonZero ? { withdrawCollateral, repayTrenUSD } : { withdrawCollateral }
        };
      }
    );
  }

  private _wrapLiquidation(
    rawPopulatedTransaction: EthersPopulatedTransaction
  ): PopulatedEthersTrenTransaction<LiquidationDetails> {
    const { moduleManager } = _getContracts(this._readable.connection);

    return new PopulatedEthersTrenTransaction(
      rawPopulatedTransaction,
      this._readable.connection,

      ({ logs }) => {
        const liquidatedAddresses = moduleManager
          .extractEvents(logs, "ModuleLiquidated")
          .map(({ args: { _borrower } }) => _borrower);

        const [totals] = moduleManager
          .extractEvents(logs, "Liquidation")
          .map(
            ({
              args: { _TrenUSDGasCompensation, _collGasCompensation, _liquidatedColl, _liquidatedDebt }
            }) => ({
              collateralGasCompensation: decimalify(_collGasCompensation),
              trenUSDGasCompensation: decimalify(_TrenUSDGasCompensation),
              totalLiquidated: new Module(decimalify(_liquidatedColl), decimalify(_liquidatedDebt))
            })
          );

        return {
          liquidatedAddresses,
          ...totals
        };
      }
    );
  }

  private _extractStabilityPoolGainsWithdrawalDetails(
    logs: Log[]
  ): StabilityPoolGainsWithdrawalDetails {
    const { stabilityPool } = _getContracts(this._readable.connection);

    const [newTrenUSDDeposit] = stabilityPool
      .extractEvents(logs, "UserDepositChanged")
      .map(({ args: { _newDeposit } }) => decimalify(_newDeposit));

    const [[collateralGain, trenUSDLoss]] = stabilityPool
      .extractEvents(logs, "ETHGainWithdrawn")
      .map(({ args: { _ETH, _TrenUSDLoss } }) => [decimalify(_ETH), decimalify(_TrenUSDLoss)]);

    return {
      trenUSDLoss,
      newTrenUSDDeposit,
      collateralGain
    };
  }

  private _wrapStabilityPoolGainsWithdrawal(
    rawPopulatedTransaction: EthersPopulatedTransaction
  ): PopulatedEthersTrenTransaction<StabilityPoolGainsWithdrawalDetails> {
    return new PopulatedEthersTrenTransaction(
      rawPopulatedTransaction,
      this._readable.connection,
      ({ logs }) => this._extractStabilityPoolGainsWithdrawalDetails(logs)
    );
  }

  private _wrapStabilityDepositTopup(
    change: { depositTrenUSD: Decimal },
    rawPopulatedTransaction: EthersPopulatedTransaction
  ): PopulatedEthersTrenTransaction<StabilityDepositChangeDetails> {
    return new PopulatedEthersTrenTransaction(
      rawPopulatedTransaction,
      this._readable.connection,

      ({ logs }) => ({
        ...this._extractStabilityPoolGainsWithdrawalDetails(logs),
        change
      })
    );
  }

  private async _wrapStabilityDepositWithdrawal(
    rawPopulatedTransaction: EthersPopulatedTransaction
  ): Promise<PopulatedEthersTrenTransaction<StabilityDepositChangeDetails>> {
    const { stabilityPool, trenUSDToken } = _getContracts(this._readable.connection);

    return new PopulatedEthersTrenTransaction(
      rawPopulatedTransaction,
      this._readable.connection,

      ({ logs, from: userAddress }) => {
        const gainsWithdrawalDetails = this._extractStabilityPoolGainsWithdrawalDetails(logs);

        const [withdrawTrenUSD] = trenUSDToken
          .extractEvents(logs, "Transfer")
          .filter(({ args: { from, to } }) => from === (stabilityPool as any).address && to === userAddress)
          .map(({ args: { value } }) => decimalify(value));

        return {
          ...gainsWithdrawalDetails,
          change: { withdrawTrenUSD, withdrawAllTrenUSD: gainsWithdrawalDetails.newTrenUSDDeposit.isZero }
        };
      }
    );
  }

  private _wrapCollateralGainTransfer(
    rawPopulatedTransaction: EthersPopulatedTransaction
  ): PopulatedEthersTrenTransaction<CollateralGainTransferDetails> {
    const { borrowerOperations } = _getContracts(this._readable.connection);

    return new PopulatedEthersTrenTransaction(
      rawPopulatedTransaction,
      this._readable.connection,

      ({ logs }) => {
        const [newModule] = borrowerOperations
          .extractEvents(logs, "ModuleUpdated")
          .map(({ args: { _coll, _debt } }) => new Module(decimalify(_coll), decimalify(_debt)));

        return {
          ...this._extractStabilityPoolGainsWithdrawalDetails(logs),
          newModule
        };
      }
    );
  }

  private _prepareOverrides(overrides?: EthersTransactionOverrides): EthersTransactionOverrides {
    return { ...overrides, from: _requireAddress(this._readable.connection, overrides) };
  }

  private async _findHintsForNominalCollateralRatio(
    nominalCollateralRatio: Decimal,
    ownAddress?: string
  ): Promise<[string, string]> {
    const { sortedModules, hintHelpers } = _getContracts(this._readable.connection);
    const numberOfModules = await this._readable.getNumberOfModules();

    if (!numberOfModules) {
      return [AddressZero, AddressZero];
    }

    if (nominalCollateralRatio.infinite) {
      return [AddressZero, await sortedModules.getFirst()];
    }

    const totalNumberOfTrials = Math.ceil(10 * Math.sqrt(numberOfModules));
    const [firstTrials, ...restOfTrials] = generateTrials(totalNumberOfTrials);

    const collectApproxHint = (
      {
        latestRandomSeed,
        results
      }: {
        latestRandomSeed: BigNumberish;
        results: { diff: BigNumber; hintAddress: string }[];
      },
      numberOfTrials: number
    ) =>
      hintHelpers
        .getApproxHint(nominalCollateralRatio.hex, numberOfTrials, latestRandomSeed)
        .then(({ latestRandomSeed, ...result }) => ({
          latestRandomSeed,
          results: [...results, result]
        }));

    const { results } = await restOfTrials.reduce(
      (p, numberOfTrials) => p.then(state => collectApproxHint(state, numberOfTrials)),
      collectApproxHint({ latestRandomSeed: randomInteger(), results: [] }, firstTrials)
    );

    const { hintAddress } = results.reduce((a, b) => (a.diff.lt(b.diff) ? a : b));

    let [prev, next] = await sortedModules.findInsertPosition(
      nominalCollateralRatio.hex,
      hintAddress,
      hintAddress
    );

    if (ownAddress) {
      // In the case of reinsertion, the address of the Module being reinserted is not a usable hint,
      // because it is deleted from the list before the reinsertion.
      // "Jump over" the Module to get the proper hint.
      if (prev === ownAddress) {
        prev = await sortedModules.getPrev(prev);
      } else if (next === ownAddress) {
        next = await sortedModules.getNext(next);
      }
    }

    // Don't use `address(0)` as hint as it can result in huge gas cost.
    // (See https://github.com/tren/dev/issues/600).
    if (prev === AddressZero) {
      prev = next;
    } else if (next === AddressZero) {
      next = prev;
    }

    return [prev, next];
  }

  private async _findHints(module: Module, ownAddress?: string): Promise<[string, string]> {
    if (module instanceof ModuleWithPendingRedistribution) {
      throw new Error("Rewards must be applied to this Module");
    }

    return this._findHintsForNominalCollateralRatio(module._nominalCollateralRatio, ownAddress);
  }

  private async _findRedemptionHints(
    amount: Decimal
  ): Promise<
    [
      truncatedAmount: Decimal,
      firstRedemptionHint: string,
      partialRedemptionUpperHint: string,
      partialRedemptionLowerHint: string,
      partialRedemptionHintNICR: BigNumber
    ]
  > {
    const { hintHelpers } = _getContracts(this._readable.connection);
    const price = await this._readable.getPrice();

    const {
      firstRedemptionHint,
      partialRedemptionHintNICR,
      truncatedTrenUSDamount
    } = await hintHelpers.getRedemptionHints(amount.hex, price.hex, _redeemMaxIterations);

    const [
      partialRedemptionUpperHint,
      partialRedemptionLowerHint
    ] = partialRedemptionHintNICR.isZero()
        ? [AddressZero, AddressZero]
        : await this._findHintsForNominalCollateralRatio(
          decimalify(partialRedemptionHintNICR)
          // XXX: if we knew the partially redeemed Module's address, we'd pass it here
        );

    return [
      decimalify(truncatedTrenUSDamount),
      firstRedemptionHint,
      partialRedemptionUpperHint,
      partialRedemptionLowerHint,
      partialRedemptionHintNICR
    ];
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.openModule} */
  async openModule(
    params: ModuleCreationParams<Decimalish>,
    maxBorrowingRateOrOptionalParams?: Decimalish | BorrowingOperationOptionalParams,
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<ModuleCreationDetails>> {
    overrides = this._prepareOverrides(overrides);
    const { borrowerOperations } = _getContracts(this._readable.connection);

    const normalizedParams = _normalizeModuleCreation(params);
    const { depositCollateral, borrowTrenUSD } = normalizedParams;

    const [fees, blockTimestamp, total, price] = await Promise.all([
      this._readable._getFeesFactory(),
      this._readable._getBlockTimestamp(),
      this._readable.getTotal(),
      this._readable.getPrice()
    ]);

    const recoveryMode = total.collateralRatioIsBelowCritical(price);

    const decayBorrowingRate = (seconds: number) =>
      fees(blockTimestamp + seconds, recoveryMode).borrowingRate();

    const currentBorrowingRate = decayBorrowingRate(0);
    const newModule = Module.create(normalizedParams, currentBorrowingRate);
    const hints = await this._findHints(newModule);

    const {
      maxBorrowingRate,
      borrowingFeeDecayToleranceMinutes
    } = normalizeBorrowingOperationOptionalParams(
      maxBorrowingRateOrOptionalParams,
      currentBorrowingRate
    );

    const txParams = (borrowTrenUSD: Decimal): Parameters<typeof borrowerOperations.openModule> => [
      maxBorrowingRate.hex,
      borrowTrenUSD.hex,
      ...hints,
      { value: depositCollateral.hex, ...overrides }
    ];

    let gasHeadroom: number | undefined;

    if (overrides?.gasLimit === undefined) {
      const decayedBorrowingRate = decayBorrowingRate(60 * borrowingFeeDecayToleranceMinutes);
      const decayedModule = Module.create(normalizedParams, decayedBorrowingRate);
      const { borrowTrenUSD: borrowTrenUSDSimulatingDecay } = Module.recreate(
        decayedModule,
        currentBorrowingRate
      );

      if (decayedModule.debt.lt(TrenUSD_MINIMUM_DEBT)) {
        throw new Error(
          `Module's debt might fall below ${TrenUSD_MINIMUM_DEBT} ` +
          `within ${borrowingFeeDecayToleranceMinutes} minutes`
        );
      }

      const [gasNow, gasLater] = await Promise.all([
        borrowerOperations.estimateGas.openModule(...txParams(borrowTrenUSD)),
        borrowerOperations.estimateGas.openModule(...txParams(borrowTrenUSDSimulatingDecay))
      ]);

      const gasLimit = addGasForBaseRateUpdate(borrowingFeeDecayToleranceMinutes)(
        bigNumberMax(addGasForPotentialListTraversal(gasNow), gasLater)
      );

      gasHeadroom = gasLimit.sub(gasNow).toNumber();
      overrides = { ...overrides, gasLimit };
    }

    return this._wrapModuleChangeWithFees(
      normalizedParams,
      await borrowerOperations.populateTransaction.openModule(...txParams(borrowTrenUSD)),
      gasHeadroom
    );
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.closeModule} */
  async closeModule(
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<ModuleClosureDetails>> {
    overrides = this._prepareOverrides(overrides);
    const { borrowerOperations } = _getContracts(this._readable.connection);

    return this._wrapModuleClosure(
      await borrowerOperations.estimateAndPopulate.closeModule(overrides, id)
    );
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.depositCollateral} */
  depositCollateral(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<ModuleAdjustmentDetails>> {
    return this.adjustModule({ depositCollateral: amount }, undefined, overrides);
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.withdrawCollateral} */
  withdrawCollateral(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<ModuleAdjustmentDetails>> {
    return this.adjustModule({ withdrawCollateral: amount }, undefined, overrides);
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.borrowTrenUSD} */
  borrowTrenUSD(
    amount: Decimalish,
    maxBorrowingRate?: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<ModuleAdjustmentDetails>> {
    return this.adjustModule({ borrowTrenUSD: amount }, maxBorrowingRate, overrides);
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.repayTrenUSD} */
  repayTrenUSD(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<ModuleAdjustmentDetails>> {
    return this.adjustModule({ repayTrenUSD: amount }, undefined, overrides);
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.adjustModule} */
  async adjustModule(
    params: ModuleAdjustmentParams<Decimalish>,
    maxBorrowingRateOrOptionalParams?: Decimalish | BorrowingOperationOptionalParams,
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<ModuleAdjustmentDetails>> {
    overrides = this._prepareOverrides(overrides);
    const { borrowerOperations } = _getContracts(this._readable.connection);

    const normalizedParams = _normalizeModuleAdjustment(params);
    const { depositCollateral, withdrawCollateral, borrowTrenUSD, repayTrenUSD } = normalizedParams;

    const [module, feeVars] = await Promise.all([
      this._readable.getModule(overrides.from),
      borrowTrenUSD &&
      promiseAllValues({
        fees: this._readable._getFeesFactory(),
        blockTimestamp: this._readable._getBlockTimestamp(),
        total: this._readable.getTotal(),
        price: this._readable.getPrice()
      })
    ]);

    const decayBorrowingRate = (seconds: number) =>
      feeVars
        ?.fees(
          feeVars.blockTimestamp + seconds,
          feeVars.total.collateralRatioIsBelowCritical(feeVars.price)
        )
        .borrowingRate();

    const currentBorrowingRate = decayBorrowingRate(0);
    const adjustedModule = module.adjust(normalizedParams, currentBorrowingRate);
    const hints = await this._findHints(adjustedModule, overrides.from);

    const {
      maxBorrowingRate,
      borrowingFeeDecayToleranceMinutes
    } = normalizeBorrowingOperationOptionalParams(
      maxBorrowingRateOrOptionalParams,
      currentBorrowingRate
    );

    const txParams = (borrowTrenUSD?: Decimal): Parameters<typeof borrowerOperations.adjustModule> => [
      maxBorrowingRate.hex,
      (withdrawCollateral ?? Decimal.ZERO).hex,
      (borrowTrenUSD ?? repayTrenUSD ?? Decimal.ZERO).hex,
      !!borrowTrenUSD,
      ...hints,
      { value: depositCollateral?.hex, ...overrides }
    ];

    let gasHeadroom: number | undefined;

    if (overrides.gasLimit === undefined) {
      const decayedBorrowingRate = decayBorrowingRate(60 * borrowingFeeDecayToleranceMinutes);
      const decayedModule = module.adjust(normalizedParams, decayedBorrowingRate);
      const { borrowTrenUSD: borrowTrenUSDSimulatingDecay } = module.adjustTo(
        decayedModule,
        currentBorrowingRate
      );

      if (decayedModule.debt.lt(TrenUSD_MINIMUM_DEBT)) {
        throw new Error(
          `Module's debt might fall below ${TrenUSD_MINIMUM_DEBT} ` +
          `within ${borrowingFeeDecayToleranceMinutes} minutes`
        );
      }

      const [gasNow, gasLater] = await Promise.all([
        borrowerOperations.estimateGas.adjustModule(...txParams(borrowTrenUSD)),
        borrowTrenUSD &&
        borrowerOperations.estimateGas.adjustModule(...txParams(borrowTrenUSDSimulatingDecay))
      ]);

      let gasLimit = bigNumberMax(addGasForPotentialListTraversal(gasNow), gasLater);

      if (borrowTrenUSD) {
        gasLimit = addGasForBaseRateUpdate(borrowingFeeDecayToleranceMinutes)(gasLimit);
      }

      gasHeadroom = gasLimit.sub(gasNow).toNumber();
      overrides = { ...overrides, gasLimit };
    }

    return this._wrapModuleChangeWithFees(
      normalizedParams,
      await borrowerOperations.populateTransaction.adjustModule(...txParams(borrowTrenUSD)),
      gasHeadroom
    );
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.claimCollateralSurplus} */
  async claimCollateralSurplus(
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<void>> {
    overrides = this._prepareOverrides(overrides);
    const { borrowerOperations } = _getContracts(this._readable.connection);

    return this._wrapSimpleTransaction(
      await borrowerOperations.estimateAndPopulate.claimCollateral(overrides, id)
    );
  }

  /** @internal */
  async setPrice(
    price: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<void>> {
    overrides = this._prepareOverrides(overrides);
    const { priceFeed } = _getContracts(this._readable.connection);

    if (!_priceFeedIsTestnet(priceFeed)) {
      throw new Error("setPrice() unavailable on this deployment of Tren");
    }

    return this._wrapSimpleTransaction(
      await priceFeed.estimateAndPopulate.setPrice(overrides, id, Decimal.from(price).hex)
    );
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.liquidate} */
  async liquidate(
    address: string | string[],
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<LiquidationDetails>> {
    overrides = this._prepareOverrides(overrides);
    const { moduleManager } = _getContracts(this._readable.connection);

    if (Array.isArray(address)) {
      return this._wrapLiquidation(
        await moduleManager.estimateAndPopulate.batchLiquidateModules(
          overrides,
          address
        )
      );
    } else {
      return this._wrapLiquidation(
        await moduleManager.estimateAndPopulate.liquidate(overrides, address)
      );
    }
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.liquidateUpTo} */
  async liquidateUpTo(
    maximumNumberOfModulesToLiquidate: number,
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<LiquidationDetails>> {
    overrides = this._prepareOverrides(overrides);
    const { moduleManager } = _getContracts(this._readable.connection);

    return this._wrapLiquidation(
      await moduleManager.estimateAndPopulate.liquidateModules(
        overrides,
        maximumNumberOfModulesToLiquidate
      )
    );
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.depositTrenUSDInStabilityPool} */
  async depositTrenUSDInStabilityPool(
    amount: Decimalish,
    frontendTag?: string,
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<StabilityDepositChangeDetails>> {
    overrides = this._prepareOverrides(overrides);
    const { stabilityPool } = _getContracts(this._readable.connection);
    const depositTrenUSD = Decimal.from(amount);

    return this._wrapStabilityDepositTopup(
      { depositTrenUSD },
      await stabilityPool.estimateAndPopulate.provideToSP(
        overrides,
        depositTrenUSD.hex,
        frontendTag ?? this._readable.connection.frontendTag ?? AddressZero
      )
    );
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.withdrawTrenUSDFromStabilityPool} */
  async withdrawTrenUSDFromStabilityPool(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<StabilityDepositChangeDetails>> {
    overrides = this._prepareOverrides(overrides);
    const { stabilityPool } = _getContracts(this._readable.connection);

    return this._wrapStabilityDepositWithdrawal(
      await stabilityPool.estimateAndPopulate.withdrawFromSP(
        overrides,
        Decimal.from(amount).hex
      )
    );
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.withdrawGainsFromStabilityPool} */
  async withdrawGainsFromStabilityPool(
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<StabilityPoolGainsWithdrawalDetails>> {
    overrides = this._prepareOverrides(overrides);
    const { stabilityPool } = _getContracts(this._readable.connection);

    return this._wrapStabilityPoolGainsWithdrawal(
      await stabilityPool.estimateAndPopulate.withdrawFromSP(
        overrides,
        Decimal.ZERO.hex
      )
    );
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.transferCollateralGainToModule} */
  async transferCollateralGainToModule(
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<CollateralGainTransferDetails>> {
    overrides = this._prepareOverrides(overrides);
    const { stabilityPool } = _getContracts(this._readable.connection);

    const [initialModule, stabilityDeposit] = await Promise.all([
      this._readable.getModule(overrides.from),
      this._readable.getStabilityDeposit(overrides.from)
    ]);

    const finalModule = initialModule.addCollateral(stabilityDeposit.collateralGain);

    return this._wrapCollateralGainTransfer(
      await stabilityPool.estimateAndPopulate.withdrawETHGainToModule(
        overrides,
        compose(addGasForPotentialListTraversal),
        ...(await this._findHints(finalModule, overrides.from))
      )
    );
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.sendTrenUSD} */
  async sendTrenUSD(
    toAddress: string,
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<void>> {
    overrides = this._prepareOverrides(overrides);
    const { trenUSDToken } = _getContracts(this._readable.connection);

    return this._wrapSimpleTransaction(
      await trenUSDToken.estimateAndPopulate.transfer(
        overrides,
        id,
        toAddress,
        Decimal.from(amount).hex
      )
    );
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.redeemTrenUSD} */
  async redeemTrenUSD(
    amount: Decimalish,
    maxRedemptionRate?: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersRedemption> {
    const preparedOverrides = this._prepareOverrides(overrides);
    const { moduleManager } = _getContracts(this._readable.connection);
    const attemptedTrenUSDAmount = Decimal.from(amount);

    const [
      fees,
      total,
      [truncatedAmount, firstRedemptionHint, ...partialHints]
    ] = await Promise.all([
      this._readable.getFees(),
      this._readable.getTotal(),
      this._findRedemptionHints(attemptedTrenUSDAmount)
    ]);

    if (truncatedAmount.isZero) {
      throw new Error(
        `redeemTrenUSD: amount too low to redeem (try at least ${TrenUSD_MINIMUM_NET_DEBT})`
      );
    }

    const defaultMaxRedemptionRate = (amount: Decimal) =>
      Decimal.min(
        fees.redemptionRate(amount.div(total.debt)).add(defaultRedemptionRateSlippageTolerance),
        Decimal.ONE
      );

    const populateRedemption = async (
      attemptedTrenUSDAmount: Decimal,
      maxRedemptionRate?: Decimalish,
      truncatedAmount: Decimal = attemptedTrenUSDAmount,
      partialHints: [string, string, BigNumberish] = [AddressZero, AddressZero, 0]
    ): Promise<PopulatedEthersRedemption> => {
      const maxRedemptionRateOrDefault =
        maxRedemptionRate !== undefined
          ? Decimal.from(maxRedemptionRate)
          : defaultMaxRedemptionRate(truncatedAmount);

      return new PopulatedEthersRedemption(
        await moduleManager.estimateAndPopulate.redeemCollateral(
          preparedOverrides,
          addGasForBaseRateUpdate(),
          truncatedAmount.hex,
          firstRedemptionHint,
          ...partialHints,
          _redeemMaxIterations,
          maxRedemptionRateOrDefault.hex
        ),

        this._readable.connection,
        attemptedTrenUSDAmount,
        truncatedAmount,

        truncatedAmount.lt(attemptedTrenUSDAmount)
          ? newMaxRedemptionRate =>
            populateRedemption(
              truncatedAmount.add(TrenUSD_MINIMUM_NET_DEBT),
              newMaxRedemptionRate ?? maxRedemptionRate
            )
          : undefined
      );
    };

    return populateRedemption(attemptedTrenUSDAmount, maxRedemptionRate, truncatedAmount, partialHints);
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.registerFrontend} */
  async registerFrontend(
    kickbackRate: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<void>> {
    overrides = this._prepareOverrides(overrides);
    const { stabilityPool } = _getContracts(this._readable.connection);

    return this._wrapSimpleTransaction(
      await stabilityPool.estimateAndPopulate.registerFrontEnd(
        overrides,
        id,
        Decimal.from(kickbackRate).hex
      )
    );
  }

  /** @internal */
  async _mintUniToken(
    amount: Decimalish,
    address?: string,
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<void>> {
    address ??= _requireAddress(this._readable.connection, overrides);
    overrides = this._prepareOverrides(overrides);
    const { uniToken } = _getContracts(this._readable.connection);

    if (!_uniTokenIsMock(uniToken)) {
      throw new Error("_mintUniToken() unavailable on this deployment of Tren");
    }

    return this._wrapSimpleTransaction(
      await uniToken.estimateAndPopulate.mint(overrides, id, address, Decimal.from(amount).hex)
    );
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.approveUniTokens} */
  async approveUniTokens(
    allowance?: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<void>> {
    overrides = this._prepareOverrides(overrides);
    const { uniToken, unipool } = _getContracts(this._readable.connection);

    return this._wrapSimpleTransaction(
      await uniToken.estimateAndPopulate.approve(
        overrides,
        id,
        (unipool as any).address,
        Decimal.from(allowance ?? Decimal.INFINITY).hex
      )
    );
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.stakeUniTokens} */
  async stakeUniTokens(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<void>> {
    overrides = this._prepareOverrides(overrides);
    const { unipool } = _getContracts(this._readable.connection);

    return this._wrapSimpleTransaction(
      await unipool.estimateAndPopulate.stake(
        overrides,
        addGasForUnipoolRewardUpdate,
        Decimal.from(amount).hex
      )
    );
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.unstakeUniTokens} */
  async unstakeUniTokens(
    amount: Decimalish,
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<void>> {
    overrides = this._prepareOverrides(overrides);
    const { unipool } = _getContracts(this._readable.connection);

    return this._wrapSimpleTransaction(
      await unipool.estimateAndPopulate.withdraw(
        overrides,
        addGasForUnipoolRewardUpdate,
        Decimal.from(amount).hex
      )
    );
  }

  /** {@inheritDoc @tren/lib-base#PopulatableTren.exitLiquidityMining} */
  async exitLiquidityMining(
    overrides?: EthersTransactionOverrides
  ): Promise<PopulatedEthersTrenTransaction<void>> {
    overrides = this._prepareOverrides(overrides);
    const { unipool } = _getContracts(this._readable.connection);

    return this._wrapSimpleTransaction(
      await unipool.estimateAndPopulate.withdrawAndClaim(overrides, addGasForUnipoolRewardUpdate)
    );
  }
}
