import { CollateralParams } from '@/context/ModuleProvider/type'
import { createContext, useContext } from 'react'
import { StabilityPoolInfo, UserStabilityPoolPosition } from './StabilityPoolProvider'

type StabilityPoolContextValue = {
  stabilityPoolInfo: StabilityPoolInfo | undefined
  userStabilityPoolPosition: UserStabilityPoolPosition | undefined
  refresh: () => Promise<any>
}
export const StabilityPoolContext = createContext<StabilityPoolContextValue | undefined>(undefined)
export const useStabilityPoolView = () => {
  const _StabilityPoolContext = useContext(StabilityPoolContext)

  if (!_StabilityPoolContext) {
    throw new Error('You must provide a StabilityPoolContext via StabilityPoolProvider')
  }

  return _StabilityPoolContext
}
