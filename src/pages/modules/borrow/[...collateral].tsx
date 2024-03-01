// React imports
import React, {
    forwardRef, Ref, ReactElement, Fragment, useState
} from 'react'

// Next.js imports
import { useRouter } from 'next/router'
import Image from 'next/image'

// MUI imports and hooks
import {
    Box, Typography, Button, Grid, Dialog, Slide, SlideProps,
    Theme, useTheme, Stack, Link
} from '@mui/material'

// Core Components Imports
import Icon from '@/@core/components/icon'

// Styled Component Import
import CleaveWrapper from '@/@core/styles/libs/react-cleave'

// CleaveJS for input formatting
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'

// Custom hook imports
import { showToast } from '@/hooks/toasts'

// Context imports
import { useGlobalValues } from '@/context/GlobalContext'
import { ModuleOverView } from '@/views/components/modules/moduleOverView'
import { Switcher } from '@/views/components/modules/switcher'
import { HealthFactor } from '@/views/components/modules/healthFactor'
import { BorrowingPower } from '@/views/components/modules/borrowingPower'
import { Result } from '@/views/components/modules/result'
import { useProtocol } from '@/context/ProtocolContext'
import { LiquityStoreState } from '@/lib-base'
import { useLiquitySelector } from '@/lib-react'
  
const Transition = forwardRef(function Transition(
    props: SlideProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Slide direction='up' ref={ref} {...props} />
})

const Borrow = () => {
  const router = useRouter();
  const theme: Theme = useTheme();
  const [openSummary, setOpenSummary] = useState<boolean>(false)
  const handleClickOpenSummary = () => setOpenSummary(true)
  const {isSmallScreen, isMediumScreen} = useGlobalValues()
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
    collateral = collateral.join(' / ');
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

  const handleCloseSummary = () => {
    setOpenSummary(false)
    showToast('success', 'Success', 'Transaction has been completed', 2000)
  }

  return (
    <Box>
        <Stack direction='row' sx={{alignItems: 'center', width: 'fit-content', cursor: 'pointer', mb:4}} >
            <Icon fontSize='24' icon='basil:arrow-left-outline' style={{color: theme.palette.primary.main}}/>
            <Typography variant='body1' color='primary' sx={{ml:1}} onClick={()=>{router.push('/modules')}}>
                Go back to Pools
            </Typography>
        </Stack>
        <ModuleOverView collateral={collateral || ''}/>
        <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
                <Switcher page='borrow' collateral={collateral || ''} />
                <Box sx={radiusBoxStyle}>
                    <Typography variant='subtitle1' sx={{mb:4, fontWeight: 600}}>
                        Deposit
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                            <Stack direction='row' sx={{alignItems: 'center', mb:2}}>
                                <img 
                                    src={`/images/tokens/${collateral?.replace(/\s+/g, '').replace(/\//g, '-')}.png`}
                                    alt='LinkedIn' height={42}
                                    style={{ marginRight: 10 }}
                                />
                                {collateral}
                            </Stack>
                            <Typography variant='body1' color='#707175'>
                                {collateral}
                            </Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <Stack direction='row' sx={{justifyContent: 'end', alignItems: 'center', mb: 1}}>
                                <Typography variant='body2' color='#707175'>Available:</Typography>
                                <Typography variant='body2' sx={{ml: 1}}>8,9B {collateral}</Typography>        
                            </Stack>
                            <CleaveWrapper style={{position: 'relative'}}>
                                <Cleave id='collateral-assets-amount' 
                                        placeholder='0.00' 
                                        options={{ 
                                            numeral: true,
                                            numeralThousandsGroupStyle: 'thousand',
                                            numeralDecimalScale: 2, // Always show two decimal points
                                            numeralDecimalMark: '.', // Decimal mark is a period
                                            stripLeadingZeroes: false // Prevents stripping the leading zero before the decimal point
                                        }} 
                                        style={{paddingRight: 50}}
                                />
                                <Box sx={{position: 'absolute', right: 10, top: 10, cursor:'pointer', borderLeft: 'solid 1px #12201F', fontSize: 12, pl: 1, color: theme.palette.primary.main}}>
                                    MAX
                                </Box>
                            </CleaveWrapper>
                            <Typography variant='body1'  sx={{ml:3, opacity: 0.5}}>
                                = $0.0
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={radiusBoxStyle}>
                    <Typography variant='subtitle1' sx={{mb:4, fontWeight: 600}}>
                        Borrow
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                            <Stack direction='row' sx={{alignItems: 'center', mb:2}}>
                                <Image 
                                    src={`/images/tokens/trenUSD.png`}
                                    alt='LinkedIn' width={32} height={32}
                                    style={{ borderRadius: '100%', marginRight: 24 }}
                                />
                                <Typography variant='body1'>
                                    trenUSD
                                </Typography>
                            </Stack>
                            <Typography variant='body1' color='#707175'>
                                Tren Finance USD
                            </Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <Stack direction='row' sx={{justifyContent: 'end', alignItems: 'center', mb: 1}}>
                                <Typography variant='body2' color='#707175'>Available:</Typography>
                                <Typography variant='body2' sx={{ml: 1}}>8,9B trenUSD</Typography>        
                            </Stack>
                            <CleaveWrapper style={{position: 'relative'}}>
                                <Cleave id='tren-usd-amount' 
                                        placeholder='0.00' 
                                        options={{ 
                                            numeral: true,
                                            numeralThousandsGroupStyle: 'thousand',
                                            numeralDecimalScale: 2, // Always show two decimal points
                                            numeralDecimalMark: '.', // Decimal mark is a period
                                            stripLeadingZeroes: false // Prevents stripping the leading zero before the decimal point
                                         }} 
                                />
                                <Box sx={{position: 'absolute', right: 10, top: 10, cursor:'pointer', borderLeft: 'solid 1px #12201F', fontSize: 12, pl: 1, color: theme.palette.primary.main}}>
                                    MAX
                                </Box>  
                            </CleaveWrapper>
                            <Typography variant='body1' sx={{ml:3, opacity: 0.5}}>
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
            <Grid item xs={12} md={6} sx={{display: 'flex', flexDirection: 'column'}}>
                <Stack sx={{...radiusBoxStyle, height: 1, mb: 10, justifyContent: 'center'}}>
                    <Stack sx={{alignItems: 'center', justifyContent: 'center'}}>
                        <Grid container sx={{height: '100%'}}>
                            <Grid item xs={12} md={6} sx={{
                                pr: {xs: 0, md: 4},
                                borderBottom: { xs: 'solid 1px #2D3131', md: 0 },
                                borderRight: { md: 'solid 1px #2D3131' }
                            }}>
                                <Typography variant='subtitle1' sx={{mb:4, fontWeight: 600}}>
                                    Collateral
                                </Typography>
                                <Stack direction='row' sx={{justifyContent: 'space-between'}}>
                                    <Stack direction='row' sx={{alignItems: 'center'}}>
                                        <img 
                                            src={`/images/tokens/${collateral?.replace(/\s+/g, '').replace(/\//g, '-')}.png`}
                                            alt='LinkedIn' height={42}
                                            style={{ marginRight: 10 }}
                                        />
                                        {collateral}
                                    </Stack>
                                    <Box>
                                        <Typography variant='subtitle1' sx={{textAlign: 'end'}}>
                                            20,000.00
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{color: '#707175', textAlign: 'end'}}>
                                            = $20,000.00
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Stack direction='row' sx={{mt: { xs: 4, md: 12 }, mb: { xs: 4, md: 0 }}}>
                                    <Button sx={{ 
                                        mr: {xs: 2, md: 4},
                                        color: 'white',
                                        borderColor: '#6795DA'
                                    }} variant='outlined'>Withdraw</Button>
                                    <Button sx={{ 
                                        color: 'white',
                                        borderColor: '#67DAB1'
                                    }} variant='outlined'>Deposit more</Button>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={6} sx={{pl: {xs: 0, md: 4}, pt: {xs: 4, md: 0}}}>
                                <Typography variant='subtitle1' sx={{mb:4, fontWeight: 600}}>
                                    Debt
                                </Typography>
                                <Stack direction='row' sx={{justifyContent: 'space-between'}}>
                                    <Stack direction='row' sx={{alignItems: 'center'}}>
                                        <Image 
                                            src={`/images/tokens/trenUSD.png`}
                                            alt='LinkedIn' width={32} height={32}
                                            style={{ borderRadius: '100%', marginRight: 10 }}
                                        />
                                        trenUSD
                                    </Stack>
                                    <Box>
                                        <Typography variant='subtitle1' sx={{textAlign: 'end'}}>
                                            20,000.00
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{color: '#707175', textAlign: 'end'}}>
                                            = $20,000.00
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Stack direction='row' sx={{mt: { xs: 4, md: 12 }, mb: { xs: 4, md: 0 }}}>
                                    <Button sx={{ 
                                        mr: {xs: 2, md: 4},
                                        color: 'white',
                                        borderColor: '#C6E0DC'
                                    }} variant='outlined'>Borrow more</Button>
                                    <Button sx={{ 
                                        color: 'white',
                                        borderColor: '#C9A3FA'
                                    }} variant='outlined'>Repay</Button>
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
                            <HealthFactor safety={24}/>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <BorrowingPower percent={68}/>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
        <Box sx={radiusBoxStyle}>
            <Result liquidationPrice={0.000008} ltv={37.5} collateralValue={10000} loanValue={3750}/>
        </Box>
        <Stack direction='row' sx={{justifyContent: 'center', py: 8}}>
            <Button sx={{ 
                ml: {xs: 2, sm: 2},
                color: 'white',
                minWidth: 250,
                width: {xs: 1, sm: 'auto'}
            }} variant='outlined' onClick={handleClickOpenSummary}>Approve</Button>
            <Button sx={{ 
                ml: {xs: 2, sm: 2},
                color: 'white',
                minWidth: 250,
                width: {xs: 1, sm: 'auto'}
            }} variant='outlined' onClick={() => {showToast('success', 'Success', 'Transaction has been completed', 10000)}}>Success Test</Button>
            <Button sx={{ 
                ml: {xs: 2, sm: 2},
                color: 'white',
                minWidth: 250,
                width: {xs: 1, sm: 'auto'}
            }} variant='outlined' onClick={() => {showToast('error', 'Warning', 'Insufficient collateral volume', 10000)}}>Error Test</Button>
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
                    <Typography sx={{textAlign: 'center', mb: 8, fontWeight: 600}} variant='h4' color='white'>
                        Summary
                    </Typography>
                    <Icon style={{position: 'absolute', right: 20, top: 20, cursor: 'pointer', fontWeight: 'bold'}} icon='tabler:x' fontSize='1.75rem' onClick={handleCloseSummary}/>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2}}>
                        <Typography variant='h5' sx={{fontWeight: 400}}>Collateral Deposited:</Typography>
                        <Typography variant='h5' sx={{fontWeight: 400}}>0.0</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2}}>
                        <Typography variant='h5' sx={{fontWeight: 400}}>Collateral Value:</Typography>
                        <Typography variant='h5' sx={{fontWeight: 400}}>$ 0.0</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2}}>
                        <Typography variant='h5' sx={{fontWeight: 400}}>trenUSD Borrowed:</Typography>
                        <Typography variant='h5' sx={{fontWeight: 400}}>0.0</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2}}>
                        <Typography variant='h5' sx={{fontWeight: 400}}>TVL:</Typography>
                        <Typography variant='h5' sx={{fontWeight: 400}}>$ 0.0</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2}}>
                        <Typography variant='h5' sx={{fontWeight: 400}}>Liquidation Price:</Typography>
                        <Typography variant='h5' sx={{fontWeight: 400}}>$ 0.0</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2}}>
                        <Typography variant='h5' sx={{fontWeight: 400}}>Interest:</Typography>
                        <Typography variant='h5' sx={{fontWeight: 400}}>0.0%</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2}}>
                        <Typography variant='h5' sx={{fontWeight: 400}}>Max Collateral Ratio:</Typography>
                        <Typography variant='h5' sx={{fontWeight: 400}}>0.0%</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2}}>
                        <Typography variant='h5' sx={{fontWeight: 400}}>Price:</Typography>
                        <Typography variant='h5' sx={{fontWeight: 400}}>$ 0.0</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2}}>
                        <Typography variant='h5' sx={{fontWeight: 400}}>Liquidation Fee:</Typography>
                        <Typography variant='h5' sx={{fontWeight: 400}}>0.0%</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 2}}>
                        <Typography variant='h5' sx={{fontWeight: 400}}>Borrow Fee:</Typography>
                        <Typography variant='h5' sx={{fontWeight: 400}}>0.0</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', py: 2}}>
                        <Typography variant='h5' sx={{fontWeight: 600}}>$trenUSD Left To Borrow:</Typography>
                        <Typography variant='h5' sx={{fontWeight: 600}}>0.0 USD</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 8}}>
                        <Button sx={{ 
                            color: 'white',
                            py: 3,
                            px: 20,
                            minWidth: 200,
                            fontSize: 18
                        }} variant='outlined' onClick={handleCloseSummary}>
                            Add collateral & borrow
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        </Fragment>
    </Box>
  );
};

export default Borrow;