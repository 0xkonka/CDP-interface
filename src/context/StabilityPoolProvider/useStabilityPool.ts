/* eslint-disable camelcase */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { type BaseError, useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { erc20Abi, parseUnits, parseGwei } from 'viem'
import { STABILITY_POOL } from '@/configs/address'
import STABILITY_POOLABI from '@/abi/StabilityPool.json'
import { ethers } from 'ethers'
import { useStabilityPoolView } from './StabilityPoolContext'
import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

const useStabilityPool = () => {
  const chainId = useChainId()
  const {address: account} = useAccount()
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

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
  })

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

  const getGasDeposit = async (amount: bigint, assets: string[]) => {
    if (amount == BigInt(0) || assets.length == 0) return 0

    //  Estimate Gas Fee
    const gasLimit = await publicClient.estimateContractGas({
      ...StabilityPoolContract,
      functionName: 'provideToSP',
      args: [
        amount,
        assets
      ],
      account
    });
    
    // Fetching the current gas price using publicClient
    const gasPrice = await publicClient.getGasPrice();
    // Actual price is the above 'gasPrice' but the network estmiate max Gas Price as 2Gwei.
    const maxGasPrice = ethers.parseUnits('2', 'gwei');
    
    // Calculate the estimated gas fee in ETH
    const estimatedGasFeeInWei = gasLimit * maxGasPrice;
    const estimatedGasFeeInEth = ethers.formatEther(estimatedGasFeeInWei);

    return +((+estimatedGasFeeInEth).toFixed(5))
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

  const getGasWithdraw = async (amount: bigint, assets: string[]) => {
    if (amount == BigInt(0) || assets.length == 0) return 0

    //  Estimate Gas Fee
    const gasLimit = await publicClient.estimateContractGas({
      ...StabilityPoolContract,
      functionName: 'withdrawFromSP',
      args: [
        amount,
        assets
      ],
      account
    });
    
    // Fetching the current gas price using publicClient
    const gasPrice = await publicClient.getGasPrice();
    // Actual price is the above 'gasPrice' but the network estmiate max Gas Price as 2Gwei.
    const maxGasPrice = ethers.parseUnits('2', 'gwei');
    
    // Calculate the estimated gas fee in ETH
    const estimatedGasFeeInWei = gasLimit * maxGasPrice;
    const estimatedGasFeeInEth = ethers.formatEther(estimatedGasFeeInWei);

    return +((+estimatedGasFeeInEth).toFixed(5))
  }

  return {
    handleProvide,
    getGasDeposit,
    handleWithdraw,
    getGasWithdraw,
    txhash,
    isPending,
    isConfirming,
    isConfirmed,
    error
  }
}

export default useStabilityPool
