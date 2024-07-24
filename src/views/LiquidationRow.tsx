import { useGlobalValues } from "@/context/GlobalContext";
import { useModuleView } from "@/context/ModuleProvider/useModuleView";
import { formatToThousands, shortenWalletAddress } from "@/hooks/utils";
import { LiquidationRowType } from "@/types";
import { Theme, useTheme, Stack, Typography, Button, Link } from "@mui/material";
import { useRouter } from 'next/router'
import { formatEther } from "viem";

interface LiquidationRowProps {
    row: LiquidationRowType
}

const getHealthColor = (value: number) => {
    if(value < 1.00)
        return '#FF4A3E'
    if(value < 1.01)
        return '#F0CE59'
    return '#FFF'
}

const getHealthDescription = (value: number) => {
    if(value < 1.00)
        return 'Ready to Luiquidate'
    if(value < 1.01)
        return 'At Risk'
    return ''
}

const LiquidationRow = (prop:LiquidationRowProps) => {
    const { row } = prop
    const { moduleInfo } = useModuleView(row.symbol)
    const { isSmallScreen, isMediumScreen } = useGlobalValues()
    const router = useRouter()
    const theme: Theme = useTheme()
    let {
        debt: debtAmount = BigInt(0),
        coll: depositedAmount = BigInt(0),
        status: positionStatus = 'nonExistent'
    } = moduleInfo || {}

    if(debtAmount > row.debtTokenGasCompensation)
        debtAmount -= row.debtTokenGasCompensation

    const currentLTV = (depositedAmount == BigInt(0) || debtAmount ==  BigInt(0)) ? 0 : ((+formatEther(debtAmount + row.debtTokenGasCompensation)) / (+formatEther(depositedAmount) * +formatEther(row.price)) * 100)
    const healthFactor = (currentLTV == 0) ? 0 : (+formatEther(row.liquidation) / currentLTV * 100)

    return (
        <Stack display={ positionStatus !== 'active' ? 'none' : 'flex'} sx={{
            borderRadius: '8px', border: 'solid 1px transparent', 
            background: 'transparent',
            [theme.breakpoints.up('md')] : {
                '&:hover': {
                    borderColor: theme.palette.primary.main,
                }
            }}}>
            {isMediumScreen ? (
            <Stack sx={{px: {xs: 3, sm: 6}, py: {xs: 3, sm: 5}, mb: 4}}>
                <Stack direction='row' sx={{alignItems: 'center'}} justifyContent='space-between'>
                    <Stack direction='row' sx={{alignItems: 'center'}}>
                        <img 
                            src={`/images/tokens/${row.symbol.replace(/\//g, '-').replace(/\s+/g, '')}.png`}
                            alt={row.symbol} height={isSmallScreen ? 24 : 32}
                            style={{ width: 'auto', borderRadius: '100%' }}
                        />
                        <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} sx={{fontWeight: 400, ml: 2}}>{row.symbol}</Typography>
                    </Stack>
                    <Link href='#'>
                        <Typography variant='h5' sx={{fontWeight: 400, textDecoration: 'underline'}}>{shortenWalletAddress(row.address)}</Typography>
                    </Link>
                </Stack>
                <Stack direction='row' sx={{mt: 4, flexDirection: {xs: 'column', md: 'row'}}} gap={4}>
                    <Stack sx={{width: 1}}>
                        <Stack direction='row' sx={{alignItems: 'center'}}>
                            <Stack direction='row' sx={{flex: '1 1 0%'}}>
                                <Typography variant='body2' color='#D4D4D4'>Borrowed</Typography>
                            </Stack>
                            <Stack direction='row' sx={{flex: '1 1 0%'}}>
                                <Typography variant='body2' color='#D4D4D4'>Health Factor</Typography>
                            </Stack>
                            <Stack direction='row' sx={{flex: '1 1 0%'}}>
                                <Typography variant='body2' color='#D4D4D4'>Coll. Ratio</Typography>
                            </Stack>
                        </Stack>
                        <Stack direction='row' sx={{alignItems: 'center'}}>
                            <Stack direction='row' sx={{flex: '1 1 0%'}}>
                                <Typography variant='h5' sx={{fontWeight: 400}}>
                                    {formatToThousands(+formatEther(debtAmount), 2)}
                                </Typography>
                            </Stack>
                            <Stack direction='row' sx={{flex: '1 1 0%'}}>
                                <Typography variant='h5' sx={{fontWeight: 400, color: getHealthColor(healthFactor)}}>
                                    {healthFactor.toFixed(2)}&nbsp;
                                    {getHealthDescription(healthFactor)}
                                </Typography>
                            </Stack>
                            <Stack direction='row' sx={{flex: '1 1 0%'}}>
                                <Typography variant='h5' sx={{fontWeight: 400}}>{currentLTV.toFixed(2)}%</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack direction='row' sx={{alignItems: 'center'}}>
                        <Button variant='outlined' color='primary' sx={{px:8, py: 3, color: '#FFF', width: {xs: 1, md: 'auto'}}} disabled={healthFactor > 1}>
                            Liquidate
                        </Button>
                    </Stack>
                </Stack>
                
            </Stack>
            ) : (
            <Stack direction='row' sx={{alignItems: 'center', 
                px: {xs: 3, sm: 6}, py: {xs: 2, sm: 2.5}}}>
                <Stack direction='row' sx={{flex: '4 1 0%', alignItems: 'center'}}>
                    <img 
                        src={`/images/tokens/${row.symbol.replace(/\//g, '-').replace(/\s+/g, '')}.png`}
                        alt={row.symbol} width={32} height={32}
                        style={{ width: 'auto', borderRadius: '100%' }}
                    />
                    <Typography variant='h5' sx={{fontWeight: 400, ml: 2}}>{row.symbol}</Typography>
                </Stack>
                <Stack direction='row' sx={{flex: '3 1 0%'}}>
                    <Link href='#'>
                        <Typography variant='h5' sx={{fontWeight: 400, textDecoration: 'underline'}}>{shortenWalletAddress(row.address)}</Typography>
                    </Link>
                </Stack>
                <Stack direction='row' sx={{flex: '3 1 0%', alignItems: 'center'}}>
                    <Typography variant='h5' sx={{fontWeight: 400}}>
                        {formatToThousands(+formatEther(debtAmount), 2)}
                    </Typography>
                </Stack>
                <Stack direction='row' sx={{flex: '4.5 1 0%', alignItems: 'center'}}>
                    <Typography variant='h5' sx={{fontWeight: 400, color: getHealthColor(healthFactor)}}>
                        {healthFactor.toFixed(2)}&nbsp;
                        {getHealthDescription(healthFactor)}
                    </Typography>
                </Stack>
                <Stack direction='row' sx={{flex: '2 1 0%', alignItems: 'center'}}>
                    <Typography variant='h5' sx={{fontWeight: 400}}>{currentLTV.toFixed(2)}%</Typography>
                </Stack>
                <Stack direction='row' sx={{flex: '2.5 1 0%', justifyContent:'flex-end', alignItems: 'center'}}>
                    <Button variant='outlined' color='primary' sx={{px:8, py: 3, color: '#FFF'}} disabled={healthFactor > 1}>
                        Liquidate
                    </Button>
                </Stack>
            </Stack>
            )}
        </Stack>
    ) 
}

export default LiquidationRow