import { Stack, Typography, Box, Link, Grid, useTheme, Input, Button } from '@mui/material'
import Icon from 'src/@core/components/icon'

import { ActiveTask } from '@/views/components/points/ActiveTask'
import { useGlobalValues } from '@/context/GlobalContext'
import { useState } from 'react'
import { useRef, useEffect } from 'react'
import { ReferralType } from '@/types'
import { useAccount } from 'wagmi'
import { TrenPointBanner } from '@/views/components/points/TrenPointBanner'
import { ExperienceBoard } from '@/views/components/points/ExperienceBoard'

const Points = () => {
  const { address: account } = useAccount()
  const { isSmallScreen } = useGlobalValues()

  const [inviteCodes, setInviteCodes] = useState<ReferralType[]>([])

  useEffect(() => {
    if (!account) return
    const getInviteCode = async () => {
      const res = await fetch('/api/points?owner=' + account)
      setInviteCodes(await res.json())
    }
    getInviteCode()
  }, [account]) // Dependency array to control re-fetching

  return (
    <Box>
      {/* 3D Tren Points Banner section */}
      <TrenPointBanner />

      {/* Active Tasks Section */}
      <Box id='active-tasks' mt={20}>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Typography className='header-gradient' sx={{ fontSize: { xs: 32, lg: 40 } }}>
            Active Tasks
          </Typography>
          <Link href='#'>
            <Stack direction='row'>
              <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} color='primary' fontWeight={400} sx={{ mr: 2 }}>
                View All
              </Typography>
              <Icon fontSize='24' icon='basil:arrow-right-outline' color='primary' />
            </Stack>
          </Link>
        </Stack>
        <Grid container spacing={4} mt={4}>
          <Grid item xs={12} sm={6} lg={3}>
            <ActiveTask
              icon='stake-lp'
              title='Stake LP Tokens'
              exp={50}
              description='Stake your LP tokens from either Curve or Uniswap to provide liquidity.'
              xpPlus={15}
              xpCurrency='dollar'
              period='per day'
              learnMoreLink='#'
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <ActiveTask
              icon='stake-trenUSD'
              title='Stake TrenUSD'
              exp={100}
              description='Stake your TrenUSD directly into our stability pool to help secure the protocol.'
              xpPlus={10}
              xpCurrency='dollar'
              period='per day'
              learnMoreLink='#'
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <ActiveTask
              icon='borrowing'
              title='Borrowing'
              exp={100}
              description='Borrow against your collateral on Tren Finance, where points are allocated based on the total value borrowed'
              xpPlus={10}
              xpCurrency='dollar'
              period='per day'
              learnMoreLink='#'
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <ActiveTask
              icon='refer-friends'
              title='Refer Friends'
              exp={50}
              description='Earn XP for each friend you invite, while also earning a share of their XP.'
              xpPlus={1000}
              xpCurrency='referral'
              period='+15% of each friend’s XP'
              learnMoreLink='#'
            />
          </Grid>
        </Grid>
      </Box>

      {/* Leaderboard and Referrals */}
      <ExperienceBoard/>
    </Box>
  )
}

export default Points
