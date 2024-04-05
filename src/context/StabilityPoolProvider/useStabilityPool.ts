/* eslint-disable camelcase */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { type BaseError, useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { erc20Abi, parseUnits, parseGwei } from 'viem'
import { useProtocol } from '../ProtocolProvider/ProtocolContext'
import { STABILITY_POOL } from '@/configs/address'
import STABILITY_POOLABI from '@/abi/StabilityPool.json'
import { ethers } from 'ethers'
import { useStabilityPoolView } from './StabilityPoolContext'

const useStabilityPool = () => {
  const chainId = useChainId()

  const { refresh: refreshStabilityPool } = useStabilityPoolView()

  const { data: txhash, writeContract, isPending, error, reset } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txhash
  })

  useEffect(() => {
    console.log('isConfirmed', isConfirmed)
    if (isConfirmed) {
      refreshStabilityPool()
      reset()
    }
  }, [isConfirmed])

  const StabilityPoolContract = {
    address: STABILITY_POOL[chainId] as '0x{string}',
    abi: STABILITY_POOLABI
  } as const

  // const handleApprove = (approveAmount: bigint) => {
  //   if (!collateralDetail) return
  //   try {
  //     writeContract({
  //       address: collateralDetail.address as '0x{string}',
  //       abi: erc20Abi,
  //       functionName: 'approve',
  //       args: [STABILITY_POOL[chainId] as '0x{string}', approveAmount]
  //       // gas: parseGwei('20'),
  //     })
  //   } catch (err) {
  //     console.log('err', err)
  //   }
  // }

  const handleProvide = (amount: bigint, assets: string[]) => {
    try {
      writeContract({
        ...StabilityPoolContract,
        functionName: 'provideToSP',
        args: [
          amount,
          assets
        ]
      })
    } catch (err) {
      console.log('err', err)
    }
  }

  const handleWithdraw = (amount: bigint, assets: string[]) => {
    try {
      writeContract({
        ...StabilityPoolContract,
        functionName: 'withdrawFromSP',
        args: [
          amount,
          assets
        ]
      })
    } catch (err) {
      console.log('err', err)
    }
  }

  return {
    handleProvide,
    handleWithdraw,
    txhash,
    isPending,
    isConfirming,
    isConfirmed,
    error
  }
}

export default useStabilityPool
