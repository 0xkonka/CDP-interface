// Import from Next
import Image from 'next/image'
import { useRouter } from 'next/router';

// Import React Basic Func
import React, { forwardRef, Ref, ReactElement, useEffect, Fragment, useState } from 'react'

// MUI imports
import {
    Box, Stack, Typography, Button, Grid, Slider, Dialog,
    Slide, useTheme, Theme, SlideProps,
} from '@mui/material';

// ** Core Components Imports
import CleaveWrapper from '@/@core/styles/libs/react-cleave'
import Icon from '@/@core/components/icon'

// ** CleaveJS Imports
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useGlobalValues } from '@/context/GlobalContext';
import { ModuleOverView } from '@/views/components/modules/moduleOverView';
import { Switcher } from '@/views/components/modules/switcher';
import { HealthFactor } from '@/views/components/modules/healthFactor';
import { BorrowingPower } from '@/views/components/modules/borrowingPower';
import { Result } from '@/views/components/modules/result';

const Transition = forwardRef(function Transition(
    props: SlideProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Slide direction='up' ref={ref} {...props} />
})

const Leverage = () => {
  const router = useRouter();
  const theme: Theme = useTheme();
  const [multiplyRate, setMultiplyRate] = useState(0)
  const [openAdjust, setOpenAdjust] = useState<boolean>(false)
  const [openRepay, setOpenRepay] = useState<boolean>(false)
  const {setOpenSlippage} = useGlobalValues()
  const {isSmallScreen, isMediumScreen, radiusBoxStyle} = useGlobalValues()
  let { collateral } = router.query

  if (Array.isArray(collateral)) {
    collateral = collateral.join(' / ');
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
                <Switcher page='leverage' collateral={collateral || ''} />
                <Box sx={radiusBoxStyle}>
                    <Typography variant='subtitle1' sx={{mb:4, fontWeight: 600}}>
                        Deposit
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                            <Stack direction='row' sx={{alignItems: 'center', mb: 2}}>
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
                            <Typography variant='body1' sx={{ml:3, opacity: 0.5}}>
                                = $0.0
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={radiusBoxStyle}>
                    <Typography variant='subtitle1' sx={{fontWeight: 600}}>
                        Leverage
                    </Typography>
                    <Typography variant='subtitle1' color='#707175' sx={{mb: 2}}>Recursive borrowing engine using trenUSD</Typography>
                    <Box sx={{width: '100%'}}>
                        <Stack direction='row' sx={{justifyContent: 'flex-end'}}>
                            <Typography variant='subtitle1' color={theme.palette.primary.main} sx={{mb: '-10px'}}>
                                Safe
                            </Typography>
                        </Stack>
                        <Slider aria-labelledby='continuous-slider'
                                value={multiplyRate}
                                min={0}
                                max={60}
                                onChange={(event:any)=>{setMultiplyRate(event.target.value)}}/>
                        <Stack direction='row' sx={{justifyContent: 'flex-end', mt: -2}}>
                            <Typography variant='subtitle2' color='white'>
                                {multiplyRate == 0 ? '' : multiplyRate}x
                            </Typography>
                        </Stack>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{display: 'flex', flexDirection: 'column'}}>
                <Stack sx={{...radiusBoxStyle, height: 1, mb: 10, justifyContent: 'center'}}>
                    <Stack sx={{alignItems: 'center', justifyContent: 'center'}}>
                        <Grid container sx={{height: '100%'}}>
                            <Grid item xs={12} lg={6} sx={{
                                pr: {xs: 0, lg: 4},
                                // borderBottom: { xs: 'solid 1px #2D3131', lg: 0 },
                                borderRight: { lg: 'solid 1px #2D3131' }
                            }}>
                                <Typography variant='subtitle1' sx={{mb:4, fontWeight: 600}}>
                                    Collateral
                                </Typography>
                                <Stack sx={{alignItems: 'center', justifyContent: 'space-between', width: 1}}>
                                    <Stack direction='row' sx={{width: 1, justifyContent: 'space-between'}}>
                                        <Stack direction='row' sx={{alignItems: 'center'}}>
                                            <img 
                                                src={`/images/tokens/${collateral?.replace(/\//g, '-').replace(/\s+/g, '')}.png`}
                                                alt={collateral} height={isSmallScreen ? 36 : 42}
                                                style={{ marginRight: 10 }}
                                            />
                                            {collateral}
                                        </Stack>
                                        <Stack sx={{ml: isSmallScreen ? 0 : 12, alignItems: 'flex-end'}}>
                                            <Typography variant='subtitle1'>
                                                17.2B
                                            </Typography>
                                            <Typography variant='subtitle2' sx={{color: '#707175'}}>
                                                = $20,000.00
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack sx={{width: {xs: 1, lg: 'auto'}, justifyContent: 'center', alignItems: 'center'}}>
                                        <Stack id='horizontal-before' sx={{justifyContent: 'center'}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="2" height="10" viewBox="0 0 2 10" fill="none">
                                                <path d="M1 0L1 10" stroke="#707175" strokeDasharray="4 4"/>
                                            </svg>
                                        </Stack>
                                        <Stack>
                                            <Typography color='primary' variant={isMediumScreen ? 'h4' : 'subtitle1'}>10x</Typography>
                                        </Stack>
                                        <Stack id='horizontal-after' sx={{justifyContent: 'center'}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="11" viewBox="0 0 8 11" fill="none">
                                                <path d="M3.64645 10.3536C3.84171 10.5488 4.15829 10.5488 4.35355 10.3536L7.53553 7.17157C7.7308 6.97631 7.7308 6.65973 7.53553 6.46447C7.34027 6.2692 7.02369 6.2692 6.82843 6.46447L4 9.29289L1.17157 6.46447C0.976311 6.2692 0.659729 6.2692 0.464466 6.46447C0.269204 6.65973 0.269204 6.97631 0.464466 7.17157L3.64645 10.3536ZM3.5 2.18557e-08L3.5 2.5L4.5 2.5L4.5 -2.18557e-08L3.5 2.18557e-08ZM3.5 7.5L3.5 10L4.5 10L4.5 7.5L3.5 7.5ZM3.64645 10.3536C3.84171 10.5488 4.15829 10.5488 4.35355 10.3536L7.53553 7.17157C7.7308 6.97631 7.7308 6.65973 7.53553 6.46447C7.34027 6.2692 7.02369 6.2692 6.82843 6.46447L4 9.29289L1.17157 6.46447C0.976311 6.2692 0.659729 6.2692 0.464466 6.46447C0.269204 6.65973 0.269204 6.97631 0.464466 7.17157L3.64645 10.3536ZM3.5 2.18557e-08L3.5 2.5L4.5 2.5L4.5 -2.18557e-08L3.5 2.18557e-08ZM3.5 7.5L3.5 10L4.5 10L4.5 7.5L3.5 7.5Z" fill="#707175"/>
                                            </svg>
                                        </Stack>
                                    </Stack>
                                    <Stack direction='row'  sx={{width: 1, justifyContent: 'space-between'}}>
                                        <Stack direction='row' sx={{alignItems: 'center'}}>
                                            <img 
                                                src={`/images/tokens/${collateral?.replace(/\//g, '-').replace(/\s+/g, '')}.png`}
                                                alt={collateral} height={isSmallScreen ? 36 : 42}
                                                style={{ marginRight: 10 }}
                                            />
                                            {collateral}
                                        </Stack>
                                        <Stack sx={{ml: isSmallScreen ? 0 : 12, alignItems: 'flex-end'}}>
                                            <Typography variant='subtitle1'>
                                                172B
                                            </Typography>
                                            <Typography variant='subtitle2' sx={{color: '#707175'}}>
                                                = $200,000.00
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} lg={6} sx={{pl: {xs: 0, md: 4}, pt: {xs: 4, md: 0}}}>
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
                                            16,000.00
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{color: '#707175', textAlign: 'end'}}>
                                            = $16,000.00
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Stack direction='row' sx={{mt: { xs: 4, md: 10 }, mb: { xs: 4, md: 0 }, gap:4}}>
                                    <Button sx={{ 
                                        color: 'white',
                                        borderColor: '#C6E0DC'
                                    }} variant='outlined' onClick={() => {setOpenAdjust(true)}}>Adjust Leverage</Button>
                                    <Button sx={{ 
                                        color: 'white',
                                        borderColor: '#C9A3FA'
                                        }} variant='outlined'
                                        onClick={() => {setOpenRepay(true)}}
                                    >
                                        Repay
                                        </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Stack>
                </Stack>
                <Box sx={radiusBoxStyle}>
                    <Grid container spacing={8}>
                        <Grid item xs={12} lg={6}>
                            <HealthFactor safety={0}/>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <BorrowingPower percent={0} max={7500}/>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
        <Box sx={radiusBoxStyle}>
            <Result featureValue={0} liquidationPrice={0.000008} ltv={37.5} collateralValue={10000} loanValue={3750}/>
        </Box>
        <Stack direction='row' sx={{justifyContent: 'center', py: 8}}>
            <Button sx={{ 
                ml: {xs: 2, sm: 2},
                color: 'white',
                minWidth: 250,
                width: {xs: 1, sm: 'auto'}
            }} variant='outlined'>Approve</Button>
        </Stack>

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