// React imports
import React from 'react'

// Material-UI components
import {
    Stack, Box, Typography, Collapse, Link, Button,
    useTheme, Theme
} from '@mui/material'

// Core components & types
import Icon from '@/@core/components/icon'

// Contexts
import { useGlobalValues } from '@/context/GlobalContext'

// Third-party libraries
import clsx from 'clsx'
import { CollateralParams } from '@/context/ModuleProvider/type'
import { useRouter } from 'next/router'
import { formatEther } from 'viem'
import { formatPercent } from '@/hooks/utils'
import { useModuleView } from '@/context/ModuleProvider/useModuleView'

// Define Props
interface TableHeaderProps {
    row: CollateralParams
}

const FaucetRow = (props: TableHeaderProps) => {
    const {row} = props
    const theme: Theme = useTheme()
    const {isMediumScreen, isSmallScreen} = useGlobalValues()

    const { moduleInfo } = useModuleView(row.symbol)

    if (!row || typeof row.symbol === 'undefined') {
        console.error('CollateralRow component received undefined "row" or "row.symbol" property.');
        return <div>Missing data</div>; // You can customize this message or behavior as needed.
    }

    return (
        <Stack display='flex' sx={{
            borderRadius: '8px', border: `solid 1px transparent`, 
            cursor: 'pointer',
            background: 'transparent',
            [theme.breakpoints.up('md')] : {
                '&:hover': {
                    borderColor: theme.palette.primary.main,
                    background: '#10131487'
                }
            }}}>
            {isMediumScreen ? (
            <Stack sx={{px: {xs: 3, sm: 6}, py: {xs: 3, sm: 5}}}>
                <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'space-between'}}>
                    <Stack direction='row' sx={{alignItems: 'center'}}>
                        <img 
                            src={`/images/tokens/${row.symbol.replace(/\//g, '-').replace(/\s+/g, '')}.png`}
                            alt={row.symbol} height={isSmallScreen ? 24 : 32}
                            style={{ width: 'auto', borderRadius: '100%' }}
                        />
                        <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} sx={{fontWeight: 400, ml: 2}}>{row.symbol}</Typography>
                    </Stack>
                </Stack>
                <Stack direction='row' sx={{mt: 2, alignItems: 'center'}}>
                    <Stack direction='row' sx={{flex: '1 1 0%'}}>
                        <Typography variant='body2' color='#D4D4D4'>MAX Leverage</Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '1 1 0%'}}>
                        <Typography variant='body2' color='#D4D4D4'>Borrow APY</Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '1.3 1 0%'}}>
                        <Typography variant='body2' color='#D4D4D4'>Deposit APY</Typography>
                    </Stack>
                </Stack>
                <Stack direction='row' sx={{mt: 2, alignItems: 'center'}}>
                    <Stack direction='row' sx={{flex: '1 1 0%'}}>
                        <Typography variant='h5' sx={{fontWeight: 400}}>{row.borrowAPY}%</Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '1 1 0%'}}>
                        <Typography variant='h5' sx={{fontWeight: 400}}>{row.maxLeverage.toFixed(2)}x&nbsp;</Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '1.3 1 0%', alignItems: 'center'}}>
                        <Typography variant='h5' sx={{fontWeight: 400}} color='primary'>{row.maxDepositAPY}%&nbsp;</Typography>
                        <Icon icon='bi:fire' color={theme.palette.primary.main} fontSize={18}/>
                    </Stack>
                </Stack>
                <Stack direction='row' sx={{mt: 2, alignItems: 'center'}}>
                    <Stack direction='row' sx={{flex: '1 1 0%'}}>
                        <Typography variant='subtitle2' color='#98999D'>{formatPercent(+formatEther(row.LTV) * 100, 2)} LTV</Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '1.3 1 0%'}}>
                        <Typography variant='subtitle2' color='#98999D' sx={{display: 'flex', alignItems: 'center'}}>
                            (Base&nbsp;
                                <Icon icon='mi:circle-information' fontSize={isSmallScreen ? 12: 18}/>
                            &nbsp;: {row.baseAPY.toFixed(3)}%)
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
            ) : (
            <Stack direction='row' sx={{alignItems: 'center', 
                px: {xs: 3, sm: 6}, py: {xs: 3, sm: 5}
            }}>
                <Stack direction='row' sx={{flex: '2 1 0%', alignItems: 'center'}}>
                    <img 
                        src={`/images/tokens/${row.symbol.replace(/\//g, '-').replace(/\s+/g, '')}.png`}
                        alt={row.symbol} width={32} height={32}
                        style={{ width: 'auto', borderRadius: '100%' }}
                    />
                    <Typography variant='h5' sx={{fontWeight: 400, ml: 2}}>{row.symbol}</Typography>
                </Stack>
                <Stack direction='row' sx={{flex: '1 1 0%'}}>
                    <Typography variant='h5' sx={{fontWeight: 400}}>10,250</Typography>
                </Stack>
                <Stack direction='row' sx={{flex: '1 1 0%'}}>
                    <Typography variant='h5' sx={{fontWeight: 400}}>$825</Typography>
                </Stack>
                <Stack direction='row' sx={{flex: '1.25 1 0%', alignItems: 'center', gap: 8}}>
                    <Button variant='outlined' color='primary' sx={{py: 2, color: '#FFFFFF', fontWeight: 600}}>
                        Get Token
                    </Button>
                    <Box>
                        <Typography variant='body1' sx={{fontWeight: 400}} color='#FFF'>Next claim in:</Typography>
                        <Typography variant='body2' sx={{fontWeight: 400}} color='primary'>23:59:59</Typography>
                    </Box>
                </Stack>
            </Stack>
            )}
        </Stack>
    )
}
export default FaucetRow