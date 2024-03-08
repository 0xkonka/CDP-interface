import { CollateralParams } from '@/types'
import { createContext, useContext } from 'react'

type ProtocolContextValue = {
  collaterals: string[]
  collateralDetails: CollateralParams[]
}
export const ProtocolContext = createContext<ProtocolContextValue | undefined>(undefined)
export const useProtocol = () => {
  const _ProtocolContext = useContext(ProtocolContext)

  if (!_ProtocolContext) {
    throw new Error('You must provide a ProtocolContext via ProtocolProvider')
  }

  return _ProtocolContext
}
