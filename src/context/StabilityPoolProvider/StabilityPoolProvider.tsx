import React, { useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { multicall, readContract } from '@wagmi/core'
import STABILITY_POOL_ABI from '@/abi/StabilityPool.json'
import { STABILITY_POOL } from '@/configs/address'
import { CollateralParams } from '@/context/ModuleProvider/type'
import { wagmiConfig } from '@/pages/_app'
import { StabilityPoolContext } from './StabilityPoolContext'
import { usePolling } from '@/hooks/use-polling'
import { useProtocol } from '../ProtocolProvider/ProtocolContext'

type StabilityPoolProviderProps = {
  children: React.ReactNode
  // loader?: React.ReactNode
}

export interface StabilityPoolInfo {
  totalCollateral: { assets: string[]; amounts: bigint[] }
  totalDebtTokenDeposits: bigint
}

export interface UserStabilityPoolPosition {
  userDeposit: bigint
  userDebtGain: bigint
  userCompoundedDebtDeposits: bigint
  userGains: { assets: string[]; amounts: bigint[] }
}

const POLLING_INTERVAL = 3000 * 1000 //default

export const StabilityPoolProvider: React.FC<StabilityPoolProviderProps> = ({ children }) => {
  const { address: account } = useAccount()
  const chainId = useChainId()
  const { collaterals } = useProtocol()

  const [stabilityPoolInfo, setStabilityPoolInfo] = useState<StabilityPoolInfo>()
  const [userStabilityPoolPosition, setUserStabilityPoolPosition] = useState<UserStabilityPoolPosition>()

  const StabilityPoolContract = {
    address: STABILITY_POOL[chainId] as '0x{string}',
    abi: STABILITY_POOL_ABI as any
  } as const

  const getStabilityPoolDetails = async () => {
    const _stabilityPoolDetails = await multicall(wagmiConfig, {
      contracts: [
        {
          ...StabilityPoolContract,
          functionName: 'getAllCollateral',
          args: []
        },
        {
          ...StabilityPoolContract,
          functionName: 'getTotalDebtTokenDeposits',
          args: []
        }
      ]
    })
    console.log('_stabilityPoolDetails', _stabilityPoolDetails)
    setStabilityPoolInfo({
      totalCollateral: {
        assets: (_stabilityPoolDetails[0].result as any[])[0],
        amounts: (_stabilityPoolDetails[0].result as any[])[1]
      },
      totalDebtTokenDeposits: _stabilityPoolDetails[1].result as bigint
    })
  }

  const getStabilityPoolUserPosition = async () => {
    if (account) {
      const _userInfo = await multicall(wagmiConfig, {
        contracts: [
          {
            ...StabilityPoolContract,
            functionName: 'deposits',
            args: [account]
          },
          {
            ...StabilityPoolContract,
            functionName: 'getDepositorTRENGain',
            args: [account]
          },
          {
            ...StabilityPoolContract,
            functionName: 'getCompoundedDebtTokenDeposits',
            args: [account]
          }
        ]
      })
      console.log('_userPosition', _userInfo)

      let _userPositionByCollateral: any = [[], []]

      // ===== We hide this temporarily because it is reverted in contract ===== //
      // if (collaterals.length > 0) {
      //   _userPositionByCollateral = await readContract(wagmiConfig, {
      //     ...StabilityPoolContract,
      //     functionName: 'getDepositorGains',
      //     args: [account, collaterals.sort()]
      //   })

      //   console.log('_userPositionByCollateral', _userPositionByCollateral)
      // }

      setUserStabilityPoolPosition({
        userDeposit: _userInfo[0].result as bigint,
        userDebtGain: _userInfo[1].result as bigint,
        userCompoundedDebtDeposits: _userInfo[2].result as bigint,
        userGains: {
          assets: _userPositionByCollateral[0],
          amounts: _userPositionByCollateral[1]
        }
      })
    }
  }

  usePolling(getStabilityPoolDetails, POLLING_INTERVAL, false, [chainId])
  usePolling(getStabilityPoolUserPosition, POLLING_INTERVAL, false, [chainId, account, collaterals])

  return (
    <StabilityPoolContext.Provider
      value={{
        stabilityPoolInfo,
        userStabilityPoolPosition,
        refresh: () => {
          return Promise.all([getStabilityPoolDetails(), getStabilityPoolUserPosition()])
        }
      }}
    >
      {children}
    </StabilityPoolContext.Provider>
  )
}
