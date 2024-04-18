export interface ResponseFuncs {
    GET?: any
    POST?: any
}

export interface ReferralType {
    owner: string
    inviteCode: string
    redeemer?: string
    redeemed?: boolean
}
