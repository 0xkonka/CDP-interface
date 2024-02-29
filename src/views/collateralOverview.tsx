//@ MUI components
import {
    Grid, Stack, Typography,
} from '@mui/material'

//@ Contexts
import { useGlobalValues } from '@/context/GlobalContext'

// Define Props
interface Props {
    collateral: string
}

interface Overview {
    platform: string
    liquidationThreshold: number
    totalTrenUSD: number 
    tvlLeverage: number 
    tvl: number
    borrowFee: number
    availableTrenUSD: number
    interestRate: number
}

const formatMoney = (value:number) => {
    if (value < 1e3) return value.toString();
    if (value >= 1e3 && value < 1e6) return (value / 1e3).toFixed(2) + "k";
    if (value >= 1e6 && value < 1e9) return (value / 1e6).toFixed(2) + "M";
    if (value >= 1e9 && value < 1e12) return (value / 1e9).toFixed(2) + "B";
    if (value >= 1e12) return (value / 1e12).toFixed(2) + "T";
}

const formatPercent = (value:number, floating = 0) => {
    return value.toFixed(floating) + '%'
}

const getOverView = (collateral:string) => {
    // Here we will get Detail values from <collateral> parameter (It is collateral asset name)
    const overview: Overview = {
        platform: 'Uniswap v3',
        liquidationThreshold: 80,
        totalTrenUSD: 800000,
        tvlLeverage: 25,
        tvl: 4300000,
        borrowFee: 6.263,
        availableTrenUSD: 500000,
        interestRate: 5
    }
    return overview;
}

export const CollateralOverview = (props: Props) => {
    const {isSmallScreen} = useGlobalValues()
    const {collateral} = props
    const overview: Overview = getOverView(collateral)

    return (
        <Grid container sx={{
                py: 2.5,
                width: 'calc(100% + 64px)',
                marginLeft: -8,
                '& > .MuiGrid-item': {
                    padding: theme => `${theme.spacing(isSmallScreen ? 1 :  2)} ${theme.spacing(8)}`, // vertical | horizontal spacing
                },
        }}>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}} >
                    <Typography variant='subtitle1' color='#D4D4D4'>Platform</Typography>
                    <Stack direction='row' sx={{gap: 2}}>
                        <img width={26} src='/images/platforms/uniswap.png' alt={overview.platform}/>
                        <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{overview.platform}</Typography>
                    </Stack>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}} >
                    <Typography variant='subtitle1' color='#D4D4D4'>Liquidation Threshold</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatPercent(overview.liquidationThreshold)}</Typography>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}} >
                    <Typography variant='subtitle1' color='#D4D4D4'>Total trenUSD</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatMoney(overview.totalTrenUSD)}</Typography>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}} >
                    <Typography variant='subtitle1' color='#D4D4D4'>LTV - Leverage</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatPercent(overview.tvlLeverage)}</Typography>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant='subtitle1' color='#D4D4D4'>TVL</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatMoney(overview.tvl)}</Typography>
                </Stack>    
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant='subtitle1' color='#D4D4D4'>Borrow Fee</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatPercent(overview.borrowFee, 3)}</Typography>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant='subtitle1' color='#D4D4D4'>Available trenUSD</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatMoney(overview.availableTrenUSD)}</Typography>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant='subtitle1' color='#D4D4D4'>Interest Rate</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatPercent(overview.interestRate)}</Typography>
                </Stack>
            </Grid>
        </Grid>
    )
}
