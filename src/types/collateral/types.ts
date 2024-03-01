export type CollateralType = {
  // This is used for modules page header view.
  id?: number
  asset: string
  type: string
  borrowAPY: number
  maxLeverage: number
  LTVRatio: number
  maxDepositAPY: number
  baseDepositAPY: number
  active?: boolean

  // When we collapse open the collateral row, we need below info
  platform: string
  liquidationThreshold: number
  totalTrenUSD: number 
  tvlLeverage: number 
  tvl: number
  borrowFee: number
  availableTrenUSD: number
  interestRate: number
  rateType: string
  [key: string]: any
}
