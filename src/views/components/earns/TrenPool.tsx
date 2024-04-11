import { Grid, Box, Stack, Typography, Theme, useTheme, Button } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useGlobalValues } from '@/context/GlobalContext'
import { formatMoney, formatToThousandsInt } from '@/hooks/utils'
import { BarChart } from './BarChart'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { DEBT_TOKEN } from '@/configs/address'
import { erc20Abi, formatEther, formatUnits, parseUnits } from 'viem'
import { useStabilityPoolView } from '@/context/StabilityPoolProvider/StabilityPoolContext'

import { useState, useEffect } from 'react'
import { StabilityPopup } from '../popups/stabilityPopup'

interface userStabilityInfoType {
  walletBalance: number
  userDeposit: number
}

export const TrenPool = () => {
    const { radiusBoxStyle, isSmallScreen, isMobileScreen } = useGlobalValues()
    const theme: Theme = useTheme()
    const chainId = useChainId()
    const { address: account } = useAccount()
    const address = DEBT_TOKEN[chainId] as '0x{string}'
    // Modal Props
    const [open, setOpen] = useState<boolean>(false)
    const [type, setType] = useState<string>('withdraw')
    const [userStabilityInfo, setUserStabilityInfo] = useState<userStabilityInfoType>({
        walletBalance: 0,
        userDeposit: 0,
    })
    const decimals = 18 // Will be replaced with real decimal - Jordan

    const { stabilityPoolInfo, userStabilityPoolPosition } = useStabilityPoolView()
    const { userDeposit = BigInt(0) } = userStabilityPoolPosition || {}
    const { totalDebtTokenDeposits = BigInt(0) } = stabilityPoolInfo || {}
    
    // Get trenUSD balance of wallet.
    const { data: userDebtBal, refetch: refetchBalance } = useReadContract({
        address: address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [account as '0x{string}'],
    })

    // Set Wallet Balance & user DepositBal, actually deposit/withdraw available val.
    useEffect(() => {
        if(userDebtBal != undefined && userDeposit != undefined) {
        setUserStabilityInfo(prevState => ({
            ...prevState,
            walletBalance: +formatUnits(userDebtBal, decimals!),
            userDeposit: +formatUnits(userDeposit, decimals!),
        }))
        refetchBalance()
        }
    }, [userDebtBal, userDeposit])

    // Open popups.
    const handleStabilityDeposit = () => {
        setOpen(true)
        setType('deposit')   
    }

    const handleStabilityWithdraw = () => {
        setOpen(true)
        setType('withdraw')   
    }
    
    return (
        <Box sx={{ ...radiusBoxStyle, pt: {xs: 1, md: 6}, opacity: 0.2 }}>
            <Stack direction='row' justifyContent='space-between' mt={4}>
                <Stack direction='row' gap={3} alignItems='center'>
                    <Box sx={{ width: { xs: 16, lg: 25 }, height: { xs: 16, lg: 25 } }}>
                        <svg
                            style={{ width: '100%', height: '100%' }}
                            xmlns='http://www.w3.org/2000/svg'
                            width='27'
                            height='28'
                            viewBox='0 0 27 28'
                            fill='none'
                        >
                            <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M12.4782 11.6876C10.9247 11.7259 9.37337 12.2061 8.40062 13.5816C7.05291 15.4872 4.4119 19.7761 2.27222 23.2509C1.46713 24.5584 0.733017 25.7506 0.165479 26.6572C-0.0235997 26.9592 0.104904 27.3562 0.44976 27.446C2.65878 28.0207 6.62346 27.7851 7.78664 26.0081L14.8227 15.2589C17.3309 19.0336 20.3609 23.4877 22.2232 26.2044C22.4292 26.5049 22.8564 26.5371 23.0946 26.2614C24.7908 24.2978 27.0876 20.6239 25.4951 18.2431L13.8789 0.876341C13.6741 0.570088 13.2403 0.536147 13.0084 0.822454C11.3952 2.81408 9.39325 6.78063 11.5894 10.2914C11.8481 10.705 12.1471 11.1744 12.4782 11.6876Z'
                            fill='white'
                            />
                        </svg>
                    </Box>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h4'} fontWeight={600}>
                    Stability Pool
                    </Typography>
                </Stack>
            </Stack>
            <Stack direction={isMobileScreen ? 'column' : 'row'} justifyContent='space-between' alignItems='start' mt={8} gap={6}>
                <Stack direction='row' sx={{ width: { xs: 1, sm: 'auto' }, gap: { xs: 4, md: 16 } }}>
                    <Box>
                        <Typography variant={isSmallScreen ? 'caption' : 'subtitle2'} sx={{ mb: 1 }} color='#D4D4D47D' fontWeight={400} >
                            Total Staked trenUSD
                        </Typography>
                        <Typography sx={{ fontWeight: 400, lineHeight: 1.3, mt: {xs: 2, lg: 0}, fontSize: {xs: 16, lg: 18, xl: 24} }}>
                        -
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant={isSmallScreen ? 'caption' : 'subtitle2'} sx={{ mb: 1 }} color='#D4D4D47D' fontWeight={400}>
                            Total Fees Accrues
                        </Typography>
                        <Typography sx={{ fontWeight: 400, lineHeight: 1.3, mt: {xs: 2, lg: 0}, fontSize: {xs: 16, lg: 18, xl: 24} }}>
                            -
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction='row' alignItems='center' justifyContent='start'>
                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h4'} sx={{ fontWeight: 400 }} color='primary'>
                        -%&nbsp;
                    </Typography>
                    <Icon icon='bi:fire' color={theme.palette.primary.main} fontSize={18} />
                    <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} color='#98999D' 
                        sx={{ display: 'flex', alignItems: 'center' }}>
                        &nbsp;(Base&nbsp;
                        <Icon icon='mi:circle-information' fontSize={18} />
                        &nbsp;: -%)
                    </Typography>
                </Stack>
            </Stack>
            <Box mt={10}>
                <BarChart isEmpty/>
            </Box>
            <Grid container spacing={4} mt={6}>
                <Grid item xs={12} md={4}>
                    <Stack direction='column' alignItems='center' px={2.5} py={5} borderRadius={1.25} border='solid 1px #FFFFFF33' sx={{backgroundColor: '#0c0e0e'}}>
                        <Typography color='#D4D4D4' mb={2}>
                            Wallet Balance
                        </Typography>
                        <Typography fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`} fontSize={24} color='white' mb={6} fontWeight={400}>
                            -
                        </Typography>
                        <Button variant='contained' color='primary'
                            sx={{ 
                                maxWidth: '100%', width: 180, py: { xs: 2, lg: 3 }, color: '#000', fontSize: { xs: 16, md: 18 }, fontWeight: 500, borderRadius: '10px'
                            }}
                            onClick={handleStabilityDeposit}
                        >
                            Deposit
                        </Button>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Stack direction='column' alignItems='center' px={2.5} py={5} borderRadius={1.25} border='solid 1px #FFFFFF33' sx={{backgroundColor: '#0c0e0e'}}>
                        <Typography color='#D4D4D4' mb={2}>
                            Staked trenUSD
                        </Typography>
                        <Typography fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`} fontSize={24} color='white' mb={6}>
                            -
                        </Typography>
                        <Button variant='outlined' color='primary'
                            sx={{ 
                                maxWidth: '100%', width: 180, py: { xs: 2, lg: 3 }, color: '#FFF', fontSize: { xs: 16, md: 18 }, fontWeight: 400, borderRadius: '10px'
                            }}
                            onClick={handleStabilityWithdraw}
                        >
                            Withdraw
                        </Button>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Stack direction='column' alignItems='center' px={2.5} py={5} borderRadius={1.25} border='solid 1px #FFFFFF33' sx={{backgroundColor: '#0c0e0e'}}>
                        <Typography color='#D4D4D4' mb={2}>
                            Rewards
                        </Typography>
                        <Typography fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`} fontSize={24} color='white' mb={6}>
                            -
                        </Typography>
                        <Button variant='outlined'
                            sx={{ 
                                maxWidth: '100%', width: 180, py: { xs: 2, lg: 3 }, color: '#FFF', fontSize: { xs: 16, md: 18 }, fontWeight: 400, borderRadius: '10px', borderColor: '#C6E0DC'
                            }}
                        >
                            Claim Rewards
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
            <StabilityPopup
                open={open}
                setOpen={setOpen}
                type={type}
                depositAvailable={userStabilityInfo.walletBalance}
                withdrawAvailable={userStabilityInfo.userDeposit}
                totalDebtTokenDeposits={+formatUnits(totalDebtTokenDeposits, decimals!)}
            />
        </Box>
    )
}