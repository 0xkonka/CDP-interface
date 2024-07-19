import { useGlobalValues } from "@/context/GlobalContext"
import { usePoint } from "@/context/PointContext"
import { formatToThousandsInt } from "@/hooks/utils"
import { Box, Stack, Typography, Grid } from "@mui/material"

export const TrenPointBanner = () => {
    const {isSmallScreen, isMediumScreen, isMediumLargeScreen} = useGlobalValues()
    const {userPoint} = usePoint()

    return (
        <Box
            mt={10}
            position='relative'
            borderRadius='10px'
            border='solid 1px #2D3131'
            overflow='hidden'
            sx={{ px: { xs: 4, md: 8, lg: 10, xl: 15 }, py: { xs: 4, md: 9 } }}
        >
            <Stack className='content' zIndex={10} position='relative'>
                <Box>
                    <Typography
                    className='header-gradient'
                    variant='h1'
                    sx={{
                        mb: { xs: 4, md: 8 },
                        mt: 4,
                        fontSize: { xs: 36, sm: 48, md: 64, xl: 72 }
                    }}
                    >
                    Tren XP
                    </Typography>
                    <Typography
                    variant={isSmallScreen ? 'subtitle1' : 'h5'}
                    color='#F3F3F3'
                    sx={{ fontWeight: 300, width: isMediumScreen ? 1 : 1 / 2, lineHeight: { xs: 1.25, sm: 1.7 } }}
                    >
                    Earn XP by borrowing trenUSD, staking tokens and referring friends.
                     Increase your multiplier by completing social tasks and utilizing the Daily Boost. 
                     Unlock larger airdrops by reaching milestones alongside fellow Tren users.
                    </Typography>
                </Box>
                <Box position='relative' sx={{ mt: { xs: 5, lg: 20 }, p: 4 }}>
                    <Grid container spacing={4} alignItems='center' ml={-8}>
                        <Grid item xs={6} lg={2.2} xl={2}>
                            <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='#C6C6C799'>
                                Total XP Gained
                            </Typography>
                            <Typography variant='h1' className='font-britanica'
                                sx={{
                                    fontSize: { xs: 16, md: 32, xl: 42 },
                                    mt: { xs: 2, lg: 0 }
                                }}
                            >
                                {/* {userPoint?.xpPoint} XP */}
                                232.2 XP
                            </Typography>
                        </Grid>
                        <Grid item xs={6} lg={2.2} xl={1.5}>
                            <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='#C6C6C799'>
                                XP Gained / 24 hrs
                            </Typography>
                            <Typography variant='h1' className='font-britanica'
                                sx={{
                                    fontSize: { xs: 16, md: 32, xl: 42 },
                                    mt: { xs: 2, lg: 0 }
                                }}
                            >
                                24.1
                            </Typography>
                        </Grid>
                        <Grid item xs={6} lg={4.2} xl={3.3}>
                            <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='#C6C6C799'>
                                Rank
                            </Typography>
                            <Stack direction='row' alignItems='end' sx={{ mt: { xs: 2, lg: 0 }}} gap={2}>
                                <Typography variant='h2' className='font-britanica'
                                    sx={{
                                        fontSize: { xs: 16, md: 32, xl: 42 },
                                    }}
                                >
                                    {/* #{userPoint?.rank} */}
                                    #{formatToThousandsInt(1321)}
                                    <Typography variant='caption' className='font-britanica'
                                        sx={{
                                            color: '#7D817F',
                                            fontSize: { xs: 16, md: 28, xl: 32 },
                                        }}
                                    >
                                        /{246757}
                                    </Typography>
                                </Typography>
                                <Stack direction='row' alignItems='center' gap={0.5} sx={{mb: {xs: 1, md: 2, xl: 3}}}>
                                    <Stack sx={{width: {xs: 12, md: 16}}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M7.24884 3.05287L3.27299 7.02872C3.13132 7.16555 2.94158 7.24126 2.74463 7.23955C2.54768 7.23784 2.35928 7.15884 2.22001 7.01957C2.08074 6.8803 2.00174 6.6919 2.00003 6.49495C1.99832 6.298 2.07403 6.10826 2.21086 5.96659L7.46893 0.70852C7.53862 0.638704 7.6214 0.583315 7.71253 0.545524C7.80366 0.507733 7.90134 0.488281 7.99999 0.488281C8.09864 0.488281 8.19633 0.507733 8.28745 0.545524C8.37858 0.583315 8.46136 0.638704 8.53106 0.70852L13.7891 5.96659C13.926 6.10826 14.0017 6.298 14 6.49495C13.9982 6.6919 13.9192 6.8803 13.78 7.01957C13.6407 7.15884 13.4523 7.23784 13.2554 7.23955C13.0584 7.24126 12.8687 7.16555 12.727 7.02872L8.75114 3.05287V14.7603C8.75114 14.9596 8.67201 15.1506 8.53114 15.2915C8.39027 15.4323 8.19921 15.5115 7.99999 15.5115C7.80077 15.5115 7.60971 15.4323 7.46885 15.2915C7.32798 15.1506 7.24884 14.9596 7.24884 14.7603V3.05287Z" fill="#67DAB1"/>
                                        </svg>
                                    </Stack>
                                    <Typography variant='h4' color='primary'
                                        sx={{
                                            color: '#7D817F',
                                            fontSize: { xs: 14, md: 20, xl: 24 },
                                            lineHeight: 1,
                                        }}>
                                        <span style={{color: '#67DAB1', fontWeight: 600}}>+4</span>/24h
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={1.8} xl={1.4}>
                            <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='#C6C6C799'>
                                Total Multiplier
                            </Typography>
                            <Typography variant='h1' className='font-britanica'
                                sx={{
                                    fontSize: { xs: 16, md: 32, xl: 42 },
                                    mt: { xs: 2, lg: 0 }
                                }}
                            >
                                4X
                            </Typography>
                        </Grid>
                        <Grid item xs={12} lg={4.5} xl={3.8}>
                            <Stack gap={2} width='fit-content' sx={{ml: {xs: 0, xl: 'auto'}}}>
                                <Stack direction='row' justifyContent='space-between' gap={3}>
                                    <Typography variant='h4' fontWeight={700}>
                                    Next Update
                                    </Typography>
                                    <Typography variant='h4' fontWeight={700} color='primary'>
                                    08:51:58
                                    </Typography>
                                </Stack>
                                <Typography sx={{ fontSize: { xs: 14, md: 16, xl: 18 } }} fontWeight={400} color='#C6C6C7'>
                                    Last Update: 3/3/2024 - 22:19:19
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Stack>
            <Box sx={{
                display: { xs: 'none', lg: 'block' },
                width: '100%',
                position: 'absolute',
                zIndex: '1',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
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