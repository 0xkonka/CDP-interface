//@ MUI components
import {
    Box, Typography, Grid, Stack, Button,
} from '@mui/material'
//@ Types
import { CollateralType } from '@/types/collateral/types'
//@ Contexts
import { useGlobalValues } from '@/context/GlobalContext'
import { HealthFactor } from '../modules/healthFactor'
import { BorrowingPower } from '../modules/borrowingPower'

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
                    <HealthFactor safety={53}/>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <BorrowingPower percent={26} max={7500}/>
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