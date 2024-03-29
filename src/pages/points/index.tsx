import { Stack, Typography, Box, Link, Grid, useTheme, Input, Button} from '@mui/material'
import Icon from 'src/@core/components/icon'

import Image from 'next/image'
import { ActiveTask } from '@/views/components/points/ActiveTask'
import { useGlobalValues } from '@/context/GlobalContext'
import { SortableHeaderItem } from '@/views/components/global/SortableHeaderItem'
import { useState } from 'react'
import { formatToThousands, formatToThousandsInt, shortenWalletAddress } from '@/hooks/utils'
import CustomTextField from '@/@core/components/mui/text-field'
import { Copy } from '@/views/components/Copy'

const Points = () => {
    const {isSmallScreen, isMediumScreen, radiusBoxStyle} = useGlobalValues()
    const [sortBy, setSortBy]= useState('symbol')
    const [direction, setDirection] = useState('asc')
    const [referralLink, setReferralLink] = useState('')
    const theme = useTheme()

    const setSortDetail = (sortBy: string, direction: string) => {
        setSortBy(sortBy)
        setDirection(direction)
    }

    const headerItems = [
        {
            label: 'Rank',
            key: 'id',  // This is sort key.
            flexWidth: 4.5,
            sortable: false
        },
        {
            label: 'User Address',
            key: 'address',
            flexWidth: 7,
            sortable: false

        },
        {
            label: 'Total XP',
            key: 'totalXP',
            flexWidth: 5,
            sortable: false

        },
        {
            label: 'XP gained per day',
            key: 'dailyXP',
            flexWidth: 6.5,
            sortable: false

        },
        {
            label: 'Referral XP',
            key: 'referralXP',
            flexWidth: 5,
            sortable: false

        },
    ]

    return (
        <Box>
            <Box mt={10} position='relative' borderRadius={2.5} border='solid 1px #2D3131' overflow='hidden' sx={{px: {xs: 4, md: 15}, py: {xs: 4, md: 9}}}>
                <Box className="content" zIndex={10} position='relative'>
                    <Typography className='header-gradient' variant='h1'sx={{
                            mb: { xs: 4, md: 8 }, mt: 4,
                            fontSize: { xs: 36, md: 64, xl: 72 }
                        }}
                    >
                        Tren XP
                    </Typography>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} color='#F3F3F3'
                        sx={{ fontWeight: 300, width: isSmallScreen ? 1 : 1/2, lineHeight: { xs: 1.25, sm: 1.7 } }}>
                        Deposit your collateral tokens into a module in exchange for a trenUSD loan or Loop 
                        your assets in one click to leverage exposure for your spot assets. Pay back your loan later using trenUSD or your collateral.
                    </Typography>
                    <Box mt={20} position='relative' sx={{backgroundColor: {xs: '#0C0E0F', md: 'transparent'}, p: 4}}>
                        {/* <div style={{
                            content: '',
                            position: 'absolute',
                            left: '50%',
                            right: 0,
                            top: 0,
                            // transform: 'translateY(-50%)',
                            width: '0.5px',
                            height: '60%',
                            background: 'white'
                        }} /> */}
                        <Grid container spacing={4} alignItems='center'>
                            <Grid item xs={6} lg={2.3}>
                                <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='#C6C6C799'>Total XP Gained</Typography>
                                <Typography variant='h1'sx={{
                                        fontSize: { xs: 16, md: 32, xl: 46 },
                                        mt: {xs: 2, lg: 0}
                                    }}
                                    fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`}
                                >
                                    232.2 XP
                                </Typography>
                            </Grid>
                            <Grid item xs={6} lg={2.3}>
                                <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='#C6C6C799'>XP Gained / 24 hrs </Typography>
                                <Typography variant='h1'sx={{
                                        fontSize: { xs: 16, md: 32, xl: 46 },
                                        mt: {xs: 2, lg: 0}
                                    }}
                                    fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`}
                                >
                                    24.1
                                </Typography>
                            </Grid>
                            <Grid item xs={6} lg={2.3}>
                                <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='#C6C6C799'>Rank</Typography>
                                <Typography variant='h1'sx={{
                                        fontSize: { xs: 16, md: 32, xl: 46 },
                                        mt: {xs: 2, lg: 0}
                                    }}
                                    fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`}
                                >
                                    #1,321
                                </Typography>
                            </Grid>
                            <Grid item xs={6} lg={2.3}>
                                <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='#C6C6C799'>Referrals</Typography>
                                    <Typography variant='h1'sx={{
                                            fontSize: { xs: 16, md: 32, xl: 46 },
                                            mt: {xs: 2, lg: 0}
                                        }}
                                        fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`}
                                    >
                                        50 XP
                                </Typography>
                            </Grid>
                            <Grid item xs={12} lg={2.8}>
                                <Stack gap={2} width='fit-content' marginLeft={isMediumScreen ? 0 : 'auto'}>
                                    <Stack direction='row' justifyContent='space-between' gap={3}>
                                        <Typography variant='h4' fontWeight={700}>Next Update</Typography>
                                        <Typography variant='h4' fontWeight={700} color='primary'>08:51:58</Typography>
                                    </Stack>
                                    <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} fontWeight={400}>Last Update: 3/3/2024 - 22:19:19</Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                
                <video autoPlay muted loop id="background-video" style={{ width: '100%', position: 'absolute', zIndex: '1', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                    <source src={isMediumScreen ? '/videos/tren-points-3d-mobile.mp4' : '/videos/tren-points-3d.mp4'} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </Box>

            {/* Active Tasks Section */}
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

            {/* Leaderboard and Referrals */}
            <Grid container spacing={4} mt={12}>
                <Grid item xs={12} sm={6} lg={8}>
                    <Typography className='header-gradient' sx={{ fontSize: {xs: 32, lg: 40}}}>
                        Leaderboard
                    </Typography>
                    <Box sx={{...radiusBoxStyle, mt: 8}} id='leaderboard'>
                        {/* Leaderboard Table Header */}
                        <Stack direction='row' sx={{
                            px: 6, pt: 6,
                            display: {
                                xs: 'none',
                                lg: 'flex'
                            }
                        }}>
                            {headerItems.map((item, index) => (
                                <SortableHeaderItem
                                    key={index}
                                    label={item.label}
                                    flexWidth={item.flexWidth}
                                    sortBy={item.key}
                                    direction={item.key == sortBy ? direction : 'none'}
                                    onSort={setSortDetail}
                                    sortable={item.sortable}
                                />
                            ))}
                        </Stack>
                        
                        {/* Leaderboard Table Body */}
                        <Stack mt={4}>
                            {Array.from({ length: 10 }, (_, index) => (
                                <Stack key={index} direction='row' alignItems='center' sx={{
                                    border: 'solid 1px transparent',
                                    borderRadius: '16px',
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                    p: {xs: 3, sm: 5}
                                }}>
                                    <Stack flex='3.5'>
                                        <Typography variant='h5' fontWeight={400} marginLeft={4}>{index + 1}</Typography>
                                    </Stack>
                                    <Stack flex='7.5' direction='row' alignItems='center' gap={3}>
                                        <img alt='Gradient Circle' src='/images/icons/customized-icons/gradient-circle.png' />
                                        <Typography variant='h5' fontWeight={400}>{shortenWalletAddress('0xD88Cc271583b0019DdA08666fF2DB78B2A0172cC')}</Typography>
                                    </Stack>
                                    <Stack flex='6'>
                                        <Typography variant='h5' fontWeight={400}>{formatToThousandsInt(123000)} XP</Typography>
                                    </Stack>
                                    <Stack flex='5.5'>
                                        <Typography variant='h5' fontWeight={400}>{formatToThousandsInt(4500)} XP</Typography>
                                    </Stack>
                                    <Stack flex='4.5'>
                                        <Typography variant='h5' fontWeight={400}>{formatToThousandsInt(3000)} XP</Typography>
                                    </Stack>
                                </Stack>
                            ))}
                        </Stack>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <Stack>
                        <Typography className='header-gradient' sx={{ fontSize: {xs: 32, lg: 40}}}>
                            Referrals
                        </Typography>
                        <Box sx={{...radiusBoxStyle, mt: 8, py: 6}}>
                            <Typography color='#C6C6C7'>
                                Invite your friends to Tren Finance to gain additional XP. Along with earning 1,000 XP per referral, you will also receive 15% of the points earned by the referred member.
                            </Typography>
                            <Box sx={{border: 'solid 1px #2D3131', borderRadius: '10px', mt: 4}}>
                                <Stack direction='row' borderBottom='solid 1px #2D3131' px={6} py={4}>
                                    <Stack flex={1}>
                                        <Typography variant='subtitle2' fontWeight={400} color='#D4D4D4'>XP from Referrals</Typography>
                                    </Stack>
                                    <Stack flex={1}>
                                        <Typography variant='subtitle2' fontWeight={400} color='#D4D4D4'>Invited People</Typography>
                                    </Stack>
                                    <Stack flex={1}>
                                        <Typography variant='subtitle2' fontWeight={400} color='#D4D4D4'>XP share from referred members</Typography>
                                    </Stack>
                                </Stack>
                                <Stack direction='row' px={6} py={4}>
                                    <Stack flex={1}>
                                        <Typography variant='h5' fontWeight={400} color='white'>{formatToThousandsInt(12000)} XP</Typography>
                                    </Stack>
                                    <Stack flex={1}>
                                        <Typography variant='h5' fontWeight={400} color='white'>12</Typography>
                                    </Stack>
                                    <Stack flex={1}>
                                        <Typography variant='h5' fontWeight={400} color='white'>{formatToThousandsInt(3600)} XP / Day</Typography>
                                    </Stack>
                                </Stack>
                            </Box>
                            <Typography variant='h5' fontWeight={400} mt={6}>Generate Link</Typography>
                            <Box position='relative' mt={3}>
                                <CustomTextField sx={{ fontSize: 18, width: 1,
                                    '& .MuiInputBase-root': {
                                        width: 1,
                                        height: 1,
                                        '& input': {
                                            fontSize: isSmallScreen ? 16 : 18,
                                            padding: '14px !important',
                                            backgroundColor: 'transparent',
                                        }
                                      }
                                    }}
                                    value={referralLink}
                                    placeholder='http://'
                                    disabled={true}
                                />
                                <Box position='absolute' right={4} top={2} borderLeft='solid 1px #171717' sx={{
                                        width: '37px', height: '37px', paddingLeft: 2,
                                        top: '50%', transform: 'translateY(-50%)',
                                        right: 10
                                    }}>
                                    <Copy text={referralLink} />
                                </Box>
                            </Box>
                            
                            <Button variant='outlined' sx={{width: 1, color: 'white', mt: 8, py: 3, fontSize: 18, fontWeight: 400}} onClick={() => {
                                setReferralLink(`https://tren.finance/invite/${Math.random().toString(36).substring(2, 15)}`)
                            }}>
                                Generate
                            </Button>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Points