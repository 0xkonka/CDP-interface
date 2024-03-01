// Material-UI components
import {
    Grid, Stack, Typography,
} from '@mui/material'

// Contexts & Types
import { useGlobalValues } from '@/context/GlobalContext'
import { CollateralType } from '@/types/collateral/types'

// Utilities
import { formatMoney, formatPercent } from '@/hooks/utils';

// Define Props
interface Props {
    row: CollateralType
}


export const CollateralOverview = (props: Props) => {
    const {isSmallScreen} = useGlobalValues()
    const {row} = props

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
                        <img width={26} src='/images/platforms/uniswap.png' alt={row.platform}/>
                        <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{row.platform}</Typography>
                    </Stack>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}} >
                    <Typography variant='subtitle1' color='#D4D4D4'>Liquidation Threshold</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatPercent(row.liquidationThreshold)}</Typography>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}} >
                    <Typography variant='subtitle1' color='#D4D4D4'>Total trenUSD</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatMoney(row.totalTrenUSD)}</Typography>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}} >
                    <Typography variant='subtitle1' color='#D4D4D4'>LTV - Leverage</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatPercent(row.tvlLeverage)}</Typography>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant='subtitle1' color='#D4D4D4'>TVL</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatMoney(row.tvl)}</Typography>
                </Stack>    
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant='subtitle1' color='#D4D4D4'>Borrow Fee</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatPercent(row.borrowFee, 3)}</Typography>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant='subtitle1' color='#D4D4D4'>Available trenUSD</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatMoney(row.availableTrenUSD)}</Typography>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant='subtitle1' color='#D4D4D4'>Interest Rate</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatPercent(row.interestRate)}</Typography>
                </Stack>
            </Grid>
        </Grid>
    )
}
