// MUI components import
import {
    Stack,
    Box,
    useTheme, Theme,
    Typography,
    Collapse,
    Grid,
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
    // const [open, setOpen] = React.useState(false)
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
        <Stack sx={{p: {xs: 3, md: 6}, borderRadius: isMediumScreen ? 0 : 2, border: `solid 1px ${isOpen ? theme.palette.primary.main : isMediumScreen ? '#A8AAAE5C' : 'transparent'}`, 
            '& .active-open': {
                color: theme.palette.primary.main,
                '& .arrow-diagonal': {
                    display: 'none'
                },
                '& .arrow-right': {
                    display: 'block'
                }
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
            }}}>
            {isMediumScreen ? (
            <Stack sx={{
                '& .arrow-right': {
                    display: 'none'
            }}}>
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
                    <Stack direction='row' sx={{flex: '1 1 0%', cursor: 'pointer'}} className={clsx('active-hover', {
                        'active-open': open
                    })}>
                        Open
                        <Icon style={{marginLeft: 4}} icon='eva:diagonal-arrow-right-up-outline' className='arrow-diagonal'/>
                        <Icon style={{marginLeft: 4}} icon='ph:arrow-right' className='arrow-right'/>
                    </Stack>
                    <Stack sx={{flex: '1 1 0%'}}>
                        <Typography color='primary'>{row.active ? 'Active' : ''}</Typography>
                    </Stack>
                </Stack>
                <Stack direction='row' sx={{mt: 2}}>
                    <Stack direction='row' sx={{flex: '1 1 0%'}}>
                        <Typography variant='subtitle2' color='#98999D'>Borrow APY</Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '1 1 0%'}}>
                        <Typography variant='subtitle2' color='#98999D'>MAX Leverage</Typography>
                    </Stack>
                </Stack>
                <Stack direction='row'>
                    <Stack direction='row' sx={{flex: '1 1 0%'}}>
                        <Typography variant='h5' sx={{fontWeight: 400}}>{row.borrowAPY}%</Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '1 1 0%', alignItems: 'center'}}>
                        <Typography variant='h5' sx={{fontWeight: 400}}>{row.maxLeverage}x&nbsp;</Typography>
                        <Typography variant='subtitle1' color='#98999D'>{row.LTVRatio}% LTV</Typography>
                    </Stack>
                </Stack>
                <Stack sx={{mt: 2}}>
                    <Stack direction='row'>
                        <Typography variant='subtitle2' color='#98999D'>Deposit APY</Typography>
                    </Stack>
                    <Stack direction='row' sx={{alignItems: 'center'}}>
                        <Typography variant='h5' sx={{fontWeight: 400}} color='primary'>{row.maxDepositAPY}%&nbsp;</Typography>
                        <Icon icon='bi:fire' color={theme.palette.primary.main} fontSize={18}/>
                        <Typography variant='subtitle1' color='#98999D' sx={{display: 'flex', alignItems: 'center'}}>
                            &nbsp;(Base&nbsp;
                                <Icon icon='mi:circle-information' fontSize={18}/>
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
                    <Stack direction='row' sx={{cursor: 'pointer'}} className={clsx('active-hover', {
                        'active-open': open
                    })}>
                        Open
                        <Icon style={{marginLeft: 4}} icon='eva:diagonal-arrow-right-up-outline' className='arrow-diagonal'/>
                        <Icon style={{marginLeft: 4}} icon='ph:arrow-right' className='arrow-right'/>
                    </Stack>
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
                                    <img width={26} src='/images/platforms/uniswap.png'/>
                                    <Typography variant='h5' fontWeight={400}>Uniswap V3</Typography>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={3}>
                            <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}} >
                                <Typography variant='subtitle1' color='#D4D4D4'>Liquidation Threshold</Typography>
                                <Typography variant='h5' fontWeight={400}>80%</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={3}>
                            <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}} >
                                <Typography variant='subtitle1' color='#D4D4D4'>Total trenUSD</Typography>
                                <Typography variant='h5' fontWeight={400}>800.00k</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={3}>
                            <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}} >
                                <Typography variant='subtitle1' color='#D4D4D4'>LTV - Leverage</Typography>
                                <Typography variant='h5' fontWeight={400}>25%</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={3}>
                            <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                                <Typography variant='subtitle1' color='#D4D4D4'>TVL</Typography>
                                <Typography variant='h5' fontWeight={400}>4.3M</Typography>
                            </Stack>    
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={3}>
                            <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                                <Typography variant='subtitle1' color='#D4D4D4'>Borrow Fee</Typography>
                                <Typography variant='h5' fontWeight={400}>6.263%</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={3}>
                            <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                                <Typography variant='subtitle1' color='#D4D4D4'>Available trenUSD</Typography>
                                <Typography variant='h5' fontWeight={400}>500.00k</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={3}>
                            <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                                <Typography variant='subtitle1' color='#D4D4D4'>Interest Rate</Typography>
                                <Typography variant='h5' fontWeight={400}>5%</Typography>
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
                                style={{marginLeft: 350}}>
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
                        <Typography variant='subtitle1' sx={{my:4, fontWeight: 600}}>
                            Deposit
                        </Typography>
                        <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4}}>
                            <Stack direction='row' sx={{justifyContent: 'space-between'}}>
                                <Stack direction='row' sx={{alignItems: 'center'}}>
                                    <img 
                                        src={`/images/tokens/${row.asset.replace(/\//g, '-').replace(/\s+/g, '')}.png`}
                                        alt={row.asset} height={isSmallScreen ? 36 : 42}
                                        style={{ marginRight: 10 }}
                                    />
                                    {row.asset}
                                </Stack>
                                <Stack sx={{ml: isSmallScreen ? 16 : 24, alignItems: 'flex-end'}}>
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
                        <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4}}>
                            <Typography variant='subtitle2'>
                                Borrowing power used
                            </Typography>
                            <Typography variant='subtitle2'>
                               
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
                        <Typography variant='subtitle1' sx={{my:4, fontWeight: 600}}>
                            Borrow
                        </Typography>
                        <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4}}>
                            <Stack direction='row' sx={{justifyContent: 'space-between'}}>
                                <Stack direction='row' sx={{alignItems: 'center'}}>
                                    <img 
                                        src='/images/tokens/trenUSD.png'
                                        alt='LinkedIn'
                                        style={{ borderRadius: '100%', marginRight: 10 }}
                                    />
                                    trenUSD
                                </Stack>
                                <Stack sx={{ml: isSmallScreen ? 16 : 24, alignItems: 'flex-end'}}>
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
            </Collapse>
        </Stack>
    )
}
export default CollateralRow