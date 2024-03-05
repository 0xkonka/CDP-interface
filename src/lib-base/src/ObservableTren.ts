import { Decimal } from "./Decimal";
import { Module, ModuleWithPendingRedistribution } from "./Module";
import { StabilityDeposit } from "./StabilityDeposit";

/** @alpha */
export interface ObservableTren {
  watchTotalRedistributed(
    onTotalRedistributedChanged: (totalRedistributed: Module) => void
  ): () => void;

  watchModuleWithoutRewards(
    onModuleChanged: (module: ModuleWithPendingRedistribution) => void,
    address?: string
  ): () => void;

  watchNumberOfModules(onNumberOfModulesChanged: (numberOfModules: number) => void): () => void;

  watchPrice(onPriceChanged: (price: Decimal) => void): () => void;

  watchTotal(onTotalChanged: (total: Module) => void): () => void;

  watchStabilityDeposit(
    onStabilityDepositChanged: (stabilityDeposit: StabilityDeposit) => void,
    address?: string
  ): () => void;

  watchTrenUSDInStabilityPool(
    onTrenUSDInStabilityPoolChanged: (trenUSDInStabilityPool: Decimal) => void
  ): () => void;

  watchTrenUSDBalance(onTrenUSDBalanceChanged: (balance: Decimal) => void, address?: string): () => void;
}
