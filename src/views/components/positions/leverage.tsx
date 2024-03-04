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

interface LeveragePostionProps {
    hasLeveragePosition: boolean
    row: CollateralType
}

export const LeveragePosition = (props: LeveragePostionProps) => {
    const {hasLeveragePosition, row} = props
    const {isSmallScreen, isMediumScreen} = useGlobalValues()

    return (
        <Box className='leverage-position' sx={{display: hasLeveragePosition ? 'block' : 'none'}}>
            <Typography variant='subtitle1' sx={{my:4, fontWeight: 600, pt: 4}}>
                Leverage Position
            </Typography>
            <Grid container spacing={8}>
                <Grid item xs={12} lg={6}>
                    <HealthFactor safety={75}/>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <BorrowingPower percent={35} label='Leverage used' max={7500}/>
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
        </Box>
    )
}