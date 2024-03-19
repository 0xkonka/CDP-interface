// React imports
import React, { useEffect, useMemo, useState } from 'react'

// Next.js imports
import { useRouter } from 'next/router'
import Image from 'next/image'

// MUI imports and hooks
import { Box, Typography, Button, Grid, Theme, useTheme, Stack, Link } from '@mui/material'

// Core Components Imports
import Icon from '@/@core/components/icon'

// Context imports
import { useGlobalValues } from '@/context/GlobalContext'
import { ModuleOverView } from '@/views/components/modules/moduleOverView'
import { Switcher } from '@/views/components/modules/switcher'
import { HealthFactor } from '@/views/components/modules/healthFactor'
import { BorrowingPower } from '@/views/components/modules/borrowingPower'
import { Result } from '@/views/components/modules/result'
import { BorrowPopup } from '@/views/components/modules/borrowPopup'
import { useProtocol } from '@/context/ProtocolProvider/ProtocolContext'
import { getBalance } from '@wagmi/core'
import { wagmiConfig } from '@/pages/_app'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { formatToThousands, removeComma } from '@/hooks/utils'
import { useModuleView } from '@/context/ModuleProvider/useModuleView'
import { erc20Abi, formatEther, formatUnits, parseUnits } from 'viem'
import { BORROWER_OPERATIONS } from '@/configs/address'
import { Loader } from '@/views/components/Loader'
import { AmountForm } from '@/views/components/modules/amountForm'

interface userModuleInfoType {
  userTotalCollateralAmount: number
  userAvailableBorrowAmount: number
  minDepositAmount: number
  minBorrowAmount: number
}

const Borrow = () => {
  const router = useRouter()
  const theme: Theme = useTheme()
  // Get collateral name from router
  let { collateral } = router.query
  if (Array.isArray(collateral)) {
    collateral = collateral.join(' / ')
  }
  // Modal Props
  const [open, setOpen] = useState<boolean>(false)
  const [type, setType] = useState<string>('withdraw')
  const { radiusBoxStyle } = useGlobalValues()
  // Validation status for deposit/borrow
  const [ableToApprove, setAbleToApprove] = useState(false)
  const [depositInputError, setDepositInputError] = useState('')
  const [borrowInputError, setBorrowInputError] = useState('')
  // User balance, deposit, borrow amount
  const [userModuleInfo, setUserModuleInfo] = useState<userModuleInfoType>({
    userTotalCollateralAmount: 0,
    userAvailableBorrowAmount: 0,
    minDepositAmount: 0,
    minBorrowAmount: 0,
  })
  const [depositAmount, setDepositAmount] = useState('')
  const [borrowAmount, setBorrowAmount] = useState('')

  // Hook data fetching
  const { address: account, isConnected } = useAccount()
  
  // === Get Collateral Detail === //
  const { collateralDetails } = useProtocol()
  const collateralDetail = useMemo(
    () => collateralDetails.find(i => i.symbol === collateral),
    [collateral, collateralDetails]
  )
  const { address = '', decimals = 18, liquidation = BigInt(1), price = BigInt(0), LTV = BigInt(1), minNetDebt = BigInt(0) } = collateralDetail || {}

  // === User Trove management === //
  const { moduleInfo } = useModuleView(collateral!)
  const {
    debt: debtAmount = BigInt(0),
    coll: depositedAmount = BigInt(0),
    status: positionStatus = 'nonExistent'
  } = moduleInfo || {}
  
  // Get Allowance
  const chainId = useChainId()
  const { data: allowance } = useReadContract({
    address: collateralDetail?.address as '0x{string}',
    abi: erc20Abi,
    functionName: 'allowance',
    args: [account as '0x${string}', BORROWER_OPERATIONS[chainId] as '0x${string}']
  })
  
  // Calculate minimum deposit & borrow amount
  useEffect(() => {
    const _minBorrow = +formatEther(minNetDebt)
    const _minDeposit = parseFloat((_minBorrow / +formatUnits(price, decimals!) / +formatEther(LTV)).toFixed(2))

    setUserModuleInfo(prevState => ({
      ...prevState,
      minBorrowAmount: _minBorrow,
      minDepositAmount: _minDeposit
    }))
  }, [minNetDebt])

  // Setup user collateral value for state
  useEffect(() => {
    if (!account || !address) return
    const getUserInfo = async () => {
      const _userCollateralBal = await getBalance(wagmiConfig, {
        address: account as '0x${string}',
        token: address as '0x${string}'
      })
      setUserModuleInfo(prevState => ({
        ...prevState,
        userTotalCollateralAmount: +formatUnits(_userCollateralBal.value, decimals!)
      }))
    }
    getUserInfo()
  }, [account, address])


  // Adjust available borrowing amount regarding deposit amount
  useEffect(() => {
    const _depositAmount = removeComma(depositAmount)
    if (+_depositAmount > 0) {
      const userAvailableBorrowAmount = +formatEther(price) * +_depositAmount * +formatEther(LTV)
      setUserModuleInfo(prevState => ({ ...prevState, userAvailableBorrowAmount }))
    }
  }, [depositAmount])

  // Validation checking for deposit/borrow inputs
  useEffect(() => {
    if(depositAmount != '') {
        if(+removeComma(depositAmount) > userModuleInfo.userTotalCollateralAmount) {
            setDepositInputError(`Insufficient ${collateral} balance.`)
        } else if(+removeComma(depositAmount) < userModuleInfo.minDepositAmount) {
            setDepositInputError(`Minimum deposit amount is ${userModuleInfo.minDepositAmount} ${collateral}.`)
        } else {
            setDepositInputError('')
        }
    }
    if(borrowAmount != '') {
        if(+removeComma(borrowAmount) > userModuleInfo.userAvailableBorrowAmount) {
            setBorrowInputError(`Available balance is ${formatToThousands(userModuleInfo.userAvailableBorrowAmount)} trenUSD.`)
        } else if(+removeComma(borrowAmount) < userModuleInfo.minBorrowAmount) {
            setBorrowInputError(`Minimum borrow amount is ${userModuleInfo.minBorrowAmount} trenUSD.`)
        } else {
            setBorrowInputError('')
        }
    }
  }, [depositAmount, borrowAmount, userModuleInfo])

  // Aprove borrowing if there is no error.
  useEffect(() => {
    setAbleToApprove(depositAmount != '' && borrowAmount != '' && depositInputError == '' && borrowInputError == '')
  }, [depositAmount, borrowAmount, depositInputError, borrowInputError])

  // Calculation View
  const collateralValue = +formatUnits(price, decimals!) * (+removeComma(depositAmount) + +formatUnits(depositedAmount, decimals))
  const loanValue = +formatUnits(debtAmount, decimals) + +removeComma(borrowAmount)
  const currentLTV = (collateralValue == 0) ? 0 : (loanValue / collateralValue * 100)
  const totalCollateralQuantity = +removeComma(depositAmount) + +formatUnits(depositedAmount, decimals)
  const liquidationPrice = totalCollateralQuantity == 0 ? 0 : loanValue / (totalCollateralQuantity * +formatEther(liquidation))
  const healthFactor = (currentLTV == 0) ? 0 : (+formatEther(liquidation) / currentLTV * 100)
  const borrowingPowerPercent = currentLTV / +formatEther(LTV)
  const maxBorrowingValue = collateralValue * +formatEther(LTV)

  // Handle click for poups
  const handleClickApprove = () => {
    setOpen(true)
    setType('openOrAdjust')
  }
  const handleWithdraw = () => {
    setOpen(true)
    setType('withdraw')
  }
  const handleDepositMore = () => {
    setOpen(true)
    setType('deposit')
  }
  const handleBorrowMore = () => {
    setOpen(true)
    setType('borrow')
  }
  const handleRepay = () => {
    setOpen(true)
    setType('repay')
  }
  
  // if(!isConnected) return <Loader content='Please connect wallet to check your module....'/>
  if(!collateralDetail || collateralDetails.length === 0) return <Loader content='Loading collateral detail...'/>
  if(!moduleInfo) return <Loader content='Loading user module detail...'/>

  return (
    <Box>
      <Stack direction='row' sx={{ alignItems: 'center', width: 'fit-content', cursor: 'pointer', mb: 4 }}>
        <Icon fontSize='24' icon='basil:arrow-left-outline' style={{ color: theme.palette.primary.main }} />
        <Typography
          variant='body1'
          color='primary'
          sx={{ ml: 1 }}
          onClick={() => {
            router.push('/modules')
          }}
        >
          Go back to Pools
        </Typography>
      </Stack>
      <ModuleOverView collateral={collateral || ''} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Switcher page='borrow' collateral={collateral || ''} />
          <Stack direction='column-reverse'>
            <AmountForm amount={borrowAmount} setAmount={setBorrowAmount} type='borrow' asset='trenUSD' available={userModuleInfo.userAvailableBorrowAmount} showTooltip={false}/>
            <Stack direction='row' justifyContent='space-between' alignItems='center' mb={3}>
              <Typography variant='subtitle1' sx={{fontWeight: 600 }}>Borrow</Typography>
              <Typography variant='subtitle2' color='white' fontWeight={300} textAlign='end'>{borrowInputError}</Typography>
            </Stack>
            <AmountForm amount={depositAmount} setAmount={setDepositAmount} type='deposit' asset={collateral!} available={userModuleInfo.userTotalCollateralAmount} showTooltip={false}/>
            <Stack direction='row' justifyContent='space-between' alignItems='center' mb={3}>
              <Typography variant='subtitle1' sx={{fontWeight: 600 }}>Deposit</Typography>
              <Typography variant='subtitle2' color='white' fontWeight={300} textAlign='end'>{depositInputError}</Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Stack sx={{ ...radiusBoxStyle, height: 1, justifyContent: 'center' }}>
            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
              {
                positionStatus == 'active' &&
                <Grid container sx={{ height: '100%' }}>
                  <Grid item xs={12} md={6}
                    sx={{
                      pr: { xs: 0, md: 4 },
                      borderBottom: { xs: 'solid 1px #2D3131', md: 0 },
                      borderRight: { md: 'solid 1px #2D3131' }
                    }}
                  >
                    <Typography variant='subtitle1' sx={{ mb: 4, fontWeight: 600 }}>
                      Collateral
                    </Typography>
                    <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
                      <Stack direction='row' sx={{ alignItems: 'center' }}>
                        <img
                          src={`/images/tokens/${collateral?.replace(/\s+/g, '').replace(/\//g, '-')}.png`}
                          alt='LinkedIn'
                          height={42}
                          style={{ marginRight: 10 }}
                        />
                        {collateral}
                      </Stack>
                      <Box>
                        <Typography variant='subtitle1' sx={{ textAlign: 'end' }}>
                          {formatToThousands(+formatUnits(depositedAmount, decimals)).substring(1)}
                        </Typography>
                        <Stack direction='row' alignItems='center' gap={1}>
                          <img style={{marginLeft: 8}} src='/images/icons/customized-icons/approximate-icon.png' height='fit-content'/>
                          <Typography variant='subtitle2' sx={{ color: '#707175', textAlign: 'end' }}>
                            {formatToThousands(+formatUnits(depositedAmount, decimals) * +formatEther(price!))}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                    <Stack direction='row' sx={{ mt: { xs: 4, md: 12 }, mb: { xs: 4, md: 0 } }}>
                      <Button
                        sx={{
                          mr: { xs: 2, md: 4 },
                          color: 'white',
                          borderColor: '#6795DA'
                        }}
                        variant='outlined'
                        onClick={handleWithdraw}
                      >
                        Withdraw
                      </Button>
                      <Button
                        sx={{
                          color: 'white',
                          borderColor: '#67DAB1'
                        }}
                        variant='outlined'
                        onClick={handleDepositMore}
                      >
                        Deposit more
                      </Button>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ pl: { xs: 0, md: 4 }, pt: { xs: 4, md: 0 } }}>
                    <Typography variant='subtitle1' sx={{ mb: 4, fontWeight: 600 }}>
                      Debt
                    </Typography>
                    <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
                      <Stack direction='row' sx={{ alignItems: 'center' }}>
                        <Image
                          src={`/images/tokens/trenUSD.png`}
                          alt='LinkedIn'
                          width={32}
                          height={32}
                          style={{ borderRadius: '100%', marginRight: 10 }}
                        />
                        trenUSD
                      </Stack>
                      <Box>
                        <Typography variant='subtitle1' sx={{ textAlign: 'end' }}>
                          {formatToThousands(+formatEther(debtAmount)).substring(1)}
                        </Typography>
                        <Stack direction='row' alignItems='center' gap={1}>
                          <img style={{marginLeft: 8}} src='/images/icons/customized-icons/approximate-icon.png' height='fit-content'/>
                          <Typography variant='subtitle2' sx={{ color: '#707175', textAlign: 'end' }}>
                            {formatToThousands(+formatEther(debtAmount))}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                    <Stack direction='row' sx={{ mt: { xs: 4, md: 12 }, mb: { xs: 4, md: 0 } }}>
                      <Button
                        sx={{
                          mr: { xs: 2, md: 4 },
                          color: 'white',
                          borderColor: '#C6E0DC'
                        }}
                        variant='outlined'
                        onClick={handleBorrowMore}
                      >
                        Borrow more
                      </Button>
                      <Button
                        sx={{
                          color: 'white',
                          borderColor: '#C9A3FA'
                        }}
                        variant='outlined'
                        onClick={handleRepay}
                      >
                        Repay
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              }
              {
                positionStatus != 'active' &&
                <Typography variant='subtitle1' color='white' sx={{opacity: 0.2}}>
                  No open modules
                </Typography>
              }  
            </Stack>
          </Stack>
          <Box sx={radiusBoxStyle}>
            <Grid container spacing={8}>
              <Grid item xs={12} lg={6}>
                <HealthFactor 
                  safety={healthFactor}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <BorrowingPower 
                  percent={borrowingPowerPercent}
                  max={maxBorrowingValue}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{...radiusBoxStyle, pt: 6, pb: 6}} >
        <Result
          liquidationPrice={liquidationPrice}
          ltv={currentLTV}
          collateralValue={collateralValue}
          loanValue={loanValue}
        />
      </Box>
      <Stack direction='row' sx={{ justifyContent: 'center', py: 8}}>
        <Button
          sx={{
            ml: { xs: 2, sm: 2 },
            color: 'white',
            minWidth: 250,
            width: { xs: 1, sm: 'auto' }
          }}
          variant='outlined'
          onClick={handleClickApprove}
          disabled={!ableToApprove}
        >
          {positionStatus != 'active' ? 'Open Module' : 'Adjust Module'}
        </Button>
      </Stack>
      {collateralDetail && allowance !== undefined && (
        <BorrowPopup
          open={open}
          setOpen={setOpen}
          type={type}
          collateral={String(collateral)}
          collateralDetail={collateralDetail}
          allowance={allowance}
          userCollateralBal={parseUnits(userModuleInfo.userTotalCollateralAmount.toString(), decimals)}
          depositAmount={depositAmount}
          borrowAmount={borrowAmount}
        />
      )}
    </Box>
  )
}

export default Borrow
