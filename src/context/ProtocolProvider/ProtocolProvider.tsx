import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Provider } from '@ethersproject/abstract-provider'
import { Config, useAccount, useChainId, useClient, useReadContract, useWalletClient } from 'wagmi'
import { erc20Abi, type Account, type Chain, type Client, type Transport } from 'viem'
import { BigNumber, providers } from 'ethers'
import { multicall, readContract, getBalance } from '@wagmi/core'
import ADMIN_CONTRACT_ABI from '@/abi/AdminContract.json'
import PRICE_FEED_ABI from '@/abi/PriceFeed.json'
import { ADMIN_CONTRACT, PRICE_FEED } from '@/configs/address'
import { CollateralParams } from '@/types'
import { wagmiConfig } from '@/pages/_app'
import { ProtocolContext } from './ProtocolContext'

type ProtocolContextValue = {
  collaterals: string[]
  collateralDetails: CollateralParams[]
}

type ProtocolProviderProps = {
  children: React.ReactNode
  // loader?: React.ReactNode
}

// const initialConfig: CollateralParams = {}

export const ProtocolProvider: React.FC<ProtocolProviderProps> = ({ children }) => {
  const { address: account } = useAccount()
  const chainId = useChainId()

  const [collaterals, setCollaterals] = useState<string[]>([])
  const [collateralDetails, setCollateralDetails] = useState<CollateralParams[]>([])
  useEffect(() => {
    const getCollateralList = async () => {
      const _collaterals = await readContract(wagmiConfig, {
        abi: ADMIN_CONTRACT_ABI,
        address: ADMIN_CONTRACT[chainId] as '0x{string}',
        functionName: 'getValidCollateral',
        args: []
      })

      setCollaterals(_collaterals as string[])
    }
    getCollateralList()
  }, [chainId])

  useEffect(() => {
    if (collaterals.length > 0) {
      const AdminContract = {
        address: ADMIN_CONTRACT[chainId] as '0x{string}',
        abi: ADMIN_CONTRACT_ABI as any
      } as const

      const PriceFeedContract = {
        address: PRICE_FEED[chainId] as '0x{string}',
        abi: PRICE_FEED_ABI as any
      } as const
      // Get Protocol Config
      const getCollateralDetails = async () => {
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
                args:[collaterals[i]]
              },

            ]
          })
          const address = collaterals[i] as string
          const symbol = result[0].result as string
          const decimals = result[1].result as number
          const index = BigNumber.from(result[2].result)
          const active = result[3].result as boolean
          const mcr = BigNumber.from(result[4].result)
          const ccr = BigNumber.from(result[5].result)
          const debtTokenGasCompensation = BigNumber.from(result[6].result)
          const minNetDebt = BigNumber.from(result[7].result)
          const percentDivisor = BigNumber.from(result[8].result)
          const borrowingFee = BigNumber.from(result[9].result)
          const redemptionFeeFloor = BigNumber.from(result[10].result)
          const redemptionBlockTimestamp = BigNumber.from(result[11].result)
          const mintCap = BigNumber.from(result[12].result)
          const totalAssetDebt = BigNumber.from(result[13].result)
          const price = BigNumber.from(result[14].result)

          const _collateralDetail: CollateralParams = {
            address,
            symbol,
            decimals,
            index,
            active,
            mcr,
            ccr,
            debtTokenGasCompensation,
            minNetDebt,
            percentDivisor,
            borrowingFee,
            redemptionFeeFloor,
            redemptionBlockTimestamp,
            mintCap,
            totalAssetDebt,
            price,
            LTV: 95,
            interest: 5,
            liquidation: 80,
          }

          _collateralDetails.push(_collateralDetail)
          // const getTotalAssetDebt = result[0].result)
        }

        setCollateralDetails(_collateralDetails)
      }

      getCollateralDetails()
    }
  }, [chainId, collaterals])

  return <ProtocolContext.Provider value={{ collaterals, collateralDetails }}>{children}</ProtocolContext.Provider>
}

