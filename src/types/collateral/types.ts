export type CollateralType = {
  id: number
  asset: string
  type: string
  borrowAPY: number
  maxLeverage: number
  LTVRatio: number
  maxDepositAPY: number
  baseDepositAPY: number
  active?: boolean
  [key: string]: any
}
