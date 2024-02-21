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
