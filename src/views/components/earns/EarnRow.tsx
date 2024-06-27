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
import { formatPercent, formatToThousands, formatToThousandsInt, getAssetPath } from '@/hooks/utils'
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
        case 'Ethereum':
            return 'secondary';
        case 'Binance':
            return 'warning';
        case 'Polygon':
            return 'error';
        case 'Avalanche':
            return 'primary';
        case 'Solana':
            return 'info';
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
        <Stack sx={{borderRadius:  2, border: `solid 1px #FFFFFF33`, backgroundColor: '#0c0e0e'}}>
            {isSmallScreen ? (
            <></>
            ) : (
            <Stack zIndex={1} direction='row' sx={{alignItems: 'center', 
                p: {xs: 3, sm: 6}
            }}>
                <Stack direction='row' sx={{flex: '5 1 0%', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Stack direction='row' alignItems='center'>
                        <img 
                            src={`/images/tokens/${row.symbol.replace(/\//g, '-').replace(/\s+/g, '')}.png`}
                            alt={row.symbol} width={32} height={32}
                            style={{ width: 'auto', borderRadius: '100%' }}
                        />
                        <Typography variant='h5' sx={{fontWeight: 400, ml: 2}}>{row.symbol}</Typography>
                    </Stack>
                    <Typography variant='h5' color='primary' sx={{ fontWeight: 400, cursor: 'pointer', pr: 12 }}>
                        Get LP Token
                        <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'
                            style={{ marginLeft: 8 }}
                        >
                            <g clipPath='url(#clip0_719_13657)'>
                                <path
                                d='M11.625 0.75V4.125C11.625 4.33228 11.4573 4.5 11.25 4.5C11.0427 4.5 10.875 4.33228 10.875 4.125V1.65525L5.51512 7.01513C5.44191 7.08834 5.34591 7.125 5.25 7.125C5.15409 7.125 5.05809 7.08834 4.98488 7.01513C4.95003 6.98032 4.92239 6.93899 4.90353 6.8935C4.88467 6.84801 4.87496 6.79925 4.87496 6.75C4.87496 6.70075 4.88467 6.65199 4.90353 6.6065C4.92239 6.56101 4.95003 6.51968 4.98488 6.48487L10.3448 1.125H7.875C7.66772 1.125 7.5 0.957281 7.5 0.75C7.5 0.542719 7.66772 0.375 7.875 0.375H11.25C11.4573 0.375 11.625 0.542719 11.625 0.75ZM10.125 10.5V6C10.125 5.79272 9.95728 5.625 9.75 5.625C9.54272 5.625 9.375 5.79272 9.375 6V10.5C9.375 10.7069 9.20691 10.875 9 10.875H1.5C1.29309 10.875 1.125 10.7069 1.125 10.5V3C1.125 2.79309 1.29309 2.625 1.5 2.625H6C6.20728 2.625 6.375 2.45728 6.375 2.25C6.375 2.04272 6.20728 1.875 6 1.875H1.5C0.879656 1.875 0.375 2.37966 0.375 3V10.5C0.375 11.1203 0.879656 11.625 1.5 11.625H9C9.62034 11.625 10.125 11.1203 10.125 10.5Z'
                                fill='#67DAB1'
                                />
                            </g>
                            <defs>
                                <clipPath id='clip0_719_13657'>
                                <rect width='12' height='12' fill='white' />
                                </clipPath>
                            </defs>
                        </svg>
                    </Typography>
                </Stack>
                <Stack direction='row' sx={{flex: '3.3 1 0%', alignItems: 'center'}}>
                    <Typography variant='h5' sx={{fontWeight: 400}} color='primary'>{row.maxDepositAPY}%&nbsp;</Typography>
                    <Icon icon='bi:fire' color={theme.palette.primary.main} fontSize={18}/>
                    <Typography variant='subtitle1' color='#98999D' sx={{display: 'flex', alignItems: 'center'}}>
                        &nbsp;(Base&nbsp;
                            <Icon icon='mi:circle-information' fontSize={18}/>
                        &nbsp;: {row.baseAPY.toFixed(2)}%)
                    </Typography>
                </Stack>
                <Stack direction='row' sx={{flex: '2.3 1 0%', alignItems: 'center'}}>
                    <Stack direction='row' width='100%' mr={8} justifyContent='space-between' alignItems='center'>
                        <Typography variant='h5' fontWeight={400}>${formatToThousandsInt(500000)}</Typography>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2" height="100%" viewBox="0 0 2 68" fill="none">
                            <path opacity="0.5" d="M1 0V68" stroke="white" strokeWidth="0.3"/>
                        </svg>
                    </Stack>
                </Stack>
                <Stack direction='row' sx={{flex: '3.7 1 0%', alignItems: 'center'}}>
                    <Stack direction='row' width='100%' mr={8} justifyContent='space-between' alignItems='center'>
                        <Stack direction='row' width='100%' mr={8} justifyContent='space-between' alignItems='center'>
                            <Typography className='font-britanica' fontSize={24} color='white' fontWeight={400}>
                                200
                            </Typography>
                            <Button variant='contained' color='primary'
                                sx={{ 
                                    maxWidth: '100%', width: 155, py: { xs: 2, lg: 3 }, color: '#000', fontSize: { xs: 16, md: 18 }, fontWeight: 500, borderRadius: '10px'
                                }}
                            >
                                Stake
                            </Button>
                        </Stack>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2" height="100%" viewBox="0 0 2 68" fill="none">
                            <path opacity="0.5" d="M1 0V68" stroke="white" strokeWidth="0.3"/>
                        </svg>
                    </Stack>
                </Stack>
                <Stack direction='row' sx={{flex: '3.7 1 0%', alignItems: 'center'}}>
                    <Stack direction='row' width='100%' mr={8} justifyContent='space-between' alignItems='center'>
                        <Stack direction='row' width='100%' mr={8} justifyContent='space-between' alignItems='center'>
                            <Typography className='font-britanica' fontSize={24} color='white' fontWeight={400}>
                                400
                            </Typography>
                            <Button variant='outlined' color='primary'
                                sx={{ 
                                    maxWidth: '100%', width: 155, py: { xs: 2, lg: 3 }, color: '#FFF', fontSize: { xs: 16, md: 18 }, fontWeight: 400, borderRadius: '10px'
                                }}
                            >
                                Withdraw
                            </Button>
                        </Stack>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2" height="100%" viewBox="0 0 2 68" fill="none">
                            <path opacity="0.5" d="M1 0V68" stroke="white" strokeWidth="0.3"/>
                        </svg>
                    </Stack>
                </Stack>
                <Stack direction='row' sx={{flex: '3.5 1 0%', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Stack alignItems='end'>
                        <Stack direction='row' gap={3.5} alignItems='center'>
                            <img 
                                src={`/images/tokens/trenUSD.png`}
                                alt='trenUSD' width={25} height={25}
                                style={{ width: 'auto', borderRadius: '100%' }}
                            />
                            <Typography className='font-britanica' fontSize={24} color='white' fontWeight={400}>
                                178.2
                            </Typography>
                        </Stack>
                        <Typography variant='subtitle1' color='#98999D'>
                            ~ $500.45
                        </Typography>
                    </Stack>
                    <Button variant='outlined'
                        sx={{ 
                            maxWidth: '100%', width: 155, py: { xs: 2, lg: 3 }, color: '#FFF', fontSize: { xs: 16, md: 18 }, fontWeight: 400, borderRadius: '10px', borderColor: '#C6E0DC'
                        }}
                    >
                        Claim
                    </Button>
                </Stack>
                {/* <Stack direction='row' sx={{flex: '1 1 0%', justifyContent:'space-between', alignItems: 'center'}}>
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
                </Stack> */}
            </Stack>
            )}
        </Stack>
    )
}