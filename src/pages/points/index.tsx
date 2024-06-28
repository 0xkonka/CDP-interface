import { Typography, Box, Link, Grid, useTheme, Input, Button, Stack, TableCellProps} from '@mui/material'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'

import { ActiveTask } from '@/views/components/points/ActiveTask'
import { ActiveTaskSpecial } from '@/views/components/points/ActiveTaskSpecial'
import { useGlobalValues } from '@/context/GlobalContext'
import { useState } from 'react'
import { useRef, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { TrenPointBanner } from '@/views/components/points/TrenPointBanner'
import { ExperienceBoard } from '@/views/components/points/ExperienceBoard'
import { borderBottom, fontWeight, textAlign } from '@mui/system'
import { PointsLineChart } from '@/views/components/charts/PointsLineChart'

const StyledTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  fontSize: 18,
  padding: 0,
  textAlign: 'center',
  borderRight: 'none',
  '&:first-child': {
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

  return (
    <Box>
      {/* 3D Tren Points Banner section */}
      <TrenPointBanner />

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
                          <StyledTableCell className='content'>50</StyledTableCell>
                          <StyledTableCell className='content'>100</StyledTableCell>
                          <StyledTableCell className='summary-cta'>Borrow</StyledTableCell>
                      </TableRow>
                      <TableRow>
                          <StyledTableCell className='label'>trenUSD staked to SP</StyledTableCell>
                          <StyledTableCell className='content'>50</StyledTableCell>
                          <StyledTableCell className='content'>100</StyledTableCell>
                          <StyledTableCell className='summary-cta'>Stake</StyledTableCell>
                      </TableRow>
                      <TableRow>
                          <StyledTableCell className='label'>LP tokens staked</StyledTableCell>
                          <StyledTableCell className='content'>50</StyledTableCell>
                          <StyledTableCell className='content'>100</StyledTableCell>
                          <StyledTableCell className='summary-cta'>Stake</StyledTableCell>
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
                <Typography variant='h1' fontWeight={600} color='primary'>1.3x</Typography>
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
          <Grid item xs={12} sm={6} lg={2.4}>
            <ActiveTaskSpecial
              icon='borrowing'
              title='Borrowing'
              exp='2.5'
              description='Borrow against your collateral on Tren Finance, where points are allocated based on the total value borrowed'
              learnMoreLink='#'
              tooltip='Borrowing Milestone Description'
              from={0}
              to={5}
              percent={15}
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={2.4}>
            <ActiveTaskSpecial
              icon='stake-trenUSD'
              title='Stake TrenUSD'
              exp='2.5'
              description='Stake your TrenUSD directly into our stability pool to help secure the protocol.'
              learnMoreLink='#'
              tooltip='Stake TrenUSD Milestone Description'
              from={0}
              to={7.5}
              percent={48}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={2.4}>
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
          </Grid>

          <Grid item xs={12} sm={6} lg={2.4}>
            <ActiveTask
              icon='refer-friends'
              title='Refer Friends'
              exp='15%'
              description='Earn a share of your referral’s XP. Your friend is also rewarded with a multiplier by using your invite code.'
              plus='+15%'
              period='of each referral'
              learnMoreLink='#'
              totalReferralXP={20}
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={2.4}>
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
      <ExperienceBoard />
    </Box>
  )
}

export default Points
