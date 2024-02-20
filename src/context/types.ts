import { BigNumber } from 'ethers'

export type UserPosition = {
  trenMarket: string
  account: string
  ltvBps: BigNumber
  healthFactor: BigNumber
  borrowValue: BigNumber
  collateral: AmountValue
  liquidationPrice: BigNumber
}

export type ProtocolInfo = {
  trenMarket: string
  borrowFee: BigNumber
  maximumCollateralRatio: BigNumber
  liquidationFee: BigNumber
  interestPerYear: BigNumber
  marketMaxBorrow: BigNumber
  userMaxBorrow: BigNumber
  totalBorrowed: BigNumber
  oracleExchangeRate: BigNumber
  collateralPrice: BigNumber
  totalCollateral: AmountValue
}

export type AmountValue = {
  amount: BigNumber
  value: BigNumber
}

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  id: number
  role: string
  email: string
  fullName: string
  username: string
  password: string
  avatar?: string | null
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}
