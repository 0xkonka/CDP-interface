import { useGlobalValues } from '@/context/GlobalContext'
import { formatToThousandsInt } from '@/hooks/utils'
import { LiquidationOverview } from '@/views/components/liquidation/overview'
import { Box, Stack, Typography } from '@mui/material'
import Icon from '@/@core/components/icon'

const Liquidation = () => {
    const {radiusBoxStyle} = useGlobalValues()
    return (
        <Box>
            <Stack direction='row' gap={4} alignItems='center' mb={4}>
                <Typography fontWeight={600} color='white'>Liquidity Statistics</Typography>
                <Typography color='white'>|</Typography>
                <Typography color='white'>Protocol</Typography>
            </Stack>
            <Box sx={{mb: {xs: 8, lg: 12}}}>
                <LiquidationOverview />
            </Box>
            <Box id='liquidate-summary'>
                <Typography variant='h5' fontWeight={400} color='white' mb={4}>Liquidate</Typography>
                <Stack direction='row' sx={{flexDirection: {xs: 'column', md: 'row'}, gap: {xs: 4, lg: 10} }}>
                    <Box flex={1} style={radiusBoxStyle} sx={{padding: '0 !important', background:'#0d1010'}}>
                        <Stack gap={2} height={1} justifyContent='center' sx={{px: {xs: 4, md: 8}, py: 4}}>
                            <Stack direction='row' justifyContent='space-between'>
                                <Typography variant='h4' color='white' fontWeight={700}>{formatToThousandsInt(892857142857)}</Typography>
                                <Typography variant='h5' color='white' fontWeight={600}>Troves</Typography>
                            </Stack>
                            <Stack direction='row' justifyContent='space-between' alignItems='center'>
                                <Typography color='#707175' fontWeight={500}>Up to</Typography>
                                <Stack direction='row' gap={2} alignItems='center'>
                                    <Icon fontSize='16' icon='bi:trash' style={{ color: '#FF5A75', cursor: 'pointer' }} />
                                    <Typography color='#707175'>Delete</Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Box>
                    
                    <Box flex={1} style={radiusBoxStyle} sx={{padding: '0 !important', background:'#0d1010'}}>
                        <Stack gap={2} height={1} sx={{px: {xs: 4, md: 8}, py: 4}}>
                            <Stack direction='row' gap={3} alignItems='center'>
                                <Icon fontSize='20' icon='simple-line-icons:question' style={{ color: '#FFF' }} />
                                <Typography variant='h4' color='white' fontWeight={400}>Bot functionality</Typography>
                            </Stack>
                            <Typography fontWeight={300} color='#F3F3F3'>
                                Liquidation is expected to be carried out by boys. Early on you may be able to manually liquidate Troves, but as the system matures this will become less likely.
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>
            </Box>
            <Box id='risky-troves'>
                <Typography className='header-gradient' variant='h1'sx={{
                        mb: { xs: 4, md: 8 }, mt: 8,
                        fontSize: { xs: 24, md: 32, xl: 36 },
                        fontWeight: 400
                    }}
                >
                    Risky Troves
                </Typography>
            </Box>
        </Box>
    )
}

export default Liquidation