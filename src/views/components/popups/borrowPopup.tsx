// React imports
import React, { Fragment, useState, Ref, forwardRef, ReactElement, useEffect, useMemo, useCallback } from 'react'

// MUI components
import { Dialog, SlideProps, Slide, Box, Typography, Button, Theme, useTheme, Stack, CircularProgress } from '@mui/material'

// Core Components Imports
import Icon from '@/@core/components/icon'
import { TransactionOverView } from '../modules/transactionOverview'
import { ApproveDetailView } from '../modules/approveDetailView'
import { AmountForm } from '../modules/amountForm'
import { showToast } from '@/hooks/toasts'
import { BaseError, useAccount, useChainId, useReadContract } from 'wagmi'
import { getBalance } from '@wagmi/core'
import { wagmiConfig } from '@/pages/_app'
import { erc20Abi, formatEther, formatUnits } from 'viem'
import { formatToThousands, removeComma } from '@/hooks/utils'
import { parseEther, parseUnits } from 'viem'
import useModules from '@/context/ModuleProvider/useModules'
import { CollateralParams } from '@/context/ModuleProvider/type'
import { useModuleView } from '@/context/ModuleProvider/useModuleView'
import { BORROWER_OPERATIONS, DEBT_TOKEN, ETHERSCAN_BASE_URL } from '@/configs/address'
import { truncateFloating } from '@/hooks/utils'

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
  reloadBalance: () => void
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
    // allowance,
    collateral,
    collateralDetail,
    userCollateralBal,
    reloadBalance
  } = props
  const { address: account } = useAccount()
  const chainId = useChainId()
  const { decimals, liquidation, price = BigInt(0), debtTokenGasCompensation = BigInt(0), LTV = BigInt(0), borrowingFee = BigInt(0)} = collateralDetail

  // Get Allowance
  const { data: allowance, refetch: refetchBalance } = useReadContract({
    address: collateralDetail?.address as '0x{string}',
    abi: erc20Abi,
    functionName: 'allowance',
    args: [account as '0x${string}', BORROWER_OPERATIONS[chainId] as '0x${string}']
  })
  

  const theme: Theme = useTheme()

  const formattedAllowance = +formatUnits(allowance!, decimals)
  const formattedDepositAmount = removeComma(depositAmount!)
  const formattedBorrowAmount = removeComma(borrowAmount!)

  const {
    handleApprove,
    getGasApprove,
    handleOpen,
    getGasOpen,
    handleAdjust,
    getGasAdjust,
    handleDeposit,
    getGasDeposit,
    handleWithdraw,
    getGasWithdraw,
    handleBorrow,
    getGasBorrow,
    handleRepay,
    getGasRepay,
    txhash,
    isPending,
    isConfirming,
    isConfirmed,
    error
  } = useModules(collateral)
  
  const { view: moduleView, moduleInfo } = useModuleView(collateral)
  let { debt: debtAmount = BigInt(0), coll: depositedAmount = BigInt(0) } = moduleInfo || {}
  
  // Minus Gas compensation from trenBox Debt  @Alex R
  if(debtAmount > debtTokenGasCompensation)
    debtAmount -= debtTokenGasCompensation

  const [useWalletBalance, setUseWalletBalance] = useState(true)
  const [inputAmount, setInputAmount] = useState('')
  const [availableBalance, setAvailableBalance] = useState(0)
  const [walletDebtAmount, setWalletDebtAmount] = useState(0)
  const [gasFee, setGasFee] = useState<number>(0)

  const initializePopupStates = () => {
    if(isPending || isConfirming)
      return
    setOpen(false)
    setInputAmount('')
  }
  useEffect(() => {
    switch (type) {
      case 'deposit':
        setAvailableBalance(truncateFloating(+formatUnits(userCollateralBal, decimals), 5))
        break
      case 'withdraw':
        setAvailableBalance(truncateFloating(+formatEther(depositedAmount) - (+formatEther(debtAmount + debtTokenGasCompensation) / +formatEther(LTV) / +formatEther(price)), 5))
        break
      case 'borrow':
        setAvailableBalance(truncateFloating((+formatEther(depositedAmount) * +formatEther(price) * +formatEther(LTV) - +formatEther(debtTokenGasCompensation) - +formatEther(debtAmount)) / (1 + +formatEther(borrowingFee)), 5))
        break
      case 'repay':
        setAvailableBalance(truncateFloating(+walletDebtAmount, 5))
        break
    }
  }, [type, decimals, userCollateralBal, depositedAmount, debtAmount])
  
  useEffect(() => {
    if (!account) return
    const getUserInfo = async () => {
      const _userDebtBal = await getBalance(wagmiConfig, {
        address: account as '0x${string}',
        token: DEBT_TOKEN[chainId] as '0x{string}'
      })
      setWalletDebtAmount(+formatEther(_userDebtBal.value))
    }
    getUserInfo()
  }, [account])

  useEffect(() => {
    if (isConfirmed && !isPending) {
      switch (type) {
        case 'openOrAdjust':
          if(formattedAllowance < +formattedDepositAmount) {
            refetchBalance()
            showToast('success', 'Approve Success', 'You have successfully approved collateral.', 50000)
          } else {
            initializePopupStates()
            reloadBalance()
            showToast(
              'success',
              'Borrow Success',
              `You have successfully deposited ${formatToThousands(+depositAmount!, 2).substring(1)} ${collateral} and borrowed ${formatToThousands(+borrowAmount!).substring(1)} trenUSD.`,
              30000,
              `${ETHERSCAN_BASE_URL}/tx/${txhash}`
            )
          }
          break
        case 'deposit':
          initializePopupStates()
          reloadBalance()
          showToast(
            'success', 
            'Deposit Success', 
            `You have successfully deposited ${formatToThousands(+inputAmount!, 2).substring(1)} ${collateral}`, 
            30000,
            `${ETHERSCAN_BASE_URL}/tx/${txhash}`
          )
          break
        case 'borrow':
          initializePopupStates()
          reloadBalance()
          showToast(
            'success', 
            'Borrow Success', 
            `You have successfully borrowed ${formatToThousands(+inputAmount!, 2).substring(1)} trenUSD`, 
            30000,
            `${ETHERSCAN_BASE_URL}/tx/${txhash}`
          )
          break
        case 'withdraw':
          initializePopupStates()
          reloadBalance()
          showToast(
            'success',
            'Withdraw Success',
            `You have successfully withdrawn ${formatToThousands(+inputAmount!, 2).substring(1)} ${collateral}`,
            30000,
            `${ETHERSCAN_BASE_URL}/tx/${txhash}`
          )
          break
        case 'repay':
          if(+inputAmount < +formatEther(debtAmount)) {
            showToast(
              'success', 
              'Repay Success', 
              `You have successfully repaid ${formatToThousands(+inputAmount!, 2).substring(1)} trenUSD`, 
              30000,
              `${ETHERSCAN_BASE_URL}/tx/${txhash}`
            )
          } else {
            showToast(
              'success', 
              'Close Success', 
              `You have successfully closed the module`, 
              30000,
              `${ETHERSCAN_BASE_URL}/tx/${txhash}`,
            )
          }
          initializePopupStates()
          reloadBalance()
          
          break
      }
    }
  }, [isConfirmed, isPending, inputAmount, depositAmount, borrowAmount, collateral, txhash, type])

  useEffect(() => {
    if (error) showToast('error', 'Error', (error as BaseError).shortMessage || error.message, 50000)
  }, [error])

  const handleSubmit = () => {
    if (!collateralDetail) return
    if (type != 'openOrAdjust' && (+inputAmount > availableBalance || +inputAmount == 0)) return

    if (type === 'openOrAdjust') {
      try {
        if (+formattedAllowance < +removeComma(depositAmount!)) {
          // In case Approve amount is less than deposit amount , Should be approved first
          handleApprove(parseUnits(formattedDepositAmount, decimals))
        } else if (moduleView === 'ACTIVE') {
          if (!collateralDetail) return
          handleAdjust(parseEther(formattedDepositAmount), parseEther(formattedBorrowAmount))
        } else {
          if (!collateralDetail) return
          handleOpen(parseEther(formattedDepositAmount), parseEther(formattedBorrowAmount))
        }
      } catch (err) {
        console.log('err', err)
      }
    } else if (type == 'deposit') {
      if (+formattedAllowance < +removeComma(depositAmount!)) {
        // In case Approve amount is less than deposit amount , Should be approved first
        handleApprove(parseUnits(inputAmount, decimals))
      } else if (moduleView === 'ACTIVE') {
        handleDeposit(parseEther(inputAmount))
      }
    } else if (type == 'withdraw') {
      handleWithdraw(parseEther(inputAmount))
    } else if (type === 'borrow') {
      handleBorrow(parseEther(inputAmount))
    } else if (type == 'repay') {
      if(+inputAmount < +formatEther(debtAmount)) {
        handleRepay(parseEther(inputAmount))
      } else {
        handleRepay(debtAmount)
      }
    }
  }

  useEffect(() => {
    if (!collateralDetail) return
    if (type != 'openOrAdjust' && (+inputAmount > availableBalance || +inputAmount == 0)) {
      setGasFee(0)
      return
    }

    const getGasFee = async (type:string) => {
      let _gasFee = 0
      if(type == 'openOrAdjust') {
        if (+formattedAllowance < +removeComma(depositAmount!)) {
          _gasFee = await getGasApprove(parseUnits(formattedDepositAmount, decimals))
        } else if (moduleView === 'ACTIVE') {
          _gasFee =  await getGasAdjust(parseEther(formattedDepositAmount), parseEther(formattedBorrowAmount))
        } else {
          _gasFee = await getGasOpen(parseEther(formattedDepositAmount), parseEther(formattedBorrowAmount))
        }
      } else if(type == 'deposit') {
        if (+formattedAllowance < +removeComma(depositAmount!)) {
          _gasFee =  await getGasApprove(parseUnits(inputAmount, decimals))
        } else if (moduleView === 'ACTIVE') {
          _gasFee =  await getGasDeposit(parseEther(inputAmount))
        }
      } else if(type == 'withdraw') {
        _gasFee =  await getGasWithdraw(parseEther(inputAmount))
      } else if(type == 'borrow') {
        _gasFee =  await getGasBorrow(parseEther(inputAmount))
      } else if(type == 'repay') {
        if(+inputAmount < +formatEther(debtAmount)) {
          _gasFee =  await getGasRepay(parseEther(inputAmount))
        } else {
          _gasFee =  await getGasRepay(debtAmount)
        }
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
              disabled={isPending || isConfirming}
            />
            <TransactionOverView collateral={collateralDetail.symbol} type={type} amount={inputAmount} gasFee={gasFee} />
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
            <TransactionOverView collateral={collateralDetail.symbol} type={type} amount={inputAmount} gasFee={gasFee} uptoFee={34.21} depositAmount={depositAmount} borrowAmount={borrowAmount}/>
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
              disabled={isPending || isConfirming}
            >
              {
                (isPending || isConfirming) && 
                <CircularProgress color='primary' sx={{mr: 4, height: '20px !important', width: '20px !important'}} />
              }
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
            <AmountForm 
              amount={inputAmount} 
              setAmount={setInputAmount} 
              type={type} 
              asset='trenUSD' 
              available={availableBalance} 
              debtAmount={debtAmount}
              disabled={isPending || isConfirming}
            />
            <TransactionOverView
              collateral={collateralDetail.symbol}
              type={type}
              gasFee={gasFee}
              amount={inputAmount}
              closeModule={+inputAmount >= +formatEther(debtAmount)}
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
              {
                (isPending || isConfirming) && 
                <CircularProgress color='primary' sx={{mr: 4, height: '20px !important', width: '20px !important'}} />
              }
              {+inputAmount >= +formatEther(debtAmount) ? 'Close Module' : 'Repay'}
            </Button>
          </Box>
        )}
        {/* <Typography>{error}</Typography> */}
      </Dialog>
    </Fragment>
  )
}
