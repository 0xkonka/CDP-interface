// MUI components import
import {
    Stack,
    Box,
    useTheme, Theme,
    Typography,
    Collapse,
    Grid,
    Link,
    Button,
    useMediaQuery
} from '@mui/material'

// ** Core Components Import
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'

// ** Import React Core
import React from 'react'

// ** Types
import { CollateralType } from 'src/types/collateral/types'

// ** Third Party Components
import clsx from 'clsx'

// Define Props
interface TableHeaderProps {
    isOpen: boolean,
    row: CollateralType
    onToogle: () => void;
}
  
const CollateralRow = (props: TableHeaderProps) => {
    const {isOpen, row, onToogle} = props
    const theme: Theme = useTheme()
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('lg'))
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

    if (!row || typeof row.asset === 'undefined') {
        console.error('CollateralRow component received undefined "row" or "row.asset" property.');

        return <div>Missing data</div>; // You can customize this message or behavior as needed.
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

    return (
        <Stack sx={{p: {xs: 3, sm: 6}, borderRadius:  2, border: `solid 1px ${isOpen ? theme.palette.primary.main : 'transparent'}`, 
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
            <Stack>
                <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'space-between'
                }}>
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
                            isOpen ? <Icon icon='solar:alt-arrow-up-outline' color={theme.palette.primary.main} style={{cursor: 'pointer'}} onClick={onToogle}/> :
                                    <Icon icon='solar:alt-arrow-down-outline' style={{cursor: 'pointer'}} onClick={onToogle}/>
                        }
                    </Stack>
                </Stack>
                <Stack direction='row' sx={{mt: 2}}>
                    <Stack direction='row' sx={{flex: '1 1 0%'}}>
                        <Typography variant='body2' color='#98999D'>Borrow APY</Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '1 1 0%'}}>
                        <Typography variant='body2' color='#98999D'>MAX Leverage</Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '1.3 1 0%'}}>
                        <Typography variant='body2' color='#98999D'>Deposit APY</Typography>
                    </Stack>
                </Stack>
                <Stack direction='row' sx={{mt: 2}}>
                    <Stack direction='row' sx={{flex: '1 1 0%'}}>
                        <Typography variant='h5' sx={{fontWeight: 400}}>{row.borrowAPY}%</Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '1 1 0%', alignItems: 'center'}}>
                        <Typography variant='h5' sx={{fontWeight: 400}}>{row.maxLeverage}x&nbsp;</Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '1.3 1 0%', alignItems: 'center'}}>
                        <Typography variant='h5' sx={{fontWeight: 400}} color='primary'>{row.maxDepositAPY}%&nbsp;</Typography>
                        <Icon icon='bi:fire' color={theme.palette.primary.main} fontSize={18}/>
                    </Stack>
                </Stack>
                <Stack direction='row' sx={{mt: 2}}>
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
                '& .arrow-right': {
                    display: 'none'
                }
            }}>
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
                    <Link href={`/modules/borrow/${row.asset}`} sx={{color: 'white'}}>
                        <Stack direction='row' sx={{cursor: 'pointer'}} className={clsx('active-hover', {
                            'active-open': isOpen
                        })}>
                            
                                Open
                                <Icon style={{marginLeft: 4}} icon='eva:diagonal-arrow-right-up-outline' className='arrow-diagonal'/>
                                <Icon style={{marginLeft: 4}} icon='ph:arrow-right' className='arrow-right'/>
                        </Stack>
                    </Link>

                    <Box>
                        <Typography color='primary'>{row.active ? 'Active' : ''}</Typography>
                    </Box>
                    {
                        isOpen ? <Icon icon='solar:alt-arrow-up-outline' color={theme.palette.primary.main} style={{cursor: 'pointer'}} onClick={onToogle}/> :
                                <Icon icon='solar:alt-arrow-down-outline' style={{cursor: 'pointer'}} onClick={onToogle}/>
                    }
                </Stack>
            </Stack>
            )}
            
             {/* Collapsible Content */}
            <Collapse in={isOpen}>
                <Box sx={{
                    mt: 4, 
                    borderTop: 'solid 1px #36373D',
                    borderBottom: 'solid 1px #36373D',
                }}>
                    <Grid container sx={{
                            width: 'calc(100% + 64px)',
                            marginLeft: -8,
                            '& > .MuiGrid-item': {
                                padding: theme => `${theme.spacing(isSmallScreen ? 1 :  3)} ${theme.spacing(8)}`, // vertical | horizontal spacing
                            },
                        }}>
                        <Grid item xs={12} sm={6} lg={4} xl={3}>
                            <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}} >
                                <Typography variant='subtitle1' color='#D4D4D4'>Platform</Typography>
                                <Stack direction='row'>
                                    <img width={26} src='/images/platforms/uniswap.png' alt='Platform'/>
                                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>Uniswap V3</Typography>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={3}>
                            <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}} >
                                <Typography variant='subtitle1' color='#D4D4D4'>Liquidation Threshold</Typography>
                                <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>80%</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={3}>
                            <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}} >
                                <Typography variant='subtitle1' color='#D4D4D4'>Total trenUSD</Typography>
                                <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>800.00k</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={3}>
                            <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}} >
                                <Typography variant='subtitle1' color='#D4D4D4'>LTV - Leverage</Typography>
                                <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>25%</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={3}>
                            <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                                <Typography variant='subtitle1' color='#D4D4D4'>TVL</Typography>
                                <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>4.3M</Typography>
                            </Stack>    
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={3}>
                            <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                                <Typography variant='subtitle1' color='#D4D4D4'>Borrow Fee</Typography>
                                <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>6.263%</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={3}>
                            <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                                <Typography variant='subtitle1' color='#D4D4D4'>Available trenUSD</Typography>
                                <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>500.00k</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={3}>
                            <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                                <Typography variant='subtitle1' color='#D4D4D4'>Interest Rate</Typography>
                                <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} fontWeight={400}>5%</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                
                {/* Borrow Position */}
                <Typography variant='subtitle1' sx={{my:4, fontWeight: 600}}>
                    Borrow Position
                </Typography>
                <Grid container spacing={8}>
                    <Grid item xs={12} lg={6}>
                        <Stack direction='row' sx={{justifyContent: 'space-between'}}>
                            <Typography variant='subtitle2'>
                                Health factor
                            </Typography>
                            <Typography variant='subtitle2'>
                                45%
                            </Typography>
                        </Stack>
                        <Box className='gradientProgress'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"
                                style={{marginLeft: '45%'}}>
                                <path d="M13.7302 5.07458C13.6912 4.98206 13.6006 4.92188 13.5 4.92188L2.50002 4.922C2.39956 4.922 2.30886 4.98218 2.26968 5.07471C2.23061 5.16724 2.25076 5.27429 2.32082 5.34631L7.82082 11.0032C7.86782 11.0515 7.93252 11.0789 8.00002 11.0789C8.06753 11.0789 8.13223 11.0515 8.17922 11.0032L13.6792 5.34619C13.7493 5.27405 13.7693 5.16711 13.7302 5.07458Z" fill="white"/>
                            </svg>
                            <Box sx={{
                                width: '100%',
                                height: 6,
                                mb: 2,
                                borderRadius: 8,
                                background: 'linear-gradient(90deg, #00D084 0%, #FF9C19 54.06%, #FF5876 100.77%)'
                            }}/>
                        </Box>
                        <Stack direction='row' sx={{justifyContent: 'space-between'}}>
                            <Typography variant='subtitle2' color='#707175'>
                                Safe
                            </Typography>
                            <Typography variant='subtitle2' color='#707175'>
                                Risky
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4}}>
                            <Typography variant='subtitle2'>
                                Borrowing power used
                            </Typography>
                            <Typography variant='subtitle2'>
                               80%
                            </Typography>
                        </Stack>
                        <Box sx={{
                            mt: 5.5,
                            width: '100%',
                            height: 6,
                            mb: 2,
                            borderRadius: 8,
                            background: '#141819',
                        }}>
                            <Box sx={{
                                width: '100%',
                                height: 6,
                                borderRadius: 8,
                                background: 'linear-gradient(270deg, #67DAB1 0%, #0D8057 43.61%, #00200F 101.04%)'
                            }}/>
                        </Box>
                        <Stack direction='row' sx={{justifyContent: 'space-between'}}>
                            <Typography variant='subtitle2' color='#707175'>
                                0%
                            </Typography>
                            <Typography variant='subtitle2' color='#707175'>
                                100%
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Typography variant='subtitle1' sx={{my:4, fontWeight: 600}}>
                            Deposit
                        </Typography>
                        <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4}}>
                            <Stack direction='row' sx={{width: {xs: 1, md: 'auto'}, justifyContent: 'space-between'}}>
                                <Stack direction='row' sx={{alignItems: 'center'}}>
                                    <img 
                                        src={`/images/tokens/${row.asset.replace(/\//g, '-').replace(/\s+/g, '')}.png`}
                                        alt={row.asset} height={isSmallScreen ? 36 : 42}
                                        style={{ marginRight: 10 }}
                                    />
                                    {row.asset}
                                </Stack>
                                <Stack sx={{ml: isSmallScreen ? 0 : 12, alignItems: 'flex-end'}}>
                                    <Typography variant='subtitle1'>
                                        17.2B
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{color: '#707175'}}>
                                        = $20,000.00
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack direction='row'>
                                <Button sx={{ 
                                    mr: {xs: 2, md: 4},
                                    color: 'white',
                                    borderColor: '#67DAB1'
                                }} variant='outlined'>Deposit</Button>
                                <Button sx={{ 
                                    color: 'white',
                                    borderColor: '#6795DA'
                                }} variant='outlined'>Withdraw</Button>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Typography variant='subtitle1' sx={{my:4, fontWeight: 600}}>
                            Borrow
                        </Typography>
                        <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4}}>
                            <Stack direction='row' sx={{width: {xs: 1, md: 'auto'}, justifyContent: 'space-between'}}>
                                <Stack direction='row' sx={{alignItems: 'center'}}>
                                    <img 
                                        src='/images/tokens/trenUSD.png'
                                        alt='LinkedIn'
                                        style={{ borderRadius: '100%', marginRight: 10 }}
                                    />
                                    trenUSD
                                </Stack>
                                <Stack sx={{ml: isSmallScreen ? 0 : 12, alignItems: 'flex-end'}}>
                                    <Typography variant='subtitle1'>
                                        16.000.00
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{color: '#707175'}}>
                                        = $16,000.00
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack direction='row'>
                                <Button sx={{ 
                                    mr: {xs: 2, md: 4},
                                    color: 'white',
                                    borderColor: '#C6E0DC'
                                }} variant='outlined'>Borrow More</Button>
                                <Button sx={{ 
                                    color: 'white',
                                    borderColor: '#C9A3FA'
                                }} variant='outlined'>Repay</Button>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
                {/* Leverage Position */}
                <Typography variant='subtitle1' sx={{my:4, fontWeight: 600, pt: 4}}>
                    Leverage Position
                </Typography>
                <Grid container spacing={8}>
                    <Grid item xs={12} lg={6}>
                        <Stack direction='row' sx={{justifyContent: 'space-between'}}>
                            <Typography variant='subtitle2'>
                                Health factor
                            </Typography>
                            <Typography variant='subtitle2'>
                                45%
                            </Typography>
                        </Stack>
                        <Box className='gradientProgress'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"
                                style={{marginLeft: '45%'}}>
                                <path d="M13.7302 5.07458C13.6912 4.98206 13.6006 4.92188 13.5 4.92188L2.50002 4.922C2.39956 4.922 2.30886 4.98218 2.26968 5.07471C2.23061 5.16724 2.25076 5.27429 2.32082 5.34631L7.82082 11.0032C7.86782 11.0515 7.93252 11.0789 8.00002 11.0789C8.06753 11.0789 8.13223 11.0515 8.17922 11.0032L13.6792 5.34619C13.7493 5.27405 13.7693 5.16711 13.7302 5.07458Z" fill="white"/>
                            </svg>
                            <Box sx={{
                                width: '100%',
                                height: 6,
                                mb: 2,
                                borderRadius: 8,
                                background: 'linear-gradient(90deg, #00D084 0%, #FF9C19 54.06%, #FF5876 100.77%)'
                            }}/>
                        </Box>
                        <Stack direction='row' sx={{justifyContent: 'space-between'}}>
                            <Typography variant='subtitle2' color='#707175'>
                                Safe
                            </Typography>
                            <Typography variant='subtitle2' color='#707175'>
                                Risky
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4}}>
                            <Typography variant='subtitle2'>
                                Leverage used
                            </Typography>
                            <Typography variant='subtitle2'>
                               80%
                            </Typography>
                        </Stack>
                        <Box sx={{
                            mt: 5.5,
                            width: '100%',
                            height: 6,
                            mb: 2,
                            borderRadius: 8,
                            background: '#141819',
                        }}>
                            <Box sx={{
                                width: '100%',
                                height: 6,
                                borderRadius: 8,
                                background: 'linear-gradient(270deg, #67DAB1 0%, #0D8057 43.61%, #00200F 101.04%)'
                            }}/>
                        </Box>
                        <Stack direction='row' sx={{justifyContent: 'space-between'}}>
                            <Typography variant='subtitle2' color='#707175'>
                                0%
                            </Typography>
                            <Typography variant='subtitle2' color='#707175'>
                                100%
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Typography variant='subtitle1' sx={{my:4, fontWeight: 600}}>
                            Deposit
                        </Typography>
                        <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                            <Stack direction='row' sx={{width: {xs: 1, md: 'auto'}, justifyContent: 'space-between'}}>
                                <Stack direction='row' sx={{alignItems: 'center'}}>
                                    <img 
                                        src={`/images/tokens/${row.asset.replace(/\//g, '-').replace(/\s+/g, '')}.png`}
                                        alt={row.asset} height={isSmallScreen ? 36 : 42}
                                        style={{ marginRight: 10 }}
                                    />
                                    {row.asset}
                                </Stack>
                                <Stack sx={{ml: isSmallScreen ? 0 : 12, alignItems: 'flex-end'}}>
                                    <Typography variant='subtitle1'>
                                        17.2B
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{color: '#707175'}}>
                                        = $20,000.00
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack direction={isSmallScreen ? 'column' : 'row'} sx={{width: {xs: 1, lg: 'auto'}, justifyContent: 'center', alignItems: 'center'}}>
                                <Stack id='horizontal-before' sx={{mr: isMediumScreen ? 0 : 2, justifyContent: 'center'}}>
                                    {
                                        isMediumScreen ? 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="2" height="10" viewBox="0 0 2 10" fill="none">
                                            <path d="M1 0L1 10" stroke="#707175" strokeDasharray="4 4"/>
                                        </svg> :
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="2" viewBox="0 0 40 2" fill="none">
                                            <path d="M0 1L40 0.999997" stroke="#707175" strokeWidth="2" strokeDasharray="6 6"/>
                                        </svg>
                                    }
                                </Stack>
                                <Stack>
                                    <Typography color='primary' variant={isSmallScreen ? 'subtitle2' : 'h4'}>10x</Typography>
                                </Stack>
                                <Stack id='horizontal-after' sx={{ml: isMediumScreen ? 0 : 2, justifyContent: 'center'}}>
                                    {
                                        isMediumScreen ? 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="11" viewBox="0 0 8 11" fill="none">
                                            <path d="M3.64645 10.3536C3.84171 10.5488 4.15829 10.5488 4.35355 10.3536L7.53553 7.17157C7.7308 6.97631 7.7308 6.65973 7.53553 6.46447C7.34027 6.2692 7.02369 6.2692 6.82843 6.46447L4 9.29289L1.17157 6.46447C0.976311 6.2692 0.659729 6.2692 0.464466 6.46447C0.269204 6.65973 0.269204 6.97631 0.464466 7.17157L3.64645 10.3536ZM3.5 2.18557e-08L3.5 2.5L4.5 2.5L4.5 -2.18557e-08L3.5 2.18557e-08ZM3.5 7.5L3.5 10L4.5 10L4.5 7.5L3.5 7.5ZM3.64645 10.3536C3.84171 10.5488 4.15829 10.5488 4.35355 10.3536L7.53553 7.17157C7.7308 6.97631 7.7308 6.65973 7.53553 6.46447C7.34027 6.2692 7.02369 6.2692 6.82843 6.46447L4 9.29289L1.17157 6.46447C0.976311 6.2692 0.659729 6.2692 0.464466 6.46447C0.269204 6.65973 0.269204 6.97631 0.464466 7.17157L3.64645 10.3536ZM3.5 2.18557e-08L3.5 2.5L4.5 2.5L4.5 -2.18557e-08L3.5 2.18557e-08ZM3.5 7.5L3.5 10L4.5 10L4.5 7.5L3.5 7.5Z" fill="#707175"/>
                                        </svg> :
                                        <svg xmlns="http://www.w3.org/2000/svg" width="41" height="16" viewBox="0 0 41 16" fill="none">
                                            <path d="M40.7071 8.7071C41.0976 8.31658 41.0976 7.68341 40.7071 7.29289L34.3431 0.928929C33.9526 0.538405 33.3195 0.538405 32.9289 0.928929C32.5384 1.31945 32.5384 1.95262 32.9289 2.34314L38.5858 8L32.9289 13.6569C32.5384 14.0474 32.5384 14.6805 32.9289 15.0711C33.3195 15.4616 33.9526 15.4616 34.3431 15.0711L40.7071 8.7071ZM8.74228e-08 9L3.33333 9L3.33333 7L-8.74228e-08 7L8.74228e-08 9ZM10 9L16.6667 9L16.6667 7L10 7L10 9ZM23.3333 9L30 9L30 7L23.3333 7L23.3333 9ZM36.6667 9L40 9L40 7L36.6667 7L36.6667 9ZM40.7071 8.7071C41.0976 8.31658 41.0976 7.68341 40.7071 7.29289L34.3431 0.928929C33.9526 0.538405 33.3195 0.538405 32.9289 0.928929C32.5384 1.31945 32.5384 1.95262 32.9289 2.34314L38.5858 8L32.9289 13.6569C32.5384 14.0474 32.5384 14.6805 32.9289 15.0711C33.3195 15.4616 33.9526 15.4616 34.3431 15.0711L40.7071 8.7071ZM8.74228e-08 9L3.33333 9L3.33333 7L-8.74228e-08 7L8.74228e-08 9ZM10 9L16.6667 9L16.6667 7L10 7L10 9ZM23.3333 9L30 9L30 7L23.3333 7L23.3333 9ZM36.6667 9L40 9L40 7L36.6667 7L36.6667 9Z" fill="#707175"/>
                                        </svg>
                                    }
                                </Stack>
                            </Stack>
                            <Stack direction='row' sx={{width: {xs: 1, md: 'auto'}, justifyContent: 'space-between'}}>
                                <Stack direction='row' sx={{alignItems: 'center'}}>
                                    <img 
                                        src={`/images/tokens/${row.asset.replace(/\//g, '-').replace(/\s+/g, '')}.png`}
                                        alt={row.asset} height={isSmallScreen ? 36 : 42}
                                        style={{ marginRight: 10 }}
                                    />
                                    {row.asset}
                                </Stack>
                                <Stack sx={{ml: isSmallScreen ? 0 : 12, alignItems: 'flex-end'}}>
                                    <Typography variant='subtitle1'>
                                        172B
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{color: '#707175'}}>
                                        = $200,000.00
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Typography variant='subtitle1' sx={{my:4, fontWeight: 600}}>
                            Borrow
                        </Typography>
                        <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4}}>
                            <Stack direction='row' sx={{width: {xs: 1, md: 'auto'}, justifyContent: 'space-between'}}>
                                <Stack direction='row' sx={{alignItems: 'center'}}>
                                    <img 
                                        src='/images/tokens/trenUSD.png'
                                        alt='LinkedIn'
                                        style={{ borderRadius: '100%', marginRight: 10 }}
                                    />
                                    trenUSD
                                </Stack>
                                <Stack sx={{ml: isSmallScreen ? 0 : 12, alignItems: 'flex-end'}}>
                                    <Typography variant='subtitle1'>
                                        16.000.00
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{color: '#707175'}}>
                                        = $16,000.00
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack direction='row'>
                                <Button sx={{ 
                                    mr: {xs: 2, md: 4},
                                    color: 'white',
                                    borderColor: '#C6E0DC'
                                }} variant='outlined'>Adjust Leverage</Button>
                                <Button sx={{ 
                                    color: 'white',
                                    borderColor: '#C9A3FA'
                                }} variant='outlined'>Repay</Button>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Collapse>
            <Stack direction='row' sx={{mt: 6, display: {xs: 'flex' , lg: 'none'}}}>
                <Button href={`/modules/borrow/${row.asset}`} color={isOpen ? 'primary' : 'secondary'} sx={{ 
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