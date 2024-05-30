import { useGlobalValues } from '@/context/GlobalContext'
import { Grid, Typography, Box, Stack, useTheme } from '@mui/material'
import { useState, useRef, useEffect } from 'react'

import { formatToThousands, formatToThousandsInt, shortenWalletAddress } from '@/hooks/utils'
import { SortableHeaderItem } from '@/views/components/global/SortableHeaderItem'
import { Copy } from '../Copy'
import { usePoint } from '@/context/PointContext'

export const ReferralBoard = () => {
    const { isMobileScreen, radiusBoxStyle} = useGlobalValues()

    const {userReferral} = usePoint()

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
        <Grid container spacing={4} mt={12} justifyContent='center'>
            {/* Referrals group */}
            <Grid item xs={12} lg={5} xl={4.5}>
                <Typography className='header-gradient' sx={{ fontSize: { xs: 32, lg: 40 } }}>
                    Referrals
                </Typography>
                <Typography variant='body1' fontWeight={400}>
                    Every person you refer on testnet will get a 2x multiplier on mainnet, and you’ll earn 15% of their XP.
                </Typography>
                <Box sx={{ ...radiusBoxStyle, mt: 8, py: 6 }}>
                    <Stack direction='row' justifyContent='space-between'>
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
            </Grid>
        </Grid>
    )
}