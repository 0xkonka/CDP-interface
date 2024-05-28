import { createContext, useContext } from 'react'

type UserBalance = {
  address: string
  balance: bigint
}

type BalanceContextValue = {
  collaterals: string[]
  balanceDetails: UserBalance[]
  refresh: () => Promise<any>
}
export const BalanceContext = createContext<BalanceContextValue | undefined>(undefined)
export const useBalance = () => {
  const _BalanceContext = useContext(BalanceContext)

  if (!_BalanceContext) {
    throw new Error('You must provide a BalanceContext via BalanceProvider')
  }

  return _BalanceContext
}
