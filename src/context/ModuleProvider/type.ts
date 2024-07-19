export type CollateralParams = {
    [key: string]: any
    id?: number
    address: string
    symbol: string
    decimals: number
    baseAPY: number
    rewardAPY: number
    price: bigint
    index: bigint
    active: boolean
    borrowingFee: bigint
    ccr: bigint
    mcr: bigint
    debtTokenGasCompensation: bigint
    minNetDebt: bigint
    mintCap: bigint
    percentDivisor: bigint
    redemptionFeeFloor: bigint
    redemptionBlockTimestamp: bigint
    totalAssetDebt: bigint
    entireSystemDebt: bigint
    totalCollDeposited: bigint
    totalBorrowAvailable: bigint
    LTV: bigint
    interest: number
    liquidation: bigint
    maxDepositAPY: number

    // Merged By Jordan. (CollateralType -> CollateralParams)
    // Below fields will be replaced with dynamic data later (except id : it is just for row in Grid). FYI: Quinn
    type: string // This is token type like 'volatile'
    platform: string
    network: string
    rateType: string
    borrowAPY: number
    maxLeverage: number
    debt: bigint
}

type NoneView = 'NONE'
type LiquidatedView = 'LIQUIDATED'
type RedeemedView = 'REDEEMED'
type OpeningView = 'OPENING'
type AdjustingView = 'ADJUSTING'
type ClosingView = 'CLOSING'
type ActiveView = 'ACTIVE'

export type ModuleView =
    | NoneView
    | LiquidatedView
    | RedeemedView
    | OpeningView
    | AdjustingView
    | ClosingView
    | ActiveView

type OpenModulePressedEvent = 'OPEN_MODULE_PRESSED'
type AdjustModulePressedEvent = 'ADJUST_MODULE_PRESSED'
type CloseModulePressedEvent = 'CLOSE_MODULE_PRESSED'
type CancelAdjustModulePressed = 'CANCEL_ADJUST_MODULE_PRESSED'
type ModuleAdjustedEvent = 'MODULE_ADJUSTED'
type ModuleOpenedEvent = 'MODULE_OPENED'
type ModuleClosedEvent = 'MODULE_CLOSED'
type ModuleLiquidatedEvent = 'MODULE_LIQUIDATED'
type ModuleRedeemedEvent = 'MODULE_REDEEMED'
type ModuleSurplusCollateralClaimedEvent = 'MODULE_SURPLUS_COLLATERAL_CLAIMED'

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
    | ModuleOpenedEvent
