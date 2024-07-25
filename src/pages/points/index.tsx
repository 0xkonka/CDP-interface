import { Typography, Box, Link, Grid, useTheme, Input, Button, Stack, TableCellProps} from '@mui/material'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'

import { ActiveTask } from '@/views/components/points/ActiveTask'
import { ActiveTaskSpecial } from '@/views/components/points/ActiveTaskSpecial'
import { useGlobalValues } from '@/context/GlobalContext'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { TrenPointBanner } from '@/views/components/points/TrenPointBanner'
import { ExperienceBoard } from '@/views/components/points/ExperienceBoard'
import { PointsLineChart } from '@/views/components/charts/PointsLineChart'
import { useStabilityPoolView } from '@/context/StabilityPoolProvider/StabilityPoolContext'
import { formatEther } from 'viem'
import { getAddress } from 'ethers'
import { formatToThousandsInt } from '@/hooks/utils'
import { useProtocol } from '@/context/ProtocolProvider/ProtocolContext'
import { gql, useQuery } from '@apollo/client';
import { XPType } from '@/types'
import { useAccount } from 'wagmi'

const BE_ENDPOINT = process.env.BE_ENDPOINT || 'https://api.tren.finance' // 'http://localhost:8000'

const GET_TRENING_BALANCES = gql`
  {
    trenXPPoints(where: {account: "0x48ae3b6C0Af855260d4382F9f693e53DA7F6E94E"}) {
      id
      type
      account
      amount
    }
  }
`    

const StyledTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  fontSize: 18,
  padding: 0,
  textAlign: 'center',
  borderRight: 'none',
  '&:first-of-type': {
    paddingLeft: '0 !important',
    textAlign: 'left'
  },
  '&:last-child': {
    paddingRight: '0 !important',
    textAlign: 'right',
    borderRight: 0,
  },
  '&.header': {
    fontWeight: 600,
    color: '#F3F3F3',
    borderBottom: 0
  },
  '&.label': {
    fontWeight: 400,
    color: '#777'
  },
  '&.label-1': {
    fontWeight: 400,
    color: '#F3F3F3'
  },
  '&.content': {
    fontWeight: 600,
    color: '#FFF'
  },
  '&.summary-cta': {
    cursor: 'pointer',
    fontWeight: 600,
    color: '#67DAB1',
  }
}))

const Points = () => {
  const { radiusBoxStyle } = useGlobalValues()
  const [isBoosted, setIsBoosted] = useState(false)
  const { userStabilityPoolPosition } = useStabilityPoolView()
  const { userDeposit = BigInt(0) } = userStabilityPoolPosition || {}
  const { totalBorrowed } = useProtocol()
  const [offChainList, setOffChainList] = useState([])
  const {address: account} =  useAccount()
  
  useEffect(() => {
    const fetchXPPoints = async() => {
        const { data: referralPoints } = await axios.get(`${BE_ENDPOINT}/api/point/offChain/list`)
        setOffChainList(referralPoints.data)
    }
    fetchXPPoints()
  }, [])

  function isValidAddress(address: string) {
    // Check if the address is all lowercase or all uppercase
    return /^[0-9a-f]{40}$/.test(address) || /^[0-9A-F]{40}$/.test(address);
  }

  const { loading, error, data } = useQuery(GET_TRENING_BALANCES );
  console.log("GraphQL Result: ", data)
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const leaderboards: XPType[] = []
  data.trenXPPoints.forEach((value:any) => {
    if(value.id != '0x0000000000000000000000000000000000000000') {
        leaderboards.push({
            userAddress: isValidAddress(value.id) ? getAddress(value.id) : value.id,
            totalXP: parseInt(formatEther(value.amount)),
            referralXP: 0,
        })
    }
  })

  const totals = data.trenXPPoints.reduce((result: any, point: any) => {
    if(point.type === 0) {
      result.borrowedPoint += +formatEther(point.amount)
    } else if (point.type === 1) {
      result.stakedPoint += +formatEther(point.amount)
    }
    return result
  }, {borrowedPoint: 0, stakedPoint: 0})
  console.log("Totals: ", totals)

  // offChainList.forEach((value: any) => {
  //   const index = leaderboards.findIndex(record => record.userAddress.toLocaleLowerCase() == value.account.toLocaleLowerCase())
  //   if(index !== -1) {
  //     leaderboards[index].referralXP = value.referralPoint
  //   } else {
  //     leaderboards.push({
  //         userAddress: isValidAddress(value.account) ? getAddress(value.account) : value.account,
  //         totalXP: value.referralPoint,
  //         referralXP: value.referralPoint
  //     })
  //   }
  // })
  console.log('leaderboards: ', leaderboards)

  const myLeader = leaderboards.find((leaderboard) => {
    return leaderboard.userAddress.toLowerCase() == account?.toLowerCase()
  })
  const totalXPGained = myLeader ? myLeader.totalXP : 0

  const totalLeaders = leaderboards.length
  const sortedLeaders = leaderboards.sort((a, b) => b.totalXP - a.totalXP)
  const rank = sortedLeaders.findIndex((leaderboard) => leaderboard.userAddress.toLocaleLowerCase() == account?.toLocaleLowerCase()) + 1

  return (
    <Box>
      {/* 3D Tren Points Banner section */}
      <TrenPointBanner totalXPGained={totalXPGained} totalLeaders={totalLeaders} rank={rank}/>

      {/* Daily Boost */}
      <Grid container spacing={8} mt={12}>
        <Grid item xs={12} xl={8}>
          <Stack height='100%' direction='row' sx={{...radiusBoxStyle, py: 6, flexDirection: {xs: 'column', md: 'row'}, gap: 6}}>
            <Stack flex={1.2}>
              <TableContainer component={Paper} sx={{height: 1}}>
                <Table sx={{height: 1}}>
                    <TableHead>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                          <StyledTableCell className='header' sx={{paddingBottom: '0 !important'}}>Your XP</StyledTableCell>
                          <StyledTableCell className='header' sx={{paddingBottom: '0 !important'}}>Current</StyledTableCell>
                          <StyledTableCell className='header' sx={{paddingBottom: '0 !important'}}>Potential</StyledTableCell>
                          <StyledTableCell className='header' sx={{paddingBottom: '0 !important'}}></StyledTableCell>
                      </TableRow>
                      <TableRow>
                          <StyledTableCell className='label-1' sx={{borderBottom: 0, paddingBottom: '0 !important'}}>Activity</StyledTableCell>
                          <StyledTableCell className='label-1' sx={{borderBottom: 0, paddingBottom: '0 !important'}} colSpan={3}></StyledTableCell>
                      </TableRow>
                      <TableRow>
                          <StyledTableCell className='label'>trenUSD borrowed</StyledTableCell>
                          <StyledTableCell className='content'>{totalBorrowed == undefined || totalBorrowed == BigInt(0) ? '-' : formatToThousandsInt(+formatEther(totalBorrowed))}</StyledTableCell>
                          <StyledTableCell className='content'>{totalBorrowed == undefined || totalBorrowed == BigInt(0) ? '-' : formatToThousandsInt(+formatEther(totalBorrowed) * 2)}</StyledTableCell>
                          <StyledTableCell className='summary-cta'>
                            <Link href='/modules'>Borrow</Link>
                          </StyledTableCell>
                      </TableRow>
                      <TableRow>
                          <StyledTableCell className='label'>trenUSD staked to SP</StyledTableCell>
                          <StyledTableCell className='content'>
                            {userDeposit == undefined || Math.floor(+formatEther(userDeposit)) == 0 ? '-' : formatToThousandsInt(+formatEther(userDeposit || BigInt(0)))}
                          </StyledTableCell>
                          <StyledTableCell className='content'>
                            {userDeposit == undefined || Math.floor(+formatEther(userDeposit)) == 0 ? '-' : formatToThousandsInt(2 * +formatEther(userDeposit || BigInt(0)))}
                          </StyledTableCell>
                          <StyledTableCell className='summary-cta'>
                            <Link href='/earn'>Stake</Link>
                          </StyledTableCell>
                      </TableRow>
                      <TableRow>
                          <StyledTableCell className='label'>Liquidity provided</StyledTableCell>
                          <StyledTableCell className='content'>-</StyledTableCell>
                          <StyledTableCell className='content'>-</StyledTableCell>
                          <StyledTableCell className='summary-cta'>
                            <Link href='/#'>Stake</Link>
                          </StyledTableCell>
                      </TableRow>
                      <TableRow>
                          <StyledTableCell className='label' style={{color: '#F3F3F3'}}>Multiplier</StyledTableCell>
                          <StyledTableCell className='content'>1.8x</StyledTableCell>
                          <StyledTableCell className='content'>2.8x</StyledTableCell>
                          <StyledTableCell className='summary-cta'>Learn more</StyledTableCell>
                      </TableRow>
                    </TableBody>
                </Table>
              </TableContainer>
            </Stack>
            <Stack flex={1} sx={{...radiusBoxStyle, mb: 0, px: 2}}>
              <PointsLineChart title='Points'/>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} xl={4}>
          <Stack height='100%' sx={{...radiusBoxStyle, pt: 8, gap: 0}}>
            <Typography textAlign='center' variant='h3' fontWeight={700} mb={8}>Daily Boost</Typography>
            <Typography textAlign='center' mb={14} mx='auto' color='#C6C6C7' maxWidth={550}>
              { !isBoosted ? 'Borrow against your collateral on Tren Finance, where points are allocated based on the total value borrowed' : 
                'Roll the dice to get an extra multiplier for the next 24 hours. Once the time is up you can come back and do it again.'}
            </Typography>
            <Stack direction='row' borderBottom='solid 1px #2C2D33' justifyContent='space-between' pb={4} mb={8}>
              <Typography variant='h5' fontWeight={400} color={isBoosted ? '#FFFFFF3F' : '#FFF'}>Expected boost</Typography>
              <Typography variant='h5' fontWeight={600} color={isBoosted ? '#FFFFFF3F' : '#FFF'}>1x</Typography>
            </Stack>
            <Stack direction='row' borderBottom='solid 1px #2C2D33' justifyContent='space-between' alignItems='center' pb={isBoosted ? 0 : 4 }>
              <Typography variant='h5' fontWeight={400} color='primary'>Your daily boost</Typography>
              {
                !isBoosted && 
                <Typography variant='h5' fontWeight={600}>Click Below</Typography>
              }
              {
                isBoosted &&
                <Typography variant='h1' fontWeight={600} color='primary'>{Math.floor(Math.random() * 4 + 1) / 10 + 1}x</Typography>
              }
              
            </Stack>
            <Button variant='outlined' color='primary' 
              sx={{fontSize: 18, mt: 10, py: 3, color: 'white', fontWeight: 400, background: (isBoosted ? '#67DAB133' : 'transparent')}} onClick={() => {setIsBoosted(true)}}>
              {
                !isBoosted ? 'Get Boost' :
                <><span style={{fontWeight: 600, color: '#67DAB1'}}>23h 56m 29s</span>&nbsp;for the next boost</>
              }
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Active Tasks Section */}
      <Box id='active-tasks' mt={30}>
        <Typography className='header-gradient' sx={{ fontSize: { xs: 32, lg: 40 } }}>
          Tasks
        </Typography>
        <Grid container spacing={4} mt={4}>
          <Grid item xs={12} sm={6} lg={3}>
            <ActiveTaskSpecial
              icon='borrowing'
              title='Borrowing'
              exp='2.5'
              description='Borrow against your collateral on Tren Finance, where points are allocated based on the total value borrowed'
              learnMoreLink='https://docs.tren.finance/get-started/borrow'
              xpPoints={totals.borrowedPoint}
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <ActiveTaskSpecial
              icon='stake-trenUSD'
              title='Stake TrenUSD'
              exp='2.5'
              description='Stake your TrenUSD directly into our stability pool to help secure the protocol.'
              learnMoreLink='https://docs.tren.finance/get-started/staking-to-the-stability-pool'
              xpPoints={totals.stakedPoint}
            />
          </Grid>
          
          {/* <Grid item xs={12} sm={6} lg={3}>
            <ActiveTaskSpecial
              icon='stake-lp'
              title='Stake LP Tokens'
              exp='2.5'
              description='Stake your LP tokens from either Curve or Uniswap to provide liquidity.'
              learnMoreLink='#'
              tooltip='Stake LP Tokens Milestone Description'
              from={0}
              to={15}
              percent={87}
            />
          </Grid> */}

          <Grid item xs={12} sm={6} lg={3}>
            <ActiveTask
              icon='refer-friends'
              title='Refer Friends'
              exp='15%'
              description='Earn a share of your referral’s XP. Your friend is also rewarded with a multiplier by using your invite code.'
              plus='+15%'
              period='of each referral'
              learnMoreLink='https://docs.tren.finance/get-started/redeem-a-referral-code'
              totalReferralXP={20}
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <ActiveTask
              icon='social-tasks'
              title='Social Tasks'
              exp='14'
              description='Borrow against your collateral on Tren Finance, where points are allocated based on the total value borrowed'
              plus='+1 task'
              period='each day'
              learnMoreLink='#'
            />
          </Grid>
        </Grid>
      </Box>

      {/* Leaderboard and Referrals */}
      <ExperienceBoard leaderboards={leaderboards}/>
    </Box>
  )
}

export default Points
