// React imports
import React, { Fragment, useState, Ref, forwardRef, ReactElement, useEffect, useMemo, useCallback } from 'react'

// MUI components
import { Dialog, SlideProps, Slide, Box, Typography, Button, Theme, useTheme, Stack } from '@mui/material'

// Core Components Imports
import Icon from '@/@core/components/icon'
import { TransactionOverView } from './transactionOverview'
import { ApproveDetailView } from './approveDetailView'
import { AmountForm } from './amountForm'
import { showToast } from '@/hooks/toasts'
import { BaseError, useAccount, useChainId } from 'wagmi'
import { ACTIVE_POOL, BORROWER_OPERATIONS } from '@/configs/address'
import BORROWER_OPERATIONS_ABI from '@/abi/BorrowerOperations.json'
import { useProtocol } from '@/context/ProtocolProvider/ProtocolContext'
import { erc20Abi, formatEther, formatUnits } from 'viem'
import { removeComma } from '@/hooks/utils'
import { parseEther, parseUnits } from 'viem'

import useModules from '@/context/ModuleProvider/useModules'
import { CollateralParams } from '@/context/ModuleProvider/type'
import { useModuleView } from '@/context/ModuleProvider/useModuleView'
import { ETHERSCAN_BASE_URL } from '@/configs/collaterals'

const Transition = forwardRef(function Transition(
  props: SlideProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  type: string
  collateral: string
  collateralDetail: CollateralParams
  allowance: bigint
  userCollateralBal: bigint
  depositAmount?: string
  borrowAmount?: string
}
const getTitle = (type: string) => {
  switch (type) {
    case 'withdraw':
      return 'Withdraw Collateral'
    case 'borrow':
      return 'Borrow More'
    case 'deposit':
      return 'Deposit Collateral'
    case 'repay':
      return 'Repay trenUSD'
    case 'openOrAdjust':
      return 'Add Collateral & Borrow'
    case 'default':
      return 'N/A'
  }
}
const getButtonLabel = (type: string, approve = false) => {
  switch (type) {
    case 'withdraw':
      return 'Withdraw Collateral'
    case 'borrow':
      return 'Borrow trenUSD'
    case 'deposit':
      if (approve) return 'Approve'
      return 'Deposit Collateral'
    case 'repay':
      return 'Repay'
    case 'openOrAdjust':
      if (approve) return 'Approve'
      return 'Borrow trenUSD'
    case 'default':
      return 'N/A'
  }
}

export const BorrowPopup = (props: Props) => {
  const {
    open,
    setOpen,
    type,
    depositAmount,
    borrowAmount,
    allowance,
    collateral,
    collateralDetail,
    userCollateralBal
  } = props
  const { decimals, LTV, price = BigInt(0) } = collateralDetail

  const theme: Theme = useTheme()
  const chainId = useChainId()
  const { address: account } = useAccount()

  const formattedAllowance = +formatUnits(allowance!, decimals)
  const formattedDepositAmount = removeComma(depositAmount!)
  const formattedBorrowAmount = removeComma(borrowAmount!)
  const formattedWithdrawAmount = removeComma(depositAmount!)
  const formattedRepayAmount = removeComma(borrowAmount!)

  const {
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
  } = useModules(collateral)

  const { view: moduleView, moduleInfo } = useModuleView(collateral)
  const { debt: debtAmount = BigInt(0), coll: depositedAmount = BigInt(0) } = moduleInfo || {}

  const [useWalletBalance, setUseWalletBalance] = useState(true)
  const [inputAmount, setInputAmount] = useState('')
  const [availableBalance, setAvailableBalance] = useState(0)
  const initializePopupStates = () => {
    setOpen(false)
    setInputAmount('')
  }
  useEffect(() => {
    switch (type) {
      case 'deposit':
        setAvailableBalance(+formatUnits(userCollateralBal, decimals))
        break
      case 'withdraw':
        setAvailableBalance(+formatUnits(depositedAmount, decimals))
        break
      case 'borrow':
        setAvailableBalance(+formatUnits(depositedAmount, decimals) * +formatEther(price) * +formatEther(LTV) - (+formatEther(debtAmount)))
        break
      case 'repay':
        setAvailableBalance(+formatEther(debtAmount))
        break
    }
  }, [type, decimals, userCollateralBal, depositedAmount, debtAmount])

  useEffect(() => {
    if (isConfirmed && !isPending) {
      initializePopupStates()
      switch (type) {
        case 'openOrAdjust':
          showToast(
            'success',
            'Borrow Success',
            `You have successfully deposit ${depositAmount} ${collateral} and borrow ${borrowAmount} trenUSD.`,
            30000,
            `${ETHERSCAN_BASE_URL}/${txhash}`,
          )
          break
        case 'deposit':
          showToast('success', 'Deposit Success', `You have successfully deposit ${inputAmount} ${collateral}`, 30000)
          break
        case 'borrow':
          showToast('success', 'Borrow Success', `You have successfully borrow ${inputAmount} trenUSD`, 30000)
          break
        case 'withdraw':
          showToast(
            'success',
            'Withdraw Success',
            `You have successfully withdrawn ${inputAmount} ${collateral}`,
            30000
          )
          break
        case 'repay':
          showToast('success', 'Repay Success', `You have successfully repaid ${inputAmount} trenUSD`, 30000)
          break
      }
    }
  }, [isConfirmed, isPending, inputAmount, depositAmount, borrowAmount, collateral, txhash, type])

  useEffect(() => {
    if (error) showToast('error', 'Error', (error as BaseError).shortMessage || error.message, 30000)
  }, [error])

  const handleSubmit = () => {
    if (!collateralDetail) return
    if (+inputAmount > availableBalance || +inputAmount == 0) return
    if (type === 'openOrAdjust') {
      try {
        if (+formattedAllowance < +removeComma(depositAmount!)) {
          // In case Approve amount is less than deposit amount , Should be approved first
          handleApprove(parseUnits(formattedDepositAmount, decimals))
        } else if (moduleView === 'ACTIVE') {
          if (!collateralDetail) return
          handleAdjust(parseUnits(formattedDepositAmount, decimals), parseUnits(formattedBorrowAmount, decimals))
        } else {
          if (!collateralDetail) return
          handleOpen(parseUnits(formattedDepositAmount, decimals), parseUnits(formattedBorrowAmount, decimals))
        }
      } catch (err) {
        console.log('err', err)
      }
    } else if (type == 'deposit') {
      console.log('deposit')
      if (+formattedAllowance < +removeComma(depositAmount!)) {
        // In case Approve amount is less than deposit amount , Should be approved first
        handleApprove(parseUnits(inputAmount, decimals))
      } else if (moduleView === 'ACTIVE') {
        handleDeposit(parseUnits(inputAmount, decimals))
      }
    } else if (type == 'withdraw') {
      handleWithdraw(parseUnits(inputAmount, decimals))
    } else if (type === 'borrow') {
      handleBorrow(parseEther(inputAmount))
    } else if (type == 'repay') {
      handleRepay(parseEther(inputAmount))
    }
  }

  return (
    <Fragment>
      <Dialog
        open={open}
        // keepMounted
        onClose={initializePopupStates}
        TransitionComponent={Transition}
        maxWidth={'sm'}
        fullWidth={true}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
      >
        {(type == 'withdraw' || type == 'borrow' || type == 'deposit') && (
          <Box id={`modal-${type}`} p={6} position='relative'>
            <Typography mb={8} fontWeight={600} variant='h4' color='white'>
              {getTitle(type)}
            </Typography>
            <Icon
              style={{ position: 'absolute', right: 20, top: 20, cursor: 'pointer', fontWeight: 'bold' }}
              icon='tabler:x'
              fontSize='1.75rem'
              onClick={initializePopupStates}
            />
            <AmountForm
              amount={inputAmount}
              setAmount={setInputAmount}
              type={type}
              asset={type =='borrow' ? 'trenUSD' : String(collateral)}
              available={availableBalance}
            />
            <TransactionOverView type={type} amount={inputAmount} liquidationPrice={2520.78} gasFee={0.14} />
            <Button
              sx={{
                color: 'white',
                py: 3,
                px: 20,
                width: 1,
                fontSize: 18
              }}
              variant='outlined'
              onClick={handleSubmit}
              disabled={isPending || isConfirming || (+inputAmount > availableBalance) || +inputAmount == 0}
            >
              {getButtonLabel(type, formattedAllowance < +formattedDepositAmount)}
            </Button>
          </Box>
        )}
        {type == 'openOrAdjust' && (
          <Box id={`modal-${type}`} p={6} position='relative'>
            <Typography mb={8} fontWeight={600} variant='h4' color='white'>
              {getTitle(type)}
            </Typography>
            <Icon
              style={{ position: 'absolute', right: 20, top: 20, cursor: 'pointer', fontWeight: 'bold' }}
              icon='tabler:x'
              fontSize='1.75rem'
              onClick={initializePopupStates}
            />
            <ApproveDetailView
              collateral={String(collateral)}
              depositAmount={depositAmount!}
              borrowAmount={borrowAmount!}
            />
            <TransactionOverView type={type} amount={inputAmount} liquidationPrice={2520.78} gasFee={0.14} uptoFee={34.21} />
            <Button
              sx={{
                color: 'white',
                py: 3,
                px: 20,
                width: 1,
                fontSize: 18
              }}
              variant='outlined'
              onClick={handleSubmit}
              disabled={isPending || isConfirming || (+inputAmount > availableBalance) || +inputAmount == 0}
            >
              {getButtonLabel(type, formattedAllowance < +formattedDepositAmount)}
            </Button>
          </Box>
        )}
        {type == 'repay' && (
          <Box id={`modal-${type}`} p={6} position='relative'>
            <Typography mb={8} fontWeight={600} variant='h4' color='white'>
              {getTitle(type)}
            </Typography>
            <Icon
              style={{ position: 'absolute', right: 20, top: 20, cursor: 'pointer', fontWeight: 'bold' }}
              icon='tabler:x'
              fontSize='1.75rem'
              onClick={initializePopupStates}
            />
            <Typography variant='h5' color='#707175' mb={2} fontWeight={400}>
              Repay with
            </Typography>
            <Stack
              direction='row'
              marginBottom={6}
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 2,
                border: 'solid 1px #C6C6C74D',
                width: { xs: 1, lg: 'auto' }
              }}
            >
              <Button
                variant='outlined'
                onClick={() => {
                  setUseWalletBalance(true)
                }}
                sx={{
                  borderRadius: 2,
                  px: 8,
                  py: 2.5,
                  fontSize: 16,
                  fontWeight: 400,
                  color: 'white',
                  width: 1 / 2,
                  border: !useWalletBalance ? 'solid 1px transparent' : '',
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
              >
                Wallet balance
              </Button>
              <Button
                variant='outlined'
                sx={{
                  borderRadius: 2,
                  px: 8,
                  py: 2.5,
                  fontSize: 16,
                  fontWeight: 400,
                  color: '#C6C6C7',
                  width: 1 / 2,
                  border: useWalletBalance ? 'solid 1px transparent' : '',
                  '&:hover': {
                    borderColor: theme.palette.primary.main
                  }
                }}
              >
                Collateral (coming soon)
              </Button>
            </Stack>
            <AmountForm amount={inputAmount} setAmount={setInputAmount} type={type} asset='trenUSD' available={availableBalance} />
            <TransactionOverView
              type={type}
              liquidationPrice={149.34}
              gasFee={0.14}
              amount={inputAmount}
            />
            <Button
              sx={{
                color: 'white',
                py: 3,
                px: 20,
                width: 1,
                fontSize: 18
              }}
              variant='outlined'
              onClick={handleSubmit}
              disabled={isPending || isConfirming || (+inputAmount > availableBalance) || +inputAmount == 0}
            >
              {getButtonLabel(type)}
            </Button>
          </Box>
        )}
        {/* <Typography>{error}</Typography> */}
      </Dialog>
    </Fragment>
  )
}
