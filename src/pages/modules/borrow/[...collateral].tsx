import { useRouter } from 'next/router'

// MUI imports
import {
  Box,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Grid,
  Dialog,
  Slide,
  SlideProps,
  useMediaQuery,
  Theme,
  useTheme,
  Stack,
  Link
} from '@mui/material'

// Import from Next
import Image from 'next/image'

// ** Core Components Imports
import Icon from '@/@core/components/icon'

// ** Styled Component
import CleaveWrapper from '@/@core/styles/libs/react-cleave'

// ** CleaveJS Imports
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'

// Import React Basic Func
import React, { forwardRef, Ref, ReactElement, useEffect, Fragment, useState } from 'react'
import { showToast } from '@/hooks/toasts'
import { LiquityStoreState } from '@/lib-base'
import { useProtocol } from '@/context/ProtocolContext'
import { useLiquitySelector } from '@/lib-react'

const labels = [
  {
    key: 'TVL',
    tooltip: 'Total value locked',
    value: '4.296M'
  },
  {
    key: 'trenUSD Available',
    tooltip: 'trenUSD available to borrow/total trenUSD allocated',
    value: '766.231K/800K'
  },
  {
    key: 'Utilization',
    tooltip: 'Total borrowed trenUSD/total trenUSD allocated',
    value: '84.86%'
  },
  {
    key: 'Max LTV',
    tooltip: 'Maximum loan-to-value',
    value: '75%'
  },
  {
    key: 'Interest',
    tooltip: 'Rate of debt accrual',
    value: '5%'
  },
  {
    key: 'Borrow Fee',
    tooltip: 'A one time fee paid upon opening a position Tooltip',
    value: '6.263%'
  },
  {
    key: 'Liquidation',
    tooltip: 'the LTV at which the position will be flagged for liquidation',
    value: '5%'
  },
  {
    key: 'Rate Type',
    tooltip: 'The interest rate used for the pool',
    value: 'Variable Rate'
  }
]

// export const getStaticProps: GetStaticProps = ({ params }: GetStaticPropsContext) => {
//     return {
//       props: {
//         collateral: params?.collateral
//       }
//     }
// }
const Transition = forwardRef(function Transition(
  props: SlideProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

const Borrow = () => {
  const router = useRouter()
  const theme: Theme = useTheme()
  const [borrowRate, setBorrowRate] = useState(0)
  const [openSummary, setOpenSummary] = useState<boolean>(false)
  const handleClickOpenSummary = () => setOpenSummary(true)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('lg'))
  let { collateral } = router.query

  const select = ({
    numberOfTroves,
    price,
    total,
    lusdInStabilityPool,
    borrowingRate,
    redemptionRate,

    frontend
  }: LiquityStoreState) => ({
    numberOfTroves,
    price,
    total,
    lusdInStabilityPool,
    borrowingRate,
    redemptionRate,
    kickbackRate: frontend.status === 'registered' ? frontend.kickbackRate : null
  })

  const {
    protocol: {
      connection: { version: contractsVersion, deploymentDate, frontendTag }
    }
  } = useProtocol()

  const { numberOfTroves, price, lusdInStabilityPool, total, borrowingRate, kickbackRate } = useLiquitySelector(select)

  console.log('numberOfTroves', numberOfTroves)
  console.log('total.collateral', +total.collateral + "ETH")
  console.log('ETH price', +price + "$")
  console.log('borrowingRate', +borrowingRate * 100 + "%")

  if (Array.isArray(collateral)) {
    collateral = collateral.join(' / ')
  }

  const radiusBoxStyle = {
    paddingLeft: isSmallScreen ? 3 : 6,
    paddingRight: isSmallScreen ? 3 : 6,
    paddingTop: 4,
    paddingBottom: 4,
    marginBottom: 4,
    border: 'solid 1px',
    borderRadius: 2.5,
    borderColor: theme.palette.secondary.dark,
    gap: 3
  }

  const smallBoxStyle = {
    width: '100vw',
    marginLeft: isSmallScreen ? -4 : -8,
    padding: 4,
    marginBottom: 4,
    borderBottom: 'solid 1px',
    borderTop: 'solid 1px',
    borderColor: theme.palette.secondary.dark,
    gap: 6,
    overflowX: 'scroll'
  }

  const computedStyle = isMediumScreen ? smallBoxStyle : radiusBoxStyle

  const handleCloseSummary = () => {
    setOpenSummary(false)
    showToast('success', 'Success', 'Transaction has been completed', 2000)
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
      <Stack
        direction='row'
        sx={{ ...computedStyle, flexWrap: isMediumScreen ? 'nowrap' : 'wrap', justifyContent: 'space-between' }}
      >
        {labels.map((label, index) => (
          <Stack key={index} sx={{ alignItems: 'center', gap: isSmallScreen ? 0 : 1 }}>
            <Typography
              variant='body1'
              color='#707175'
              sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}
            >
              {label.key}
              <Tooltip title={label.tooltip} placement='top'>
                <IconButton sx={{ bgcolor: 'transparent !important' }}>
                  <Icon
                    fontSize='14'
                    icon='simple-line-icons:question'
                    style={{ color: '#707175', cursor: 'pointer' }}
                  />
                </IconButton>
              </Tooltip>
            </Typography>
            <Typography variant='body1'>{label.value}</Typography>
          </Stack>
        ))}
      </Stack>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Stack
            direction={isMediumScreen ? 'column' : 'row'}
            sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 4, py: 4, mb: { xs: 4, lg: 0 } }}
          >
            <Stack
              direction='row'
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
                sx={{
                  borderRadius: 2,
                  px: 8,
                  py: 2.5,
                  fontSize: 16,
                  fontWeight: 400,
                  color: 'white',
                  width: 1 / 2,
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
              >
                Borrow
              </Button>
              <Button
                variant='outlined'
                onClick={() => router.push(`/modules/leverage/${collateral?.toString().trim().replace(/\s+/g, '')}`)}
                sx={{
                  borderRadius: 2,
                  px: 8,
                  py: 2.5,
                  fontSize: 16,
                  fontWeight: 400,
                  color: 'white',
                  width: 1 / 2,
                  border: 'solid 1px transparent',
                  '&:hover': {
                    borderColor: theme.palette.primary.main
                  }
                }}
              >
                Leverage
              </Button>
            </Stack>
            <Stack direction='row' style={{ alignItems: 'center' }} gap={3}>
              <Link href='' sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant='h5' color='primary' sx={{ fontWeight: 400 }}>
                  0x03B5...36Fa
                </Typography>
                <svg
                  style={{ marginLeft: 4, marginBottom: 4 }}
                  xmlns='http://www.w3.org/2000/svg'
                  width='12'
                  height='12'
                  viewBox='0 0 12 12'
                  fill='none'
                >
                  <g clipPath='url(#clip0_719_13657)'>
                    <path
                      d='M11.625 0.75V4.125C11.625 4.33228 11.4573 4.5 11.25 4.5C11.0427 4.5 10.875 4.33228 10.875 4.125V1.65525L5.51512 7.01513C5.44191 7.08834 5.34591 7.125 5.25 7.125C5.15409 7.125 5.05809 7.08834 4.98488 7.01513C4.95003 6.98032 4.92239 6.93899 4.90353 6.8935C4.88467 6.84801 4.87496 6.79925 4.87496 6.75C4.87496 6.70075 4.88467 6.65199 4.90353 6.6065C4.92239 6.56101 4.95003 6.51968 4.98488 6.48487L10.3448 1.125H7.875C7.66772 1.125 7.5 0.957281 7.5 0.75C7.5 0.542719 7.66772 0.375 7.875 0.375H11.25C11.4573 0.375 11.625 0.542719 11.625 0.75ZM10.125 10.5V6C10.125 5.79272 9.95728 5.625 9.75 5.625C9.54272 5.625 9.375 5.79272 9.375 6V10.5C9.375 10.7069 9.20691 10.875 9 10.875H1.5C1.29309 10.875 1.125 10.7069 1.125 10.5V3C1.125 2.79309 1.29309 2.625 1.5 2.625H6C6.20728 2.625 6.375 2.45728 6.375 2.25C6.375 2.04272 6.20728 1.875 6 1.875H1.5C0.879656 1.875 0.375 2.37966 0.375 3V10.5C0.375 11.1203 0.879656 11.625 1.5 11.625H9C9.62034 11.625 10.125 11.1203 10.125 10.5Z'
                      fill='#67DAB1'
                    />
                  </g>
                  <defs>
                    <clipPath id='clip0_719_13657'>
                      <rect width='12' height='12' fill='white' />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
              <Icon icon='tabler:copy' style={{ cursor: 'pointer' }} fontSize={22} />
              <Icon icon='iconoir:refresh' style={{ cursor: 'pointer' }} fontSize={18} />
              <Icon icon='tabler:settings' style={{ cursor: 'pointer' }} fontSize={22} />
            </Stack>
          </Stack>
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
                    8,9B {collateral}
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
                  >
                    MAX
                  </Box>
                </CleaveWrapper>
                <Typography variant='body1' sx={{ ml: 3, opacity: 0.5 }}>
                  = $0.0
                </Typography>
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
                    8,9B trenUSD
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
                  >
                    MAX
                  </Box>
                </CleaveWrapper>
                <Typography variant='body1' sx={{ ml: 3, opacity: 0.5 }}>
                  = $0.0
                </Typography>
              </Grid>
            </Grid>
          </Box>
          {/* <Box sx={{display: 'flex', alignItems: 'center', gap: 4, py: 4}}>
                    <CustomTextField
                        sx={{width: 100}}
                        placeholder='Custom'
                        value={borrowRate != 0 ? borrowRate : ''}
                        onChange={(event:React.ChangeEvent<HTMLInputElement>)=>{setBorrowRate(Number(event.target.value))}}
                    />
                    <Box sx={{width: '100%'}}>
                        <Slider aria-labelledby='continuous-slider' 
                                valueLabelDisplay='on'
                                value={borrowRate}
                                valueLabelFormat={(value)=>{return `${value}%`}}
                                onChange={(event:any)=>{setBorrowRate(event.target.value)}}/>
                        <Box sx={{display:'flex', justifyContent: 'space-between'}}>
                            <Typography variant='subtitle2' color='#707175' sx={{mt: '-10px'}}>
                                0%
                            </Typography>
                            <Typography variant='subtitle2' color='#707175' sx={{mt: '-10px'}}>
                                100%
                            </Typography>
                        </Box>
                    </Box>
                </Box> */}
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Stack sx={{ ...radiusBoxStyle, height: 1, mb: 10, justifyContent: 'center' }}>
            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
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
                        20,000.00
                      </Typography>
                      <Typography variant='subtitle2' sx={{ color: '#707175', textAlign: 'end' }}>
                        = $20,000.00
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
                    >
                      Withdraw
                    </Button>
                    <Button
                      sx={{
                        color: 'white',
                        borderColor: '#67DAB1'
                      }}
                      variant='outlined'
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
                        20,000.00
                      </Typography>
                      <Typography variant='subtitle2' sx={{ color: '#707175', textAlign: 'end' }}>
                        = $20,000.00
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
                    >
                      Borrow more
                    </Button>
                    <Button
                      sx={{
                        color: 'white',
                        borderColor: '#C9A3FA'
                      }}
                      variant='outlined'
                    >
                      Repay
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
              {/* <Typography variant='body1' color='#707175'>
                            No open positions
                        </Typography> */}
            </Stack>
          </Stack>
          <Box sx={radiusBoxStyle}>
            <Grid container spacing={8}>
              <Grid item xs={12} lg={6}>
                <Stack direction='row' sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='subtitle1'>Health factor</Typography>
                  <Typography variant='subtitle1'>—</Typography>
                </Stack>
                <Box className='gradientProgress'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 16 16'
                    fill='none'
                    style={{ marginLeft: -8 }}
                  >
                    <path
                      d='M13.7302 5.07458C13.6912 4.98206 13.6006 4.92188 13.5 4.92188L2.50002 4.922C2.39956 4.922 2.30886 4.98218 2.26968 5.07471C2.23061 5.16724 2.25076 5.27429 2.32082 5.34631L7.82082 11.0032C7.86782 11.0515 7.93252 11.0789 8.00002 11.0789C8.06753 11.0789 8.13223 11.0515 8.17922 11.0032L13.6792 5.34619C13.7493 5.27405 13.7693 5.16711 13.7302 5.07458Z'
                      fill='white'
                    />
                  </svg>
                  <Box
                    sx={{
                      width: '100%',
                      height: 6,
                      mb: 2,
                      borderRadius: 8,
                      background: 'linear-gradient(270deg, #00D084 0%, #FF9C19 54.06%, #FF5876 100.77%)'
                    }}
                  />
                </Box>
                <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
                  <Typography variant='subtitle2' color='#707175'>
                    Safe
                  </Typography>
                  <Typography variant='subtitle2' color='#707175'>
                    Risky
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Stack direction='row' sx={{ mb: 2, justifyContent: 'space-between' }}>
                  <Typography variant='subtitle1'>Borrowing power used</Typography>
                  <Typography variant='subtitle1'>—</Typography>
                </Stack>
                <Box
                  sx={{
                    mt: '30px',
                    width: '100%',
                    height: 6,
                    mb: 2,
                    borderRadius: 8,
                    background: '#141819'
                  }}
                >
                  <Box
                    sx={{
                      width: '60%',
                      height: 6,
                      borderRadius: 8,
                      background: 'linear-gradient(90deg, #67DAB1 0%, #0D8057 43.61%, #00200F 101.04%)'
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='subtitle2' color='#707175'>
                    0%
                  </Typography>
                  <Typography variant='subtitle2' color='#707175'>
                    100%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Box sx={radiusBoxStyle}>
        <Grid container spacing={isSmallScreen ? 4 : 8}>
          <Grid item xs={12} md={6} lg={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 1px #2C2D33', pb: 1 }}>
              <Typography variant='body1'>Liquidation Price</Typography>
              <Typography variant='body1'>—</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 1px #2C2D33', pb: 1 }}>
              <Typography variant='body1'>LTV</Typography>
              <Typography variant='body1'>—</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 1px #2C2D33', pb: 1 }}>
              <Typography variant='body1'>Collateral Value</Typography>
              <Typography variant='body1'>—</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 1px #2C2D33', pb: 1 }}>
              <Typography variant='body1'>Loan Value</Typography>
              <Typography variant='body1'>—</Typography>
            </Box>
          </Grid>
        </Grid>
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
          onClick={handleClickOpenSummary}
        >
          Approve
        </Button>
        <Button
          sx={{
            ml: { xs: 2, sm: 2 },
            color: 'white',
            minWidth: 250,
            width: { xs: 1, sm: 'auto' }
          }}
          variant='outlined'
          onClick={() => {
            showToast('success', 'Success', 'Transaction has been completed', 10000)
          }}
        >
          Success Test
        </Button>
        <Button
          sx={{
            ml: { xs: 2, sm: 2 },
            color: 'white',
            minWidth: 250,
            width: { xs: 1, sm: 'auto' }
          }}
          variant='outlined'
          onClick={() => {
            showToast('error', 'Warning', 'Insufficient collateral volume', 10000)
          }}
        >
          Error Test
        </Button>
      </Stack>
      <Fragment>
        <Dialog
          open={openSummary}
          keepMounted
          onClose={handleCloseSummary}
          TransitionComponent={Transition}
          maxWidth={'sm'}
          fullWidth={true}
          aria-labelledby='alert-dialog-slide-title'
          aria-describedby='alert-dialog-slide-description'
        >
          <Box sx={{ p: 6, position: 'relative' }}>
            <Typography sx={{ textAlign: 'center', mb: 8, fontWeight: 600 }} variant='h4' color='white'>
              Summary
            </Typography>
            <Icon
              style={{ position: 'absolute', right: 20, top: 20, cursor: 'pointer', fontWeight: 'bold' }}
              icon='tabler:x'
              fontSize='1.75rem'
              onClick={handleCloseSummary}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2 }}>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                Collateral Deposited:
              </Typography>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                0.0
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2 }}>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                Collateral Value:
              </Typography>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                $ 0.0
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2 }}>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                trenUSD Borrowed:
              </Typography>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                0.0
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2 }}>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                TVL:
              </Typography>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                $ 0.0
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2 }}>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                Liquidation Price:
              </Typography>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                $ 0.0
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2 }}>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                Interest:
              </Typography>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                0.0%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2 }}>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                Max Collateral Ratio:
              </Typography>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                0.0%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2 }}>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                Price:
              </Typography>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                $ 0.0
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2 }}>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                Liquidation Fee:
              </Typography>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                0.0%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2 }}>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                Borrow Fee:
              </Typography>
              <Typography variant='h5' sx={{ fontWeight: 400 }}>
                0.0
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
              <Typography variant='h5' sx={{ fontWeight: 600 }}>
                $trenUSD Left To Borrow:
              </Typography>
              <Typography variant='h5' sx={{ fontWeight: 600 }}>
                0.0 USD
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
              <Button
                sx={{
                  color: 'white',
                  py: 3,
                  px: 20,
                  minWidth: 200,
                  fontSize: 18
                }}
                variant='outlined'
                onClick={handleCloseSummary}
              >
                Add collateral & borrow
              </Button>
            </Box>
          </Box>
        </Dialog>
      </Fragment>
    </Box>
  )
}

export default Borrow
