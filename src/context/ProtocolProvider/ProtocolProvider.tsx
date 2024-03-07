import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Provider } from '@ethersproject/abstract-provider'
import { Config, useAccount, useChainId, useClient, useReadContract, useWalletClient } from 'wagmi'
import { erc20Abi, type Account, type Chain, type Client, type Transport } from 'viem'
import { BigNumber, providers } from 'ethers'
import { multicall, readContract, getBalance } from '@wagmi/core'
import ADMIN_CONTRACT_ABI from '@/abi/AdminContract.json'
import { ADMIN_CONTRACT } from '@/configs/address'
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
      // Get Protocol Config
      const getCollateralDetails = async () => {
        const _collateralDetails: CollateralParams[] = []

        for (let i = 0; i < collaterals.length; i++) {
          const result = await multicall(wagmiConfig, {
            contracts: [
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
                args: []
              }
              // {
              //   ...AdminContract,
              //   functionName: 'getTotalAssetDebt',
              //   args: []
              // }
            ]
          })

          // console.log('result', result)

          const decimals = result[0].result as number
          const index = result[1].result as BigNumber
          const active = result[2].result as boolean
          const mcr = result[3].result as BigNumber
          const ccr = result[4].result as BigNumber
          const debtTokenGasCompensation = result[5].result as BigNumber
          const minNetDebt = result[6].result as BigNumber
          const percentDivisor = result[7].result as BigNumber
          const borrowingFee = result[8].result as BigNumber
          const redemptionFeeFloor = result[9].result as BigNumber
          const redemptionBlockTimestamp = result[10].result as BigNumber
          const mintCap = result[10].result as BigNumber

          const _collateralDetail: CollateralParams = {
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
            mintCap
          }

          // console.log('_collateralDetail', _collateralDetail)

          _collateralDetails.push(_collateralDetail)
          // const getTotalAssetDebt = result[0].result as BigNumber
        }

        setCollateralDetails(_collateralDetails)
      }

      getCollateralDetails()
    }
  }, [chainId, collaterals])

  return <ProtocolContext.Provider value={{ collaterals, collateralDetails }}>{children}</ProtocolContext.Provider>
}

