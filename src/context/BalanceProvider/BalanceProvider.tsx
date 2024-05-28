import React, { useState } from 'react'

import { Config, useAccount, useChainId } from 'wagmi'
import {
  erc20Abi,
} from 'viem'
import { multicall, readContract } from '@wagmi/core'
import ADMIN_CONTRACT_ABI from '@/abi/AdminContract.json'
import { ADMIN_CONTRACT } from '@/configs/address'
import { wagmiConfig } from '@/pages/_app'
import { BalanceContext } from './BalanceContext'
import { usePolling } from '@/hooks/use-polling'

type BalanceProviderProps = {
  children: React.ReactNode
}

type UserBalance = {
  address: string
  balance: bigint
}

const POLLING_INTERVAL = 3000 * 1000 //default

export const BalanceProvider: React.FC<BalanceProviderProps> = ({ children }) => {
  const { address: account } = useAccount()
  const chainId = useChainId()

  const [collaterals, setCollaterals] = useState<string[]>([])
  const [balanceDetails, setBalanceDetails] = useState<UserBalance[]>([])
  
  const getCollateralList = async () => {
    const _collaterals = await readContract(wagmiConfig, {
      abi: ADMIN_CONTRACT_ABI,
      address: ADMIN_CONTRACT[chainId] as '0x{string}',
      functionName: 'getValidCollateral',
      args: []
    })
    const sortedCollateral = (_collaterals as string[]).sort()
    setCollaterals(sortedCollateral)
  }
  
  // Get Protocol Config
  const getBalanceDetails = async () => {
    const _balanceContracts = collaterals.map((address) => ({
      abi: erc20Abi,
      address: address as '0x{string}',
      functionName: 'balanceOf',
      args: [account as '0x{string}']
    }))

    const result = await multicall(wagmiConfig, {
      contracts: _balanceContracts
    })

    const _balanceDetails = collaterals.map((address, index) => ({
      address,
      balance: result[index].result as bigint
    }))
    console.log('__balanceDetails', _balanceDetails)
    setBalanceDetails(_balanceDetails)
  }

  usePolling(getCollateralList, POLLING_INTERVAL, false, [chainId])
  usePolling(getBalanceDetails, POLLING_INTERVAL, false, [chainId, collaterals])

  return (
    <BalanceContext.Provider
      value={{
        collaterals,
        balanceDetails,
        refresh: () => {
          return Promise.all([getCollateralList(), getBalanceDetails()])
        }
      }}
    >
      {children}
    </BalanceContext.Provider>
  )
}
