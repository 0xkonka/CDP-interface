import {
    Grid, Box, Stack, Typography, Theme, useTheme, Button
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useGlobalValues } from '@/context/GlobalContext'
import { formatToThousands } from '@/hooks/utils'
import { BarChart } from './BarChart'
import { StakeCard } from './StakeCard'
import { StakeCardTren } from './StakeCardTren'

export const StabilityPool = () => {
    const { radiusBoxStyle, isSmallScreen, isMobileScreen } = useGlobalValues()
    const theme: Theme = useTheme()

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
                <Box sx={{...radiusBoxStyle}}>
                    <Stack direction='row' justifyContent='space-between' mt={4}>
                        <Stack direction='row' gap={3} alignItems='center'>
                            <Box sx={{ width: {xs: 16, lg: 25}, height: {xs: 16, lg: 25} }}>
                                <svg style={{width: '100%', height: '100%'}} xmlns="http://www.w3.org/2000/svg" width="27" height="28" viewBox="0 0 27 28" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4782 11.6876C10.9247 11.7259 9.37337 12.2061 8.40062 13.5816C7.05291 15.4872 4.4119 19.7761 2.27222 23.2509C1.46713 24.5584 0.733017 25.7506 0.165479 26.6572C-0.0235997 26.9592 0.104904 27.3562 0.44976 27.446C2.65878 28.0207 6.62346 27.7851 7.78664 26.0081L14.8227 15.2589C17.3309 19.0336 20.3609 23.4877 22.2232 26.2044C22.4292 26.5049 22.8564 26.5371 23.0946 26.2614C24.7908 24.2978 27.0876 20.6239 25.4951 18.2431L13.8789 0.876341C13.6741 0.570088 13.2403 0.536147 13.0084 0.822454C11.3952 2.81408 9.39325 6.78063 11.5894 10.2914C11.8481 10.705 12.1471 11.1744 12.4782 11.6876Z" fill="white"/>
                                </svg>
                            </Box>
                            <Typography variant={isSmallScreen ? 'subtitle1' : 'h4'} fontWeight={600}>Stability Pool</Typography>
                        </Stack>
                        <Stack direction='row' alignItems='center'>
                            <Typography variant={isSmallScreen ? 'subtitle1' : 'h4'} sx={{fontWeight: 400}} color='primary'>{47}%&nbsp;</Typography>
                            <Icon icon='bi:fire' color={theme.palette.primary.main} fontSize={18}/>
                            <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} color='#98999D' sx={{display: 'flex', alignItems: 'center'}}>
                                &nbsp;(Base&nbsp;
                                    <Icon icon='mi:circle-information' fontSize={18}/>
                                &nbsp;: {12.72}%)
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack direction={isMobileScreen ? 'column' : 'row'} justifyContent='space-between' alignItems='center' mt={8} gap={6}>
                        <Stack direction='row' sx={{ width: { xs: 1, sm: 'auto' }, gap: { xs: 4, md: 8 } }}>
                            <Box>
                                <Typography variant={isSmallScreen ? 'caption' : 'subtitle2'} sx={{ mb: 1 }} color='#D4D4D47D' fontWeight={400}>
                                    Total Staked trenUSD
                                </Typography>
                                <Typography variant={isSmallScreen ? 'subtitle1' : 'h4'} sx={{ fontWeight: 400, lineHeight: 1.3, mt: {xs: 2, lg: 0} }}>
                                    {formatToThousands(500000).slice(1).slice(0, -3)} <span style={{marginRight: 2}}></span>
                                    <br style={{display: isSmallScreen ? 'inline-block' : 'none'}}/>
                                    trenUSD
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant={isSmallScreen ? 'caption' : 'subtitle2'} sx={{ mb: 1 }} color='#D4D4D47D' fontWeight={400}>
                                    Total Fees Accrues
                                </Typography>
                                <Typography variant={isSmallScreen ? 'subtitle1' : 'h4'} sx={{ fontWeight: 400, lineHeight: 1.3, mt: {xs: 2, lg: 0} }}>
                                    {formatToThousands(200).slice(1).slice(0, -3)} <span style={{marginRight: 2}}></span>
                                    <br style={{display: isSmallScreen ? 'inline-block' : 'none'}}/>
                                    trenUSD
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant={isSmallScreen ? 'caption' : 'subtitle2'} sx={{ mb: 1 }} color='#D4D4D47D' fontWeight={400}>
                                    Wallet Balance
                                </Typography>
                                <Typography variant={isSmallScreen ? 'subtitle1' : 'h4'} sx={{ fontWeight: 400, lineHeight: 1.3, mt: {xs: 2, lg: 0} }}>
                                    {formatToThousands(200).slice(1).slice(0, -3)} <span style={{marginRight: 2}}></span>
                                    <br style={{display: isSmallScreen ? 'inline-block' : 'none'}}/>
                                    trenUSD
                                </Typography>
                            </Box>
                        </Stack>
                        <Button sx={{width: {xs: 1, sm: 'auto'}, px: 6, py: 2, color: 'black', fontSize: 18}} variant='contained' color='primary'>
                            Deposit
                        </Button>
                    </Stack>
                    <Box mt={10}>
                        <BarChart title='Daily revenue fees distributed over time'/>
                    </Box>
                    <Grid container spacing={6} mt={6} mb={4}>
                        <Grid item xs={12} md={6}>
                            <StakeCard balanceUSD={400} poolShare={2} txHash='https://sepolia.etherscan.io/tx/0x1c36dc0dc64bf5e690f021464c2b5ca86d7e6ffcf5a0cb95e04d3adf4a3b3fbe'/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StakeCardTren balanceTren={2} balanceUSD={300} txHash='https://sepolia.etherscan.io/tx/0x1c36dc0dc64bf5e690f021464c2b5ca86d7e6ffcf5a0cb95e04d3adf4a3b3fbe'/>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            <Grid item xs={12} lg={6} position='relative'>
                <Box sx={{...radiusBoxStyle, opacity: 0.3}}>
                    <Stack direction='row' justifyContent='space-between' mt={4}>
                        <Stack direction='row' gap={3} alignItems='center'>
                            <Box sx={{ width: {xs: 16, lg: 25}, height: {xs: 16, lg: 25} }}>
                                <svg style={{width: '100%', height: '100%'}} xmlns="http://www.w3.org/2000/svg" width="27" height="28" viewBox="0 0 27 28" fill="none">
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.9693 11.4835C11.3577 11.5181 9.74684 12.0087 8.73353 13.425C7.32979 15.3869 4.57728 19.8037 2.34727 23.3821C1.47062 24.7888 0.674713 26.066 0.0732384 27.0135C-0.0837555 27.2608 0.0206642 27.5848 0.302658 27.6657C2.55994 28.3133 6.82106 28.1117 8.05837 26.2436L15.3897 15.1747C18.0174 19.1337 21.2 23.8158 23.115 26.6114C23.2843 26.8585 23.6362 26.8874 23.8352 26.664C25.6081 24.6743 28.1253 20.7936 26.4496 18.2857L14.3722 0.209082C14.2039 -0.0427856 13.8459 -0.0754662 13.6508 0.15572C11.9567 2.16313 9.73938 6.33895 12.051 10.0392C12.3182 10.467 12.6272 10.9525 12.9693 11.4835Z" fill="#67DAB1"/>
                                </svg>
                            </Box>
                            <Typography variant={isSmallScreen ? 'subtitle1' : 'h4'} fontWeight={600}>Stake TREN (Coming Soon)</Typography>
                        </Stack>
                        {/* <Stack direction='row' alignItems='center'>
                            <Typography variant={isSmallScreen ? 'subtitle1' : 'h4'} sx={{fontWeight: 400}} color='primary'>{47}%&nbsp;</Typography>
                            <Icon icon='bi:fire' color={theme.palette.primary.main} fontSize={18}/>
                            <Typography variant={isSmallScreen ? 'subtitle2' : 'h5'} color='#98999D' sx={{display: 'flex', alignItems: 'center'}}>
                                &nbsp;(Base&nbsp;
                                    <Icon icon='mi:circle-information' fontSize={18}/>
                                &nbsp;: {12.72}%)
                            </Typography>
                        </Stack> */}
                    </Stack>
                    <Stack direction={isSmallScreen ? 'column' : 'row'} justifyContent='space-between' alignItems='center' mt={8} gap={6}>
                        <Stack direction='row' sx={{ width: { xs: 1, md: 'auto' }, gap: { xs: 4, md: 8 } }}>
                            <Box>
                                <Typography variant={isSmallScreen ? 'caption' : 'subtitle2'} sx={{ mb: 1 }} color='#D4D4D47D' fontWeight={400}>
                                    APY
                                </Typography>
                                <Stack direction='row' alignItems='center'>
                                    <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} sx={{fontWeight: 400}} color='primary'>{47}%&nbsp;</Typography>
                                    <Icon icon='bi:fire' color={theme.palette.primary.main} fontSize={18}/>
                                    <Typography variant={isSmallScreen ? 'caption' : 'subtitle1'} color='#98999D' sx={{display: 'flex', alignItems: 'center'}}>
                                        &nbsp;(Base&nbsp;
                                            <Icon icon='mi:circle-information' fontSize={18}/>
                                        &nbsp;: {12.72}%)
                                    </Typography>
                                </Stack>
                            </Box>
                            <Box>
                                <Typography variant={isSmallScreen ? 'caption' : 'subtitle2'} sx={{ mb: 1 }} color='#D4D4D47D' fontWeight={400}>
                                    Total Staked trenUSD
                                </Typography>
                                <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} sx={{ fontWeight: 400, lineHeight: 1.3, mt: {xs: 2, lg: 0} }}>
                                    {formatToThousands(500000).slice(1).slice(0, -3)} <span style={{marginRight: 2}}></span>
                                    <br style={{display: isSmallScreen ? 'inline-block' : 'none'}}/>
                                    trenUSD
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant={isSmallScreen ? 'caption' : 'subtitle2'} sx={{ mb: 1 }} color='#D4D4D47D' fontWeight={400}>
                                    Wallet Balance
                                </Typography>
                                <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} sx={{ fontWeight: 400, lineHeight: 1.3, mt: {xs: 2, lg: 0} }}>
                                    {formatToThousands(200).slice(1).slice(0, -3)} <span style={{marginRight: 2}}></span>
                                    <br style={{display: isSmallScreen ? 'inline-block' : 'none'}}/>
                                    trenUSD
                                </Typography>
                            </Box>
                        </Stack>
                        <Button sx={{width: {xs: 1, lg: 'auto'}, px: 6, py: 2, color: 'white', fontSize: 18}} variant='outlined' color='primary'>
                            Deposit
                        </Button>
                    </Stack>
                    <Box mt={10}>
                        <BarChart title='Daily revenue fees distributed over time'/>
                    </Box>
                    <Grid container spacing={6} mt={6} mb={4}>
                        <Grid item xs={12} md={6}>
                            <StakeCard balanceUSD={400} poolShare={2} txHash='https://sepolia.etherscan.io/tx/0x1c36dc0dc64bf5e690f021464c2b5ca86d7e6ffcf5a0cb95e04d3adf4a3b3fbe'/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StakeCardTren balanceTren={2} balanceUSD={300} txHash='https://sepolia.etherscan.io/tx/0x1c36dc0dc64bf5e690f021464c2b5ca86d7e6ffcf5a0cb95e04d3adf4a3b3fbe'/>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ width: 1, height: 1, position: 'absolute', left: 0, top: 0 }} zIndex={10}></Box>
            </Grid>
        </Grid>
    )
}