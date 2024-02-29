//@ MUI components
import {
    Box, Typography, Grid, Stack, Button,
} from '@mui/material'
//@ Types
import { CollateralType } from '@/types/collateral/types'
//@ Contexts
import { useGlobalValues } from '@/context/GlobalContext'

interface BorrowPostionProps {
    hasBorrowPosition: boolean
    row: CollateralType
}

export const BorrowPosition = (props: BorrowPostionProps) => {
    const {hasBorrowPosition, row} = props
    const {isSmallScreen} = useGlobalValues()

    return (
        <Box className='borrow-position' sx={{display: hasBorrowPosition ? 'block' : 'none'}}>
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
        </Box>
    )
}