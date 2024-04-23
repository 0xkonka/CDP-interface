// React imports
import React from 'react'

// Material-UI components
import {
    Stack, Box, Typography, Collapse, Link, Button,
    useTheme, Theme
} from '@mui/material'

// Core components & types
import Icon from '@/@core/components/icon'
import CustomChip from '@/@core/components/mui/chip'

// Subcomponents
import { BorrowPosition } from './components/positions/borrow'

// Subpages
import { CollateralOverview } from './collateralOverview'

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
    onToogle: () => void;
    isOpen: boolean,
    disableToogle?: boolean
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

const CollateralRow = (props: TableHeaderProps) => {
    const router = useRouter()
    const {isOpen, row, onToogle, disableToogle} = props
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
        router.replace(`/modules/borrow/${row.symbol}`)
    }

    return (
        <Stack display={disableToogle && positionStatus !== 'active' ? 'none' : 'flex'} sx={{borderRadius:  2, border: `solid 1px ${isOpen ? theme.palette.primary.main : 'transparent'}`, cursor: 'pointer',
            '& .active-open': {
                color: theme.palette.primary.main,
                '& .arrow-diagonal': {
                    display: 'none'
                },
                '& .arrow-right': {
                    display: 'block'
                }
            },
            '& .arrow-right': {
                display: 'none'
            },
            [theme.breakpoints.up('md')] : {
                '& .active-open': {
                    color: 'black !important',
                },
                '&:hover': {
                    borderColor: theme.palette.primary.main,
                    '& .active-hover': {
                        color: theme.palette.primary.main,
                        '& .arrow-diagonal': {
                            display: 'none'
                        },
                        '& .arrow-right': {
                            display: 'block'
                        }
                    },
                }
            }}}>
            {isMediumScreen ? (
            <Stack sx={{p: {xs: 3, sm: 6}}} onClick={
                (event) => {
                    if(event.target instanceof HTMLElement && event.target.className.includes('open-button') ||
                        event.target instanceof SVGElement && event.target.className.baseVal.includes('arrow-right')) {
                        router.replace(`/modules/borrow/${row.symbol}`)
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
                    <Stack direction='row' sx={{justifyContent:'space-between', alignItems: 'center', display: disableToogle? 'none' : 'flex'}}>
                        {
                            isOpen ? <Icon icon='solar:alt-arrow-up-outline' color={theme.palette.primary.main}/> :
                                    <Icon icon='solar:alt-arrow-down-outline'/>
                        }
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
                        <Typography color='primary'>{positionStatus === 'active' ? 'Active' : ''}</Typography>
                    </Stack>
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
                p: {xs: 3, sm: 6},
                '& .arrow-right': {
                    display: 'none'
                }
            }} onClick={
                (event) => {
                    if(event.target instanceof HTMLElement && event.target.className.includes('open-button') ||
                        event.target instanceof SVGElement && event.target.className.baseVal.includes('arrow-right')) {
                        router.replace(`/modules/borrow/${row.symbol}`)
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
                <Stack direction='row' sx={{flex: '1 1 0%'}}>
                    <Typography variant='h5' sx={{fontWeight: 400}}>{row.borrowAPY}%</Typography>
                </Stack>
                <Stack direction='row' sx={{flex: '1 1 0%', alignItems: 'center'}}>
                    <Typography variant='h5' sx={{fontWeight: 400}}>{row.maxLeverage.toFixed(2)}x&nbsp;</Typography>
                    <Typography variant='subtitle1' color='#98999D'>{formatPercent(+formatEther(row.LTV) * 100, 2)} LTV</Typography>
                </Stack>
                <Stack direction='row' sx={{flex: '1.25 1 0%', alignItems: 'center'}}>
                    <Typography variant='h5' sx={{fontWeight: 400}} color='primary'>{row.maxDepositAPY}%&nbsp;</Typography>
                    <Icon icon='bi:fire' color={theme.palette.primary.main} fontSize={18}/>
                    <Typography variant='subtitle1' color='#98999D' sx={{display: 'flex', alignItems: 'center'}}>
                        &nbsp;(Base&nbsp;
                            <Icon icon='mi:circle-information' fontSize={18}/>
                        &nbsp;: {row.baseAPY.toFixed(2)}%)
                    </Typography>
                </Stack>
                <Stack direction='row' sx={{flex: '1.25 1 0%', justifyContent:'space-between', alignItems: 'center'}}>
                    <Stack direction='row' sx={{cursor: 'pointer', alignItems: 'center'}} className={clsx('open-button active-hover', {
                        'active-open': isOpen
                    })}>
                        <Button variant={isOpen ? 'contained' : 'outlined'} color='primary' sx={{color: isOpen ? '#0D1313' : '#FFFFFF', fontWeight: 600}} className={clsx('open-button', {
                            'active-open': isOpen
                        })}>
                            Open
                        </Button>
                    </Stack>
                    <Box>
                        <Typography color='primary'>{positionStatus === 'active' ? 'Active' : ''}</Typography>
                    </Box>
                    <Box>
                        <Box sx={{display: disableToogle ? 'none' : 'block'}}>
                            {
                                isOpen ? <Icon icon='solar:alt-arrow-up-outline' color={theme.palette.primary.main} style={{cursor: 'pointer'}}/> :
                                        <Icon icon='solar:alt-arrow-down-outline' style={{cursor: 'pointer'}}/>
                            }       
                        </Box>
                    </Box>
                </Stack>
            </Stack>
            )}
            
             {/* Collapsible Content */}
            <Collapse in={isOpen}>
                <Box sx={{px: {xs: 3, sm: 6}, pb: {xs: 0, sm: 6}}}>
                    <Box sx={{
                        borderTop: 'solid 1px #36373D',
                        borderBottom: positionStatus == 'active' ? 'solid 1px #36373D' : 'none',
                    }}>
                        <CollateralOverview row={row}/>
                    </Box>
                    <BorrowPosition row={row}/>
                </Box>
            </Collapse>
            <Stack direction='row' sx={{mt: 6, p: {xs: 3, sm: 6}, display: {xs: 'flex' , lg: 'none'}}}>
                <Button onClick={goToPosition} color={isOpen ? 'primary' : 'secondary'} sx={{ 
                        minWidth: isSmallScreen ? 1 : 160
                    }} 
                    variant='outlined'
                    className={clsx('active-hover', {
                        'active-open': isOpen
                    })}
                >
                    Open
                    <Icon style={{marginLeft: 4}} icon='eva:diagonal-arrow-right-up-outline' className='arrow-diagonal'/>
                    <Icon style={{marginLeft: 4}} icon='ph:arrow-right' className='arrow-right'/>
                </Button>
            </Stack>
        </Stack>
    )
}
export default CollateralRow