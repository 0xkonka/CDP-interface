// React imports
import React, { useEffect, useMemo, useState } from 'react'

// Next.js imports
import { useRouter } from 'next/router'
import Image from 'next/image'

// MUI imports and hooks
import { Box, Typography, Button, Grid, Theme, useTheme, Stack, Link } from '@mui/material'

// Core Components Imports
import Icon from '@/@core/components/icon'

// Styled Component Import
import CleaveWrapper from '@/@core/styles/libs/react-cleave'

// CleaveJS for input formatting
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'

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
import { erc20Abi, formatEther, formatUnits } from 'viem'
import { BORROWER_OPERATIONS } from '@/configs/address'

interface userModuleInfoType {
  userCollateralBal: bigint
  userAvailableBorrowAmount: number
}

const Borrow = () => {
  const router = useRouter()
  const theme: Theme = useTheme()

  const [open, setOpen] = useState<boolean>(false)
  const [type, setType] = useState<string>('withdraw')
  const { radiusBoxStyle } = useGlobalValues()
  const [ableToApprove, setAbleToApprove] = useState(false)
  const [depositInputError, setDepositInputError] = useState('')
  const [borrowInputError, setBorrowInputError] = useState('')
  const [userModuleInfo, setUserModuleInfo] = useState<userModuleInfoType>({
    userCollateralBal: BigInt(0),
    userAvailableBorrowAmount: 0
  })
  const [depositAmount, setDepositAmount] = useState('')
  const [borrowAmount, setBorrowAmount] = useState('')

  let { collateral } = router.query

  if (Array.isArray(collateral)) {
    collateral = collateral.join(' / ')
  }

  const { address: account } = useAccount()
  const chainId = useChainId()
  const { collateralDetails } = useProtocol()

  const collateralDetail = useMemo(
    () => collateralDetails.find(i => i.symbol === collateral),
    [collateral, collateralDetails]
  )
  
  const { data: allowance } = useReadContract({
    address: collateralDetail?.address as '0x{string}',
    abi: erc20Abi,
    functionName: 'allowance',
    args: [account as '0x${string}', BORROWER_OPERATIONS[chainId] as '0x${string}']
  })


  // if(!collateralDetail || collateralDetails.length === 0) return <div>Loading collateral detail...</div>   
  console.log("MY COllateral Detail, ", collateralDetail)
  const { address, decimals = 18, liquidation, price = BigInt(0), LTV = BigInt(0) } = collateralDetail || {}

  const minDeposit = parseFloat((200 / +formatUnits(price, decimals!) / +formatEther(LTV)).toFixed(2)) // Minium collater deposit input
  const minBorrow = 200

  const { moduleInfo } = useModuleView(collateral!)

  const {
    debt: debtAmount = BigInt(0),
    coll: depositedAmount = BigInt(0),
  } = moduleInfo || {}

  // if(!debtAmount || !depositedAmount) return <div>Loading user module detail...</div>
  // console.log('MY MODULE INFO:', debtAmount, depositedAmount)
  
  useEffect(() => {
    if (!account || !address) return
    const getUserInfo = async () => {
      const _userCollateralBal = await getBalance(wagmiConfig, {
        address: account as '0x${string}',
        token: address as '0x${string}'
      })

      setUserModuleInfo(prevState => ({
        ...prevState,
        userCollateralBal: _userCollateralBal.value
      }))
    }
    getUserInfo()
  }, [account, address])

  useEffect(() => {
    const _depositAmount = removeComma(depositAmount)
    if (price && LTV && +_depositAmount > 0) {
      const userAvailableBorrowAmount = +formatEther(price) * +_depositAmount * +formatEther(LTV)
      setUserModuleInfo(prevState => ({ ...prevState, userAvailableBorrowAmount }))
    }
  }, [depositAmount, LTV, price])

  useEffect(() => {
    if(depositAmount != '') {
        if(+removeComma(depositAmount) > +formatUnits(userModuleInfo.userCollateralBal, decimals!)) {
            setDepositInputError(`Insufficient ${collateral} balance.`)
        } else if(+removeComma(depositAmount) < minDeposit) {
            setDepositInputError(`Minimum deposit amount is ${minDeposit} ${collateral}.`)
        } else {
            setDepositInputError('')
        }
        
    }
    if(borrowAmount != '') {
        if(+removeComma(borrowAmount) > userModuleInfo.userAvailableBorrowAmount) {
            setBorrowInputError(`Available balance is ${formatToThousands(userModuleInfo.userAvailableBorrowAmount)} trenUSD.`)
        } else if(+removeComma(borrowAmount) < minBorrow) {
            setBorrowInputError(`Minimum borrow amount is ${minBorrow} trenUSD.`)
        } else {
            setBorrowInputError('')
        }
    }
    setAbleToApprove(depositAmount != '' && borrowAmount != '' && depositInputError == '' && borrowInputError == '')
  }, [depositAmount, borrowAmount, userModuleInfo])

  useEffect(() => {
    setAbleToApprove(depositAmount != '' && borrowAmount != '' && depositInputError == '' && borrowInputError == '')
  }, [depositInputError, borrowInputError])

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
          <Box sx={radiusBoxStyle}>
            <Typography variant='subtitle1' sx={{ mb: 4, fontWeight: 600 }}>
              Deposit
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <Stack direction='row' sx={{ alignItems: 'center', mb: 2 }}>
                  <img
                    src={`/images/tokens/${collateral?.replace(/\s+/g, '').replace(/\//g, '-')}.png`}
                    alt='LinkedIn'
                    height={42}
                    style={{ marginRight: 10 }}
                  />
                  {collateral}
                </Stack>
                <Typography variant='body1' color='#707175'>
                  {collateral}
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <Stack direction='row' sx={{ justifyContent: 'end', alignItems: 'center', mb: 1 }}>
                  <Typography variant='body2' color='#707175'>
                    Available:
                  </Typography>
                  <Typography variant='body2' sx={{ ml: 1 }}>
                    {formatToThousands(+formatUnits(userModuleInfo.userCollateralBal, decimals!))} {collateral}
                  </Typography>
                </Stack>
                <CleaveWrapper style={{ position: 'relative' }}>
                  <Cleave
                    id='collateral-assets-amount'
                    placeholder='0.00'
                    options={{
                      numeral: true,
                      numeralThousandsGroupStyle: 'thousand',
                      numeralDecimalScale: 2, // Always show two decimal points
                      numeralDecimalMark: '.', // Decimal mark is a period
                      stripLeadingZeroes: false // Prevents stripping the leading zero before the decimal point
                    }}
                    style={{ paddingRight: 50 }}
                    value={depositAmount}
                    onChange={e => setDepositAmount(e.target.value)}
                    autoComplete='off'
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      right: 10,
                      top: 10,
                      cursor: 'pointer',
                      borderLeft: 'solid 1px #12201F',
                      fontSize: 12,
                      pl: 1,
                      color: theme.palette.primary.main
                    }}
                    onClick={() => {
                      setDepositAmount(formatUnits(userModuleInfo.userCollateralBal, decimals!))
                    }}
                  >
                    MAX
                  </Box>
                </CleaveWrapper>
                <Stack direction='row' justifyContent='space-between' mt={1}>
                    <Stack direction='row' gap={1} alignItems='center'>
                        <img style={{marginLeft: 8}} src='/images/icons/customized-icons/approximate-icon.png' height='fit-content'/>
                        <Typography variant='subtitle2' fontWeight={400} sx={{opacity: 0.5}} color='white'>
                          {formatToThousands(price ? +removeComma(depositAmount) * +formatUnits(price, decimals!) : 1)}
                        </Typography>
                    </Stack>
                    <Typography variant='subtitle2' color='white' fontWeight={300} textAlign='end'>{depositInputError}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>
          <Box sx={radiusBoxStyle}>
            <Typography variant='subtitle1' sx={{ mb: 4, fontWeight: 600 }}>
              Borrow
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <Stack direction='row' sx={{ alignItems: 'center', mb: 2 }}>
                  <Image
                    src={`/images/tokens/trenUSD.png`}
                    alt='LinkedIn'
                    width={32}
                    height={32}
                    style={{ borderRadius: '100%', marginRight: 24 }}
                  />
                  <Typography variant='body1'>trenUSD</Typography>
                </Stack>
                <Typography variant='body1' color='#707175'>
                  Tren Finance USD
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <Stack direction='row' sx={{ justifyContent: 'end', alignItems: 'center', mb: 1 }}>
                  <Typography variant='body2' color='#707175'>
                    Available:
                  </Typography>
                  <Typography variant='body2' sx={{ ml: 1 }}>
                    {formatToThousands(userModuleInfo.userAvailableBorrowAmount)} trenUSD
                  </Typography>
                </Stack>
                <CleaveWrapper style={{ position: 'relative' }}>
                  <Cleave
                    id='tren-usd-amount'
                    placeholder='0.00'
                    options={{
                      numeral: true,
                      numeralThousandsGroupStyle: 'thousand',
                      numeralDecimalScale: 2, // Always show two decimal points
                      numeralDecimalMark: '.', // Decimal mark is a period
                      stripLeadingZeroes: false // Prevents stripping the leading zero before the decimal point
                    }}
                    value={borrowAmount}
                    onChange={e => setBorrowAmount(e.target.value)}
                    autoComplete='off'
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      right: 10,
                      top: 10,
                      cursor: 'pointer',
                      borderLeft: 'solid 1px #12201F',
                      fontSize: 12,
                      pl: 1,
                      color: theme.palette.primary.main
                    }}
                    onClick={() => {
                      setBorrowAmount(userModuleInfo.userAvailableBorrowAmount.toString())
                    }}
                  >
                    MAX
                  </Box>
                </CleaveWrapper>
                <Stack direction='row' justifyContent='space-between' mt={1}>
                    <Stack direction='row' gap={1} alignItems='center'>
                        <img style={{marginLeft: 8}} src='/images/icons/customized-icons/approximate-icon.png' height='fit-content'/>
                        <Typography variant='subtitle2' fontWeight={400} sx={{opacity: 0.5}} color='white'>
                          {formatToThousands(+removeComma(borrowAmount))}
                        </Typography>
                    </Stack>
                    <Typography variant='subtitle2' color='white' fontWeight={300} textAlign='end'>{borrowInputError}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Stack sx={{ ...radiusBoxStyle, height: 1, mb: 10, justifyContent: 'center' }}>
            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
              {
                ((decimals && depositedAmount != undefined && +formatUnits(depositedAmount, decimals) != 0) ||
                (decimals && debtAmount != undefined && +formatUnits(debtAmount, decimals) != 0)) &&
                <Grid container sx={{ height: '100%' }}>
                  <Grid
                    item
                    xs={12}
                    md={6}
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
                          {decimals && depositedAmount ? +formatUnits(depositedAmount, decimals) : 0}
                        </Typography>
                        <Typography variant='subtitle2' sx={{ color: '#707175', textAlign: 'end' }}>
                          $
                          {decimals && depositedAmount
                            ? +formatUnits(depositedAmount, decimals) * +formatEther(price!)
                            : 0}
                        </Typography>
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
                          {decimals && debtAmount ? +formatEther(debtAmount) : 0}
                        </Typography>
                        <Typography variant='subtitle2' sx={{ color: '#707175', textAlign: 'end' }}>
                          ${decimals && debtAmount ? +formatEther(debtAmount) : 0}
                        </Typography>
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
                ((decimals && depositedAmount != undefined && +formatUnits(depositedAmount, decimals) == 0) &&
                (decimals && debtAmount != undefined && +formatUnits(debtAmount, decimals) == 0)) &&
                <Typography variant='subtitle1' color='white' sx={{opacity: 0.2}}>
                      No open positions
                  </Typography>
              }  
            </Stack>
          </Stack>
          <Box sx={radiusBoxStyle}>
            <Grid container spacing={8}>
              <Grid item xs={12} lg={6}>
              
                {/* <HealthFactor safety={healthFactor || 1} /> */}
                <HealthFactor 
                  safety={(price && depositedAmount != undefined && decimals && liquidation && (+removeComma(depositAmount) + +formatUnits(depositedAmount, decimals)) != 0) ? (+formatEther(liquidation) / ((+formatUnits(debtAmount, decimals) + +removeComma(borrowAmount)) / (+formatUnits(price, decimals!) * (+removeComma(depositAmount) + +formatUnits(depositedAmount, decimals))))) : 0 }
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <BorrowingPower 
                  // percent={(borrowingPower || 0) * 100} 
                  // max={maximumBorrowingPower ? +formatEther(maximumBorrowingPower!) : 0} 
                  percent={(price && depositedAmount != undefined  && decimals && (+removeComma(depositAmount) + +formatUnits(depositedAmount, decimals)) != 0 && liquidation) ? ((+formatUnits(debtAmount, decimals) + +removeComma(borrowAmount)) / (+formatUnits(price, decimals!) * (+removeComma(depositAmount) + +formatUnits(depositedAmount, decimals)))) * 100 /  +formatEther(LTV) : 0}
                  max={(price && depositedAmount != undefined && decimals) ? +formatUnits(price, decimals!) * (+removeComma(depositAmount) + +formatUnits(depositedAmount, decimals)) * +formatEther(LTV) : 0}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Box sx={radiusBoxStyle}>
        <Result
          // liquidationPrice={liquidationPrice || 0}
          liquidationPrice={liquidation ? (+formatUnits(debtAmount, decimals) + +removeComma(borrowAmount)) / (+formatUnits(price, decimals!) * +formatEther(liquidation)) : 0}
          // ltv={debtAmount && collUSD ? +formatUnits(debtAmount, decimals) / Number(collUSD) : 0}
          ltv={(price && depositedAmount != undefined && decimals) ? (+formatUnits(debtAmount, decimals) + +removeComma(borrowAmount)) / (+formatUnits(price, decimals!) * (+removeComma(depositAmount) + +formatUnits(depositedAmount, decimals))) * 100 : 0}
          collateralValue={(price && depositedAmount != undefined && decimals) ? +formatUnits(price, decimals!) * (+removeComma(depositAmount) + +formatUnits(depositedAmount, decimals)) : 0}
          loanValue={+formatUnits(debtAmount, decimals) + +removeComma(borrowAmount)}
        />
      </Box>
      <Stack direction='row' sx={{ justifyContent: 'center', py: 8 }}>
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
          Approve
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
          userCollateralBal={userModuleInfo.userCollateralBal}
          depositAmount={depositAmount}
          borrowAmount={borrowAmount}
        />
      )}
    </Box>
  )
}

export default Borrow
