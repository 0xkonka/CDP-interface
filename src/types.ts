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
}
