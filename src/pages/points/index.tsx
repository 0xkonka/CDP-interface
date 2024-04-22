import { Stack, Typography, Box, Link, Grid, useTheme, Input, Button } from '@mui/material'
import Icon from 'src/@core/components/icon'

import { ActiveTask } from '@/views/components/points/ActiveTask'
import { useGlobalValues } from '@/context/GlobalContext'
import { SortableHeaderItem } from '@/views/components/global/SortableHeaderItem'
import { useMemo, useState } from 'react'
import { formatToThousands, formatToThousandsInt, shortenWalletAddress } from '@/hooks/utils'
import CustomTextField from '@/@core/components/mui/text-field'
import { Copy } from '@/views/components/Copy'
import { useRef, useEffect } from 'react'
import { ReferralType } from '@/lib/types'
import { useAccount } from 'wagmi'
import { useReferral } from '@/context/ReferralContext'

const Points = () => {
  const { address: account } = useAccount()
  const { isSmallScreen, isMobileScreen, isMediumScreen, radiusBoxStyle, isMediumLargeScreen } = useGlobalValues()
  const [sortBy, setSortBy] = useState('symbol')
  const [direction, setDirection] = useState('asc')
  const [referralLink, setReferralLink] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const theme = useTheme()

  const [firstItemHeight, setFirstItemHeight] = useState('auto')
  const secondItemRef = useRef<HTMLDivElement>(null)

  const { inviteCodes, getInviteCode, generateInviteCode, signReferral } = useReferral()

  useEffect(() => {
    const updateHeight = () => {
      if (secondItemRef.current) {
        const height = secondItemRef.current.clientHeight
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

  const handleGenerate = async () => {
    if (!account) return
    if (inviteCodes.length >= 5) return

    const inviteCode = Math.random().toString(36).substring(2, 15)
    setReferralLink(`https://tren.finance/invite/${inviteCode}`)
    generateInviteCode(inviteCode)
    getInviteCode()
  }

  const handleJoin = async () => {
    signReferral(inviteCode)
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

  return (
    <Box>
      <Box
        mt={10}
        position='relative'
        borderRadius={2.5}
        border='solid 2px #2D3131'
        overflow='hidden'
        sx={{ px: { xs: 4, md: 8, xl: 15 }, py: { xs: 4, md: 9 } }}
      >
        <Stack className='content' zIndex={10} position='relative'>
          <Box>
            <Typography
              className='header-gradient'
              variant='h1'
              sx={{
                mb: { xs: 4, md: 8 },
                mt: 4,
                fontSize: { xs: 36, md: 64, xl: 72 }
              }}
            >
              Tren XP
            </Typography>
            <Typography
              variant={isSmallScreen ? 'subtitle1' : 'h5'}
              color='#F3F3F3'
              sx={{ fontWeight: 300, width: isMediumScreen ? 1 : 1 / 2, lineHeight: { xs: 1.25, sm: 1.7 } }}
            >
              Deposit your collateral tokens into a module in exchange for a trenUSD loan or Loop your assets in one
              click to leverage exposure for your spot assets. Pay back your loan later using trenUSD or your
              collateral.
            </Typography>
          </Box>
          <Box position='relative' sx={{ mt: { xs: 5, lg: 20 }, p: 4 }}>
            <Grid container spacing={4} alignItems='center' ml={-8}>
              <Grid item xs={6} lg={2.3}>
                <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='#C6C6C799'>
                  Total XP Gained
                </Typography>
                <Typography
                  variant='h1'
                  sx={{
                    fontSize: { xs: 16, md: 32, xl: 46 },
                    mt: { xs: 2, lg: 0 }
                  }}
                  fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`}
                >
                  232.2 XP
                </Typography>
              </Grid>
              <Grid item xs={6} lg={2.3}>
                <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='#C6C6C799'>
                  XP Gained / 24 hrs{' '}
                </Typography>
                <Typography
                  variant='h1'
                  sx={{
                    fontSize: { xs: 16, md: 32, xl: 46 },
                    mt: { xs: 2, lg: 0 }
                  }}
                  fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`}
                >
                  24.1
                </Typography>
              </Grid>
              <Grid item xs={6} lg={2.3}>
                <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='#C6C6C799'>
                  Rank
                </Typography>
                <Typography
                  variant='h1'
                  sx={{
                    fontSize: { xs: 16, md: 32, xl: 46 },
                    mt: { xs: 2, lg: 0 }
                  }}
                  fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`}
                >
                  #1,321
                </Typography>
              </Grid>
              <Grid item xs={6} lg={2.3}>
                <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='#C6C6C799'>
                  Referrals
                </Typography>
                <Typography
                  variant='h1'
                  sx={{
                    fontSize: { xs: 16, md: 32, xl: 46 },
                    mt: { xs: 2, lg: 0 }
                  }}
                  fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`}
                >
                  50 XP
                </Typography>
              </Grid>
              <Grid item xs={12} lg={2.8}>
                <Stack gap={2} width='fit-content' marginLeft={isMediumScreen ? 0 : 'auto'}>
                  <Stack direction='row' justifyContent='space-between' gap={3}>
                    <Typography variant='h4' fontWeight={700}>
                      Next Update
                    </Typography>
                    <Typography variant='h4' fontWeight={700} color='primary'>
                      08:51:58
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: { xs: 14, md: 16, xl: 18 } }} fontWeight={400}>
                    Last Update: 3/3/2024 - 22:19:19
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Stack>
        <Box
          sx={{
            display: { xs: 'none', lg: 'block' },
            width: '100%',
            position: 'absolute',
            zIndex: '1',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <video autoPlay muted loop id='background-video' style={{ width: '100%' }}>
            <source
              src={isMediumLargeScreen ? '/videos/tren-points-3d-laptop.mp4' : '/videos/tren-points-3d.mp4'}
              type='video/mp4'
            />
            Your browser does not support the video tag.
          </video>
        </Box>
      </Box>

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
      <Grid container spacing={4} mt={12}>
        <Grid item xs={12} lg={7}>
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
              sx={{
                px: 6,
                pt: 6,
                pb: 2,
                display: {
                  xs: 'none',
                  lg: 'flex'
                },
                position: 'sticky',
                top: 0,
                background: '#080b0b'
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
                  <Stack
                    direction='row'
                    alignItems='center'
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
                  <Stack
                    gap={2}
                    py={4}
                    sx={{ display: { xs: 'flex', lg: 'none' }, borderTop: index == 0 ? 'none' : 'solid 1px #3030306e' }}
                  >
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
        <Grid item xs={12} lg={5}>
          <Typography className='header-gradient' sx={{ fontSize: { xs: 32, lg: 40 } }}>
            Referrals
          </Typography>
          <Box sx={{ ...radiusBoxStyle, mt: 8, py: 6 }} ref={secondItemRef}>
            <Typography color='#C6C6C7'>
              Invite your friends to Tren Finance to gain additional XP. Along with earning 1,000 XP per referral, you
              will also receive 15% of the points earned by the referred member.
            </Typography>
            <Box sx={{ border: 'solid 1px #2D3131', borderRadius: '10px', mt: 4 }}>
              <Stack direction='row' borderBottom='solid 1px #2D3131' px={6} py={4} alignItems='center'>
                <Stack flex={1}>
                  <Typography variant='subtitle2' fontWeight={400} color='#D4D4D4'>
                    XP from Referrals
                  </Typography>
                </Stack>
                <Stack flex={1}>
                  <Typography variant='subtitle2' fontWeight={400} color='#D4D4D4'>
                    Invited People
                  </Typography>
                </Stack>
                <Stack flex={1.2}>
                  <Typography variant='subtitle2' fontWeight={400} color='#D4D4D4'>
                    XP share from referred members
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction='row' px={6} py={4}>
                <Stack flex={1}>
                  <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='white'>
                    {formatToThousandsInt(12000)} XP
                  </Typography>
                </Stack>
                <Stack flex={1}>
                  <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='white'>
                    12
                  </Typography>
                </Stack>
                <Stack flex={1.2}>
                  <Typography variant={isMobileScreen ? 'subtitle2' : 'h5'} fontWeight={400} color='white'>
                    {formatToThousandsInt(3600)} XP / Day
                  </Typography>
                </Stack>
              </Stack>
            </Box>
            <Typography variant='h5' fontWeight={400} mt={6}>
              Generate Link
            </Typography>
            <Box position='relative' mt={3}>
              <CustomTextField
                sx={{
                  fontSize: 18,
                  width: 1,
                  '& .MuiInputBase-root': {
                    width: 1,
                    height: 1,
                    '& input': {
                      fontSize: isSmallScreen ? 16 : 18,
                      padding: '14px !important',
                      backgroundColor: 'transparent'
                    }
                  }
                }}
                value={referralLink}
                placeholder='http://'
                disabled={true}
              />
              <Box
                position='absolute'
                right={4}
                top={2}
                borderLeft='solid 1px #171717'
                sx={{
                  width: '37px',
                  height: '37px',
                  paddingLeft: 2,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  right: 10
                }}
              >
                <Copy text={referralLink} />
              </Box>
            </Box>
            <Typography>Generated invideCodes:</Typography>
            {inviteCodes.length > 0 &&
              inviteCodes.map((i, index) => <Typography key={index}> {i.inviteCode} </Typography>)}
            <Button
              variant='outlined'
              sx={{ width: 1, color: 'white', mt: 8, py: 3, fontSize: 18, fontWeight: 400 }}
              onClick={() => handleGenerate()}
            >
              Generate
            </Button>
          </Box>
          <CustomTextField
            sx={{
              fontSize: 18,
              width: 1,
              '& .MuiInputBase-root': {
                width: 1,
                height: 1,
                '& input': {
                  fontSize: isSmallScreen ? 16 : 18,
                  padding: '14px !important',
                  backgroundColor: 'transparent'
                }
              }
            }}
            value={inviteCode}
            onChange={e => setInviteCode(e.target.value)}
            placeholder='Input InviteCode'
          />
          <Button
            variant='outlined'
            sx={{ width: 1, color: 'white', mt: 8, py: 3, fontSize: 18, fontWeight: 400 }}
            onClick={() => handleJoin()}
          >
            Join
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Points
