import { useGlobalValues } from '@/context/GlobalContext'
import { Grid, Typography, Box, Stack, useTheme } from '@mui/material'
import { useState, useRef, useEffect } from 'react'

import { formatToThousands, formatToThousandsInt, shortenWalletAddress } from '@/hooks/utils'
import { SortableHeaderItem } from '@/views/components/global/SortableHeaderItem'
import { Copy } from '../Copy'
import { useReferral } from '@/context/ReferralContext'

export const ExperienceBoard = () => {
    const [firstItemHeight, setFirstItemHeight] = useState('auto')
    const secondItemRef = useRef<HTMLDivElement>(null)
    const { isMobileScreen, radiusBoxStyle} = useGlobalValues()

    const [direction, setDirection] = useState('asc')
    const [sortBy, setSortBy] = useState('symbol')
    const theme = useTheme()

    const {userReferral, userPoint} = useReferral()
    console.log('userReferral', userReferral)

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

    const insertHyphens = (s: string) => s.split('').join('-');

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

    const referralItems = [
        {
            code: 'E82S9',
            redeemed: false,
            address: '',
            xpPoint: 0
        },
        {
            code: '73Z91',
            redeemed: true,
            address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
            xpPoint: 14000
        },
        {
            code: '52X8U',
            redeemed: false,
            address: '',
            xpPoint: 0
        },
        {
            code: '4I0YT',
            redeemed: true,
            address: '0x4D88DC5d528A33E4b8bE579e9476715F60060582',
            xpPoint: 7800
        },
        {
            code: '3N7QB',
            redeemed: true,
            address: '0x7E5F4552091A69125d5DfCb7B8C2659029395Bdf',
            xpPoint: 12700
        },
    ]

    const totalxpPoint = userReferral.reduce((sum, item) => {
        if (item.redeemed) {
            return sum + item.xpPoint;
        }
        return sum;
    }, 0);

    return (
        <Grid container spacing={4} mt={12}>
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
                                    <img alt='Gradient Circle' src='/images/icons/customized-icons/gradient-circle.png' />
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
            <Grid item xs={12} lg={5} xl={4.5}>
                <Typography className='header-gradient' sx={{ fontSize: { xs: 32, lg: 40 } }}>
                    Referrals
                </Typography>
                <Box sx={{ ...radiusBoxStyle, mt: 8, py: 6 }} ref={secondItemRef}>
                    <Stack direction='row' justifyContent='space-between'>
                        <Stack sx={{flex: {xs: 4, sm: 3.5}}}>
                            <Stack direction='row' gap={2} alignItems='center' sx={{mb: {xs: 4, md: 10}}}>
                                <Typography color='#D4D4D4' sx={{fontSize: {xs: 12, sm: 14}}}>Codes</Typography>
                                <svg xmlns="http://www.w3.org/2000/svg" width={isMobileScreen ? "12" : "16"} height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M7.80835 14.4619C7.86901 14.487 7.93405 14.4999 7.99971 14.4999C8.06538 14.4999 8.13042 14.487 8.19108 14.4619C8.25175 14.4367 8.30685 14.3999 8.35322 14.3534L11.8532 10.8539C11.947 10.7601 11.9998 10.6329 11.9998 10.5003C11.9999 10.3676 11.9472 10.2404 11.8535 10.1466C11.7597 10.0528 11.6325 10 11.4999 10C11.3673 9.99995 11.24 10.0526 11.1462 10.1464L7.99971 13.2924L4.85321 10.1464C4.75891 10.0553 4.63261 10.0049 4.50151 10.006C4.37042 10.0072 4.24501 10.0597 4.15231 10.1524C4.0596 10.2451 4.00702 10.3706 4.00588 10.5017C4.00474 10.6327 4.05514 10.7591 4.14622 10.8534L7.64621 14.3534C7.69258 14.3999 7.74768 14.4367 7.80835 14.4619Z" fill='#D4D4D4'/>
                                    <path d="M11.3083 5.96191C11.369 5.98705 11.434 5.99996 11.4997 5.99989C11.5986 5.99987 11.6952 5.97054 11.7774 5.91559C11.8596 5.86065 11.9237 5.78257 11.9616 5.69122C11.9994 5.59987 12.0093 5.49935 11.99 5.40238C11.9707 5.3054 11.9231 5.21632 11.8532 5.14639L8.35322 1.64639C8.25945 1.55266 8.1323 1.5 7.99971 1.5C7.86713 1.5 7.73998 1.55266 7.64621 1.64639L4.14622 5.14639C4.05514 5.24069 4.00474 5.367 4.00588 5.49809C4.00702 5.62919 4.0596 5.7546 4.15231 5.8473C4.24501 5.94001 4.37042 5.99259 4.50151 5.99373C4.63261 5.99487 4.75891 5.94447 4.85321 5.85339L7.99971 2.70689L11.1462 5.85339C11.1926 5.89989 11.2477 5.93677 11.3083 5.96191Z" fill='#D4D4D4'/>
                                </svg>
                            </Stack>
                            <Stack sx={{gap: {xs: 4, sm: 6}}}>
                                {
                                    userReferral.map((item, index) => (
                                        <Stack width={isMobileScreen ? 100 : 130} direction='row' gap={isMobileScreen ? 1 : 3} sx={{height: {xs: 28, sm:32}}} alignItems='center' justifyContent='space-between' key={index}>
                                            <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={400} color={item.redeemed ? 'primary' : 'white'} sx={{my:'auto', userSelect: 'none', textDecorationThickness: 2, textDecoration: item.redeemed ? 'line-through' : 'none'}}>
                                                {insertHyphens(item.inviteCode)}
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width={isMobileScreen ? "12" : "16"} height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M7.80835 14.4619C7.86901 14.487 7.93405 14.4999 7.99971 14.4999C8.06538 14.4999 8.13042 14.487 8.19108 14.4619C8.25175 14.4367 8.30685 14.3999 8.35322 14.3534L11.8532 10.8539C11.947 10.7601 11.9998 10.6329 11.9998 10.5003C11.9999 10.3676 11.9472 10.2404 11.8535 10.1466C11.7597 10.0528 11.6325 10 11.4999 10C11.3673 9.99995 11.24 10.0526 11.1462 10.1464L7.99971 13.2924L4.85321 10.1464C4.75891 10.0553 4.63261 10.0049 4.50151 10.006C4.37042 10.0072 4.24501 10.0597 4.15231 10.1524C4.0596 10.2451 4.00702 10.3706 4.00588 10.5017C4.00474 10.6327 4.05514 10.7591 4.14622 10.8534L7.64621 14.3534C7.69258 14.3999 7.74768 14.4367 7.80835 14.4619Z" fill='#D4D4D4'/>
                                        <path d="M11.3083 5.96191C11.369 5.98705 11.434 5.99996 11.4997 5.99989C11.5986 5.99987 11.6952 5.97054 11.7774 5.91559C11.8596 5.86065 11.9237 5.78257 11.9616 5.69122C11.9994 5.59987 12.0093 5.49935 11.99 5.40238C11.9707 5.3054 11.9231 5.21632 11.8532 5.14639L8.35322 1.64639C8.25945 1.55266 8.1323 1.5 7.99971 1.5C7.86713 1.5 7.73998 1.55266 7.64621 1.64639L4.14622 5.14639C4.05514 5.24069 4.00474 5.367 4.00588 5.49809C4.00702 5.62919 4.0596 5.7546 4.15231 5.8473C4.24501 5.94001 4.37042 5.99259 4.50151 5.99373C4.63261 5.99487 4.75891 5.94447 4.85321 5.85339L7.99971 2.70689L11.1462 5.85339C11.1926 5.89989 11.2477 5.93677 11.3083 5.96191Z" fill='#D4D4D4'/>
                                    </svg>
                                </Stack>
                                <Stack direction='row' gap={2} alignItems='center'>
                                    <Typography color='#D4D4D4' sx={{fontSize: {xs: 12, sm: 14}}}>Total Reward</Typography>
                                    <svg xmlns="http://www.w3.org/2000/svg" width={isMobileScreen ? "12" : "16"} height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M7.80835 14.4619C7.86901 14.487 7.93405 14.4999 7.99971 14.4999C8.06538 14.4999 8.13042 14.487 8.19108 14.4619C8.25175 14.4367 8.30685 14.3999 8.35322 14.3534L11.8532 10.8539C11.947 10.7601 11.9998 10.6329 11.9998 10.5003C11.9999 10.3676 11.9472 10.2404 11.8535 10.1466C11.7597 10.0528 11.6325 10 11.4999 10C11.3673 9.99995 11.24 10.0526 11.1462 10.1464L7.99971 13.2924L4.85321 10.1464C4.75891 10.0553 4.63261 10.0049 4.50151 10.006C4.37042 10.0072 4.24501 10.0597 4.15231 10.1524C4.0596 10.2451 4.00702 10.3706 4.00588 10.5017C4.00474 10.6327 4.05514 10.7591 4.14622 10.8534L7.64621 14.3534C7.69258 14.3999 7.74768 14.4367 7.80835 14.4619Z" fill='#D4D4D4'/>
                                        <path d="M11.3083 5.96191C11.369 5.98705 11.434 5.99996 11.4997 5.99989C11.5986 5.99987 11.6952 5.97054 11.7774 5.91559C11.8596 5.86065 11.9237 5.78257 11.9616 5.69122C11.9994 5.59987 12.0093 5.49935 11.99 5.40238C11.9707 5.3054 11.9231 5.21632 11.8532 5.14639L8.35322 1.64639C8.25945 1.55266 8.1323 1.5 7.99971 1.5C7.86713 1.5 7.73998 1.55266 7.64621 1.64639L4.14622 5.14639C4.05514 5.24069 4.00474 5.367 4.00588 5.49809C4.00702 5.62919 4.0596 5.7546 4.15231 5.8473C4.24501 5.94001 4.37042 5.99259 4.50151 5.99373C4.63261 5.99487 4.75891 5.94447 4.85321 5.85339L7.99971 2.70689L11.1462 5.85339C11.1926 5.89989 11.2477 5.93677 11.3083 5.96191Z" fill='#D4D4D4'/>
                                    </svg>
                                </Stack>
                            </Stack>
                            <Stack sx={{gap: {xs: 4, sm: 6}}}>
                                {
                                    userReferral.map((item, index) => {
                                        if(item.redeemed) {
                                            return (
                                                <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{height: {xs: 28, sm:32}}} key={index}>
                                                    <Stack direction='row' alignItems='center' gap={isMobileScreen ? 2 : 3}>
                                                        <Stack sx={{width: {xs: 20, md: 32}}}>
                                                            <img alt='Gradient Circle' src='/images/icons/customized-icons/gradient-circle.png' style={{width: '100%'}}/>
                                                        </Stack>
                                                        <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={400}>
                                                            {shortenWalletAddress(item.redeemer)}
                                                        </Typography>
                                                    </Stack>
                                                    <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={400}>
                                                        {formatToThousandsInt(item.xpPoint)} XP
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
            </Grid>
        </Grid>
    )
}