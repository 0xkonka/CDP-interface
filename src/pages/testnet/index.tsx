import { useGlobalValues } from '@/context/GlobalContext'
import {Box, Typography, Stack, Button} from '@mui/material'

const Testnet = () => {
    const {isSmallScreen, isMediumScreen, isMediumLargeScreen} = useGlobalValues()
    const gradientBgStyle = {
        background: 'linear-gradient(90deg, rgba(52, 97, 81, 0.60) 6.56%, rgba(81, 150, 125, 0.00) 88.13%)',
        WebkitBackdropFilter: 'blur(1.244215965270996px)', // for Safari
        backdropFilter: 'blur(1.244215965270996px)' // standard property, may not work as inline-style
    }
    const lightPrimaryBlendingStyle = {
        borderRadius: '2010px',
        background: '#67DAB1',
        filter: 'blur(400px)',
        width: '100%',
        height: 132,
    }

    return (
        <Box>
            <Box className='content' zIndex={10} position='relative'>
                <Typography className='header-gradient' variant='h1'sx={{
                        mb: { xs: 4, md: 4 }, mt: 10,
                        fontSize: { xs: 36, md: 64, xl: 72 }
                    }}
                >
                    Enabling the Internet Bond
                </Typography>
                <Typography fontSize={24} mb={8}>
                    Synthetic dollar and Internet Native Yield
                </Typography>
                <Box style={gradientBgStyle} sx={{py: 3, px: 8, width: 484}}>
                    <Typography variant='h2' color='primary' fontWeight={600}>sUSDe APY 35.4%</Typography>
                </Box>
                <Stack direction={isSmallScreen ? 'column' : 'row'} gap={8} mt={32}>
                    <Stack sx={{flex: {xs: 1, lg: 1}, border: 'solid 1px #67DAB1', px: 10, py: 6, alignItems: {xs: 'center', lg: 'start'}}}>
                        <Typography className='header-gradient' variant='h1' sx={{
                                mb: { xs: 4, md: 4 },
                                lineHeight: 1,
                                fontSize: { xs: 18, md: 28, xl: 40 }
                            }}
                        >
                            Early Access
                        </Typography>
                        <Typography sx={{fontSize: {xs: 12, lg: 20}, mb: 4}}>
                            Enter your Invite Code 
                        </Typography>
                        <Box height={90} mb={8} sx={{background: 'green', width: 1}}>
                            
                        </Box>
                        <Button
                            className='gradient-stroke-button'
                            sx={{
                                py: 3,
                                px: 10,
                                fontSize: 24,
                                borderRadius: '10px'
                            }}
                            variant='outlined'
                        >
                        Enter Code
                        </Button>
                    </Stack>
                    <Stack sx={{flex: {xs: 1, lg: 2.5}, border: 'solid 1px #67DAB1', px: 10, py: 6, alignItems: {xs: 'center', lg: 'start'}}}>
                        <Typography className='header-gradient' variant='h1' sx={{
                                mb: { xs: 10, md: 14 },
                                lineHeight: 1,
                                fontSize: { xs: 18, md: 28, xl: 40 }
                            }}
                        >
                            Backed by
                        </Typography>
                        <Stack direction={isMediumLargeScreen ? 'column': 'row'} justifyContent='space-between' gap={9} width='100%'>
                            <Stack gap={12}>
                                <Stack direction='row' justifyContent={isMediumScreen ? 'center' : 'flex-start'} gap={5}>
                                    <img src='/images/logos/dragonfly.png' alt='Dragonfly' height={36}/>
                                    <Stack direction='row' alignItems='center' gap={3.5}>
                                        <img src='/images/avatars/arthur-hayes.png' width={32} alt='Arthur Hayes'/>
                                        <Typography sx={{fontSize: {xs: 16, lg: 28}}}>Arthur Hayes</Typography>
                                    </Stack>
                                </Stack>
                                <Stack direction='row' justifyContent='justify-between' gap={7.5}>
                                    <img src='/images/logos/binance-labs.svg' alt='Binance Labs' height={26}/>
                                    <img src='/images/logos/ventures.svg' alt='Ventures' height={26}/>
                                    <img src='/images/logos/bybit.svg' alt='Bybit' height={26}/>
                                    <img src='/images/logos/deribit.png' alt='Deribit' height={26}/>
                                    <img src='/images/logos/mirana.png' alt='Mirana' height={26}/>
                                </Stack>
                            </Stack>
                            <Stack direction='row' gap={4} sx={{justifyContent: {xs: 'space-between', lg: 'flex-start', xl: 'flex-end'}}}>
                                <Stack direction='column' justifyContent='center' alignItems='center' gap={1}>
                                    <img src='/images/avatars/synthetics.png' alt='Synthetics' width={50}/>
                                    <Typography sx={{fontSize:{xs: 12, md: 14}}} mt={3}>SYNTHETICS</Typography>
                                    <Typography sx={{fontSize:{xs: 12, md: 14}}} color='primary'>@kayinne</Typography>
                                </Stack>
                                <Stack direction='column' justifyContent='center' alignItems='center' gap={1}>
                                    <img src='/images/avatars/aave.png' alt='Aave' width={50}/>
                                    <Typography sx={{fontSize:{xs: 12, md: 14}}} mt={3}>AAVE</Typography>
                                    <Typography sx={{fontSize:{xs: 12, md: 14}}} color='primary'>@Stanikulechov</Typography>
                                </Stack>
                                <Stack direction='column' justifyContent='center' alignItems='center' gap={1}>
                                    <img src='/images/avatars/curve.png' alt='Curve' width={50}/>
                                    <Typography sx={{fontSize:{xs: 12, md: 14}}} mt={3}>CURVE</Typography>
                                    <Typography sx={{fontSize:{xs: 12, md: 14}}} color='primary'>@newmilwich</Typography>
                                </Stack>
                                <Stack direction='column' justifyContent='center' alignItems='center' gap={1}>
                                    <img src='/images/avatars/frax.png' alt='Frax' width={50}/>
                                    <Typography sx={{fontSize:{xs: 12, md: 14}}} mt={3}>FRAX</Typography>
                                    <Typography sx={{fontSize:{xs: 12, md: 14}}} color='primary'>@samkazemian</Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </Box>
          
            <Box sx={{
                width: '100vw',
                height: 'calc(100vh + 170px)',
                position: 'fixed',
                zIndex: '1',
                top: -170,
                left: 0,
                overflow: 'hidden'
            }}>
                <video autoPlay muted loop id='background-video' >
                    <source
                        src='/videos/testnet-video.mp4'
                        type='video/mp4'    
                    />
                    Your browser does not support the video tag.
                </video>
            </Box>
            <Box sx={{
                width: '100vw',
                height: '100vh',
                position: 'fixed',
                zIndex: '1',
                top: 0,
                left: 0,
                overflow: 'hidden',
                background: 'rgba(0, 0, 0, 0.53)'
            }}></Box>
            <Box style={lightPrimaryBlendingStyle}></Box>
        </Box>
    )
}

export default Testnet