import { useGlobalValues } from '@/context/GlobalContext'
import { Grid, Typography, Box, Stack, useTheme } from '@mui/material'
import { useState, useRef, useEffect } from 'react'

import { formatToThousands, formatToThousandsInt, shortenWalletAddress } from '@/hooks/utils'
import { SortableHeaderItem } from '@/views/components/global/SortableHeaderItem'
import { Copy } from '../Copy'
import { usePoint } from '@/context/PointContext'

export const ExperienceBoard = () => {
    const [firstItemHeight, setFirstItemHeight] = useState('auto')
    const secondItemRef = useRef<HTMLDivElement>(null)
    const { isMobileScreen, radiusBoxStyle} = useGlobalValues()

    const [direction, setDirection] = useState('asc')
    const [sortBy, setSortBy] = useState('symbol')
    const theme = useTheme()

    const {userReferral} = usePoint()

    // Adjust the container heights of leaderboard and referrals.
    useEffect(() => {
        const updateHeight = () => {
          if (secondItemRef.current) {
            const height = secondItemRef.current.clientHeight;
            setFirstItemHeight(`${height}px`)
          }
        }
    
        // Set the initial height
        updateHeight()
    
        // Update height whenever the window resizes
        window.addEventListener('resize', updateHeight)
    
        // Remove event listener on component unmount
        return () => window.removeEventListener('resize', updateHeight)
    }, [])

    const setSortDetail = (sortBy: string, direction: string) => {
        setSortBy(sortBy)
        setDirection(direction)
    }

    const headerItems = [
        {
          label: 'Rank',
          key: 'id', // This is sort key.
          flexWidth: 6.5,
          sortable: false
        },
        {
          label: 'User Address',
          key: 'address',
          flexWidth: 8.5,
          sortable: false
        },
        {
          label: 'Total XP',
          key: 'totalXP',
          flexWidth: 5.5,
          sortable: false
        },
        {
          label: 'XP gained per day',
          key: 'dailyXP',
          flexWidth: 8.5,
          sortable: false
        },
        {
          label: 'Referral XP',
          key: 'referralXP',
          flexWidth: 6,
          sortable: false
        }
    ]

    const totalxpPoint = userReferral.reduce((sum, item) => {
        if (item.redeemed) {
            return sum + item.xpPoint;
        }
        return sum;
    }, 0);

    return (
        <Grid container spacing={4} mt={12} >
            {/* Leaderboard Group */}
            <Grid item xs={12} lg={7} xl={7.5}>
                <Typography className='header-gradient' sx={{ fontSize: { xs: 32, lg: 40 } }}>
                    Leaderboard
                </Typography>
                <Box
                    sx={{ ...radiusBoxStyle, mt: 8, pt: 0 }}
                    id='leaderboard'
                    style={{ overflowY: 'scroll', maxHeight: firstItemHeight }}
                >
                    {/* Leaderboard Table Header */}
                    <Stack
                        direction='row'
                        sx={{ px: 6, pt: 6, pb: 2,
                            display: {
                                xs: 'none',
                                lg: 'flex'
                            },
                            position: 'sticky', top: 0, background: '#080b0b'
                        }}
                    >
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
                    <Stack mt={2}>
                    {Array.from({ length: 50 }, (_, index) => (
                        <Box id='leaderboard-row' key={index}>
                            <Stack direction='row' alignItems='center'
                                sx={{
                                    border: 'solid 1px transparent',
                                    borderRadius: '16px',
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main
                                    },
                                    display: { xs: 'none', lg: 'flex' },
                                    p: { xs: 3, sm: 5 }
                                }}
                            >
                                <Stack flex='3.5'>
                                    <Typography variant='h5' fontWeight={400} marginLeft={4}>
                                        {index + 1}
                                    </Typography>
                                </Stack>
                                <Stack flex='7.5' direction='row' alignItems='center' gap={3}>
                                    <Typography variant='h5' fontWeight={400}>
                                        {shortenWalletAddress('0xD88Cc271583b0019DdA08666fF2DB78B2A0172cC')}
                                    </Typography>
                                </Stack>
                                <Stack flex='6'>
                                    <Typography variant='h5' fontWeight={400}>
                                        {formatToThousandsInt(123000)} XP
                                    </Typography>
                                </Stack>
                                <Stack flex='5.5'>
                                    <Typography variant='h5' fontWeight={400}>
                                        {formatToThousandsInt(4500)} XP
                                    </Typography>
                                </Stack>
                                <Stack flex='4.5'>
                                    <Typography variant='h5' fontWeight={400}>
                                        {formatToThousandsInt(3000)} XP
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack gap={2} py={4} sx={{ display: { xs: 'flex', lg: 'none' }, borderTop: index == 0 ? 'none' : 'solid 1px #3030306e' }}>
                                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                                    <Stack direction='row' gap={2}>
                                        <img
                                        width={27}
                                        alt='Gradient Circle'
                                        src='/images/icons/customized-icons/gradient-circle.png'
                                        />
                                        <Typography variant='subtitle1' fontWeight={400}>
                                        {shortenWalletAddress('0xD88Cc271583b0019DdA08666fF2DB78B2A0172cC')}
                                        </Typography>
                                    </Stack>
                                    <Stack>
                                        <Typography variant='subtitle1' fontWeight={500}>
                                        {index + 1}
                                        </Typography>
                                    </Stack>
                                    </Stack>
                                    <Stack direction='row' alignItems='center'>
                                    <Stack sx={{ flex: 3 }}>
                                        <Typography fontSize={12} fontWeight={500} color='#D4D4D4'>
                                        Total XP
                                        </Typography>
                                    </Stack>
                                    <Stack sx={{ flex: 3.5 }}>
                                        <Typography fontSize={12} fontWeight={500} color='#D4D4D4'>
                                        XP gained per day
                                        </Typography>
                                    </Stack>
                                    <Stack sx={{ flex: 2 }}>
                                        <Typography fontSize={12} fontWeight={500} color='#D4D4D4'>
                                        Referral XP
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack direction='row' alignItems='center'>
                                    <Stack sx={{ flex: 3 }}>
                                        <Typography variant='subtitle1' fontWeight={500} color='#D4D4D4'>
                                        {formatToThousandsInt(123000)} XP
                                        </Typography>
                                    </Stack>
                                    <Stack sx={{ flex: 3.5 }}>
                                        <Typography variant='subtitle1' fontWeight={500} color='#D4D4D4'>
                                        {formatToThousandsInt(4500)} XP
                                        </Typography>
                                    </Stack>
                                    <Stack sx={{ flex: 2 }}>
                                        <Typography variant='subtitle1' fontWeight={500} color='#D4D4D4'>
                                        {formatToThousandsInt(3000)} XP
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Box>
                    ))}
                    </Stack>
                </Box>
            </Grid>

            {/* Referrals group */}
            {/* <Grid item xs={12} lg={5} xl={4.5}>
                <Typography className='header-gradient' sx={{ fontSize: { xs: 32, lg: 40 } }}>
                    Referrals
                </Typography>
                <Box sx={{ ...radiusBoxStyle, mt: 8, py: 6 }} ref={secondItemRef}>
                    <Stack direction='row' justifyContent='space-between' sx={{mb: {xs: 0, lg: 20}}}>
                        <Stack sx={{flex: {xs: 4, sm: 3.5}}}>
                            <Stack direction='row' gap={2} alignItems='center' sx={{mb: {xs: 4, md: 10}}}>
                                <Typography color='#D4D4D4' sx={{fontSize: {xs: 12, sm: 14}}}>Codes</Typography>
                            </Stack>
                            <Stack sx={{gap: {xs: 4, sm: 6}}}>
                                {
                                    userReferral.map((item, index) => (
                                        <Stack width={isMobileScreen ? 100 : 130} direction='row' gap={isMobileScreen ? 1 : 3} sx={{height: {xs: 28, sm:32}}} alignItems='center' justifyContent='space-between' key={index}>
                                            <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={400} color={item.redeemed ? 'primary' : 'white'} sx={{my:'auto', userSelect: 'none', textDecorationThickness: 2, textDecoration: item.redeemed ? 'line-through' : 'none'}}>
                                                {item.inviteCode}
                                            </Typography>
                                            <Box display={item.redeemed ? 'none' : 'block'} height={isMobileScreen ? 20 : 24}><Copy text={item.inviteCode}/></Box>
                                        </Stack>        
                                    ))
                                }
                            </Stack>
                        </Stack>
                        <Stack sx={{ flex: {sm: 1, xl: 2}, display: {xs: 'none', sm: 'flex'} }} direction='row'>
                            <Stack sx={{flex: 1, borderRight: 'solid 2px #262929'}}>
                            </Stack>
                            <Stack sx={{flex: 1}}>
                            </Stack>
                        </Stack>
                        <Stack sx={{flex: 8.5}}>
                            <Stack direction='row' justifyContent='space-between' sx={{mb: {xs: 4, md: 10}}}>
                                <Stack direction='row' gap={2} alignItems='center'>
                                    <Typography color='#D4D4D4' sx={{fontSize: {xs: 12, sm: 14}}}>Redeemed Wallet</Typography>
                                </Stack>
                                <Stack direction='row' gap={2} alignItems='center'>
                                    <Typography color='#D4D4D4' sx={{fontSize: {xs: 12, sm: 14}}}>Referral XP</Typography>
                                </Stack>
                            </Stack>
                            <Stack sx={{gap: {xs: 4, sm: 6}}}>
                                {
                                    userReferral.map((item, index) => {
                                        if(item.redeemed) {
                                            return (
                                                <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{height: {xs: 28, sm:32}}} key={index}>
                                                    <Stack direction='row' alignItems='center' gap={isMobileScreen ? 2 : 3}>
                                                        <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={400}>
                                                            {shortenWalletAddress(item.redeemer)}
                                                        </Typography>
                                                    </Stack>
                                                    <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={400}>
                                                        {formatToThousandsInt(item.xpPoint || 0)} XP
                                                    </Typography>
                                                </Stack> 
                                            )
                                        } else {
                                            return (
                                                <Stack sx={{height: {xs: 28, sm:32}}} direction='row' alignItems='center' justifyContent='center' key={index}>
                                                    <Typography variant='subtitle2' color='#D4D4D44D'>No wallet has redeemed&nbsp;
                                                    <Typography component='span' variant='subtitle2' color='#D4D4D44D' sx={{display:{xs: 'none', sm: 'inline'}}}>this code </Typography>
                                                    yet
                                                    </Typography>
                                                </Stack>
                                            )
                                        }
                                    })
                                }
                                <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{height: {xs: 28, sm:32}}}>
                                    <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='#FFFFFF99' sx={{width: {xs: 124, sm: 166}, textAlign: 'end'}}>Total</Typography>
                                    <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={600} color='primary'> {formatToThousandsInt(totalxpPoint)} XP </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </Grid> */}
            <Grid item xs={12} lg={5} xl={4.5}>
                <Typography className='header-gradient' sx={{ fontSize: { xs: 32, lg: 40 } }}>
                    Referrals
                </Typography>
                <Box sx={{ ...radiusBoxStyle, mt: 8, p: 0 }} ref={secondItemRef}>
                    <Stack direction='row' height='100%' sx={{minHeight: {xs: 0, lg:450}}}>
                        <Stack sx={{flex: 6.5, borderRight: 'solid 1px #2D3131'}}>
                            <Typography color='#D4D4D4' sx={{fontSize: {xs: 12, sm: 14}, padding: {xs: 3, md: 6}}}>Codes</Typography>
                            <Stack>
                                {
                                    userReferral.map((item, index) => (
                                        <Stack direction='row' gap={isMobileScreen ? 2 : 6} sx={{borderBottom: 'solid 1px #2D3131', padding: {xs: 3, md: 6}}} alignItems='center' key={index}>
                                            <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={400} color={item.redeemed ? 'primary' : 'white'} sx={{my:'auto', userSelect: 'none'}}>
                                                {item.inviteCode}
                                            </Typography>
                                            <Stack display={item.redeemed ? 'flex' : 'none'}  direction='row' alignItems='center' gap={2}>
                                                <Typography variant='subtitle2' fontWeight={400} color='primary' sx={{display: {xs: 'none', md: 'block'}}}>redeemed</Typography>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
                                                    <path d="M13.5701 1.15264L5.17145 9.25052C5.10645 9.31326 5.02926 9.36304 4.9443 9.397C4.85933 9.43095 4.76826 9.44843 4.67628 9.44843C4.58431 9.44843 4.49323 9.43095 4.40827 9.397C4.3233 9.36304 4.24611 9.31326 4.18111 9.25052L0.681669 5.8764C0.550341 5.74978 0.476562 5.57804 0.476562 5.39896C0.476562 5.21989 0.550341 5.04815 0.681669 4.92153C0.812996 4.7949 0.991115 4.72376 1.17684 4.72376C1.36257 4.72376 1.54068 4.7949 1.67201 4.92153L4.67628 7.81905L12.5798 0.197761C12.7111 0.0711364 12.8892 -1.3342e-09 13.0749 0C13.2607 1.33421e-09 13.4388 0.0711364 13.5701 0.197761C13.7014 0.324385 13.7752 0.496125 13.7752 0.675199C13.7752 0.854272 13.7014 1.02601 13.5701 1.15264Z" fill="#67DAB1"/>
                                                </svg>
                                            </Stack>
                                            <Box display={item.redeemed ? 'none' : 'block'} height={isMobileScreen ? 20 : 24}><Copy text={item.inviteCode}/></Box>
                                        </Stack>        
                                    ))
                                }
                            </Stack>
                        </Stack>
                        <Stack sx={{flex: 11.5}}>
                            <Stack direction='row' justifyContent='space-between' sx={{padding: {xs: 3, md: 6}}}>
                                <Typography color='#D4D4D4' sx={{fontSize: {xs: 12, sm: 14}}}>Active Codes</Typography>
                                <Typography color='#D4D4D4' sx={{fontSize: {xs: 12, sm: 14}}}>Referral XP</Typography>
                            </Stack>
                            <Stack>
                                {
                                    userReferral.map((item, index) => {
                                        if(item.redeemed) {
                                            return (
                                                <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{borderBottom: 'solid 1px #2D3131', padding: {xs: 3, md: 6}}} key={index}>
                                                    <Stack direction='row' alignItems='center' gap={isMobileScreen ? 2 : 3}>
                                                        <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={400}>
                                                            {shortenWalletAddress(item.redeemer)}
                                                        </Typography>
                                                    </Stack>
                                                    <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={400}>
                                                        {formatToThousandsInt(item.xpPoint || 0)} XP
                                                    </Typography>
                                                </Stack> 
                                            )
                                        } else {
                                            return (
                                                <Stack sx={{borderBottom: 'solid 1px #2D3131', padding: {xs: 3, md: 6}}} direction='row' alignItems='center' justifyContent='center' key={index}>
                                                    <Stack sx={{height: {xs: 20, sm: 24}}}>
                                                        <Typography sx={{fontSize:{xs: 12, md: 14}}} color='#D4D4D44D' margin='auto'>
                                                            No wallet has redeemed yet
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            )
                                        }
                                    })
                                }
                            </Stack>
                            <Stack direction='row' alignItems='center' justifyContent='space-between' paddingX={6} paddingY={4} marginTop='auto'>
                                <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={600} color='#FFF'>Total XP</Typography>
                                <Typography sx={{fontSize:{xs: 16, md:24}}} fontWeight={400} color='primary' fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`}> 
                                    {formatToThousandsInt(totalxpPoint)} XP 
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    
                    {/* <Stack direction='row' justifyContent='space-between' sx={{mb: {xs: 0, lg: 20}}}>
                        <Stack sx={{flex: 6.5, borderRight: 'solid 1px #2D3131'}}>
                            <Stack>
                                {
                                    userReferral.map((item, index) => (
                                        <Stack direction='row' gap={isMobileScreen ? 1 : 3} sx={{borderBottom: 'solid 1px #2D3131', padding: 6}} alignItems='center' key={index}>
                                            <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={400} color={item.redeemed ? 'primary' : 'white'} sx={{my:'auto', userSelect: 'none', textDecorationThickness: 2, textDecoration: item.redeemed ? 'line-through' : 'none'}}>
                                                {item.inviteCode}
                                            </Typography>
                                            <Box display={item.redeemed ? 'none' : 'block'} height={isMobileScreen ? 20 : 24}><Copy text={item.inviteCode}/></Box>
                                        </Stack>        
                                    ))
                                }
                            </Stack>
                        </Stack>
                        <Stack sx={{flex: 11.5}}>
                            <Stack>
                                {
                                    userReferral.map((item, index) => {
                                        if(item.redeemed) {
                                            return (
                                                <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{borderBottom: 'solid 1px #2D3131', padding: 6}} key={index}>
                                                    <Stack direction='row' alignItems='center' gap={isMobileScreen ? 2 : 3}>
                                                        <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={400}>
                                                            {shortenWalletAddress(item.redeemer)}
                                                        </Typography>
                                                    </Stack>
                                                    <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={400}>
                                                        {formatToThousandsInt(item.xpPoint || 0)} XP
                                                    </Typography>
                                                </Stack> 
                                            )
                                        } else {
                                            return (
                                                <Stack sx={{borderBottom: 'solid 1px #2D3131', padding: 6}} direction='row' alignItems='center' justifyContent='center' key={index}>
                                                    <Typography variant='subtitle2' color='#D4D4D44D'>No wallet has redeemed&nbsp;
                                                    <Typography component='span' variant='subtitle2' color='#D4D4D44D' sx={{display:{xs: 'none', sm: 'inline'}}}>this code </Typography>
                                                    yet
                                                    </Typography>
                                                </Stack>
                                            )
                                        }
                                    })
                                }
                                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                    <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='#FFFFFF99' sx={{width: {xs: 124, sm: 166}, textAlign: 'end'}}>Total</Typography>
                                    <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={600} color='primary'> {formatToThousandsInt(totalxpPoint)} XP </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack> */}
                </Box>
            </Grid>
        </Grid>
    )
}