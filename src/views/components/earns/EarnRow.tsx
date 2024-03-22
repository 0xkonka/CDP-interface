// React imports
import React from 'react'

// Material-UI components
import {
    Stack, Box, Typography, Collapse, Link, Button,
    useTheme, Theme, Grid
} from '@mui/material'

// Core components & types
import Icon from '@/@core/components/icon'
import CustomChip from '@/@core/components/mui/chip'

// Contexts
import { useGlobalValues } from '@/context/GlobalContext'

// Third-party libraries
import clsx from 'clsx'
import { CollateralParams } from '@/context/ModuleProvider/type'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { showToast } from '@/hooks/toasts'
import { formatEther } from 'viem'
import { formatPercent, formatToThousands, getAssetPath } from '@/hooks/utils'
import { useModuleView } from '@/context/ModuleProvider/useModuleView'
import { StakeCard } from './StakeCard'
import {StakeCardTren} from './StakeCardTren'

// Define Props
interface TableHeaderProps {
    row: CollateralParams
    onToogle: () => void;
    isOpen: boolean,
}

const getChipTheme = (label: string) => {
    switch(label) {
        case 'LRT':
            return 'secondary';
        case 'LST':
            return 'secondary';
        case 'RWA':
            return 'error';
        case 'LP Token':
            return 'primary';
        case 'Vault':
            return 'info';
        case 'PT Tokens':
            return 'secondary';
        case 'Meme':
            return 'secondary';
        case 'Volatile':
            return 'warning';
        case 'Stable':
            return 'success';
        default:
            return 'secondary';
    }
}

export const EarnRow = (props: TableHeaderProps) => {
    const router = useRouter()
    const {isOpen, row, onToogle} = props
    const theme: Theme = useTheme()
    const {isMediumScreen, isSmallScreen} = useGlobalValues()

    const { moduleInfo } = useModuleView(row.symbol)
    const {
      status: positionStatus = 'nonExistent'
    } = moduleInfo || {}

    if (!row || typeof row.symbol === 'undefined') {
        console.error('CollateralRow component received undefined "row" or "row.symbol" property.');
        return <div>Missing data</div>; // You can customize this message or behavior as needed.
    }

    const goToPosition = () => {
        showToast('success', 'Deposit', 'Deposit Action Here', 1000)
        // router.replace(`/modules/borrow/${row.symbol}`)
    }

    return (
        <Stack sx={{borderRadius:  2, border: `solid 1px ${isOpen ? theme.palette.primary.main : 'transparent'}`, cursor: 'pointer',
            '& .active-open': {
                color: theme.palette.primary.main,
                // color: 'black',
            },
            [theme.breakpoints.up('md')] : {
                '& .active-open': {
                    color: 'black !important',
                },
                '&:hover': {
                    borderColor: theme.palette.primary.main,
                }
            }}}>
            {isMediumScreen ? (
            <Stack zIndex={1} sx={{p: {xs: 3, sm: 6}}} onClick={
                (event) => {
                    if(event.target instanceof HTMLElement && event.target.className.includes('open-button')) {
                        showToast('success', 'Deposit', 'Deposit Action Here', 1000)
                        return
                    }
                    onToogle()
                }
            }>
                <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'space-between'}}>
                    <Stack direction='row' sx={{alignItems: 'center'}}>
                        <img 
                            src={`/images/tokens/${row.symbol.replace(/\//g, '-').replace(/\s+/g, '')}.png`}
                            alt={row.symbol} height={isSmallScreen ? 24 : 32}
                            style={{ width: 'auto' }}
                        />
                        <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} sx={{fontWeight: 400, ml: 2}}>{row.symbol}</Typography>
                        <CustomChip label={row.type} skin='light' color={getChipTheme(row.type)} style={{marginLeft: 16}}/>
                    </Stack>
                    <Stack direction='row' sx={{justifyContent:'space-between', alignItems: 'center'}}>
                        {
                            isOpen ? <Icon icon='solar:alt-arrow-up-outline' color={theme.palette.primary.main}/> :
                                    <Icon icon='solar:alt-arrow-down-outline'/>
                        }
                    </Stack>
                </Stack>
                <Stack direction='row' sx={{mt: 2, alignItems: 'center'}}>
                    <Stack direction='row' sx={{flex: '1.25 1 0%'}}>
                        <Typography variant='body2' color='#D4D4D4'>Platform</Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '2 1 0%'}}>
                        <Typography variant='body2' color='#D4D4D4'>APY</Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '1 1 0%'}}>
                        <Typography variant='body2' color='#D4D4D4'>Liquidity</Typography>
                    </Stack>
                </Stack>
                <Stack direction='row' sx={{mt: 2, alignItems: 'center'}}>
                    <Stack direction='row' sx={{flex: '1.25 1 0%'}}>
                        <img width={26} src={`/images/platforms/${getAssetPath(row.platform)}.png`} alt={row.platform}/>
                    </Stack>
                    <Stack direction='row' sx={{flex: '2 1 0%'}}>
                        <Typography variant='h5' sx={{fontWeight: 400}} color='primary'>{row.maxDepositAPY}%&nbsp;</Typography>
                        <Icon icon='bi:fire' color={theme.palette.primary.main} fontSize={18}/>
                    </Stack>
                    <Stack direction='row' sx={{flex: '1 1 0%', alignItems: 'center'}}>
                        <Typography fontWeight={500}>{formatToThousands(500000).slice(1)}</Typography>
                    </Stack>
                </Stack>
                <Stack direction='row' sx={{mt: 2, alignItems: 'center'}}>
                    <Stack direction='row' sx={{flex: '1.25 1 0%'}}>
                        <Typography>{row.platform}</Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '2 1 0%'}}>
                        <Typography variant='subtitle2' color='#98999D' sx={{display: 'flex', alignItems: 'center'}}>
                            (Base&nbsp;
                                <Icon icon='mi:circle-information' fontSize={isSmallScreen ? 12: 18}/>
                            &nbsp;: {row.baseAPY.toFixed(2)}%)
                        </Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '1 1 0%', alignItems: 'center'}}>
                        <Typography fontWeight={500}>trenUSD</Typography>
                    </Stack>
                </Stack>
            </Stack>
            ) : (
            <Stack zIndex={1} direction='row' sx={{alignItems: 'center', 
                p: {xs: 3, sm: 6}
            }} onClick={
                (event) => {
                    if(event.target instanceof HTMLElement && event.target.className.includes('open-button')) {
                        showToast('success', 'Deposit', 'Deposit Action Here', 1000)
                        return
                    }
                    onToogle()
                }
            }>
                <Stack direction='row' sx={{flex: '2 1 0%', alignItems: 'center'}}>
                    <img 
                        src={`/images/tokens/${row.symbol.replace(/\//g, '-').replace(/\s+/g, '')}.png`}
                        alt={row.symbol} width={32} height={32}
                        style={{ width: 'auto' }}
                    />
                    <Typography variant='h5' sx={{fontWeight: 400, ml: 2}}>{row.symbol}</Typography>
                    <CustomChip label={row.type} skin='light' color={getChipTheme(row.type)} style={{marginLeft: 16}}/>
                </Stack>
                <Stack direction='row' sx={{flex: '1 1 0%', gap: 2}}>
                    <img width={26} src={`/images/platforms/${getAssetPath(row.platform)}.png`} alt={row.platform}/>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>{row.platform}</Typography>
                </Stack>
                <Stack direction='row' sx={{flex: '1.5 1 0%', alignItems: 'center'}}>
                    <Typography variant='h5' sx={{fontWeight: 400}} color='primary'>{row.maxDepositAPY}%&nbsp;</Typography>
                    <Icon icon='bi:fire' color={theme.palette.primary.main} fontSize={18}/>
                    <Typography variant='subtitle1' color='#98999D' sx={{display: 'flex', alignItems: 'center'}}>
                        &nbsp;(Base&nbsp;
                            <Icon icon='mi:circle-information' fontSize={18}/>
                        &nbsp;: {row.baseAPY.toFixed(2)}%)
                    </Typography>
                </Stack>
                <Stack direction='row' sx={{flex: '1.25 1 0%', alignItems: 'center'}}>
                    <Typography variant='h5' fontWeight={400} color='white'>{formatToThousands(500000).slice(1)} trenUSD</Typography>
                </Stack>
                <Stack direction='row' sx={{flex: '1 1 0%', justifyContent:'space-between', alignItems: 'center'}}>
                    <Stack direction='row' sx={{cursor: 'pointer', alignItems: 'center'}}>
                        <Button variant={isOpen ? 'contained' : 'outlined'} color='primary' sx={{color: isOpen ? '#0D1313' : '#FFFFFF', fontWeight: 600}} className={clsx('open-button', {
                            'active-open': isOpen
                        })}>
                            Deposit
                        </Button>
                    </Stack>
                    {
                        isOpen ? <Icon icon='solar:alt-arrow-up-outline' color={theme.palette.primary.main} style={{cursor: 'pointer'}}/> :
                                <Icon icon='solar:alt-arrow-down-outline' style={{cursor: 'pointer'}}/>
                    }
                </Stack>
            </Stack>
            )}
            
             {/* Collapsible Content */}
            <Collapse in={isOpen}>
                <Box sx={{px: {xs: 3, sm: 6}, pb: {xs: 0, sm: 6}}}>
                    <Box sx={{
                        borderTop: 'solid 1px #36373D',
                        px: {xs: 0, md: 12}
                    }}>
                        <Grid container spacing={isSmallScreen ? 6 : 12} pt={6}>
                            <Grid item xs={12} md={6}>
                                <StakeCard balanceUSD={400} poolShare={2} txHash='https://sepolia.etherscan.io/tx/0x1c36dc0dc64bf5e690f021464c2b5ca86d7e6ffcf5a0cb95e04d3adf4a3b3fbe'/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StakeCardTren balanceTren={2} balanceUSD={300} txHash='https://sepolia.etherscan.io/tx/0x1c36dc0dc64bf5e690f021464c2b5ca86d7e6ffcf5a0cb95e04d3adf4a3b3fbe'/>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Collapse>
            <Stack direction='row' sx={{mt: 6, p: {xs: 3, sm: 6}, display: {xs: 'flex' , lg: 'none'}}}>
                <Button onClick={goToPosition} color={isOpen ? 'primary' : 'secondary'} sx={{ 
                        py: 2,
                        borderRadius: '10px',
                        minWidth: isSmallScreen ? 1 : 160,
                        // color: 'white'
                    }} 
                    variant='outlined'
                    className={isOpen ? 'active-open': ''}
                >
                    Deposit
                </Button>
            </Stack>
        </Stack>
    )
}