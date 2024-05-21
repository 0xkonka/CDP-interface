import { Stack, Typography, Box, Link, Grid, useTheme, Input, Button } from '@mui/material'
import Icon from 'src/@core/components/icon'

import { ActiveTask } from '@/views/components/points/ActiveTask'
import { useGlobalValues } from '@/context/GlobalContext'
import { useState } from 'react'
import { useRef, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ReferralBoard } from '@/views/components/points/ReferralBoard'

const Referrals = () => {
  const { address: account } = useAccount()
  const { isSmallScreen } = useGlobalValues()

  return (
    <Box>
      {/* Leaderboard and Referrals */}
      <ReferralBoard />
    </Box>
  )
}

export default Referrals
