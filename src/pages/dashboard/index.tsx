import { Typography, Grid, Box, Stack } from '@mui/material'
import { PositionsNet } from '@/views/components/dashboard/PositionsNet'
import { PositionsCount } from '@/views/components/dashboard/PositionsCount'
import { useGlobalValues } from '@/context/GlobalContext'
import DashboardConnectWallet from '@/views/components/DashboardConnectWallet'

const Dashboard = () => {
    const {isSmallScreen} = useGlobalValues()
    const statBoxStyle = {
        borderRadius: '10px',
        border: 'solid 1px #393939', 
        backgroundColor: '#0C0E0F', 
        width: '270px', 
        minWidth: '160px',
        py: 4, px: {xs: 4, lg: 6}
    }
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
        </Box>
    )
}

export default Dashboard