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

  const { data: txhash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txhash
  })

  const BorrowerOperationsContract = {
    address: BORROWER_OPERATIONS[chainId] as '0x{string}',
    abi: BORROWER_OPERATIONS_ABI
  } as const

  const onApprove = (approveAmount: bigint) => {
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

  const onOpen = (depositAmount: bigint, borrowAmount: bigint) => {
    if (!collateralDetail) return
    try {
      console.log('Opening')
      writeContract({
        ...BorrowerOperationsContract,
        functionName: 'openModule',
        args: [
          collateralDetail.address as '0x{string}',
          depositAmount,
          borrowAmount,
          ethers.constants.AddressZero,
          ethers.constants.AddressZero
        ]
      })
    } catch (err) {
      console.log('err', err)
    }
  }

  const onDeposit = (depositAmount: bigint) => {
    if (!collateralDetail) return
    try {
      console.log('Depositing')
      writeContract({
        ...BorrowerOperationsContract,
        functionName: 'addColl',
        args: [
          collateralDetail.address as '0x{string}',
          depositAmount,
          ethers.constants.AddressZero,
          ethers.constants.AddressZero
        ]
      })
    } catch (err) {
      console.log('err', err)
    }
  }

  const onWithdraw = (withdrawAmount: bigint) => {
    if (!collateralDetail) return
    try {
      console.log('Withdrawing')
      writeContract({
        ...BorrowerOperationsContract,
        functionName: 'withdrawColl',
        args: [
          collateralDetail.address as '0x{string}',
          withdrawAmount,
          ethers.constants.AddressZero,
          ethers.constants.AddressZero
        ]
      })
    } catch (err) {
      console.log('err', err)
    }
  }

  const onBorrow = (borrowAmount: bigint) => {
    if (!collateralDetail) return
    try {
      console.log('Borrowing')
      writeContract({
        ...BorrowerOperationsContract,
        functionName: 'withdrawDebtTokens',
        args: [
          collateralDetail.address as '0x{string}',
          borrowAmount,
          ethers.constants.AddressZero,
          ethers.constants.AddressZero
        ]
      })
    } catch (err) {
      console.log('err', err)
    }
  }

  const onRepay = (repayAmount: bigint) => {
    if (!collateralDetail) return
    try {
      console.log('Borrowing')
      writeContract({
        ...BorrowerOperationsContract,
        functionName: 'repayDebtTokens',
        args: [
          collateralDetail.address as '0x{string}',
          repayAmount,
          ethers.constants.AddressZero,
          ethers.constants.AddressZero
        ]
      })
    } catch (err) {
      console.log('err', err)
    }
  }

  return { onApprove, onOpen, onDeposit, onWithdraw, onBorrow, onRepay, txhash, isPending, isConfirming, isConfirmed, error }
}

export default useModules
