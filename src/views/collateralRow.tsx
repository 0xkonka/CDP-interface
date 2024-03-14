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
import { CollateralType } from '@/types/collateral/types'

// Subcomponents
import { BorrowPosition } from './components/positions/borrow'
import { LeveragePosition } from './components/positions/leverage'

// Subpages
import { CollateralOverview } from './collateralOverview'

// Contexts
import { useGlobalValues } from '@/context/GlobalContext'

// Third-party libraries
import clsx from 'clsx'
import { CollateralParams } from '@/context/ModuleProvider/type'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { showToast } from '@/hooks/toasts'

// Define Props
interface TableHeaderProps {
    isOpen: boolean,
    row: CollateralType
    onToogle: () => void;
    collateralDetail: CollateralParams
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
    const {isOpen, row, onToogle} = props
    const theme: Theme = useTheme()
    const {isMediumScreen, isSmallScreen} = useGlobalValues()
    const hasBorrowPosition = true // We will get this value from collateral asset - Jordan
    const hasLeveragePosition = false
    const {isConnected} = useAccount()

    if (!row || typeof row.asset === 'undefined') {
        console.error('CollateralRow component received undefined "row" or "row.asset" property.');
        return <div>Missing data</div>; // You can customize this message or behavior as needed.
    }

    const goToPosition = () => {
        if(!isConnected) {
            showToast('success', 'Confirm', 'Please connect wallet to check your module.', 5000)
            return
        }
        router.replace(`/modules/borrow/${row.asset}`)
    }

    return (
        <Stack sx={{borderRadius:  2, border: `solid 1px ${isOpen ? theme.palette.primary.main : 'transparent'}`, cursor: 'pointer',
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
                        if(!isConnected) {
                            showToast('success', 'Confirm', 'Please connect wallet to check your module.', 5000)
                            return
                        }
                        router.replace(`/modules/borrow/${row.asset}`)
                        return
                    }
                    onToogle()
                }
            }>
                <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'space-between'}}>
                    <Stack direction='row' sx={{alignItems: 'center'}}>
                        <img 
                            src={`/images/tokens/${row.asset.replace(/\//g, '-').replace(/\s+/g, '')}.png`}
                            alt={row.asset} height={isSmallScreen ? 24 : 32}
                            style={{ width: 'auto' }}
                        />
                        <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} sx={{fontWeight: 400, ml: 2}}>{row.asset}</Typography>
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
                        <Typography variant='h5' sx={{fontWeight: 400}}>{row.maxLeverage}x&nbsp;</Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '1.3 1 0%', alignItems: 'center'}}>
                        <Typography variant='h5' sx={{fontWeight: 400}} color='primary'>{row.maxDepositAPY}%&nbsp;</Typography>
                        <Icon icon='bi:fire' color={theme.palette.primary.main} fontSize={18}/>
                    </Stack>
                </Stack>
                <Stack direction='row' sx={{mt: 2, alignItems: 'center'}}>
                    <Stack direction='row' sx={{flex: '1 1 0%'}}>
                        <Typography color='primary'>{row.active ? 'Active' : ''}</Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '1 1 0%'}}>
                        <Typography variant='subtitle2' color='#98999D'>{row.LTVRatio}% LTV</Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '1.3 1 0%'}}>
                        <Typography variant='subtitle2' color='#98999D' sx={{display: 'flex', alignItems: 'center'}}>
                            (Base&nbsp;
                                <Icon icon='mi:circle-information' fontSize={isSmallScreen ? 12: 18}/>
                            &nbsp;: {row.baseDepositAPY}%)
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
                        if(!isConnected) {
                            showToast('success', 'Confirm', 'Please connect wallet to check your module.', 5000)
                            return
                        }
                        router.replace(`/modules/borrow/${row.asset}`)
                        return
                    }
                    onToogle()
                }
            }>
                <Stack direction='row' sx={{flex: '2 1 0%', alignItems: 'center'}}>
                    <img 
                        src={`/images/tokens/${row.asset.replace(/\//g, '-').replace(/\s+/g, '')}.png`}
                        alt={row.asset} width={32} height={32}
                        style={{ width: 'auto' }}
                    />
                    <Typography variant='h5' sx={{fontWeight: 400, ml: 2}}>{row.asset}</Typography>
                    <CustomChip label={row.type} skin='light' color={getChipTheme(row.type)} style={{marginLeft: 16}}/>
                </Stack>
                <Stack direction='row' sx={{flex: '1 1 0%'}}>
                    <Typography variant='h5' sx={{fontWeight: 400}}>{row.borrowAPY}%</Typography>
                </Stack>
                <Stack direction='row' sx={{flex: '1 1 0%', alignItems: 'center'}}>
                    <Typography variant='h5' sx={{fontWeight: 400}}>{row.maxLeverage}x&nbsp;</Typography>
                    <Typography variant='subtitle1' color='#98999D'>{row.LTVRatio}% LTV</Typography>
                </Stack>
                <Stack direction='row' sx={{flex: '1.25 1 0%', alignItems: 'center'}}>
                    <Typography variant='h5' sx={{fontWeight: 400}} color='primary'>{row.maxDepositAPY}%&nbsp;</Typography>
                    <Icon icon='bi:fire' color={theme.palette.primary.main} fontSize={18}/>
                    <Typography variant='subtitle1' color='#98999D' sx={{display: 'flex', alignItems: 'center'}}>
                        &nbsp;(Base&nbsp;
                            <Icon icon='mi:circle-information' fontSize={18}/>
                        &nbsp;: {row.baseDepositAPY}%)
                    </Typography>
                </Stack>
                <Stack direction='row' sx={{flex: '1.25 1 0%', justifyContent:'space-between', alignItems: 'center'}}>
                    {/* <Link href={`/modules/borrow/${row.asset}`} sx={{color: 'white'}}> */}
                        <Stack direction='row' sx={{cursor: 'pointer', alignItems: 'center'}} className={clsx('open-button active-hover', {
                            'active-open': isOpen
                        })}>
                            Open
                            <svg className='arrow-diagonal' style={{marginLeft: 16}} xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 9 9" fill="none">
                                <path d="M8.58903 0H0.410966C0.301971 4.60292e-09 0.19744 0.0432979 0.120369 0.120369C0.0432979 0.19744 0 0.301971 0 0.410966C0 0.519961 0.0432979 0.624491 0.120369 0.701562C0.19744 0.778633 0.301971 0.821932 0.410966 0.821932H7.59912L0.12224 8.29881C0.0842254 8.33682 0.0540706 8.38195 0.0334973 8.43162C0.012924 8.48129 0.00233476 8.53452 0.00233476 8.58828C0.00233476 8.64205 0.012924 8.69528 0.0334973 8.74495C0.0540706 8.79462 0.0842254 8.83975 0.12224 8.87776C0.160254 8.91577 0.205384 8.94593 0.255053 8.9665C0.304721 8.98708 0.357955 8.99767 0.411716 8.99767C0.465476 8.99767 0.518711 8.98708 0.568379 8.9665C0.618047 8.94593 0.663177 8.91577 0.701192 8.87776L8.17807 1.40013V8.58903C8.17807 8.69803 8.22137 8.80256 8.29844 8.87963C8.37551 8.9567 8.48004 9 8.58903 9C8.69803 9 8.80256 8.9567 8.87963 8.87963C8.9567 8.80256 9 8.69803 9 8.58903V0.409466C8.9996 0.300731 8.95613 0.196585 8.8791 0.119838C8.80207 0.0430913 8.69777 -7.24163e-07 8.58903 0Z" fill="white"/>
                            </svg>
                            <svg className='arrow-right' style={{marginLeft: 16}} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                                <path d="M12.5778 6.3154L6.89681 0.432587C6.82109 0.354182 6.71734 0.309067 6.60836 0.307164C6.49938 0.305262 6.39411 0.346729 6.3157 0.422444C6.2373 0.498158 6.19218 0.601917 6.19028 0.710895C6.18838 0.819874 6.22985 0.925144 6.30556 1.00355L11.2989 6.17427L0.72658 5.98973C0.672827 5.98879 0.619416 5.99845 0.569396 6.01816C0.519376 6.03786 0.473727 6.06722 0.435055 6.10457C0.396383 6.14191 0.365445 6.18651 0.344008 6.23581C0.322571 6.28511 0.311055 6.33815 0.310117 6.39191C0.309179 6.44566 0.318837 6.49907 0.33854 6.54909C0.358243 6.59911 0.387606 6.64476 0.424951 6.68343C0.462296 6.7221 0.506893 6.75304 0.556195 6.77448C0.605497 6.79591 0.658538 6.80743 0.712291 6.80837L11.2851 6.99239L6.11386 11.9862C6.03545 12.0619 5.99034 12.1657 5.98844 12.2747C5.98653 12.3836 6.028 12.4889 6.10371 12.5673C6.17943 12.6457 6.28319 12.6908 6.39217 12.6927C6.50115 12.6946 6.60642 12.6532 6.68482 12.5775L12.5687 6.89546C12.6467 6.81964 12.6914 6.71602 12.6931 6.6073C12.6948 6.49858 12.6533 6.39361 12.5778 6.3154Z" fill="#67DAB1"/>
                            </svg>
                        </Stack>
                    {/* </Link> */}

                    <Box>
                        <Typography color='primary'>{row.active ? 'Active' : ''}</Typography>
                    </Box>
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
                        borderBottom: 'solid 1px #36373D',
                    }}>
                        <CollateralOverview row={row}/>
                    </Box>
                    <BorrowPosition hasBorrowPosition={hasBorrowPosition} row={row}/>
                    <LeveragePosition hasLeveragePosition={hasLeveragePosition} row={row}/>
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