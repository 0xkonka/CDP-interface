import React, { ReactElement, ReactNode, useContext } from 'react'
import { useAccount, useContractRead, useContractReads, useNetwork } from 'wagmi'
import { MARKET_LENS_ADDR, TREN_MARKET_ADDR } from 'src/configs/address'
import MARKET_LENS_ABI from 'src/abi/MarketLens.json'
import { ProtocolInfo, UserPosition } from './types'

export interface ProtocolDataContextData {
  ProtocolInfo: ProtocolInfo[] | undefined
  UserPosition: UserPosition[] | undefined
}

const StaticPoolDataContext = React.createContext({} as ProtocolDataContextData)

interface ProtocolDataProviderProps {
  children: ReactNode
}

export function PoolDataProvider({ children }: ProtocolDataProviderProps) {
  const { chain: chainId } = useNetwork()
  const { isConnected, address } = useAccount()

  const marketLensProtocol = {
    address: MARKET_LENS_ADDR[chainId?.id ?? 5] as `0x${string}`,
    abi: MARKET_LENS_ABI as any,
    functionName: 'getMarketInfoTrenMarketV3'
  }
  const marketLensUser = {
    address: MARKET_LENS_ADDR[chainId?.id ?? 5] as `0x${string}`,
    abi: MARKET_LENS_ABI as any,
    functionName: 'getUserPosition'
  }

  const protocolContractArr = []
  const userContractArr = []

  // Get All TrenMarket's info
  for (let i = 0; i < TREN_MARKET_ADDR.length; i++) {
    protocolContractArr.push({ ...marketLensProtocol, args: [TREN_MARKET_ADDR[i][chainId?.id ?? 5]] })
  }
  const { data: ProtocolInfo } = useContractReads({
    contracts: protocolContractArr
  })
  const ProtocolInfoResult: any = ProtocolInfo?.map(i => i?.result)

  // Get All User's info
  if (isConnected) {
    for (let i = 0; i < TREN_MARKET_ADDR.length; i++) {
      userContractArr.push({ ...marketLensUser, args: [TREN_MARKET_ADDR[i][chainId?.id ?? 5], address] })
    }
  }
  const { data: UserPosition } = useContractReads({
    contracts: userContractArr
  })
  const UserPositionResult: any = UserPosition?.map(i => i?.result)

  return (
    <StaticPoolDataContext.Provider
      value={{
        ProtocolInfo: ProtocolInfoResult,
        UserPosition: UserPositionResult
      }}
    >
      {children}
    </StaticPoolDataContext.Provider>
  )
}

export const useProtocolDataContext = () => useContext(StaticPoolDataContext)
