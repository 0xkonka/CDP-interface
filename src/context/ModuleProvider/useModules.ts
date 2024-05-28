/* eslint-disable camelcase */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { type BaseError, useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { erc20Abi, parseUnits, parseGwei } from 'viem'
import { useProtocol } from '../ProtocolProvider/ProtocolContext'
import { BORROWER_OPERATIONS } from '@/configs/address'
import BORROWER_OPERATIONS_ABI from '@/abi/BorrowerOperations.json'
import { ethers } from 'ethers'
import { useModuleView } from './useModuleView'
import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

const useModules = (collateral: string) => {
  const chainId = useChainId()
  const { collateralDetails } = useProtocol()
  const collateralDetail = useMemo(
    () => collateralDetails.find(i => i.symbol === collateral),
    [collateral, collateralDetails]
  )
  const {address: account} = useAccount()

  const { refresh: refreshProtocol } = useProtocol()
  const { refresh: refreshModule } = useModuleView(collateral)

  const { data: txhash, writeContract, isPending, error, reset } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txhash
  })

  useEffect(() => {
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

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
  })
  
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

  const getGasApprove = async (approveAmount: bigint) => {
    if (!collateralDetail) return 0

    //  Estimate Gas Fee
    const gasLimit = await publicClient.estimateContractGas({
      address: collateralDetail.address as '0x{string}',
      abi: erc20Abi,
      functionName: 'approve',
      args: [BORROWER_OPERATIONS[chainId] as '0x{string}', approveAmount],
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

  const handleOpen = async (depositAmount: bigint, borrowAmount: bigint) => {
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

  const getGasOpen = async (depositAmount: bigint, borrowAmount: bigint) => {
    if (!collateralDetail) return 0

    //  Estimate Gas Fee
    const gasLimit = await publicClient.estimateContractGas({
      ...BorrowerOperationsContract,
      functionName: 'openTrenBox',
      args: [
        collateralDetail.address as '0x{string}',
        depositAmount,
        borrowAmount,
        ethers.ZeroAddress,
        ethers.ZeroAddress
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

  const handleAdjust = async (depositAmount: bigint, borrowAmount: bigint) => {
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

  const getGasAdjust = async (depositAmount: bigint, borrowAmount: bigint) => {
    if (!collateralDetail) return 0

    //  Estimate Gas Fee
    const gasLimit = await publicClient.estimateContractGas({
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

  const getGasDeposit = async (depositAmount: bigint) => {
    if (!collateralDetail || depositAmount == BigInt(0)) return 0
    
    //  Estimate Gas Fee
    const gasLimit = await publicClient.estimateContractGas({
      ...BorrowerOperationsContract,
      functionName: 'addColl',
      args: [collateralDetail.address as '0x{string}', depositAmount, ethers.ZeroAddress, ethers.ZeroAddress],
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

  const getGasWithdraw = async (withdrawAmount: bigint) => {
    if (!collateralDetail || withdrawAmount == BigInt(0)) return 0

    //  Estimate Gas Fee
    const gasLimit = await publicClient.estimateContractGas({
      ...BorrowerOperationsContract,
      functionName: 'withdrawColl',
      args: [collateralDetail.address as '0x{string}', withdrawAmount, ethers.ZeroAddress, ethers.ZeroAddress],
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

  const getGasBorrow = async (borrowAmount: bigint) => {
    if (!collateralDetail || borrowAmount == BigInt(0)) return 0

    //  Estimate Gas Fee
    const gasLimit = await publicClient.estimateContractGas({
      ...BorrowerOperationsContract,
      functionName: 'withdrawDebtTokens',
      args: [collateralDetail.address as '0x{string}', borrowAmount, ethers.ZeroAddress, ethers.ZeroAddress],
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

  const getGasRepay = async (repayAmount: bigint) => {
    if (!collateralDetail || repayAmount == BigInt(0)) return 0

    //  Estimate Gas Fee
    const gasLimit = await publicClient.estimateContractGas({
      ...BorrowerOperationsContract,
      functionName: 'repayDebtTokens',
      args: [collateralDetail.address as '0x{string}', repayAmount, ethers.ZeroAddress, ethers.ZeroAddress],
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
    handleApprove,
    handleOpen,
    handleAdjust,
    handleDeposit,
    handleWithdraw,
    handleBorrow,
    handleRepay,
    getGasApprove,
    getGasOpen,
    getGasAdjust,
    getGasDeposit,
    getGasWithdraw,
    getGasBorrow,
    getGasRepay,
    txhash,
    isPending,
    isConfirming,
    isConfirmed,
    error
  }
}

export default useModules
