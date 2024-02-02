import { useRouter } from 'next/router';

// MUI imports
import Box, {BoxProps} from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import Slider from '@mui/material/Slider'
import { useTheme, Theme } from '@mui/material/styles'

// Import from local configs
import { collaterals } from 'src/configs/collateral';

// Import from Next
import Image from 'next/image'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next/types'

// ** Core Components Imports
import Icon from 'src/@core/components/icon'

// Import theme basic config
import CustomTextField from 'src/@core/components/mui/text-field'

// Import React Basic Func
import React, { useEffect, useState } from 'react'
import ButtonsOutlined from 'src/views/components/buttons/ButtonsOutlined';

const labels = [
    {
        key: 'TVL',
        tooltip: 'Placeholder Tooltip',
        value: '4.296M'
    },
    {
        key: 'trenUSD Available',
        tooltip: 'Placeholder Tooltip',
        value: '766.231K/800K'
    },
    {
        key: 'Utilization',
        tooltip: 'Placeholder Tooltip',
        value: '84.86%'
    },
    {
        key: 'Max LTV',
        tooltip: 'Placeholder Tooltip',
        value: '75%'
    },
    {
        key: 'Interest',
        tooltip: 'Placeholder Tooltip',
        value: '5%'
    },
    {
        key: 'Borrow Fee',
        tooltip: 'Placeholder Tooltip',
        value: '6.263%'
    },
    {
        key: 'Liquidation',
        tooltip: 'Placeholder Tooltip',
        value: '5%'
    },
    {
        key: 'Rate Type',
        tooltip: 'Placeholder Tooltip',
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

const Borrow = () => {
  const router = useRouter();
  const theme: Theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [borrowRate, setBorrowRate] = useState(0)
  const { collateral } = router.query

  const StyledRoundedBox = styled(Box)<BoxProps>(({ theme }) => ({
    paddingLeft: isSmallScreen ? 8 : 24,
    paddingRight: isSmallScreen ? 8 : 24,
    paddingTop: 16,
    paddingBottom: 16,
    marginBottom: 16,
    border: 'solid 1px',
    borderRadius: 10, 
    borderColor: theme.palette.secondary.dark, 
    gap: 3
  }))

  return (
    <Box sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
        <Box sx={{display:'flex', alignItems: 'center', width: 'fit-content', cursor: 'pointer', mb:4}} >
            <Icon fontSize='24' icon='basil:arrow-left-outline' style={{color: theme.palette.primary.main}}/>
            <Typography variant='body1' color='primary' sx={{ml:1}} onClick={()=>{router.push('/pools')}}>
                Go back to Pools
            </Typography>
        </Box>
        <Box sx={{display:'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4}}>
            <Typography variant='h2' sx={{ textTransform: 'uppercase' }}>
                {collateral}
            </Typography>
            <ButtonGroup variant='outlined' color='secondary'>
                <Button sx={{borderColor: theme.palette.primary.main}}>Borrow</Button>
                <Button sx={{borderLeftColor: theme.palette.primary.main}}>Leverage</Button>
            </ButtonGroup>
        </Box>
        <StyledRoundedBox sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
            {labels.map((label, index) => (
                <Box key={index} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isSmallScreen ? 0:1}}>
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
        </StyledRoundedBox>
        <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
                <StyledRoundedBox>
                    <Typography variant='subtitle1' sx={{mb:4, fontWeight: 600}}>
                        Collateral assets
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={5} sx={{display: 'flex', alignItems: 'center'}}>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <Image 
                                    src={`/images/tokens/${collateral}.png`}
                                    alt='LinkedIn' width={42} height={42}
                                    style={{ borderRadius: '100%', marginRight: 10 }}
                                />
                                {collateral}
                            </Box>
                            {/* <Typography variant='body1' color='#707175'>
                                {collateral}
                            </Typography> */}
                        </Grid>
                        <Grid item xs={7}>
                            <Box sx={{display: 'flex', justifyContent: 'end', alignItems: 'center', mb: 1}}>
                                <Typography variant='body2' color='#707175'>Available:</Typography>
                                <Typography variant='body2' sx={{ml: 1}}>8,9B {collateral}</Typography>        
                            </Box>
                            <CustomTextField
                                placeholder='0.0'
                                sx={{
                                    width: '100%',
                                    mb: 1,
                                    '& .MuiInputBase-root': {
                                        width: '100%'
                                    },
                                    '& .MuiTypography-root': {
                                        borderLeft: 'solid 1px #12201F',
                                        paddingLeft: 2
                                    }
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position='end' 
                                                    sx={{cursor: 'pointer', '& p' : {color: theme.palette.primary.main, fontSize: 12}}} 
                                                    onClick={()=>{alert('Max clicked')}}>
                                                    MAX
                                                  </InputAdornment>
                                }}
                            />
                            <Typography variant='body1' sx={{ml:3}}>
                                $0.0
                            </Typography>
                        </Grid>
                    </Grid>
                </StyledRoundedBox>
                <StyledRoundedBox>
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
                            <CustomTextField
                                placeholder='0.0'
                                sx={{
                                    width: '100%',
                                    mb: 1,
                                    '& .MuiInputBase-root': {
                                        width: '100%'
                                    },
                                    '& .MuiTypography-root': {
                                        borderLeft: 'solid 1px #12201F',
                                        paddingLeft: 2
                                    }
                                }}
                            />
                            <Typography variant='body1' sx={{ml:3}}>
                                $0.0
                            </Typography>
                        </Grid>
                    </Grid>
                </StyledRoundedBox>
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
                <StyledRoundedBox sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                    <Grid container sx={{height: '100%'}}>
                        <Grid item xs={12} md={6} sx={{
                            pr: 4,
                            borderBottom: { xs: 'solid 1px #2D3131', md: 0 },
                            borderRight: { md: 'solid 1px #2D3131' }
                        }}>
                            <Typography variant='subtitle1' sx={{mb:4, fontWeight: 600}}>
                                Deposit
                            </Typography>
                            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <Image 
                                        src={`/images/tokens/${collateral}.png`}
                                        alt='LinkedIn' width={42} height={42}
                                        style={{ borderRadius: '100%', marginRight: 10 }}
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
                        <Grid item xs={12} md={6} sx={{pl: 4}}>
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
                </StyledRoundedBox>
                <StyledRoundedBox>
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
                </StyledRoundedBox>
            </Grid>
        </Grid>
        <StyledRoundedBox>
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
        </StyledRoundedBox>
        <Box sx={{display: 'flex', justifyContent: 'center', py: 8}}>
            <Button sx={{ 
                ml: {xs: 2, sm: 2},
                color: 'white',
                minWidth: 250
            }} variant='outlined'>Approve</Button>
        </Box>
    </Box>
  );
};

export default Borrow;