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
import { BaseError, useAccount, useChainId, useReadContract, useWriteContract } from 'wagmi'
import { ACTIVE_POOL, BORROWER_OPERATIONS } from '@/configs/address'
import BORROWER_OPERATIONS_ABI from '@/abi/BorrowerOperations.json'
import { useProtocol } from '@/context/ProtocolProvider/ProtocolContext'
import { erc20Abi, formatUnits } from 'viem'
import { RemoveComma } from '@/hooks/utils'
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
  depositAmount?: string
  borrowAmount?: string
  withdrawAmount?: string
  repayAmount?: string
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
    withdrawAmount,
    repayAmount,
    allowance,
    collateral,
    collateralDetail
  } = props

  const [useWalletBalance, setUseWalletBalance] = useState(true)
  const [amount, setAmount] = useState('')
  const theme: Theme = useTheme()

  const { moduleInfo } = useModuleView(collateral)

  const formattedAllowance = +formatUnits(allowance!, collateralDetail.decimals)
  const formattedDepositAmount = RemoveComma(depositAmount!)
  const formattedBorrowAmount = RemoveComma(borrowAmount!)
  const formattedWithdrawAmount = RemoveComma(depositAmount!)
  const formattedRepayAmount = RemoveComma(borrowAmount!)

  const chainId = useChainId()
  const { address: account } = useAccount()
  const {
    onApprove,
    onOpen,
    onAdjust,
    onDeposit,
    onWithdraw,
    onBorrow,
    onRepay,
    txhash,
    isPending,
    isConfirming,
    isConfirmed,
    error
  } = useModules(collateral)

  const { view: moduleView } = useModuleView(collateral)

  const initializePopupStates = () => {
    setOpen(false)
    setAmount('')
  }

  useEffect(() => {
    console.log('isConfirmed', isConfirmed)
    if (isConfirmed) {
      initializePopupStates()
      switch (type) {
        case 'openOrAdjust':
          showToast(
            'success',
            'Borrow Success',
            `You have successfully deposit ${depositAmount} ${collateral} and borrow ${borrowAmount} trenUSD. 
            <br/> txhash: ${ETHERSCAN_BASE_URL}/${txhash}`,
            10000
          )
        case 'deposit':
          showToast('success', 'Deposit Success', `You have successfully deposit ${depositAmount} ${collateral}`, 10000)
        case 'borrow':
          showToast('success', 'Borrow Success', `You have successfully borrow ${borrowAmount} trenUSD`, 10000)
        case 'withdraw':
          showToast(
            'success',
            'Withdraw Success',
            `You have successfully withdrawn ${withdrawAmount} ${collateral}`,
            10000
          )
        case 'repay':
          showToast('success', 'Repay Success', `You have successfully repaid ${repayAmount} trenUSD`, 10000)
      }
    }
  }, [isConfirmed, depositAmount, borrowAmount, repayAmount, withdrawAmount, collateral, setOpen, txhash, type])

  // useEffect(() => {
  //   if (error) showToast('error', 'Error', (error as BaseError).shortMessage || error.message, 10000)
  // }, [error])

  // {error && (
  //   <div>Error: {(error as BaseError).shortMessage || error.message}</div>
  // )}

  const handleSubmit = () => {
    if (!collateralDetail) return
    if (type === 'openOrAdjust') {
      try {
        if (+formattedAllowance < +RemoveComma(depositAmount!)) {
          // In case Approve amount is less than deposit amount , Should be approved first
          onApprove(parseUnits(formattedDepositAmount, collateralDetail.decimals))
        } else if (moduleView === 'ACTIVE') {
          if (!collateralDetail) return
          onAdjust(
            parseUnits(formattedDepositAmount, collateralDetail.decimals),
            parseUnits(formattedBorrowAmount, collateralDetail.decimals)
          )
          showToast('success', 'Borrow Success', txhash!, 10000)
        } else {
          if (!collateralDetail) return
          onOpen(
            parseUnits(formattedDepositAmount, collateralDetail.decimals),
            parseUnits(formattedBorrowAmount, collateralDetail.decimals)
          )
        }
      } catch (err) {
        console.log('err', err)
        showToast('error', 'Borrow Failed', '', 10000)
      }
    } else if (type == 'deposit') {
      if (+formattedAllowance < +RemoveComma(depositAmount!)) {
        // In case Approve amount is less than deposit amount , Should be approved first
        onApprove(parseUnits(formattedDepositAmount, collateralDetail.decimals))
      } else if (moduleView === 'ACTIVE') {
        if (!collateralDetail) return
        onAdjust(
          parseUnits(formattedDepositAmount, collateralDetail.decimals),
          parseUnits(formattedBorrowAmount, collateralDetail.decimals)
        )
        showToast('success', 'Borrow Success', txhash!, 10000)
      }
    } else if (type == 'withdraw') {
    } else if (type === 'borrow') {
    } else if (type == 'repay') {
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
              amount={amount}
              setAmount={setAmount}
              type={type}
              asset={String(collateral)}
              available={12.78}
            />
            <TransactionOverView healthFrom={14.54} healthTo={1.75} liquidationPrice={2520.78} gasFee={0.14} />
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
              disabled={isPending}
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
            <TransactionOverView healthTo={14.54} liquidationPrice={2520.78} gasFee={0.14} uptoFee={34.21} />
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
              disabled={isPending}
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
            <AmountForm amount={amount} setAmount={setAmount} type={type} asset='trenUSD' available={20} />
            <TransactionOverView
              type={type}
              healthFrom={1.54}
              healthTo={13.42}
              liquidationPrice={149.34}
              gasFee={0.14}
              debt={30}
              amount={amount}
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
              disabled={isPending}
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
