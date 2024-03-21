// Material-UI components
import {
    Grid, Stack, Typography,
} from '@mui/material'

// Contexts & Types
import { useGlobalValues } from '@/context/GlobalContext'

// Utilities
import { formatMoney, formatPercent, getAssetPath } from '@/hooks/utils';
import { CollateralParams } from '@/context/ModuleProvider/type';
import { formatEther, formatUnits } from 'viem';

// Define Props
interface Props {
    row: CollateralParams
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
                        <img width={26} src={`/images/platforms/${getAssetPath(row.platform)}.png`} alt={row.platform}/>
                        <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{row.platform}</Typography>
                    </Stack>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}} >
                    <Typography variant='subtitle1' color='#D4D4D4'>Liquidation Threshold</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatPercent(+formatEther(row.liquidation) * 100, 2)}</Typography>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}} >
                    <Typography variant='subtitle1' color='#D4D4D4'>Total trenUSD</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatMoney(+formatUnits(row.mintCap, row.decimals))}</Typography>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}} >
                    <Typography variant='subtitle1' color='#D4D4D4'>LTV - Leverage</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatPercent(+formatEther(row.LTV) * 100, 2)}</Typography>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant='subtitle1' color='#D4D4D4'>TVL</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatMoney(+formatUnits(row.totalAssetDebt, row.decimals))}</Typography>
                </Stack>    
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant='subtitle1' color='#D4D4D4'>Borrow Fee</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatPercent(+formatEther(row.borrowingFee) * 100, 3)}</Typography>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant='subtitle1' color='#D4D4D4'>Available trenUSD</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatMoney(+formatUnits(row.totalBorrowAvailable, row.decimals))}</Typography>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant='subtitle1' color='#D4D4D4'>Interest Rate</Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{formatPercent(row.interest)}</Typography>
                </Stack>
            </Grid>
        </Grid>
    )
}
