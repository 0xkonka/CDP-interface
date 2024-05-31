import { Typography, Box, Link, Grid, useTheme, Input, Button } from '@mui/material'

import { ActiveTask } from '@/views/components/points/ActiveTask'
import { ActiveTaskSpecial } from '@/views/components/points/ActiveTaskSpecial'
import { useGlobalValues } from '@/context/GlobalContext'
import { useState } from 'react'
import { useRef, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { TrenPointBanner } from '@/views/components/points/TrenPointBanner'
import { ExperienceBoard } from '@/views/components/points/ExperienceBoard'

const Points = () => {
  const { address: account } = useAccount()
  const { isSmallScreen } = useGlobalValues()

  return (
    <Box>
      {/* 3D Tren Points Banner section */}
      <TrenPointBanner />

      {/* Active Tasks Section */}
      <Box id='active-tasks' mt={20}>
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
