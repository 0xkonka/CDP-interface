export interface Referral {
    owner: string
    inviteCode: string
    redeemer: string
    redeemed: boolean
    signMsg?: string
    xpPoint?: any
}

export interface Point {
    account: string
    xpPoint: number
    multiplier: number
    endTimestamp?: number
    rank?: number
}

export interface PointDataType {
    id: string
    rank: number
    onChainPoints: number
    offChainXpPoints: number
    offChainReferralPoints: number
    totalPoints: number
}

export interface LiquidationRowType {
    symbol: string
    address: string
    price: bigint
    liquidation: bigint
    debtTokenGasCompensation: bigint
    // borrowedAmount: bigint
    // healthFactor: number
    // collRatio: number
}