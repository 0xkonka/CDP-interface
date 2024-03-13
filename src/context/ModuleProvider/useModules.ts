/* eslint-disable camelcase */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { type BaseError, useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { erc20Abi, parseUnits } from 'viem'
import { useProtocol } from '../ProtocolProvider/ProtocolContext'
import { BORROWER_OPERATIONS } from '@/configs/address'
import BORROWER_OPERATIONS_ABI from '@/abi/BorrowerOperations.json'
import { ethers } from 'ethers'

const useModules = (collateral: string) => {
  const chainId = useChainId()
  const { collateralDetails } = useProtocol()
  const collateralDetail = useMemo(
    () => collateralDetails.find(i => i.symbol === collateral),
    [collateral, collateralDetails]
  )

  const { refresh } = useProtocol()

  const { data: txhash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txhash
  })

  useEffect(() => {
    console.log('isConfirmed', isConfirmed)
    if (isConfirmed) refresh()
  }, [isConfirmed, refresh])

  const BorrowerOperationsContract = {
    address: BORROWER_OPERATIONS[chainId] as '0x{string}',
    abi: BORROWER_OPERATIONS_ABI
  } as const

  const handleApprove = (approveAmount: bigint) => {
    if (!collateralDetail) return
    try {
      writeContract({
        address: collateralDetail.address as '0x{string}',
        abi: erc20Abi,
        functionName: 'approve',
        args: [BORROWER_OPERATIONS[chainId] as '0x{string}', approveAmount]
      })
    } catch (err) {
      console.log('err', err)
    }
  }

  const handleOpen = (depositAmount: bigint, borrowAmount: bigint) => {
    if (!collateralDetail) return
    try {
      writeContract({
        ...BorrowerOperationsContract,
        functionName: 'openModule',
        args: [
          collateralDetail.address as '0x{string}',
          depositAmount,
          borrowAmount,
          ethers.ZeroAddress,
          ethers.ZeroAddress
        ]
      })
    } catch (err) {
      console.log('err', err)
    }
  }

  const handleAdjust = (depositAmount: bigint, borrowAmount: bigint) => {
    if (!collateralDetail) return
    try {
      writeContract({
        ...BorrowerOperationsContract,
        functionName: 'adjustModule',
        args: [
          collateralDetail.address as '0x{string}',
          depositAmount,
          BigInt(0),
          borrowAmount,
          true,
          ethers.ZeroAddress,
          ethers.ZeroAddress
        ]
      })
    } catch (err) {
      console.log('err', err)
    }
  }

  const handleDeposit = (depositAmount: bigint) => {
    if (!collateralDetail) return
    try {
      writeContract({
        ...BorrowerOperationsContract,
        functionName: 'addColl',
        args: [collateralDetail.address as '0x{string}', depositAmount, ethers.ZeroAddress, ethers.ZeroAddress]
      })
    } catch (err) {
      console.log('err', err)
    }
  }

  const handleWithdraw = (withdrawAmount: bigint) => {
    if (!collateralDetail) return
    try {
      writeContract({
        ...BorrowerOperationsContract,
        functionName: 'withdrawColl',
        args: [collateralDetail.address as '0x{string}', withdrawAmount, ethers.ZeroAddress, ethers.ZeroAddress]
      })
    } catch (err) {
      console.log('err', err)
    }
  }

  const handleBorrow = (borrowAmount: bigint) => {
    if (!collateralDetail) return
    try {
      writeContract({
        ...BorrowerOperationsContract,
        functionName: 'withdrawDebtTokens',
        args: [collateralDetail.address as '0x{string}', borrowAmount, ethers.ZeroAddress, ethers.ZeroAddress]
      })
    } catch (err) {
      console.log('err', err)
    }
  }

  const handleRepay = (repayAmount: bigint) => {
    if (!collateralDetail) return
    try {
      writeContract({
        ...BorrowerOperationsContract,
        functionName: 'repayDebtTokens',
        args: [collateralDetail.address as '0x{string}', repayAmount, ethers.ZeroAddress, ethers.ZeroAddress]
      })
    } catch (err) {
      console.log('err', err)
    }
  }

  return {
    handleApprove,
    handleOpen,
    handleAdjust,
    handleDeposit,
    handleWithdraw,
    handleBorrow,
    handleRepay,
    txhash,
    isPending,
    isConfirming,
    isConfirmed,
    error
  }
}

export default useModules
