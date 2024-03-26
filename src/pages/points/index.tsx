import { Stack, Typography, Box, Link, Grid, Button} from '@mui/material'
import Icon from 'src/@core/components/icon'

import Image from 'next/image'
import { ActiveTask } from '@/views/components/points/ActiveTask'
import { useGlobalValues } from '@/context/GlobalContext'

const Points = () => {
    const {isSmallScreen} = useGlobalValues()

    return (
        <Box>
            <Box mt={10} position='relative' borderRadius={2.5} border='solid 1px #2D3131' overflow='hidden' sx={{px: 15, py: 9}}>
                <Box className="content" zIndex={10} position='relative'>
                    <Typography className='header-gradient' variant='h1'sx={{
                            mb: { xs: 4, md: 8 }, mt: 4,
                            fontSize: { xs: 36, md: 64, xl: 72 }
                        }}
                    >
                        Tren XP
                    </Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} color='#F3F3F3'
                        sx={{ fontWeight: 300, width: 730, maxWidth: '100%', lineHeight: { xs: 1.25, sm: 1.7 } }}>
                        Deposit your collateral tokens into a module in exchange for a trenUSD loan or Loop 
                        your assets in one click to leverage exposure for your spot assets. Pay back your loan later using trenUSD or your collateral.
                    </Typography>
                    <Stack direction='row' justifyContent='space-between' alignItems='center' mt={20}>
                        <Box>
                            <Typography variant='h5' fontWeight={400} color='#C6C6C799'>Total XP Gained</Typography>
                            <Typography variant='h1'sx={{
                                    fontSize: { xs: 24, md: 32, xl: 46 },
                                }}
                                fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`}
                            >
                                232.2 XP
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant='h5' fontWeight={400} color='#C6C6C799'>XP Gained / 24 hrs </Typography>
                            <Typography variant='h1'sx={{
                                    fontSize: { xs: 24, md: 32, xl: 46 },
                                }}
                                fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`}
                            >
                                24.1
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant='h5' fontWeight={400} color='#C6C6C799'>Rank</Typography>
                            <Typography variant='h1'sx={{
                                    fontSize: { xs: 24, md: 32, xl: 46 },
                                }}
                                fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`}
                            >
                                #1,321
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant='h5' fontWeight={400} color='#C6C6C799'>Referrals</Typography>
                            <Typography variant='h1'sx={{
                                    fontSize: { xs: 24, md: 32, xl: 46 },
                                }}
                                fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`}
                            >
                                50 XP
                            </Typography>
                        </Box>
                        <Stack gap={2}>
                            <Stack direction='row' justifyContent='space-between'>
                                <Typography variant='h4' fontWeight={700}>Next Update</Typography>
                                <Typography variant='h4' fontWeight={700} color='primary'>08:51:58</Typography>
                            </Stack>
                            <Typography variant='h5' fontWeight={400}>Last Update: 3/3/2024 - 22:19:19</Typography>
                        </Stack>
                    </Stack>
                </Box>
                
                <video autoPlay muted loop id="background-video" style={{ width: '100%', position: 'absolute', zIndex: '1', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                    <source src={isSmallScreen ? '/videos/tren-points-3d-mobile.mp4' : '/videos/tren-points-3d.mp4'} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </Box>
            <Box id='active-tasks' mt={20}>
                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                    <Typography className='header-gradient' sx={{ fontSize: {xs: 32, lg: 40}}}>
                        Active Tasks
                    </Typography>
                    <Link href='#'>
                        <Stack direction='row'>
                            <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} color='primary' fontWeight={400} sx={{ mr: 2 }}>
                                View All
                            </Typography>
                            <Icon fontSize='24' icon='basil:arrow-right-outline' color='primary'/>
                        </Stack>
                    </Link>
                </Stack>
                <Grid container spacing={4} mt={4}>
                    <Grid item xs={12} sm={6} lg={3}>
                        <ActiveTask icon='stake-lp' title='Stake LP Tokens' exp={50} description='Stake your LP tokens from either Curve or Uniswap to provide liquidity.'
                                    xpPlus={15} xpCurrency='dollar' period='per day' learnMoreLink='#'/>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <ActiveTask icon='stake-trenUSD' title='Stake TrenUSD' exp={100} description='Stake your TrenUSD directly into our stability pool to help secure the protocol.'
                                    xpPlus={10} xpCurrency='dollar' period='per day' learnMoreLink='#'/>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <ActiveTask icon='borrowing' title='Borrowing' exp={100} description='Borrow against your collateral on Tren Finance, where points are allocated based on the total value borrowed'
                                    xpPlus={10} xpCurrency='dollar' period='per day' learnMoreLink='#'/>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <ActiveTask icon='refer-friends' title='Refer Friends' exp={50} description='Earn XP for each friend you invite, while also earning a share of their XP.'
                                    xpPlus={1000} xpCurrency='referral' period='+15% of each friend’s XP' learnMoreLink='#'/>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default Points