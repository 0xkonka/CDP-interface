export interface Referral {
    owner: string
    inviteCode: string
    redeemer: string
    redeemed: boolean
    signMsg?: string
    xpPoint: number
}

export interface Point {
    account: string
    xpPoint: number
    multiplier: number
    endTimestamp?: number
    rank?: number
}

export interface XPType {
    userAddress: string
    totalXP: number
    // protocolXP: number   // This will be calculated by totalXP - referralXP automatically.
    referralXP: number
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