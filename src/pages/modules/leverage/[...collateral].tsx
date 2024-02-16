// Import from Next
import Image from 'next/image'
import { useRouter } from 'next/router';

// Import React Basic Func
import React, { forwardRef, Ref, ReactElement, useEffect, Fragment, useState } from 'react'

// MUI imports
import {
    Box,
    Typography,
    Button,
    Tooltip,
    IconButton,
    useMediaQuery,
    Grid,
    Slider,
    Dialog,
    Slide,
    useTheme,
    Theme,
    SlideProps 
} from '@mui/material';

// ** Core Components Imports
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'
import Icon from 'src/@core/components/icon'

// ** CleaveJS Imports
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'


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

const Transition = forwardRef(function Transition(
    props: SlideProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Slide direction='up' ref={ref} {...props} />
})

const Leverage = () => {
  const router = useRouter();
  const theme: Theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [multiplyRate, setMultiplyRate] = useState(0)
  const [openAdjust, setOpenAdjust] = useState<boolean>(false)
  const [openRepay, setOpenRepay] = useState<boolean>(false)
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
                <Button onClick={() => router.push(`/modules/borrow/${collateral?.toString().trim().replace(/\s+/g, '')}`)} sx={{borderRadius: '50px', px: 6, py: 3.5, fontWeight: 600, color: 'white'}}>Borrow</Button>
                <Button sx={{borderRadius: '50px', px: 6, py: 3.5, fontWeight: 600, backgroundColor: theme.palette.primary.main, color: '#101617',
                            '&:hover': {
                                backgroundColor: theme.palette.primary.main
                            }}}>
                    Leverage
                </Button>
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
                    <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Typography variant='subtitle1' sx={{fontWeight: 600}}>
                            Leverage
                        </Typography>
                        <Icon fontSize='28' icon='tabler:settings' style={{color: theme.palette.primary.main, cursor: 'pointer'}}/>
                    </Box>
                    <Typography variant='subtitle1' color='#707175' sx={{mb: 2}}>Recursive borrowing engine using trenUSD</Typography>
                    <Box sx={{width: '100%'}}>
                        <Box sx={{display:'flex', justifyContent: 'flex-end'}}>
                            <Typography variant='subtitle1' color={theme.palette.primary.main} sx={{mb: '-10px'}}>
                                Safe
                            </Typography>
                        </Box>
                        <Slider aria-labelledby='continuous-slider'
                                value={multiplyRate}
                                min={0}
                                max={60}
                                onChange={(event:any)=>{setMultiplyRate(event.target.value)}}/>
                        <Box sx={{display:'flex', justifyContent: 'flex-end', mt: -2}}>
                            <Typography variant='subtitle2' color='white'>
                                {multiplyRate}x
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ ...radiusBoxStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='subtitle1' sx={{fontWeight: 600}}>
                        Feature value
                    </Typography>
                    <Typography variant='subtitle1'>
                        0
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{display: 'flex', flexDirection: 'column'}}>
                <Box sx={{...radiusBoxStyle, height: '100%', mb: 10}}>
                    <Typography variant='subtitle1' sx={{mb:4, fontWeight: 600}}>
                        Leverage
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Grid container sx={{height: '100%'}}>
                            <Grid item xs={12} md={6} sx={{
                                pr: {xs: 0, md: 4},
                                borderBottom: { xs: 'solid 1px #2D3131', md: 0 },
                                borderRight: { md: 'solid 1px #2D3131' }
                            }}>
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
                                <Box sx={{display: 'flex', justifyContent: {xs: 'flex-end', md: 'flex-start'}, mt: { xs: 4, md: 10 }, mb: { xs: 4, md: 0 }}}>
                                    <Button sx={{ 
                                        color: 'white',
                                        borderColor: '#C6E0DC'
                                    }} variant='outlined' onClick={() => {setOpenAdjust(true)}}>Adjust Leverage</Button>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6} sx={{pl: {xs: 0, md: 4}, pt: {xs: 4, md: 0}}}>
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
                                            16,000.00
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{color: '#707175'}}>
                                            $16,000.00
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: { xs: 4, md: 10 }, mb: { xs: 4, md: 0 }}}>
                                    <Button sx={{ 
                                        color: 'white',
                                        borderColor: '#C9A3FA'
                                        }} variant='outlined'
                                        onClick={() => {setOpenRepay(true)}}
                                    >
                                        Repay
                                        </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
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
            }} variant='outlined'>Approve</Button>
        </Box>

        {/* Adjust Leverage Modal Popup */}
        <Fragment>
            <Dialog
                open={openAdjust}
                keepMounted
                onClose={() => {setOpenAdjust(false)}}
                TransitionComponent={Transition}
                maxWidth='sm'
                fullWidth={true}
                aria-labelledby='alert-dialog-slide-title'
                aria-describedby='alert-dialog-slide-description'
            >
                <Box sx={{ p: 6, position: 'relative' }}>
                    <Typography sx={{textAlign: 'center', mb: 8, fontWeight: 600}} variant='h4'>
                        Adjust Leverage
                    </Typography>
                    <Icon style={{position: 'absolute', right: 20, top: 20, cursor: 'pointer', fontWeight: 'bold'}} icon='tabler:x' fontSize='1.75rem' onClick={() => {setOpenAdjust(false)}}/>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 1}}>
                        <Typography>Collateral Deposited:</Typography>
                        <Typography>0.0</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 1}}>
                        <Typography>Collateral Value:</Typography>
                        <Typography>$ 0.0</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 1}}>
                        <Typography>trenUSD Borrowed:</Typography>
                        <Typography>0.0</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 1}}>
                        <Typography>TVL:</Typography>
                        <Typography>$ 0.0</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 1}}>
                        <Typography>Liquidation Price:</Typography>
                        <Typography>$ 0.0</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 1}}>
                        <Typography>Interest:</Typography>
                        <Typography>0.0%</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 1}}>
                        <Typography>Max Collateral Ratio:</Typography>
                        <Typography>0.0%</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 1}}>
                        <Typography>Price:</Typography>
                        <Typography>$ 0.0</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 1}}>
                        <Typography>Liquidation Fee:</Typography>
                        <Typography>0.0%</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', borderBottom: 'solid 0.5px #2C2D33', py: 1}}>
                        <Typography>Borrow Fee:</Typography>
                        <Typography>0.0</Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', py: 2}}>
                        <Typography variant='subtitle1' sx={{fontWeight: 600}}>trenUSD Left To Borrow:</Typography>
                        <Typography variant='subtitle1' sx={{fontWeight: 600}}>0.0 USD</Typography>
                    </Box>
                    
                    <Box sx={{width: '100%', mt: 6}}>
                        <Box sx={{display:'flex', justifyContent: 'space-between'}}>
                            <Typography variant='subtitle1' sx={{fontWeight: 600, mb: '-10px'}}>
                                Leverage
                            </Typography>
                        </Box>
                        <Typography variant='subtitle1' color={theme.palette.primary.main} sx={{mb: '-10px', textAlign: 'end'}}>
                            Safe
                        </Typography>
                        <Slider aria-labelledby='continuous-slider'
                                value={multiplyRate}
                                min={0}
                                max={60}
                                onChange={(event:any)=>{setMultiplyRate(event.target.value)}}/>
                        <Box sx={{display:'flex', justifyContent: 'flex-end', mt: -2}}>
                            <Typography variant='subtitle2' color='white'>
                                {multiplyRate}X
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 8}}>
                        <Button sx={{ 
                            color: 'white',
                            py: 3,
                            px: 20,
                            minWidth: 200,
                            fontSize: 18
                        }} variant='outlined' onClick={() => {setOpenAdjust(false)}}>
                            Confirm
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        </Fragment>
        {/* End Adjust Leverage Modal Popup */}

        {/* Repay Modal Popup */}
        <Fragment>
            <Dialog
                open={openRepay}
                keepMounted
                onClose={() => {setOpenRepay(false)}}
                TransitionComponent={Transition}
                maxWidth='sm'
                fullWidth={true}
                aria-labelledby='alert-dialog-slide-title'
                aria-describedby='alert-dialog-slide-description'
            >
                <Box sx={{ p: 6, position: 'relative' }}>
                    <Typography sx={{textAlign: 'center', mb: 8, fontWeight: 600}} variant='h4'>
                        Repay
                    </Typography>
                    <Icon style={{position: 'absolute', right: 20, top: 20, cursor: 'pointer', fontWeight: 'bold'}} icon='tabler:x' fontSize='1.75rem' onClick={() => {setOpenRepay(false)}}/>
                    <Typography sx={{textAlign: 'center', maxWidth: 490, m: 'auto'}}>
                        Here we will have a short text.Here we will have a short text.Here we will have a short text.Here we will have a short text.Here we will have a short text.
                    </Typography>
                    <Box sx={{display: 'flex', justifyContent: 'center', gap: 4, mt: { xs: 4, md: 10 }, mb: { xs: 4, md: 0 }}}>
                        <Button sx={{ 
                            color: 'white',
                            fontSize: 18,
                            borderColor: '#C9A3FA'
                            }} variant='outlined'
                        >
                            Repay
                        </Button>
                        <Button sx={{ 
                            color: 'white',
                            fontSize: 18,
                            borderColor: '#C6E0DC'
                            }} variant='outlined'
                        >
                            Close Position
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        </Fragment>
        {/* End Repay Modal */}
    </Box>
  );
};

export default Leverage;