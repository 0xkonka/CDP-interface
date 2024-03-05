import { Decimal } from "./Decimal";
import { Fees } from "./Fees";
import { StabilityDeposit } from "./StabilityDeposit";
import { Module, ModuleWithPendingRedistribution, UserModule } from "./Module";
import { FrontendStatus, ReadableTren, ModuleListingParams } from "./ReadableTren";

/** @internal */
export type _ReadableTrenWithExtraParamsBase<T extends unknown[]> = {
  [P in keyof ReadableTren]: ReadableTren[P] extends (...params: infer A) => infer R
    ? (...params: [...originalParams: A, ...extraParams: T]) => R
    : never;
};

/** @internal */
export type _TrenReadCacheBase<T extends unknown[]> = {
  [P in keyof ReadableTren]: ReadableTren[P] extends (...args: infer A) => Promise<infer R>
    ? (...params: [...originalParams: A, ...extraParams: T]) => R | undefined
    : never;
};

// Overloads get lost in the mapping, so we need to define them again...

/** @internal */
export interface _ReadableTrenWithExtraParams<T extends unknown[]>
  extends _ReadableTrenWithExtraParamsBase<T> {
  getModules(
    params: ModuleListingParams & { beforeRedistribution: true },
    ...extraParams: T
  ): Promise<ModuleWithPendingRedistribution[]>;

  getModules(params: ModuleListingParams, ...extraParams: T): Promise<UserModule[]>;
}

/** @internal */
export interface _TrenReadCache<T extends unknown[]> extends _TrenReadCacheBase<T> {
  getModules(
    params: ModuleListingParams & { beforeRedistribution: true },
    ...extraParams: T
  ): ModuleWithPendingRedistribution[] | undefined;

  getModules(params: ModuleListingParams, ...extraParams: T): UserModule[] | undefined;
}

/** @internal */
export class _CachedReadableTren<T extends unknown[]>
  implements _ReadableTrenWithExtraParams<T> {
  private _readable: _ReadableTrenWithExtraParams<T>;
  private _cache: _TrenReadCache<T>;

  constructor(readable: _ReadableTrenWithExtraParams<T>, cache: _TrenReadCache<T>) {
    this._readable = readable;
    this._cache = cache;
  }

  async getTotalRedistributed(...extraParams: T): Promise<Module> {
    return (
      this._cache.getTotalRedistributed(...extraParams) ??
      this._readable.getTotalRedistributed(...extraParams)
    );
  }

  async getModuleBeforeRedistribution(
    address?: string,
    ...extraParams: T
  ): Promise<ModuleWithPendingRedistribution> {
    return (
      this._cache.getModuleBeforeRedistribution(address, ...extraParams) ??
      this._readable.getModuleBeforeRedistribution(address, ...extraParams)
    );
  }

  async getModule(address?: string, ...extraParams: T): Promise<UserModule> {
    const [moduleBeforeRedistribution, totalRedistributed] = await Promise.all([
      this.getModuleBeforeRedistribution(address, ...extraParams),
      this.getTotalRedistributed(...extraParams)
    ]);

    return moduleBeforeRedistribution.applyRedistribution(totalRedistributed);
  }

  async getNumberOfModules(...extraParams: T): Promise<number> {
    return (
      this._cache.getNumberOfModules(...extraParams) ??
      this._readable.getNumberOfModules(...extraParams)
    );
  }

  async getPrice(...extraParams: T): Promise<Decimal> {
    return this._cache.getPrice(...extraParams) ?? this._readable.getPrice(...extraParams);
  }

  async getTotal(...extraParams: T): Promise<Module> {
    return this._cache.getTotal(...extraParams) ?? this._readable.getTotal(...extraParams);
  }

  async getStabilityDeposit(address?: string, ...extraParams: T): Promise<StabilityDeposit> {
    return (
      this._cache.getStabilityDeposit(address, ...extraParams) ??
      this._readable.getStabilityDeposit(address, ...extraParams)
    );
  }

  async getTrenUSDInStabilityPool(...extraParams: T): Promise<Decimal> {
    return (
      this._cache.getTrenUSDInStabilityPool(...extraParams) ??
      this._readable.getTrenUSDInStabilityPool(...extraParams)
    );
  }

  async getTrenUSDBalance(address?: string, ...extraParams: T): Promise<Decimal> {
    return (
      this._cache.getTrenUSDBalance(address, ...extraParams) ??
      this._readable.getTrenUSDBalance(address, ...extraParams)
    );
  }

  async getUniTokenBalance(address?: string, ...extraParams: T): Promise<Decimal> {
    return (
      this._cache.getUniTokenBalance(address, ...extraParams) ??
      this._readable.getUniTokenBalance(address, ...extraParams)
    );
  }

  async getUniTokenAllowance(address?: string, ...extraParams: T): Promise<Decimal> {
    return (
      this._cache.getUniTokenAllowance(address, ...extraParams) ??
      this._readable.getUniTokenAllowance(address, ...extraParams)
    );
  }

  async getLiquidityMiningStake(address?: string, ...extraParams: T): Promise<Decimal> {
    return (
      this._cache.getLiquidityMiningStake(address, ...extraParams) ??
      this._readable.getLiquidityMiningStake(address, ...extraParams)
    );
  }

  async getTotalStakedUniTokens(...extraParams: T): Promise<Decimal> {
    return (
      this._cache.getTotalStakedUniTokens(...extraParams) ??
      this._readable.getTotalStakedUniTokens(...extraParams)
    );
  }

  async getCollateralSurplusBalance(address?: string, ...extraParams: T): Promise<Decimal> {
    return (
      this._cache.getCollateralSurplusBalance(address, ...extraParams) ??
      this._readable.getCollateralSurplusBalance(address, ...extraParams)
    );
  }

  getModules(
    params: ModuleListingParams & { beforeRedistribution: true },
    ...extraParams: T
  ): Promise<ModuleWithPendingRedistribution[]>;

  getModules(params: ModuleListingParams, ...extraParams: T): Promise<UserModule[]>;

  async getModules(params: ModuleListingParams, ...extraParams: T): Promise<UserModule[]> {
    const { beforeRedistribution, ...restOfParams } = params;

    const [totalRedistributed, modules] = await Promise.all([
      beforeRedistribution ? undefined : this.getTotalRedistributed(...extraParams),
      this._cache.getModules({ beforeRedistribution: true, ...restOfParams }, ...extraParams) ??
        this._readable.getModules({ beforeRedistribution: true, ...restOfParams }, ...extraParams)
    ]);

    if (totalRedistributed) {
      return modules.map(module => module.applyRedistribution(totalRedistributed));
    } else {
      return modules;
    }
  }

  async getFees(...extraParams: T): Promise<Fees> {
    return this._cache.getFees(...extraParams) ?? this._readable.getFees(...extraParams);
  }

  async getFrontendStatus(address?: string, ...extraParams: T): Promise<FrontendStatus> {
    return (
      this._cache.getFrontendStatus(address, ...extraParams) ??
      this._readable.getFrontendStatus(address, ...extraParams)
    );
  }
}
