// React imports
import React, { Fragment, useState, Ref, forwardRef, ReactElement, useEffect } from 'react'

// MUI components
import { Dialog, SlideProps, Slide, Box, Typography, Button, CircularProgress } from '@mui/material'

// Core Components Imports
import Icon from '@/@core/components/icon'
import { TransactionOverView } from '../earns/transactionOverview'
import { AmountForm } from '../modules/amountForm'
import { showToast } from '@/hooks/toasts'
import { BaseError } from 'wagmi'
import { parseEther } from 'viem'

import useStabilityPool from '@/context/StabilityPoolProvider/useStabilityPool'
import { useProtocol } from '@/context/ProtocolProvider/ProtocolContext'
import { ETHERSCAN_BASE_URL } from '@/configs/address'

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
  depositAvailable: number
  withdrawAvailable: number
  totalDebtTokenDeposits: number
}
const getTitle = (type: string) => {
  switch (type) {
    case 'withdraw':
      return 'Withdraw trenUSD'
    case 'deposit':
      return 'Deposit trenUSD'
    case 'default':
      return 'N/A'
  }
}
const getButtonLabel = (type: string) => {
  switch (type) {
    case 'withdraw':
      return 'Withdraw trenUSD'
    case 'deposit':
      return 'Deposit trenUSD'
    case 'default':
      return 'N/A'
  }
}

export const StabilityPopup = (props: Props) => {
  const {
    open,
    setOpen,
    type,
    depositAvailable,
    withdrawAvailable,
    totalDebtTokenDeposits
  } = props

  const { 
    getGasDeposit,
    handleProvide, 
    getGasWithdraw,
    handleWithdraw, 
    txhash, 
    isPending, 
    isConfirming, 
    isConfirmed,
    error
  } = useStabilityPool()
  const { collaterals } = useProtocol()

  const [inputAmount, setInputAmount] = useState('')
  const [availableBalance, setAvailableBalance] = useState(0)
  const [gasFee, setGasFee] = useState<number>(0)
  const initializePopupStates = () => {
    setOpen(false)
    setInputAmount('')
  }
  
  useEffect(() => {
    switch (type) {
      case 'deposit':
        setAvailableBalance(depositAvailable)
        break
      case 'withdraw':
        setAvailableBalance(withdrawAvailable)
        break
    }
  }, [type, depositAvailable, withdrawAvailable])

  useEffect(() => {
    if (isConfirmed && !isPending) {
      initializePopupStates()
      switch (type) {
        case 'deposit':
          showToast('success', 
            'Deposit Success', 
            `You have successfully deposited ${inputAmount} trenUSD`,
            30000,
            `${ETHERSCAN_BASE_URL}/tx/${txhash}`
          )
          break
        case 'withdraw':
          showToast(
            'success',
            'Withdraw Success',
            `You have successfully withdrawn ${inputAmount} trenUSD`,
            30000,
            `${ETHERSCAN_BASE_URL}/tx/${txhash}`
          )
          break
      }
    }
  }, [isConfirmed, isPending, inputAmount, txhash, type])

  useEffect(() => {
    if (error) showToast('error', 'Error', (error as BaseError).shortMessage || error.message, 30000)
  }, [error])

  const handleSubmit = () => {
    if (collaterals.length <= 0) return
    if (+inputAmount > availableBalance || +inputAmount == 0) return

    if (type == 'deposit') {
      handleProvide(parseEther(inputAmount), collaterals)
    } else if (type == 'withdraw') {
      handleWithdraw(parseEther(inputAmount), collaterals)
    }
  }

  useEffect(() => {
    const getGasFee = async (type:string) => {
      if (collaterals.length <= 0 || +inputAmount > availableBalance || +inputAmount == 0) {
        setGasFee(0)
        return
      }
      
      let _gasFee = 0
      if (type == 'deposit') {
        _gasFee = await getGasDeposit(parseEther(inputAmount), collaterals)
      } else if (type == 'withdraw') {
        _gasFee = await getGasWithdraw(parseEther(inputAmount), collaterals)
      }
      setGasFee(_gasFee!)
    }

    getGasFee(type)
  }, [type, inputAmount])

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
        {(type == 'withdraw' || type == 'deposit') && (
          <Box id={`stability-modal-${type}`} p={6} position='relative'>
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
              type={`stability-${type}`}
              asset='trenUSD'
              available={availableBalance}
            />
            <TransactionOverView collateral='trenUSD' type={type} amount={inputAmount} gasFee={gasFee} poolBalance={withdrawAvailable} poolVolume={totalDebtTokenDeposits} />
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
              {
                (isPending || isConfirming) && 
                <CircularProgress color='primary' sx={{mr: 4, height: '20px !important', width: '20px !important'}} />
              }
              {getButtonLabel(type)}
            </Button>
          </Box>
        )}
      </Dialog>
    </Fragment>
  )
}
