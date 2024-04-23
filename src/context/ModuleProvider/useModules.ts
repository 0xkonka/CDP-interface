/* eslint-disable camelcase */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { type BaseError, useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { erc20Abi, parseUnits, parseGwei } from 'viem'
import { useProtocol } from '../ProtocolProvider/ProtocolContext'
import { BORROWER_OPERATIONS } from '@/configs/address'
import BORROWER_OPERATIONS_ABI from '@/abi/BorrowerOperations.json'
import { ethers } from 'ethers'
import { useModuleView } from './useModuleView'

const useModules = (collateral: string) => {
  const chainId = useChainId()
  const { collateralDetails } = useProtocol()
  const collateralDetail = useMemo(
    () => collateralDetails.find(i => i.symbol === collateral),
    [collateral, collateralDetails]
  )

  const { refresh: refreshProtocol } = useProtocol()
  const { refresh: refreshModule } = useModuleView(collateral)

  const { data: txhash, writeContract, isPending, error, reset } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txhash
  })

  useEffect(() => {
    console.log('isConfirmed', isConfirmed)
    if (isConfirmed) {
      refreshProtocol()
      refreshModule()
      reset()
    }
  }, [isConfirmed])

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
        // gas: parseGwei('20'),
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
        functionName: 'openTrenBox',
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
        functionName: 'adjustTrenBox',
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

  const handleClose = () => {
    if (!collateralDetail) return
    try {
      writeContract({
        ...BorrowerOperationsContract,
        functionName: 'closeTrenBox',
        args: [collateralDetail.address as '0x{string}']
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
    handleClose,
    txhash,
    isPending,
    isConfirming,
    isConfirmed,
    error
  }
}

export default useModules
