import { Box, Stack, Typography } from '@mui/material'

import { useProtocol } from '@/context/ProtocolProvider/ProtocolContext'
import { useGlobalValues } from '@/context/GlobalContext'

import FaucetRow from '@/views/faucetRow'

const Faucet = () => {
    const { collateralDetails } = useProtocol()
    const { isMediumScreen } = useGlobalValues()

    return (
        <Stack alignItems='center'>
            <Box sx={{width: 4/5}}>
                <Typography className='header-gradient' sx={{ fontSize: { xs: 32, lg: 40 } }}>
                    Get Token
                </Typography>
                {/* Collateral Table Header */}
                <Stack direction='row' sx={{
                    position: 'relative',
                    zIndex: 1,
                    mt: {xs: 4, md: 8},
                    px: 6, pt: 2, 
                    display: {
                        xs: 'none',
                        lg: 'flex'
                    },
                    }}
                >
                    <Stack sx={{ flex: '2 1 0%', alignItems: 'center', cursor: 'pointer' }} direction='row'>
                        Asset
                    </Stack>
                    <Stack sx={{ flex: '1 1 0%', alignItems: 'center', cursor: 'pointer' }} direction='row'>
                        Wallet Balance
                    </Stack>
                    <Stack sx={{ flex: '1 1 0%', alignItems: 'center', cursor: 'pointer' }} direction='row'>
                        Price (USD)
                    </Stack>
                    <Stack sx={{ flex: '1.25 1 0%', alignItems: 'center', cursor: 'pointer' }} direction='row'>
                        Faucet
                    </Stack>
                </Stack>

                {/* Collateral Group Stack*/}
                {collateralDetails && (
                    <Stack sx={{ mt: 4 }} gap={isMediumScreen ? 5 : 0} position='relative' zIndex={1}>
                    {collateralDetails.length > 0 ? (
                        collateralDetails.map((row, index) => (
                        <FaucetRow
                            row={row}
                            key={index}
                        />
                        ))
                    ) : (
                        <Box sx={{ p: 6, textAlign: 'center' }}>
                            <Typography variant='body1'>No matching collateral</Typography>
                        </Box>
                    )}
                    </Stack>
                )}
            </Box>
        </Stack>
    )
}

export default Faucet