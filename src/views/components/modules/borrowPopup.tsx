// React imports
import React, { Fragment, useState, Ref, forwardRef, ReactElement, useEffect } from 'react'

// MUI components
import { Dialog, SlideProps, Slide, Box, Typography, Button, Theme, useTheme, Stack } from '@mui/material'

// Core Components Imports
import Icon from '@/@core/components/icon'
import { TransactionOverView } from './transactionOverview'
import { ApproveDetailView } from './approveDetailView'
import { AmountForm } from './amountForm'
import { showToast } from '@/hooks/toasts'
import { useChainId, useWriteContract } from 'wagmi'
import { BORROWER_OPERATIONS } from '@/configs/address'
import BORROWER_OPERATIONS_ABI from '@/abi/BorrowerOperations.json'
import { useProtocol } from '@/context/ProtocolProvider/ProtocolContext'

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
    case 'approve':
      return 'Add Collateral & Borrow'
    case 'default':
      return 'N/A'
  }
}
const getButtonLabel = (type: string) => {
  switch (type) {
    case 'withdraw':
      return 'Withdraw Collateral'
    case 'borrow':
      return 'Borrow trenUSD'
    case 'deposit':
      return 'Deposit Collateral'
    case 'repay':
      return 'Repay'
    case 'approve':
      return 'Borrow trenUSD'
    case 'default':
      return 'N/A'
  }
}

export const BorrowPopup = (props: Props) => {
  const { open, setOpen, type, depositAmount, borrowAmount, withdrawAmount, repayAmount } = props

  const [useWalletBalance, setUseWalletBalance] = useState(true)
  const [amount, setAmount] = useState('')
  const theme: Theme = useTheme()
  let { collateral } = props
  collateral = type == 'borrow' ? 'trenUSD' : collateral

  const chainId = useChainId()
  const { collateralDetails } = useProtocol()
  const collateralDetail = collateralDetails.find(i => i.symbol === collateral)
  const { data: txhash, writeContract, isPending, error } = useWriteContract()

  const handleSubmit = () => {
    if (type == 'withdraw') {
      initializePopupStates()
      showToast('success', 'Withdraw Success', `You have successfully withdrawn ${amount} ${collateral}`, 10000)
    } else if (type == 'borrow') {
      initializePopupStates()
      showToast('success', 'Borrow Success', `You have successfully borrow ${amount} trenUSD`, 10000)
    } else if (type === 'deposit') {
      initializePopupStates()
      showToast('success', 'Deposit Success', `You have successfully deposit ${amount} ${collateral}`, 10000)
    } else if (type == 'repay') {
      initializePopupStates()
      showToast('success', 'Repay Success', `You have successfully repaid ${amount} trenUSD`, 10000)
    } else if (type === 'approve') {

      try {
        //     if(!collateralDetail) return
        //     console.log('Approving')
        //     writeContract({
        //       address: BORROWER_OPERATIONS[chainId] as '0x{string}',
        //       abi: BORROWER_OPERATIONS_ABI,
        //       functionName: 'openModule',
        //       args: [collateralDetail?.address[chainId] as '0x{string}', parseUnits(approveAmount, 6)]
        //     })

        initializePopupStates()
        showToast('success', 'Borrow Success', `You have successfully borrow trenUSD`, 10000)
      } catch (err) {
        console.log('err', err)
        showToast('error', 'Borrow Failed', '', 10000)
      }
    }
  }

  const initializePopupStates = () => {
    setOpen(false)
    setAmount('')
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
            >
              {getButtonLabel(type)}
            </Button>
          </Box>
        )}
        {type == 'approve' && (
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
              depositAmount={+depositAmount!}
              borrowAmount={+borrowAmount!}
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
            >
              {getButtonLabel(type)}
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
