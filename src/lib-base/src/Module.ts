import assert from "assert";

import { Decimal, Decimalish } from "./Decimal";

import {
  MINIMUM_COLLATERAL_RATIO,
  CRITICAL_COLLATERAL_RATIO,
  TrenUSD_LIQUIDATION_RESERVE,
  MINIMUM_BORROWING_RATE
} from "./constants";

/** @internal */ export type _CollateralDeposit<T> = { depositCollateral: T };
/** @internal */ export type _CollateralWithdrawal<T> = { withdrawCollateral: T };
/** @internal */ export type _TrenUSDBorrowing<T> = { borrowTrenUSD: T };
/** @internal */ export type _TrenUSDRepayment<T> = { repayTrenUSD: T };

/** @internal */ export type _NoCollateralDeposit = Partial<_CollateralDeposit<undefined>>;
/** @internal */ export type _NoCollateralWithdrawal = Partial<_CollateralWithdrawal<undefined>>;
/** @internal */ export type _NoTrenUSDBorrowing = Partial<_TrenUSDBorrowing<undefined>>;
/** @internal */ export type _NoTrenUSDRepayment = Partial<_TrenUSDRepayment<undefined>>;

/** @internal */
export type _CollateralChange<T> =
  | (_CollateralDeposit<T> & _NoCollateralWithdrawal)
  | (_CollateralWithdrawal<T> & _NoCollateralDeposit);

/** @internal */
export type _NoCollateralChange = _NoCollateralDeposit & _NoCollateralWithdrawal;

/** @internal */
export type _DebtChange<T> =
  | (_TrenUSDBorrowing<T> & _NoTrenUSDRepayment)
  | (_TrenUSDRepayment<T> & _NoTrenUSDBorrowing);

/** @internal */
export type _NoDebtChange = _NoTrenUSDBorrowing & _NoTrenUSDRepayment;

/**
 * Parameters of an {@link TransactableTren.openModule | openModule()} transaction.
 *
 * @remarks
 * The type parameter `T` specifies the allowed value type(s) of the particular `ModuleCreationParams`
 * object's properties.
 *
 * <h2>Properties</h2>
 *
 * <table>
 *
 *   <tr>
 *     <th> Property </th>
 *     <th> Type </th>
 *     <th> Description </th>
 *   </tr>
 *
 *   <tr>
 *     <td> depositCollateral </td>
 *     <td> T </td>
 *     <td> The amount of collateral that's deposited. </td>
 *   </tr>
 *
 *   <tr>
 *     <td> borrowTrenUSD </td>
 *     <td> T </td>
 *     <td> The amount of TrenUSD that's borrowed. </td>
 *   </tr>
 *
 * </table>
 *
 * @public
 */
export type ModuleCreationParams<T = unknown> = _CollateralDeposit<T> &
  _NoCollateralWithdrawal &
  _TrenUSDBorrowing<T> &
  _NoTrenUSDRepayment;

/**
 * Parameters of a {@link TransactableTren.closeModule | closeModule()} transaction.
 *
 * @remarks
 * The type parameter `T` specifies the allowed value type(s) of the particular `ModuleClosureParams`
 * object's properties.
 *
 * <h2>Properties</h2>
 *
 * <table>
 *
 *   <tr>
 *     <th> Property </th>
 *     <th> Type </th>
 *     <th> Description </th>
 *   </tr>
 *
 *   <tr>
 *     <td> withdrawCollateral </td>
 *     <td> T </td>
 *     <td> The amount of collateral that's withdrawn. </td>
 *   </tr>
 *
 *   <tr>
 *     <td> repayTrenUSD? </td>
 *     <td> T </td>
 *     <td> <i>(Optional)</i> The amount of TrenUSD that's repaid. </td>
 *   </tr>
 *
 * </table>
 *
 * @public
 */
export type ModuleClosureParams<T> = _CollateralWithdrawal<T> &
  _NoCollateralDeposit &
  Partial<_TrenUSDRepayment<T>> &
  _NoTrenUSDBorrowing;

/**
 * Parameters of an {@link TransactableTren.adjustModule | adjustModule()} transaction.
 *
 * @remarks
 * The type parameter `T` specifies the allowed value type(s) of the particular
 * `ModuleAdjustmentParams` object's properties.
 *
 * Even though all properties are optional, a valid `ModuleAdjustmentParams` object must define at
 * least one.
 *
 * Defining both `depositCollateral` and `withdrawCollateral`, or both `borrowTrenUSD` and `repayTrenUSD`
 * at the same time is disallowed, and will result in a type-checking error.
 *
 * <h2>Properties</h2>
 *
 * <table>
 *
 *   <tr>
 *     <th> Property </th>
 *     <th> Type </th>
 *     <th> Description </th>
 *   </tr>
 *
 *   <tr>
 *     <td> depositCollateral? </td>
 *     <td> T </td>
 *     <td> <i>(Optional)</i> The amount of collateral that's deposited. </td>
 *   </tr>
 *
 *   <tr>
 *     <td> withdrawCollateral? </td>
 *     <td> T </td>
 *     <td> <i>(Optional)</i> The amount of collateral that's withdrawn. </td>
 *   </tr>
 *
 *   <tr>
 *     <td> borrowTrenUSD? </td>
 *     <td> T </td>
 *     <td> <i>(Optional)</i> The amount of TrenUSD that's borrowed. </td>
 *   </tr>
 *
 *   <tr>
 *     <td> repayTrenUSD? </td>
 *     <td> T </td>
 *     <td> <i>(Optional)</i> The amount of TrenUSD that's repaid. </td>
 *   </tr>
 *
 * </table>
 *
 * @public
 */
export type ModuleAdjustmentParams<T = unknown> =
  | (_CollateralChange<T> & _NoDebtChange)
  | (_DebtChange<T> & _NoCollateralChange)
  | (_CollateralChange<T> & _DebtChange<T>);

/**
 * Describes why a Module could not be created.
 *
 * @remarks
 * See {@link ModuleChange}.
 *
 * <h2>Possible values</h2>
 *
 * <table>
 *
 *   <tr>
 *     <th> Value </th>
 *     <th> Reason </th>
 *   </tr>
 *
 *   <tr>
 *     <td> "missingLiquidationReserve" </td>
 *     <td> A Module's debt cannot be less than the liquidation reserve. </td>
 *   </tr>
 *
 * </table>
 *
 * More errors may be added in the future.
 *
 * @public
 */
export type ModuleCreationError = "missingLiquidationReserve";

/**
 * Represents the change between two Module states.
 *
 * @remarks
 * Returned by {@link Module.whatChanged}.
 *
 * Passed as a parameter to {@link Module.apply}.
 *
 * @public
 */
export type ModuleChange<T> =
  | { type: "invalidCreation"; invalidModule: Module; error: ModuleCreationError }
  | { type: "creation"; params: ModuleCreationParams<T> }
  | { type: "closure"; params: ModuleClosureParams<T> }
  | { type: "adjustment"; params: ModuleAdjustmentParams<T>; setToZero?: "collateral" | "debt" };

// This might seem backwards, but this way we avoid spamming the .d.ts and generated docs
type InvalidModuleCreation = Extract<ModuleChange<never>, { type: "invalidCreation" }>;
type ModuleCreation<T> = Extract<ModuleChange<T>, { type: "creation" }>;
type ModuleClosure<T> = Extract<ModuleChange<T>, { type: "closure" }>;
type ModuleAdjustment<T> = Extract<ModuleChange<T>, { type: "adjustment" }>;

const invalidModuleCreation = (
  invalidModule: Module,
  error: ModuleCreationError
): InvalidModuleCreation => ({
  type: "invalidCreation",
  invalidModule,
  error
});

const moduleCreation = <T>(params: ModuleCreationParams<T>): ModuleCreation<T> => ({
  type: "creation",
  params
});

const moduleClosure = <T>(params: ModuleClosureParams<T>): ModuleClosure<T> => ({
  type: "closure",
  params
});

const moduleAdjustment = <T>(
  params: ModuleAdjustmentParams<T>,
  setToZero?: "collateral" | "debt"
): ModuleAdjustment<T> => ({
  type: "adjustment",
  params,
  setToZero
});

const valueIsDefined = <T>(entry: [string, T | undefined]): entry is [string, T] =>
  entry[1] !== undefined;

type AllowedKey<T> = Exclude<
  {
    [P in keyof T]: T[P] extends undefined ? never : P;
  }[keyof T],
  undefined
>;

const allowedModuleCreationKeys: AllowedKey<ModuleCreationParams>[] = [
  "depositCollateral",
  "borrowTrenUSD"
];

function checkAllowedModuleCreationKeys<T>(
  entries: [string, T][]
): asserts entries is [AllowedKey<ModuleCreationParams>, T][] {
  const badKeys = entries
    .filter(([k]) => !(allowedModuleCreationKeys as string[]).includes(k))
    .map(([k]) => `'${k}'`);

  if (badKeys.length > 0) {
    throw new Error(`ModuleCreationParams: property ${badKeys.join(", ")} not allowed`);
  }
}

const moduleCreationParamsFromEntries = <T>(
  entries: [AllowedKey<ModuleCreationParams>, T][]
): ModuleCreationParams<T> => {
  const params = Object.fromEntries(entries) as Record<AllowedKey<ModuleCreationParams>, T>;
  const missingKeys = allowedModuleCreationKeys.filter(k => !(k in params)).map(k => `'${k}'`);

  if (missingKeys.length > 0) {
    throw new Error(`ModuleCreationParams: property ${missingKeys.join(", ")} missing`);
  }

  return params;
};

const decimalize = <T>([k, v]: [T, Decimalish]): [T, Decimal] => [k, Decimal.from(v)];
const nonZero = <T>([, v]: [T, Decimal]): boolean => !v.isZero;

/** @internal */
export const _normalizeModuleCreation = (
  params: Record<string, Decimalish | undefined>
): ModuleCreationParams<Decimal> => {
  const definedEntries = Object.entries(params).filter(valueIsDefined);
  checkAllowedModuleCreationKeys(definedEntries);
  const nonZeroEntries = definedEntries.map(decimalize);

  return moduleCreationParamsFromEntries(nonZeroEntries);
};

const allowedModuleAdjustmentKeys: AllowedKey<ModuleAdjustmentParams>[] = [
  "depositCollateral",
  "withdrawCollateral",
  "borrowTrenUSD",
  "repayTrenUSD"
];

function checkAllowedModuleAdjustmentKeys<T>(
  entries: [string, T][]
): asserts entries is [AllowedKey<ModuleAdjustmentParams>, T][] {
  const badKeys = entries
    .filter(([k]) => !(allowedModuleAdjustmentKeys as string[]).includes(k))
    .map(([k]) => `'${k}'`);

  if (badKeys.length > 0) {
    throw new Error(`ModuleAdjustmentParams: property ${badKeys.join(", ")} not allowed`);
  }
}

const collateralChangeFrom = <T>({
  depositCollateral,
  withdrawCollateral
}: Partial<Record<AllowedKey<ModuleAdjustmentParams>, T>>): _CollateralChange<T> | undefined => {
  if (depositCollateral !== undefined && withdrawCollateral !== undefined) {
    throw new Error(
      "ModuleAdjustmentParams: 'depositCollateral' and 'withdrawCollateral' " +
        "can't be present at the same time"
    );
  }

  if (depositCollateral !== undefined) {
    return { depositCollateral };
  }

  if (withdrawCollateral !== undefined) {
    return { withdrawCollateral };
  }
};

const debtChangeFrom = <T>({
  borrowTrenUSD,
  repayTrenUSD
}: Partial<Record<AllowedKey<ModuleAdjustmentParams>, T>>): _DebtChange<T> | undefined => {
  if (borrowTrenUSD !== undefined && repayTrenUSD !== undefined) {
    throw new Error(
      "ModuleAdjustmentParams: 'borrowTrenUSD' and 'repayTrenUSD' can't be present at the same time"
    );
  }

  if (borrowTrenUSD !== undefined) {
    return { borrowTrenUSD };
  }

  if (repayTrenUSD !== undefined) {
    return { repayTrenUSD };
  }
};

const moduleAdjustmentParamsFromEntries = <T>(
  entries: [AllowedKey<ModuleAdjustmentParams>, T][]
): ModuleAdjustmentParams<T> => {
  const params = Object.fromEntries(entries) as Partial<
    Record<AllowedKey<ModuleAdjustmentParams>, T>
  >;

  const collateralChange = collateralChangeFrom(params);
  const debtChange = debtChangeFrom(params);

  if (collateralChange !== undefined && debtChange !== undefined) {
    return { ...collateralChange, ...debtChange };
  }

  if (collateralChange !== undefined) {
    return collateralChange;
  }

  if (debtChange !== undefined) {
    return debtChange;
  }

  throw new Error("ModuleAdjustmentParams: must include at least one non-zero parameter");
};

/** @internal */
export const _normalizeModuleAdjustment = (
  params: Record<string, Decimalish | undefined>
): ModuleAdjustmentParams<Decimal> => {
  const definedEntries = Object.entries(params).filter(valueIsDefined);
  checkAllowedModuleAdjustmentKeys(definedEntries);
  const nonZeroEntries = definedEntries.map(decimalize).filter(nonZero);

  return moduleAdjustmentParamsFromEntries(nonZeroEntries);
};

const applyFee = (borrowingRate: Decimalish, debtIncrease: Decimal) =>
  debtIncrease.mul(Decimal.ONE.add(borrowingRate));

const unapplyFee = (borrowingRate: Decimalish, debtIncrease: Decimal) =>
  debtIncrease._divCeil(Decimal.ONE.add(borrowingRate));

const NOMINAL_COLLATERAL_RATIO_PRECISION = Decimal.from(100);

/**
 * A combination of collateral and debt.
 *
 * @public
 */
export class Module {
  /** Amount of native currency (e.g. Ether) collateralized. */
  readonly collateral: Decimal;

  /** Amount of TrenUSD owed. */
  readonly debt: Decimal;

  /** @internal */
  constructor(collateral = Decimal.ZERO, debt = Decimal.ZERO) {
    this.collateral = collateral;
    this.debt = debt;
  }

  get isEmpty(): boolean {
    return this.collateral.isZero && this.debt.isZero;
  }

  /**
   * Amount of TrenUSD that must be repaid to close this Module.
   *
   * @remarks
   * This doesn't include the liquidation reserve, which is refunded in case of normal closure.
   */
  get netDebt(): Decimal {
    if (this.debt.lt(TrenUSD_LIQUIDATION_RESERVE)) {
      throw new Error(`netDebt should not be used when debt < ${TrenUSD_LIQUIDATION_RESERVE}`);
    }

    return this.debt.sub(TrenUSD_LIQUIDATION_RESERVE);
  }

  /** @internal */
  get _nominalCollateralRatio(): Decimal {
    return this.collateral.mulDiv(NOMINAL_COLLATERAL_RATIO_PRECISION, this.debt);
  }

  /** Calculate the Module's collateralization ratio at a given price. */
  collateralRatio(price: Decimalish): Decimal {
    return this.collateral.mulDiv(price, this.debt);
  }

  /**
   * Whether the Module is undercollateralized at a given price.
   *
   * @returns
   * `true` if the Module's collateralization ratio is less than the
   * {@link MINIMUM_COLLATERAL_RATIO}.
   */
  collateralRatioIsBelowMinimum(price: Decimalish): boolean {
    return this.collateralRatio(price).lt(MINIMUM_COLLATERAL_RATIO);
  }

  /**
   * Whether the collateralization ratio is less than the {@link CRITICAL_COLLATERAL_RATIO} at a
   * given price.
   *
   * @example
   * Can be used to check whether the Tren protocol is in recovery mode by using it on the return
   * value of {@link ReadableTren.getTotal | getTotal()}. For example:
   *
   * ```typescript
   * const total = await tren.getTotal();
   * const price = await tren.getPrice();
   *
   * if (total.collateralRatioIsBelowCritical(price)) {
   *   // Recovery mode is active
   * }
   * ```
   */
  collateralRatioIsBelowCritical(price: Decimalish): boolean {
    return this.collateralRatio(price).lt(CRITICAL_COLLATERAL_RATIO);
  }

  /** Whether the Module is sufficiently collateralized to be opened during recovery mode. */
  isOpenableInRecoveryMode(price: Decimalish): boolean {
    return this.collateralRatio(price).gte(CRITICAL_COLLATERAL_RATIO);
  }

  /** @internal */
  toString(): string {
    return `{ collateral: ${this.collateral}, debt: ${this.debt} }`;
  }

  equals(that: Module): boolean {
    return this.collateral.eq(that.collateral) && this.debt.eq(that.debt);
  }

  add(that: Module): Module {
    return new Module(this.collateral.add(that.collateral), this.debt.add(that.debt));
  }

  addCollateral(collateral: Decimalish): Module {
    return new Module(this.collateral.add(collateral), this.debt);
  }

  addDebt(debt: Decimalish): Module {
    return new Module(this.collateral, this.debt.add(debt));
  }

  subtract(that: Module): Module {
    const { collateral, debt } = that;

    return new Module(
      this.collateral.gt(collateral) ? this.collateral.sub(collateral) : Decimal.ZERO,
      this.debt.gt(debt) ? this.debt.sub(debt) : Decimal.ZERO
    );
  }

  subtractCollateral(collateral: Decimalish): Module {
    return new Module(
      this.collateral.gt(collateral) ? this.collateral.sub(collateral) : Decimal.ZERO,
      this.debt
    );
  }

  subtractDebt(debt: Decimalish): Module {
    return new Module(this.collateral, this.debt.gt(debt) ? this.debt.sub(debt) : Decimal.ZERO);
  }

  multiply(multiplier: Decimalish): Module {
    return new Module(this.collateral.mul(multiplier), this.debt.mul(multiplier));
  }

  setCollateral(collateral: Decimalish): Module {
    return new Module(Decimal.from(collateral), this.debt);
  }

  setDebt(debt: Decimalish): Module {
    return new Module(this.collateral, Decimal.from(debt));
  }

  private _debtChange({ debt }: Module, borrowingRate: Decimalish): _DebtChange<Decimal> {
    return debt.gt(this.debt)
      ? { borrowTrenUSD: unapplyFee(borrowingRate, debt.sub(this.debt)) }
      : { repayTrenUSD: this.debt.sub(debt) };
  }

  private _collateralChange({ collateral }: Module): _CollateralChange<Decimal> {
    return collateral.gt(this.collateral)
      ? { depositCollateral: collateral.sub(this.collateral) }
      : { withdrawCollateral: this.collateral.sub(collateral) };
  }

  /**
   * Calculate the difference between this Module and another.
   *
   * @param that - The other Module.
   * @param borrowingRate - Borrowing rate to use when calculating a borrowed amount.
   *
   * @returns
   * An object representing the change, or `undefined` if the Modules are equal.
   */
  whatChanged(
    that: Module,
    borrowingRate: Decimalish = MINIMUM_BORROWING_RATE
  ): ModuleChange<Decimal> | undefined {
    if (this.collateral.eq(that.collateral) && this.debt.eq(that.debt)) {
      return undefined;
    }

    if (this.isEmpty) {
      if (that.debt.lt(TrenUSD_LIQUIDATION_RESERVE)) {
        return invalidModuleCreation(that, "missingLiquidationReserve");
      }

      return moduleCreation({
        depositCollateral: that.collateral,
        borrowTrenUSD: unapplyFee(borrowingRate, that.netDebt)
      });
    }

    if (that.isEmpty) {
      return moduleClosure(
        this.netDebt.nonZero
          ? { withdrawCollateral: this.collateral, repayTrenUSD: this.netDebt }
          : { withdrawCollateral: this.collateral }
      );
    }

    return this.collateral.eq(that.collateral)
      ? moduleAdjustment<Decimal>(this._debtChange(that, borrowingRate), that.debt.zero && "debt")
      : this.debt.eq(that.debt)
      ? moduleAdjustment<Decimal>(this._collateralChange(that), that.collateral.zero && "collateral")
      : moduleAdjustment<Decimal>(
          {
            ...this._debtChange(that, borrowingRate),
            ...this._collateralChange(that)
          },
          (that.debt.zero && "debt") ?? (that.collateral.zero && "collateral")
        );
  }

  /**
   * Make a new Module by applying a {@link ModuleChange} to this Module.
   *
   * @param change - The change to apply.
   * @param borrowingRate - Borrowing rate to use when adding a borrowed amount to the Module's debt.
   */
  apply(
    change: ModuleChange<Decimal> | undefined,
    borrowingRate: Decimalish = MINIMUM_BORROWING_RATE
  ): Module {
    if (!change) {
      return this;
    }

    switch (change.type) {
      case "invalidCreation":
        if (!this.isEmpty) {
          throw new Error("Can't create onto existing Module");
        }

        return change.invalidModule;

      case "creation": {
        if (!this.isEmpty) {
          throw new Error("Can't create onto existing Module");
        }

        const { depositCollateral, borrowTrenUSD } = change.params;

        return new Module(
          depositCollateral,
          TrenUSD_LIQUIDATION_RESERVE.add(applyFee(borrowingRate, borrowTrenUSD))
        );
      }

      case "closure":
        if (this.isEmpty) {
          throw new Error("Can't close empty Module");
        }

        return _emptyModule;

      case "adjustment": {
        const {
          setToZero,
          params: { depositCollateral, withdrawCollateral, borrowTrenUSD, repayTrenUSD }
        } = change;

        const collateralDecrease = withdrawCollateral ?? Decimal.ZERO;
        const collateralIncrease = depositCollateral ?? Decimal.ZERO;
        const debtDecrease = repayTrenUSD ?? Decimal.ZERO;
        const debtIncrease = borrowTrenUSD ? applyFee(borrowingRate, borrowTrenUSD) : Decimal.ZERO;

        return setToZero === "collateral"
          ? this.setCollateral(Decimal.ZERO).addDebt(debtIncrease).subtractDebt(debtDecrease)
          : setToZero === "debt"
          ? this.setDebt(Decimal.ZERO)
              .addCollateral(collateralIncrease)
              .subtractCollateral(collateralDecrease)
          : this.add(new Module(collateralIncrease, debtIncrease)).subtract(
              new Module(collateralDecrease, debtDecrease)
            );
      }
    }
  }

  /**
   * Calculate the result of an {@link TransactableTren.openModule | openModule()} transaction.
   *
   * @param params - Parameters of the transaction.
   * @param borrowingRate - Borrowing rate to use when calculating the Module's debt.
   */
  static create(params: ModuleCreationParams<Decimalish>, borrowingRate?: Decimalish): Module {
    return _emptyModule.apply(moduleCreation(_normalizeModuleCreation(params)), borrowingRate);
  }

  /**
   * Calculate the parameters of an {@link TransactableTren.openModule | openModule()} transaction
   * that will result in the given Module.
   *
   * @param that - The Module to recreate.
   * @param borrowingRate - Current borrowing rate.
   */
  static recreate(that: Module, borrowingRate?: Decimalish): ModuleCreationParams<Decimal> {
    const change = _emptyModule.whatChanged(that, borrowingRate);
    assert(change?.type === "creation");
    return change.params;
  }

  /**
   * Calculate the result of an {@link TransactableTren.adjustModule | adjustModule()} transaction
   * on this Module.
   *
   * @param params - Parameters of the transaction.
   * @param borrowingRate - Borrowing rate to use when adding to the Module's debt.
   */
  adjust(params: ModuleAdjustmentParams<Decimalish>, borrowingRate?: Decimalish): Module {
    return this.apply(moduleAdjustment(_normalizeModuleAdjustment(params)), borrowingRate);
  }

  /**
   * Calculate the parameters of an {@link TransactableTren.adjustModule | adjustModule()}
   * transaction that will change this Module into the given Module.
   *
   * @param that - The desired result of the transaction.
   * @param borrowingRate - Current borrowing rate.
   */
  adjustTo(that: Module, borrowingRate?: Decimalish): ModuleAdjustmentParams<Decimal> {
    const change = this.whatChanged(that, borrowingRate);
    assert(change?.type === "adjustment");
    return change.params;
  }
}

/** @internal */
export const _emptyModule = new Module();

/**
 * Represents whether a UserModule is open or not, or why it was closed.
 *
 * @public
 */
export type UserModuleStatus =
  | "nonExistent"
  | "open"
  | "closedByOwner"
  | "closedByLiquidation"
  | "closedByRedemption";

/**
 * A Module that is associated with a single owner.
 *
 * @remarks
 * The SDK uses the base {@link Module} class as a generic container of collateral and debt, for
 * example to represent the {@link ReadableTren.getTotal | total collateral and debt} locked up
 * in the protocol.
 *
 * The `UserModule` class extends `Module` with extra information that's only available for Modules
 * that are associated with a single owner (such as the owner's address, or the Module's status).
 *
 * @public
 */
export class UserModule extends Module {
  /** Address that owns this Module. */
  readonly ownerAddress: string;

  /** Provides more information when the UserModule is empty. */
  readonly status: UserModuleStatus;

  /** @internal */
  constructor(ownerAddress: string, status: UserModuleStatus, collateral?: Decimal, debt?: Decimal) {
    super(collateral, debt);

    this.ownerAddress = ownerAddress;
    this.status = status;
  }

  equals(that: UserModule): boolean {
    return (
      super.equals(that) && this.ownerAddress === that.ownerAddress && this.status === that.status
    );
  }

  /** @internal */
  toString(): string {
    return (
      `{ ownerAddress: "${this.ownerAddress}"` +
      `, collateral: ${this.collateral}` +
      `, debt: ${this.debt}` +
      `, status: "${this.status}" }`
    );
  }
}

/**
 * A Module in its state after the last direct modification.
 *
 * @remarks
 * The Module may have received collateral and debt shares from liquidations since then.
 * Use {@link ModuleWithPendingRedistribution.applyRedistribution | applyRedistribution()} to
 * calculate the Module's most up-to-date state.
 *
 * @public
 */
export class ModuleWithPendingRedistribution extends UserModule {
  private readonly stake: Decimal;
  private readonly snapshotOfTotalRedistributed: Module;

  /** @internal */
  constructor(
    ownerAddress: string,
    status: UserModuleStatus,
    collateral?: Decimal,
    debt?: Decimal,
    stake = Decimal.ZERO,
    snapshotOfTotalRedistributed = _emptyModule
  ) {
    super(ownerAddress, status, collateral, debt);

    this.stake = stake;
    this.snapshotOfTotalRedistributed = snapshotOfTotalRedistributed;
  }

  applyRedistribution(totalRedistributed: Module): UserModule {
    const afterRedistribution = this.add(
      totalRedistributed.subtract(this.snapshotOfTotalRedistributed).multiply(this.stake)
    );

    return new UserModule(
      this.ownerAddress,
      this.status,
      afterRedistribution.collateral,
      afterRedistribution.debt
    );
  }

  equals(that: ModuleWithPendingRedistribution): boolean {
    return (
      super.equals(that) &&
      this.stake.eq(that.stake) &&
      this.snapshotOfTotalRedistributed.equals(that.snapshotOfTotalRedistributed)
    );
  }
}
