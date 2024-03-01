type NoneView = "NONE";
type LiquidatedView = "LIQUIDATED";
type RedeemedView = "REDEEMED";
type OpeningView = "OPENING";
type AdjustingView = "ADJUSTING";
type ClosingView = "CLOSING";
type ActiveView = "ACTIVE";

export type ModuleView =
  | NoneView
  | LiquidatedView
  | RedeemedView
  | OpeningView
  | AdjustingView
  | ClosingView
  | ActiveView;

type OpenModulePressedEvent = "OPEN_MODULE_PRESSED";
type AdjustModulePressedEvent = "ADJUST_MODULE_PRESSED";
type CloseModulePressedEvent = "CLOSE_MODULE_PRESSED";
type CancelAdjustModulePressed = "CANCEL_ADJUST_MODULE_PRESSED";
type ModuleAdjustedEvent = "MODULE_ADJUSTED";
type ModuleOpenedEvent = "MODULE_OPENED";
type ModuleClosedEvent = "MODULE_CLOSED";
type ModuleLiquidatedEvent = "MODULE_LIQUIDATED";
type ModuleRedeemedEvent = "MODULE_REDEEMED";
type ModuleSurplusCollateralClaimedEvent = "MODULE_SURPLUS_COLLATERAL_CLAIMED";

export type ModuleEvent =
  | OpenModulePressedEvent
  | AdjustModulePressedEvent
  | CloseModulePressedEvent
  | CancelAdjustModulePressed
  | ModuleClosedEvent
  | ModuleLiquidatedEvent
  | ModuleRedeemedEvent
  | ModuleAdjustedEvent
  | ModuleSurplusCollateralClaimedEvent
  | ModuleOpenedEvent;
