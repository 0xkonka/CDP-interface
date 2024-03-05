import { Decimal, Decimalish } from "./Decimal";

/**
 * Represents the change between two Stability Deposit states.
 *
 * @public
 */
export type StabilityDepositChange<T> =
  | { depositTrenUSD: T; withdrawTrenUSD?: undefined }
  | { depositTrenUSD?: undefined; withdrawTrenUSD: T; withdrawAllTrenUSD: boolean };

/**
 * A Stability Deposit and its accrued gains.
 *
 * @public
 */
export class StabilityDeposit {
  /** Amount of TrenUSD in the Stability Deposit at the time of the last direct modification. */
  readonly initialTrenUSD: Decimal;

  /** Amount of TrenUSD left in the Stability Deposit. */
  readonly currentTrenUSD: Decimal;

  /** Amount of native currency (e.g. Ether) received in exchange for the used-up TrenUSD. */
  readonly collateralGain: Decimal;

  /**
   * Address of frontend through which this Stability Deposit was made.
   *
   * @remarks
   * If the Stability Deposit was made through a frontend that doesn't tag deposits, this will be
   * the zero-address.
   */
  readonly frontendTag: string;

  /** @internal */
  constructor(
    initialTrenUSD: Decimal,
    currentTrenUSD: Decimal,
    collateralGain: Decimal,
    frontendTag: string
  ) {
    this.initialTrenUSD = initialTrenUSD;
    this.currentTrenUSD = currentTrenUSD;
    this.collateralGain = collateralGain;
    this.frontendTag = frontendTag;

    if (this.currentTrenUSD.gt(this.initialTrenUSD)) {
      throw new Error("currentTrenUSD can't be greater than initialTrenUSD");
    }
  }

  get isEmpty(): boolean {
    return (
      this.initialTrenUSD.isZero &&
      this.currentTrenUSD.isZero &&
      this.collateralGain.isZero 
    );
  }

  /** @internal */
  toString(): string {
    return (
      `{ initialTrenUSD: ${this.initialTrenUSD}` +
      `, currentTrenUSD: ${this.currentTrenUSD}` +
      `, collateralGain: ${this.collateralGain}` +
      `, frontendTag: "${this.frontendTag}" }`
    );
  }

  /**
   * Compare to another instance of `StabilityDeposit`.
   */
  equals(that: StabilityDeposit): boolean {
    return (
      this.initialTrenUSD.eq(that.initialTrenUSD) &&
      this.currentTrenUSD.eq(that.currentTrenUSD) &&
      this.collateralGain.eq(that.collateralGain) &&
      this.frontendTag === that.frontendTag
    );
  }

  /**
   * Calculate the difference between the `currentTrenUSD` in this Stability Deposit and `thatTrenUSD`.
   *
   * @returns An object representing the change, or `undefined` if the deposited amounts are equal.
   */
  whatChanged(thatTrenUSD: Decimalish): StabilityDepositChange<Decimal> | undefined {
    thatTrenUSD = Decimal.from(thatTrenUSD);

    if (thatTrenUSD.lt(this.currentTrenUSD)) {
      return { withdrawTrenUSD: this.currentTrenUSD.sub(thatTrenUSD), withdrawAllTrenUSD: thatTrenUSD.isZero };
    }

    if (thatTrenUSD.gt(this.currentTrenUSD)) {
      return { depositTrenUSD: thatTrenUSD.sub(this.currentTrenUSD) };
    }
  }

  /**
   * Apply a {@link StabilityDepositChange} to this Stability Deposit.
   *
   * @returns The new deposited TrenUSD amount.
   */
  apply(change: StabilityDepositChange<Decimalish> | undefined): Decimal {
    if (!change) {
      return this.currentTrenUSD;
    }

    if (change.withdrawTrenUSD !== undefined) {
      return change.withdrawAllTrenUSD || this.currentTrenUSD.lte(change.withdrawTrenUSD)
        ? Decimal.ZERO
        : this.currentTrenUSD.sub(change.withdrawTrenUSD);
    } else {
      return this.currentTrenUSD.add(change.depositTrenUSD);
    }
  }
}
