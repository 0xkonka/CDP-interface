import { useRouter } from 'next/router';

// MUI imports
import Box, {BoxProps} from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import Grid from '@mui/material/Grid'
import Slider from '@mui/material/Slider'
import Dialog from '@mui/material/Dialog'
import Slide, { SlideProps } from '@mui/material/Slide'
import { useTheme, Theme } from '@mui/material/styles'

// ** Styled Component
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'

// Import from Next
import Image from 'next/image'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next/types'

// ** Core Components Imports
import Icon from 'src/@core/components/icon'

// Import theme basic config
import CustomTextField from 'src/@core/components/mui/text-field'

// ** CleaveJS Imports
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'

// Import React Basic Func
import React, { forwardRef, Ref, ReactElement, useEffect, Fragment, useState } from 'react'

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
    },
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
  const router = useRouter();
  const theme: Theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [borrowRate, setBorrowRate] = useState(0)
  const [openSummary, setOpenSummary] = useState<boolean>(false)
  const handleClickOpenSummary = () => setOpenSummary(true)
  const handleCloseSummary = () => setOpenSummary(false)
  let { collateral } = router.query
 
  if (Array.isArray(collateral)) {
    collateral = collateral.join(' / ');
  }
  console.log(collateral)


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

  return (
    <Box>
        <Box sx={{display:'flex', alignItems: 'center', width: 'fit-content', cursor: 'pointer', mb:4}} >
            <Icon fontSize='24' icon='basil:arrow-left-outline' style={{color: theme.palette.primary.main}}/>
            <Typography variant='body1' color='primary' sx={{ml:1}} onClick={()=>{router.push('/modules')}}>
                Go back to Pools
            </Typography>
        </Box>
        <Box sx={{display:'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4}}>
            <Typography variant='h2'>
                {collateral}
            </Typography>
            <Box sx={{borderRadius: '50px', border: 'solid 1px #C6C6C74D'}}>
                <Button sx={{borderRadius: '50px', px: 6, py: 3.5, fontWeight: 600, backgroundColor: theme.palette.primary.main, color: '#101617',
                            '&:hover': {
                                backgroundColor: theme.palette.primary.main
                            }}}>
                    Borrow
                </Button>
                <Button onClick={() => router.push(`/modules/leverage/${collateral?.toString().trim().replace(/\s+/g, '')}`)} sx={{borderRadius: '50px', px: 6, py: 3.5, fontWeight: 600, color: 'white'}}>Leverage</Button>
            </Box>
        </Box>
        <Box sx={{...radiusBoxStyle, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
            {labels.map((label, index) => (
                <Box key={index} sx={{display: 'flex', flexDirection: 'column', alignItems: {xs: 'start', md: 'center'}, gap: isSmallScreen ? 0:1}}>
                    <Typography variant='body1' color='#707175' sx={{display: 'flex', alignItems: 'center'}}>
                        {label.key} 
                        <Tooltip title={label.tooltip} placement='top'>
                            <IconButton sx={{bgcolor: 'transparent !important'}}>
                                <Icon fontSize='14' icon='simple-line-icons:question' style={{color: '#707175', cursor: 'pointer'}}/>
                            </IconButton>
                        </Tooltip>
                    </Typography>
                    <Typography variant='body1'>
                        {label.value}
                    </Typography>
                </Box>
            ))}
        </Box>
        <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
                <Box sx={radiusBoxStyle}>
                    <Typography variant='subtitle1' sx={{mb:4, fontWeight: 600}}>
                        Collateral assets
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={5} sx={{display: 'flex', alignItems: 'center'}}>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <img 
                                    src={`/images/tokens/${collateral?.replace(/\s+/g, '').replace(/\//g, '-')}.png`}
                                    alt='LinkedIn' height={42}
                                    style={{ marginRight: 10 }}
                                />
                                {collateral}
                            </Box>
                        </Grid>
                        <Grid item xs={7}>
                            <Box sx={{display: 'flex', justifyContent: 'end', alignItems: 'center', mb: 1}}>
                                <Typography variant='body2' color='#707175'>Available:</Typography>
                                <Typography variant='body2' sx={{ml: 1}}>8,9B {collateral}</Typography>        
                            </Box>
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
                                <Box sx={{position: 'absolute', right: 10, top: 10, cursor:'pointer', borderLeft: 'solid 1px #12201F', fontSize: 12, pl: 1}}>
                                    MAX
                                </Box>   
                            </CleaveWrapper>
                            <Typography variant='body1' sx={{ml:3}}>
                                $0.0
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={radiusBoxStyle}>
                    <Typography variant='subtitle1' sx={{mb:4, fontWeight: 600}}>
                        trenUSD to Borrow
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                            <Box sx={{display: 'flex', alignItems: 'center', mb:2}}>
                                <Image 
                                    src={`/images/tokens/trenUSD.png`}
                                    alt='LinkedIn' width={32} height={32}
                                    style={{ borderRadius: '100%', marginRight: 24 }}
                                />
                                <Typography variant='body1'>
                                    trenUSD
                                </Typography>
                            </Box>
                            <Typography variant='body1' color='#707175'>
                                Tren Finance USD
                            </Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <CleaveWrapper>
                                <Cleave id='tren-usd-amount' 
                                        placeholder='0.00' 
                                        options={{ 
                                            numeral: true,
                                            numeralThousandsGroupStyle: 'thousand',
                                            numeralDecimalScale: 2, // Always show two decimal points
                                            numeralDecimalMark: '.', // Decimal mark is a period
                                            stripLeadingZeroes: false // Prevents stripping the leading zero before the decimal point
                                         }} />
                            </CleaveWrapper>
                            <Typography variant='body1' sx={{ml:3}}>
                                $0.0
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 4, py: 4}}>
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
                </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{display: 'flex', flexDirection: 'column'}}>
                <Box sx={{...radiusBoxStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                    <Grid container sx={{height: '100%'}}>
                        <Grid item xs={12} md={6} sx={{
                             pr: {xs: 0, md: 4},
                            borderBottom: { xs: 'solid 1px #2D3131', md: 0 },
                            borderRight: { md: 'solid 1px #2D3131' }
                        }}>
                            <Typography variant='subtitle1' sx={{mb:4, fontWeight: 600}}>
                                Deposit
                            </Typography>
                            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <img 
                                        src={`/images/tokens/${collateral?.replace(/\s+/g, '').replace(/\//g, '-')}.png`}
                                        alt='LinkedIn' height={42}
                                        style={{ marginRight: 10 }}
                                    />
                                    {collateral}
                                </Box>
                                <Box>
                                    <Typography variant='subtitle1'>
                                        20,000.00
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{color: '#707175'}}>
                                        $20,000.00
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{display: 'flex', mt: { xs: 4, md: 12 }, mb: { xs: 4, md: 0 }}}>
                                <Button sx={{ 
                                    mr: {xs: 2, md: 4},
                                    color: 'white',
                                    borderColor: '#6795DA'
                                }} variant='outlined'>Withdraw</Button>
                                <Button sx={{ 
                                    color: 'white',
                                    borderColor: '#67DAB1'
                                }} variant='outlined'>Deposit more</Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{pl: {xs: 0, md: 4}, pt: {xs: 4, md: 0}}}>
                            <Typography variant='subtitle1' sx={{mb:4, fontWeight: 600}}>
                                Borrow
                            </Typography>
                            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <Image 
                                        src={`/images/tokens/trenUSD.png`}
                                        alt='LinkedIn' width={32} height={32}
                                        style={{ borderRadius: '100%', marginRight: 10 }}
                                    />
                                    trenUSD
                                </Box>
                                <Box>
                                    <Typography variant='subtitle1'>
                                        20,000.00
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{color: '#707175'}}>
                                        $20,000.00
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{display: 'flex', mt: { xs: 4, md: 12 }, mb: { xs: 4, md: 0 }}}>
                                <Button sx={{ 
                                    mr: {xs: 2, md: 4},
                                    color: 'white',
                                    borderColor: '#C6E0DC'
                                }} variant='outlined'>Borrow more</Button>
                                <Button sx={{ 
                                    color: 'white',
                                    borderColor: '#C9A3FA'
                                }} variant='outlined'>Repay</Button>
                            </Box>
                        </Grid>
                    </Grid>
                    {/* <Typography variant='body1' color='#707175'>
                        No open positions
                    </Typography> */}
                </Box>
                <Box sx={radiusBoxStyle}>
                    <Typography variant='subtitle1' sx={{mb:4, fontWeight: 600}}>
                        {collateral} - trenUSD
                    </Typography>
                    <Grid container spacing={8}>
                        <Grid item xs={12} lg={6}>
                            <Box sx={{mb:2, display:'flex', justifyContent: 'space-between'}}>
                                <Typography variant='subtitle2'>
                                    Health factor
                                </Typography>
                                <Typography variant='subtitle2'>
                                    —
                                </Typography>
                            </Box>
                            <Box className='gradientProgress'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"
                                    style={{marginLeft: -8}}>
                                    <path d="M13.7302 5.07458C13.6912 4.98206 13.6006 4.92188 13.5 4.92188L2.50002 4.922C2.39956 4.922 2.30886 4.98218 2.26968 5.07471C2.23061 5.16724 2.25076 5.27429 2.32082 5.34631L7.82082 11.0032C7.86782 11.0515 7.93252 11.0789 8.00002 11.0789C8.06753 11.0789 8.13223 11.0515 8.17922 11.0032L13.6792 5.34619C13.7493 5.27405 13.7693 5.16711 13.7302 5.07458Z" fill="white"/>
                                </svg>
                                <Box sx={{
                                    width: '100%',
                                    height: 6,
                                    mb: 2,
                                    borderRadius: 8,
                                    background: 'linear-gradient(270deg, #00D084 0%, #FF9C19 54.06%, #FF5876 100.77%)'
                                }}/>
                            </Box>
                            <Box sx={{display:'flex', justifyContent: 'space-between'}}>
                                <Typography variant='subtitle2' color='#707175'>
                                    Safe
                                </Typography>
                                <Typography variant='subtitle2' color='#707175'>
                                    Risky
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Box sx={{mb:2, display:'flex', justifyContent: 'space-between'}}>
                                <Typography variant='subtitle2'>
                                    Borrowing power used
                                </Typography>
                                <Typography variant='subtitle2'>
                                    —
                                </Typography>
                            </Box>
                            <Box sx={{
                                mt: '30px',
                                width: '100%',
                                height: 6,
                                mb: 2,
                                borderRadius: 8,
                                background: '#141819',
                            }}>
                                <Box sx={{
                                    width: '60%',
                                    height: 6,
                                    borderRadius: 8,
                                    background: 'linear-gradient(90deg, #67DAB1 0%, #0D8057 43.61%, #00200F 101.04%)'
                                }}/>
                            </Box>
                            <Box sx={{display:'flex', justifyContent: 'space-between'}}>
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
            <Grid container spacing={8}>
                <Grid item xs={12} md={6} lg={3}>
                    <Box sx={{display:'flex', justifyContent: 'space-between', borderBottom: 'solid 1px #2C2D33', pb:1}}>
                        <Typography variant='body1'>
                            Liquidation Price
                        </Typography>
                        <Typography variant='body1'>
                            —
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Box sx={{display:'flex', justifyContent: 'space-between', borderBottom: 'solid 1px #2C2D33', pb:1}}>
                        <Typography variant='body1'>
                            LTV
                        </Typography>
                        <Typography variant='body1'>
                            —
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Box sx={{display:'flex', justifyContent: 'space-between', borderBottom: 'solid 1px #2C2D33', pb:1}}>
                        <Typography variant='body1'>
                            Collateral Value
                        </Typography>
                        <Typography variant='body1'>
                            —
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Box sx={{display:'flex', justifyContent: 'space-between', borderBottom: 'solid 1px #2C2D33', pb:1}}>
                        <Typography variant='body1'>
                            Loan Value
                        </Typography>
                        <Typography variant='body1'>
                            —
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'center', py: 8}}>
            <Button sx={{ 
                ml: {xs: 2, sm: 2},
                color: 'white',
                minWidth: 250
            }} variant='outlined' onClick={handleClickOpenSummary}>Approve</Button>
        </Box>
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
                        <Typography variant='h5' sx={{fontWeight: 400}}>trenUSD Left To Borrow:</Typography>
                        <Typography variant='h5' sx={{fontWeight: 400}}>0.0 USD</Typography>
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