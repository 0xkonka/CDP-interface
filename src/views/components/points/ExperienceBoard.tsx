import { useGlobalValues } from '@/context/GlobalContext'
import { Grid, Typography, Box, Stack, useTheme, Button } from '@mui/material'
import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

import { formatToThousands, formatToThousandsInt, shortenWalletAddress } from '@/hooks/utils'
import { SortableHeaderItem } from '@/views/components/global/SortableHeaderItem'
import { Copy } from '../Copy'
import { usePoint } from '@/context/PointContext'
import { gql, useQuery } from '@apollo/client';
import { formatEther } from 'viem'
import { useAccount } from 'wagmi'

const BE_ENDPOINT = process.env.BE_ENDPOINT || 'https://api.tren.finance' // 'http://localhost:8000'
const GET_TRENING_BALANCES  = gql`
  {
    treningBalances {
      id
      balance
    }
  }
`;

interface XPType {
    userAddress: string
    totalXP: number
    // protocolXP: number   // This will be calculated by totalXP - referralXP automatically.
    referralXP: number
}
export const ExperienceBoard = () => {
    const secondItemRef = useRef<HTMLDivElement>(null)
    const {isMobileScreen, radiusBoxStyle} = useGlobalValues()
    const {userReferral} = usePoint()
    const [direction, setDirection] = useState('asc')
    const [sortBy, setSortBy] = useState('symbol')
    const [showRange, setShowRange] = useState('top10')
    const [offChainList, setOffChainList] = useState([])
    const leaderboardRef = useRef<HTMLDivElement>(null)
    const myLeaderRef = useRef<HTMLDivElement>(null)
    const {address: account} =  useAccount()
    const theme = useTheme()
    
    useEffect(() => {
        const fetchXPPoints = async() => {
            const { data: referralPoints } = await axios.get(`${BE_ENDPOINT}/api/point/offChain/list`)
            // console.log('Referral Points:', referralPoints.data)
            setOffChainList(referralPoints.data)
        }
        fetchXPPoints()
    }, [])
    const { loading, error, data } = useQuery(GET_TRENING_BALANCES );
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    console.log(data.treningBalances)
    const leaderboards: XPType[] = []
    data.treningBalances.forEach((value:any) => {
        if(value.id != '0x0000000000000000000000000000000000000000') {
            leaderboards.push({
                userAddress: value.id,
                totalXP: parseInt(formatEther(value.balance)),
                referralXP: 0,
            })
        }
    })
    offChainList.forEach((value: any) => {
        const index = leaderboards.findIndex(record => record.userAddress == value.account)
        if(index !== -1) {
            leaderboards[index].referralXP = value.referralPoint
        } else {
            leaderboards.push({
                userAddress: value.account,
                totalXP: value.referralPoint,
                referralXP: value.referralPoint
            })
        }
    })

    console.log('Leaderboards:', leaderboards)
    
    const setSortDetail = (sortBy: string, direction: string) => {
        setSortBy(sortBy)
        setDirection(direction)
    }

    const headerItems = [
        {
          label: 'Rank',
          key: 'id', // This is sort key.
          flexWidth: 3.5,
          sortable: true
        },
        {
          label: 'User Address',
          key: 'address',
          flexWidth: 7.5,
          sortable: true
        },
        {
          label: 'Total XP',
          key: 'totalXP',
          flexWidth: 6,
          sortable: true
        },
        {
          label: 'Protocol XP',
          key: 'protocolXP',
          flexWidth: 5.5,
          sortable: true
        },
        {
          label: 'Referral XP',
          key: 'referralXP',
          flexWidth: 4.5,
          sortable: true
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
                <Stack justifyContent='space-between' sx={{flexDirection: {xs: 'column', sm: 'row'}, alignItems: {xs: 'start', md: 'center'}}} gap={4}>
                    <Typography className='header-gradient' sx={{ fontSize: { xs: 32, lg: 40 } }}>
                        Leaderboard
                    </Typography>
                    <Stack direction='row' gap={4}>
                        <Button sx={{ width: 'fit-content', color: showRange=='top10' ? 'white' : '#6B6D6D', py: 3, fontWeight: 400}}
                                variant='outlined'
                                color={showRange=='top10' ? 'primary' : 'secondary'} onClick={()=>{
                                    leaderboardRef.current?.scrollTo({ behavior: "smooth", top: 0})
                                    setShowRange('top10')
                                }}>
                            See top 10
                        </Button>
                        <Button sx={{ width: 'fit-content', color: showRange=='myscore' ? 'white' : '#6B6D6D', py: 3, fontWeight: 400, mr: 8}}
                                variant='outlined'
                                color={showRange=='myscore' ? 'primary' : 'secondary'}
                                onClick={() => {
                                    if(myLeaderRef && myLeaderRef.current && leaderboardRef && leaderboardRef.current) {
                                        const offsetTop = myLeaderRef.current?.offsetTop - leaderboardRef.current.offsetTop - 70
                                        leaderboardRef.current.scrollTo({ behavior: "smooth", top: offsetTop})
                                        setShowRange('myscore')
                                    }
                                }}>
                            See my Score
                        </Button>
                    </Stack>
                </Stack>
                <Box
                    sx={{ ...radiusBoxStyle, mt: 6, pt: 0 }}
                    id='leaderboard'
                    style={{ overflowY: 'scroll', height: 450 }}
                    ref={leaderboardRef}
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
                    {leaderboards.map((value:XPType, index) => (
                        <Box className='leaderboard-row' key={index} 
                            ref={value.userAddress.toLowerCase() == (account as '0x{string}').toLowerCase() ? myLeaderRef : null}>
                            <Stack direction='row' alignItems='center'
                                sx={{
                                    border: value.userAddress.toLowerCase() == (account as '0x{string}').toLowerCase() ? `solid 1px ${theme.palette.primary.main}` : 'none',
                                    borderRadius: '6px',
                                    display: { xs: 'none', lg: 'flex' },
                                    p: 3
                                }}
                            >
                                <Stack flex='3.5'>
                                    <Typography variant='h5' fontWeight={400} marginLeft={4}>
                                        {formatToThousandsInt(index + 1)}
                                    </Typography>
                                </Stack>
                                <Stack flex='7.5' direction='row' alignItems='center' gap={3}>
                                    <Typography variant='h5' fontWeight={400}>
                                        {shortenWalletAddress(value.userAddress)}
                                    </Typography>
                                </Stack>
                                <Stack flex='6'>
                                    <Typography variant='h5' fontWeight={400}>
                                        {formatToThousandsInt(value.totalXP)} XP
                                    </Typography>
                                </Stack>
                                <Stack flex='5.5'>
                                    <Typography variant='h5' fontWeight={400}>
                                        {formatToThousandsInt(value.totalXP - value.referralXP)} XP
                                    </Typography>
                                </Stack>
                                <Stack flex='4.5'>
                                    <Typography variant='h5' fontWeight={400}>
                                        {formatToThousandsInt(value.referralXP)} XP
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack gap={2} py={4} sx={{ display: { xs: 'flex', lg: 'none' }, 
                                borderTop: index == 0 ? 'none' : 'solid 1px #3030306e', 
                                borderBottom: value.userAddress.toLowerCase() == (account as '0x{string}').toLowerCase() ? `solid 1px ${theme.palette.primary.main}` : 'none', }}>
                                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                                    <Stack direction='row' gap={2}>
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
                                        Protocol XP
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
                <Box sx={{ ...radiusBoxStyle, mt: 6, p: 0 }} ref={secondItemRef}>
                    <Stack direction='row' height='100%' sx={{minHeight: {xs: 0, lg:450}}}>
                        <Stack sx={{flex: 6.5, borderRight: 'solid 1px #2D3131'}}>
                            <Typography color='#D4D4D4' sx={{fontSize: {xs: 12, sm: 14}, px: {xs: 3, md: 6}, pt: {xs: 3, md: 6}, pb: 2}}>Codes</Typography>
                            <Stack>
                                {
                                    userReferral.map((item, index) => (
                                        <Stack direction='row' gap={isMobileScreen ? 2 : 6} sx={{borderBottom: 'solid 1px #2D3131', px: {xs: 3, md: 6}, py: {xs: 3, md: 4}}} alignItems='center' key={index}>
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
                            <Stack direction='row' justifyContent='space-between' sx={{px: {xs: 3, md: 6}, pt: {xs: 3, md: 6}, pb: 2}}>
                                <Typography color='#D4D4D4' sx={{fontSize: {xs: 12, sm: 14}}}>Active Codes</Typography>
                                <Typography color='#D4D4D4' sx={{fontSize: {xs: 12, sm: 14}}}>Referral XP</Typography>
                            </Stack>
                            <Stack>
                                {
                                    userReferral.map((item, index) => {
                                        if(item.redeemed) {
                                            return (
                                                <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{borderBottom: 'solid 1px #2D3131', px: {xs: 3, md: 6}, py: {xs: 3, md: 4}}} key={index}>
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
                                                <Stack sx={{borderBottom: 'solid 1px #2D3131', px: {xs: 3, md: 6}, py: {xs: 3, md: 4}}} direction='row' alignItems='center' justifyContent='center' key={index}>
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
                                <Typography sx={{fontSize:{xs: 16, md:24}}} fontWeight={400} color='primary' className='font-britanica'> 
                                    {formatToThousandsInt(totalxpPoint)} XP 
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </Grid>
        </Grid>
    )
}