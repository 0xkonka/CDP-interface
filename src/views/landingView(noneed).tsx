import {
    Box, Stack, Typography, Fade
} from '@mui/material'
import Image from 'next/image'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Icon from 'src/@core/components/icon'

export const LandingView = () => {
    return (
        <Stack alignItems='center' justifyContent='center' height='100vh' sx={{
            background: `url('/images/backgrounds/landing-bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <Fade in={true} timeout={1000}>
                <Box sx={{position: 'absolute', left: '50%', top: '20%', animation: 'absoluteFadeInUp 0.5s forwards'}}>
                    <Image src='/images/logos/logo.svg' alt='TrenFi Logo' sizes="100vw"
                        width={207}
                        height={24}
                        style={{
                            width: '100%',
                            height: 24,
                        }} 
                        priority 
                    />
                </Box>
            </Fade>
            <Stack alignItems='center'>
                <Fade in={true} timeout={1000}>
                    <Box width='fit-content' px={2} py={0.5} bgcolor='FFFFFF0D' borderRadius={50} border='solid 1px #FFFFFF1A'
                        sx={{
                            animation: 'fadeInUp 1s forwards'
                        }}>
                        <Typography variant='subtitle2' color='#F0F0F0'>Join now!</Typography>
                    </Box>
                </Fade>
                <Fade in={true} timeout={1000}>
                    <Typography fontSize={60} fontWeight={400} color='#F0F0F0' style={{
                        fontFamily: `'Britanica-HeavySemiExpanded', sans-serif`
                    }} my={1} sx={{
                        animation: 'fadeInUp 1.5s forwards'
                    }}>
                        Get started
                    </Typography>
                </Fade>
                <Fade in={true} timeout={1000}>
                    <Typography  color='#FFF' textAlign='center' lineHeight={1.25} mb={4} style={{
                        fontFamily: 'Poppins, sans-serif'
                    }} sx={{
                        animation: 'fadeInUp 2s forwards',
                        maxWidth: {xs: 300, md: 400}
                    }}>
                        By connecting your wallet, you accept our Terms of Service an Privacy Policy.
                    </Typography>
                </Fade>
                <ConnectButton.Custom>
                {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                    return (
                    <Stack direction='row' alignItems='center' onClick={openConnectModal} style={{ cursor: 'pointer' }} sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 50,
                        gap: 1,
                        bgcolor: '#67DAB1',
                        '&:hover': {
                            bgcolor: '#FFFFFF'
                          },
                        transition: 'background-color 0.3s ease-in-out'
                    }}>
                        {!account 
                        ? <>
                            <Typography className='font-poppins'>Connect Wallet</Typography>
                            <Icon icon='system-uicons:arrow-right'/>
                          </>
                        : <></>
                        }
                    </Stack>
                    );
                }}
                </ConnectButton.Custom>
            </Stack>
        </Stack>
    )
}