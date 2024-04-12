import React, { useState } from 'react'

import { Config, useAccount, useChainId } from 'wagmi'
import {
  erc20Abi,
  formatEther,
  formatUnits,
  parseEther,
  type Account,
  type Chain,
  type Client,
  type Transport
} from 'viem'
import { multicall, readContract, getBalance } from '@wagmi/core'
import ADMIN_CONTRACT_ABI from '@/abi/AdminContract.json'
import PRICE_FEED_ABI from '@/abi/PriceFeed.json'
import BORROWER_OPERATIONS_ABI from '@/abi/BorrowerOperations.json'
import { ADMIN_CONTRACT, PRICE_FEED, BORROWER_OPERATIONS, ACTIVE_POOL } from '@/configs/address'
import { CollateralParams } from '@/context/ModuleProvider/type'
import { wagmiConfig } from '@/pages/_app'
import { ProtocolContext } from './ProtocolContext'
import { getDefillmaAPY } from '@/hooks/utils'
import { usePolling } from '@/hooks/use-polling'

type ProtocolProviderProps = {
  children: React.ReactNode
  // loader?: React.ReactNode
}

const POLLING_INTERVAL = 3000 * 1000 //default

export const ProtocolProvider: React.FC<ProtocolProviderProps> = ({ children }) => {
  const { address: account } = useAccount()
  const chainId = useChainId()

  const [collaterals, setCollaterals] = useState<string[]>([])
  const [collateralDetails, setCollateralDetails] = useState<CollateralParams[]>([])
  // useEffect(() => {
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
  //   getCollateralList()
  // }, [chainId])

  // useEffect(() => {

  const AdminContract = {
    address: ADMIN_CONTRACT[chainId] as '0x{string}',
    abi: ADMIN_CONTRACT_ABI as any
  } as const

  const PriceFeedContract = {
    address: PRICE_FEED[chainId] as '0x{string}',
    abi: PRICE_FEED_ABI as any
  } as const

  const BorrowerOperationsContract = {
    address: BORROWER_OPERATIONS[chainId] as '0x{string}',
    abi: BORROWER_OPERATIONS_ABI as any
  } as const
  // Get Protocol Config
  const getCollateralDetails = async () => {
    if (collaterals.length > 0) {
      const _collateralDetails: CollateralParams[] = []

      for (let i = 0; i < collaterals.length; i++) {
        const result = await multicall(wagmiConfig, {
          contracts: [
            {
              abi: erc20Abi,
              address: collaterals[i] as '0x{string}',
              functionName: 'symbol',
              args: []
            },
            {
              abi: erc20Abi,
              address: collaterals[i] as '0x{string}',
              functionName: 'decimals',
              args: []
            },
            {
              ...AdminContract,
              functionName: 'getIndex',
              args: [collaterals[i]]
            },
            {
              ...AdminContract,
              functionName: 'getIsActive',
              args: [collaterals[i]]
            },
            {
              ...AdminContract,
              functionName: 'getMcr',
              args: [collaterals[i]]
            },
            {
              ...AdminContract,
              functionName: 'getCcr',
              args: [collaterals[i]]
            },
            {
              ...AdminContract,
              functionName: 'getDebtTokenGasCompensation',
              args: [collaterals[i]]
            },
            {
              ...AdminContract,
              functionName: 'getMinNetDebt',
              args: [collaterals[i]]
            },
            {
              ...AdminContract,
              functionName: 'getPercentDivisor',
              args: [collaterals[i]]
            },
            {
              ...AdminContract,
              functionName: 'getBorrowingFee',
              args: [collaterals[i]]
            },
            {
              ...AdminContract,
              functionName: 'getRedemptionFeeFloor',
              args: [collaterals[i]]
            },
            {
              ...AdminContract,
              functionName: 'getRedemptionBlockTimestamp',
              args: [collaterals[i]]
            },
            {
              ...AdminContract,
              functionName: 'getMintCap',
              args: [collaterals[i]]
            },
            {
              ...AdminContract,
              functionName: 'getTotalAssetDebt',
              args: [collaterals[i]]
            },
            {
              ...PriceFeedContract,
              functionName: 'fetchPrice',
              args: [collaterals[i]]
            },
            {
              ...BorrowerOperationsContract,
              functionName: 'getEntireSystemDebt',
              args: [collaterals[i]]
            },
            {
              abi: erc20Abi,
              address: collaterals[i] as '0x{string}',
              functionName: 'balanceOf',
              args: [ACTIVE_POOL[chainId] as '0x{string}']
            },
          ]
        })
        const address = collaterals[i] as string
        const symbol = result[0].result as string
        const decimals = result[1].result as number
        const index = result[2].result as bigint
        const active = result[3].result as boolean
        const mcr = result[4].result as bigint
        const ccr = result[5].result as bigint
        const debtTokenGasCompensation = result[6].result as bigint
        const minNetDebt = result[7].result as bigint
        const percentDivisor = result[8].result as bigint
        const borrowingFee = result[9].result as bigint
        const redemptionFeeFloor = result[10].result as bigint
        const redemptionBlockTimestamp = result[11].result as bigint
        const mintCap = result[12].result as bigint
        const totalAssetDebt = result[13].result as bigint
        const price = result[14].result as bigint
        const entireSystemDebt = result[15].result as bigint
        const totalCollDeposited = result[16].result as bigint

        let baseAPY = 0
        if (symbol) baseAPY = await getDefillmaAPY(symbol)
        const _collateralDetail: CollateralParams = {
          address,
          symbol,
          decimals,
          baseAPY,
          price,
          rewardAPY: 2,
          index,
          active,
          borrowingFee,
          ccr,
          mcr,
          debtTokenGasCompensation,
          minNetDebt,
          mintCap,
          percentDivisor,
          redemptionFeeFloor,
          redemptionBlockTimestamp,
          totalAssetDebt,
          entireSystemDebt,
          totalCollDeposited,
          totalBorrowAvailable: mintCap - entireSystemDebt,
          LTV: parseEther((1 / +formatEther(ccr)).toString()),
          interest: 5,
          liquidation: parseEther((1 / +formatEther(mcr)).toString()),
          type: 'token_type_here',
          borrowAPY: 0,
          maxLeverage: 0,
          maxDepositAPY: 0,
          network: 'network',
          platform: 'platform',
          rateType: 'collateral rate tye here'
        }

        _collateralDetails.push(_collateralDetail)
      }
      console.log('_collateralDetails', _collateralDetails)
      setCollateralDetails(_collateralDetails)
    }
  }
  // getCollateralDetails()

  // }, [chainId, collaterals])

  usePolling(getCollateralList, POLLING_INTERVAL, false, [chainId])
  usePolling(getCollateralDetails, POLLING_INTERVAL, false, [chainId, collaterals])

  return (
    <ProtocolContext.Provider
      value={{
        collaterals,
        collateralDetails,
        refresh: () => {
          return Promise.all([getCollateralList(), getCollateralDetails()])
        }
      }}
    >
      {children}
    </ProtocolContext.Provider>
  )
}
