import { Typography, Grid, Box, Stack, Button, Link } from '@mui/material'
import { PositionsNet } from '@/views/components/dashboard/PositionsNet'
import { PositionsCount } from '@/views/components/dashboard/PositionsCount'
import { useGlobalValues } from '@/context/GlobalContext'
import DashboardConnectWallet from '@/views/components/DashboardConnectWallet'
import CollateralRow from '@/views/collateralRow'

import { useProtocol } from '@/context/ProtocolProvider/ProtocolContext'
import { CollateralParams } from '@/context/ModuleProvider/type'
import { getOverView } from '@/hooks/utils'
import { formatEther } from 'viem'

import {useState, useMemo} from 'react'

const Dashboard = () => {
    const {isSmallScreen, isMobileScreen, isMediumScreen } = useGlobalValues()
    const statBoxStyle = {
        borderRadius: '10px',
        border: 'solid 1px #393939', 
        backgroundColor: '#0C0E0F', 
        width: '270px', 
        minWidth: '160px',
        py: 4, px: {xs: 4, lg: 6}
    }
    const { collateralDetails } = useProtocol()
    const rows = useMemo(() => {
        if (collateralDetails && collateralDetails.length > 0) {
          const _rows: CollateralParams[] = collateralDetails
            .map((collateral: CollateralParams, index) => {
              return {
                id: index + 1,
                ...collateral,
                ...getOverView(collateral.symbol),
                maxLeverage: (1 / (1 - +formatEther(collateral.LTV))),
                maxDepositAPY: +collateral.baseAPY.toFixed(3) + 30
              }
            })
            .filter(collateral => collateral !== undefined) as CollateralParams[]
          return _rows
        }
        return []
    }, [collateralDetails])

    return (
        <Box>
            <Stack direction={isSmallScreen ? 'column' : 'row'} justifyContent='space-between' alignItems='center' 
                sx={{position: {xs: 'absolute', md: 'relative'}, left: 0, top: 0, width: 1, borderRadius: {xs: 0, md: 2.5}, border: {xs: 'none', md: 'solid 1px #2D3131'}, px: {xs: 6, md: 8, lg: 14}, py: {xs: 6, md: 8, lg: 14}, mt: {xs: 0, md: 10}, mb: {xs: 20, md: 20}, backgroundPosition: 'right center', backgroundSize: 'cover', minHeight: {xs: 400, md: 'auto'}}}
                style={{backgroundImage: isSmallScreen ? `url('/images/backgrounds/tren-3D-mobile.png')` : `url('/images/backgrounds/tren-3D.png')`}}>
                <Typography sx={{ fontSize: {xs: 16, md: 18}, textAlign: {xs: 'center', md: 'start'}, maxWidth: {xs: 277, sm: 534}, mt: {xs: 14, md: 0} }} color='#FFF' lineHeight='normal'>
                    Deposit your collateral tokens into a module in exchange for a trenUSD loan or Loop your assets in one click to leverage exposure for your spot assets. 
                </Typography>
                <DashboardConnectWallet show='disconnected'/>
            </Stack>
            <Typography className='header-gradient' variant='h1'sx={{
                    pt: {xs: 100, md: 0},
                    mb: { xs: 4, md: 8 }, mt: 8,
                    fontSize: { xs: 36, md: 64, xl: 72 }
                }}
            >
                Dashboard
            </Typography>
            <Stack direction='row' sx={{
                overflowX: 'scroll',
                '&::-webkit-scrollbar': {
                    display: 'none'
                },
                '-ms-overflow-style': 'none',
                'scrollbar-width': 'none',
                gap: {xs: 2, md: 4},
                mr: {xs: -4, md: 0},
                pr: {xs: 4, md: 0}
            }}>
                <Box sx={statBoxStyle}>
                    <Typography fontWeight={400} color='#C6C6C799' sx={{fontSize: {xs: 14, lg: 18}}}>Total Collateral</Typography>
                    <Typography fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`} color='#FFF' lineHeight='normal' sx={{fontSize: {xs: 24, lg: 46}}}>232. XP</Typography>
                </Box>
                <Box sx={statBoxStyle}>
                    <Typography fontWeight={400} color='#C6C6C799' sx={{fontSize: {xs: 14, lg: 18}}}>Total Debts</Typography>
                    <Typography fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`} color='#FFF' lineHeight='normal' sx={{fontSize: {xs: 24, lg: 46}}}>24.1</Typography>
                </Box>
                <Box sx={statBoxStyle}>
                    <Typography fontWeight={400} color='#C6C6C799' sx={{fontSize: {xs: 14, lg: 18}}}>Stability Pool</Typography>
                    <Typography fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`} color='#FFF' lineHeight='normal' sx={{fontSize: {xs: 24, lg: 46}}}>#1,321</Typography>
                </Box>
                <Box sx={statBoxStyle}>
                    <Typography fontWeight={400} color='#C6C6C799' sx={{fontSize: {xs: 14, lg: 18}}}>Staked</Typography>
                    <Typography fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`} color='#FFF' lineHeight='normal' sx={{fontSize: {xs: 24, lg: 46}}}>50 XP</Typography>
                </Box>
                <Box sx={statBoxStyle}>
                    <Typography fontWeight={400} color='#C6C6C799' sx={{fontSize: {xs: 14, lg: 18}}}>Net Worth</Typography>
                    <Typography fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`} color='#FFF' lineHeight='normal' sx={{fontSize: {xs: 24, lg: 46}}}>50 XP</Typography>
                </Box>
            </Stack>
            <Grid container spacing={statBoxStyle ? 6 : 10} sx={{ mt: {xs: 0, lg:30} }}>
                <Grid item xs={12} lg={6}>
                    <PositionsNet/>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <PositionsCount/>
                </Grid>
            </Grid>

            {/* Stacking Component */}
            <Stack direction={isSmallScreen ? 'column' : 'row'} sx={{padding: {xs: 0, md: 6, xl: 10}, backgroundColor: '#101314', border: 'solid 1px #FFFFFF33', borderRadius: '10px', mt: {xs: 12, md: 6}}} justifyContent='space-between' alignItems='center'>
                <Stack direction='row' gap={5} alignItems='center' sx={{display: {xs: 'none', md: 'flex'}}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="31" viewBox="0 0 33 35" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.4785 14.625C13.5519 14.6728 11.6281 15.2686 10.4217 16.9744C8.74983 19.3383 5.47367 24.6588 2.8194 28.9692C1.8207 30.5911 0.910044 32.07 0.206023 33.1946C-0.0285242 33.5693 0.130881 34.0618 0.558673 34.1731C3.29894 34.8861 8.21711 34.5938 9.66001 32.3894L18.3875 19.0562C21.4988 23.7384 25.2571 29.2631 27.567 32.6328C27.8225 33.0056 28.3525 33.0455 28.6479 32.7035C30.7521 30.2677 33.6013 25.7103 31.6258 22.7569L17.216 1.21354C16.9619 0.833641 16.4238 0.791536 16.1361 1.1467C14.135 3.6173 11.6516 8.53777 14.3758 12.8929C14.6968 13.406 15.0678 13.9883 15.4785 14.625Z" fill="white"/>
                    </svg>
                    <Typography variant='h3' fontWeight={600}>Staking</Typography>
                </Stack>
                <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{display: {xs: 'flex', md: 'none'}}} px={2.5} py={4.5} width='100%' borderBottom={1} borderColor='#FFFFFF10'>
                    <Stack direction='row' alignItems='center' gap={2}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="19" viewBox="0 0 33 35" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.4785 14.625C13.5519 14.6728 11.6281 15.2686 10.4217 16.9744C8.74983 19.3383 5.47367 24.6588 2.8194 28.9692C1.8207 30.5911 0.910044 32.07 0.206023 33.1946C-0.0285242 33.5693 0.130881 34.0618 0.558673 34.1731C3.29894 34.8861 8.21711 34.5938 9.66001 32.3894L18.3875 19.0562C21.4988 23.7384 25.2571 29.2631 27.567 32.6328C27.8225 33.0056 28.3525 33.0455 28.6479 32.7035C30.7521 30.2677 33.6013 25.7103 31.6258 22.7569L17.216 1.21354C16.9619 0.833641 16.4238 0.791536 16.1361 1.1467C14.135 3.6173 11.6516 8.53777 14.3758 12.8929C14.6968 13.406 15.0678 13.9883 15.4785 14.625Z" fill="white"/>
                        </svg>
                        <Typography variant='h5' fontWeight={600}>Staking</Typography>
                    </Stack>
                    <Box>
                        <Link href='/earn'>
                            <Typography variant='h5' color='primary' sx={{ fontWeight: 400, cursor: 'pointer' }}>
                                Earn
                                <svg
                                style={{ marginLeft: 8 }}
                                xmlns='http://www.w3.org/2000/svg'
                                width='12'
                                height='12'
                                viewBox='0 0 12 12'
                                fill='none'
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
                        </Link>
                    </Box>
                </Stack>
                <Stack direction={isMobileScreen ? 'column' : 'row'} alignItems='center' justifyContent='space-between' sx={{width: {xs: 1, md: 'auto'}, gap: {xs: 0, md: 4, lg: 12, xlg: 6, xl: 12}}}>
                    <Stack alignItems='center' borderRight={isSmallScreen ? 0: 1} borderBottom={isMobileScreen ? 1 : 0} borderColor='#FFFFFF52'
                        sx={{flexDirection: {xs: 'column', xlg: 'row'}, width: {xs: 1, sm: 'auto'}, padding: {xs: 4, sm: 2, md: 0}, pr: {xs: 4, md: 4, lg: 12, xlg: 6, xl: 12}, gap: {xs: 4, xl: 10}}}>
                        <Box>
                            <Typography color='#D4D4D4' sx={{textAlign: {xs: 'center', xlg: 'left'}}}>Wallet Balance</Typography>
                            <Typography fontSize={24} color='#FFF' sx={{textAlign: {xs: 'center', sm: 'left'}}}>
                                <span style={{fontFamily: `'Britanica-HeavySemiExpanded', sans-serif`}}>200 </span>
                                trenUSD
                            </Typography>
                        </Box>
                        <Button variant='contained' color='primary'
                            sx={{ 
                                maxWidth: '100%', width: {xs: 1, sm: 155}, py: { xs: 2, lg: 3 }, color: '#000', fontSize: { xs: 16, md: 18 }, fontWeight: 500, borderRadius: '10px'
                            }}
                        >
                            Deposit
                        </Button>
                    </Stack>
                    <Stack alignItems='center' borderRight={isSmallScreen ? 0: 1} borderBottom={isMobileScreen ? 1 : 0} borderColor='#FFFFFF52'
                        sx={{flexDirection: {xs: 'column', xlg: 'row'}, width: {xs: 1, sm: 'auto'}, padding: {xs: 4, sm: 2, md: 0}, pr: {xs: 4, md: 4, lg: 12, xlg: 6, xl: 12}, gap: {xs: 4, xl: 10}}}>
                        <Box>
                            <Typography color='#D4D4D4' sx={{textAlign: {xs: 'center', xlg: 'left'}}}>Staked trenUSD</Typography>
                            <Typography fontSize={24} color='#FFF' sx={{textAlign: {xs: 'center', sm: 'left'}}}>
                                <span style={{fontFamily: `'Britanica-HeavySemiExpanded', sans-serif`}}>400 </span>
                                trenUSD
                            </Typography>
                        </Box>
                        <Button variant='outlined' color='primary'
                            sx={{ 
                                maxWidth: '100%', width: {xs: 1, sm: 155}, py: { xs: 2, lg: 3 }, color: '#FFF', fontSize: { xs: 16, md: 18 }, fontWeight: 400, borderRadius: '10px'
                            }}
                        >
                            Withdraw
                        </Button>
                    </Stack>
                    <Stack alignItems='center' borderRight={isSmallScreen ? 0: 1} borderColor='#FFFFFF52'
                        sx={{flexDirection: {xs: 'column', xlg: 'row'}, width: {xs: 1, sm: 'auto'}, padding: {xs: 4, sm: 2, md: 0}, pr: {xs: 4, md: 4, lg: 12, xlg: 6, xl: 12}, gap: {xs: 4, xl: 10}}}>
                        <Box>
                            <Typography color='#D4D4D4' sx={{textAlign: {xs: 'center', xlg: 'left'}}}>Rewards</Typography>
                            <Typography fontSize={24} color='#FFF' sx={{textAlign: {xs: 'center', sm: 'left'}}}>
                                <span style={{fontFamily: `'Britanica-HeavySemiExpanded', sans-serif`}}>2 </span>
                                TREN
                            </Typography>
                        </Box>
                        <Button variant='outlined'
                            sx={{ 
                                maxWidth: '100%', width: {xs: 1, sm: 'auto'}, py: { xs: 2, lg: 3 }, color: '#FFF', fontSize: { xs: 16, md: 18 }, fontWeight: 400, borderRadius: '10px', borderColor: '#C6E0DC'
                            }}
                        >
                            Claim <Typography sx={{display: {xs: 'block', md: 'none', lg: 'block', xlg: 'none', xl: 'block'}, fontSize: { xs: 16, md: 18 }}}>&nbsp;Rewards</Typography>
                        </Button>
                    </Stack>
                </Stack>
                <Box sx={{display: {xs: 'none', md: 'block'}, pr: {xs: 0, lg: 10, xlg: 0, xl: 20}}}>
                    <Link href='/earn'>
                        <Typography variant='h5' color='primary' sx={{ fontWeight: 400, cursor: 'pointer' }}>
                            Earn
                            <svg
                            style={{ marginLeft: 8 }}
                            xmlns='http://www.w3.org/2000/svg'
                            width='12'
                            height='12'
                            viewBox='0 0 12 12'
                            fill='none'
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
                    </Link>
                </Box>
            </Stack>

            {/* Active positions */}
            {collateralDetails && (
                <Stack sx={{ mt: {xs: 20, md: 30} }} gap={isMediumScreen ? 6 : 12}>
                {rows.length > 0 ? (
                    rows.map((row, index) => (
                    <CollateralRow
                        row={row}
                        onToogle={() => {console.log('Do nothing')}}
                        isOpen={true}
                        key={index}
                        disableToogle={true}
                    />
                    ))
                ) : (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                    <Typography variant='body1'>No matching collateral</Typography>
                    </Box>
                )}
                </Stack>
            )}
        </Box>
    )
}

export default Dashboard