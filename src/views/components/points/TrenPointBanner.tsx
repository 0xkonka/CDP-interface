import { useGlobalValues } from "@/context/GlobalContext"
import { Box, Stack, Typography, Grid } from "@mui/material"

export const TrenPointBanner = () => {
    const {isSmallScreen, isMediumScreen, isMediumLargeScreen} = useGlobalValues()

    return (
        <Box
            mt={10}
            position='relative'
            borderRadius={2.5}
            border='solid 2px #2D3131'
            overflow='hidden'
            sx={{ px: { xs: 4, md: 8, xl: 15 }, py: { xs: 4, md: 9 } }}
        >
            <Stack className='content' zIndex={10} position='relative'>
            <Box>
                <Typography
                className='header-gradient'
                variant='h1'
                sx={{
                    mb: { xs: 4, md: 8 },
                    mt: 4,
                    fontSize: { xs: 36, md: 64, xl: 72 }
                }}
                >
                Tren XP
                </Typography>
                <Typography
                variant={isSmallScreen ? 'subtitle1' : 'h5'}
                color='#F3F3F3'
                sx={{ fontWeight: 300, width: isMediumScreen ? 1 : 1 / 2, lineHeight: { xs: 1.25, sm: 1.7 } }}
                >
                Deposit your collateral tokens into a module in exchange for a trenUSD loan or Loop your assets in one
                click to leverage exposure for your spot assets. Pay back your loan later using trenUSD or your
                collateral.
                </Typography>
            </Box>
            <Box position='relative' sx={{ mt: { xs: 5, lg: 20 }, p: 4 }}>
                <Grid container spacing={4} alignItems='center' ml={-8}>
                <Grid item xs={6} lg={2.3}>
                    <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='#C6C6C799'>
                    Total XP Gained
                    </Typography>
                    <Typography
                    variant='h1'
                    sx={{
                        fontSize: { xs: 16, md: 32, xl: 46 },
                        mt: { xs: 2, lg: 0 }
                    }}
                    fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`}
                    >
                    232.2 XP
                    </Typography>
                </Grid>
                <Grid item xs={6} lg={2.3}>
                    <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='#C6C6C799'>
                    XP Gained / 24 hrs{' '}
                    </Typography>
                    <Typography
                    variant='h1'
                    sx={{
                        fontSize: { xs: 16, md: 32, xl: 46 },
                        mt: { xs: 2, lg: 0 }
                    }}
                    fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`}
                    >
                    24.1
                    </Typography>
                </Grid>
                <Grid item xs={6} lg={2.3}>
                    <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='#C6C6C799'>
                    Rank
                    </Typography>
                    <Typography
                    variant='h1'
                    sx={{
                        fontSize: { xs: 16, md: 32, xl: 46 },
                        mt: { xs: 2, lg: 0 }
                    }}
                    fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`}
                    >
                    #1,321
                    </Typography>
                </Grid>
                <Grid item xs={6} lg={2.3}>
                    <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='#C6C6C799'>
                    Referrals
                    </Typography>
                    <Typography
                    variant='h1'
                    sx={{
                        fontSize: { xs: 16, md: 32, xl: 46 },
                        mt: { xs: 2, lg: 0 }
                    }}
                    fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`}
                    >
                    50 XP
                    </Typography>
                </Grid>
                <Grid item xs={12} lg={2.8}>
                    <Stack gap={2} width='fit-content' marginLeft={isMediumScreen ? 0 : 'auto'}>
                    <Stack direction='row' justifyContent='space-between' gap={3}>
                        <Typography variant='h4' fontWeight={700}>
                        Next Update
                        </Typography>
                        <Typography variant='h4' fontWeight={700} color='primary'>
                        08:51:58
                        </Typography>
                    </Stack>
                    <Typography sx={{ fontSize: { xs: 14, md: 16, xl: 18 } }} fontWeight={400}>
                        Last Update: 3/3/2024 - 22:19:19
                    </Typography>
                    </Stack>
                </Grid>
                </Grid>
            </Box>
            </Stack>
            <Box
            sx={{
                display: { xs: 'none', lg: 'block' },
                width: '100%',
                position: 'absolute',
                zIndex: '1',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}
            >
            <video autoPlay muted loop id='background-video' style={{ width: '100%' }}>
                <source
                src={isMediumLargeScreen ? '/videos/tren-points-3d-laptop.mp4' : '/videos/tren-points-3d.mp4'}
                type='video/mp4'
                />
                Your browser does not support the video tag.
            </video>
            </Box>
        </Box>
    )
}