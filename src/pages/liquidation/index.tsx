import { useGlobalValues } from '@/context/GlobalContext'
import { formatToThousandsInt } from '@/hooks/utils'
import { LiquidationOverview } from '@/views/components/liquidation/overview'
import { Box, Stack, Typography } from '@mui/material'
import Icon from '@/@core/components/icon'
import { useProtocol } from '@/context/ProtocolProvider/ProtocolContext'
import { useMemo } from 'react'
import { LiquidationRowType } from '@/types'
import LiquidationRow from '@/views/LiquidationRow'
import { CollateralParams } from '@/context/ModuleProvider/type'

const Liquidation = () => {
    const {radiusBoxStyle} = useGlobalValues()
    const { collateralDetails } = useProtocol()
    console.log(collateralDetails)

    const rows = useMemo(() => {
        if (collateralDetails && collateralDetails.length > 0) {
          const _rows: LiquidationRowType[] = collateralDetails
            .map((collateral: CollateralParams, index) => {
              return {
                symbol: collateral.symbol,
                address: collateral.address,
                price: collateral.price,
                liquidation: collateral.liquidation,
                debtTokenGasCompensation: collateral.debtTokenGasCompensation
              }
            })
            .filter(collateral => collateral !== undefined) as LiquidationRowType[]
          return _rows
        }
        return []
      }, [collateralDetails])

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
            <Stack id='risky-troves' direction='row' sx={{justifyContent: 'space-between'}} mt={16}>
                <Typography className='header-gradient' variant='h1'sx={{
                        fontSize: { xs: 24, md: 32, xl: 36 },
                        fontWeight: 400,
                        color: 'white'
                    }}
                >
                    Risky Troves
                </Typography>
                <Stack direction='row'>
                    Filter by
                </Stack>
            </Stack>

            <Box id='liquidate-list'>
                {/* Collateral Table Header */}
                <Stack direction='row' sx={{
                    position: 'relative',
                    zIndex: 1,
                    mt: {xs: 6, md: 12},
                    px: 6, pt: 2, 
                    display: {
                        xs: 'none',
                        lg: 'flex'
                    }
                    }}
                >
                    <Stack sx={{ flex: '4 1 0%', alignItems: 'center', cursor: 'pointer', fontWeight: 14 }} direction='row'>
                    Module
                    </Stack>
                    <Stack sx={{ flex: '3 1 0%', alignItems: 'center', cursor: 'pointer', fontWeight: 14 }} direction='row'>
                    Wallet Address
                    </Stack>
                    <Stack sx={{ flex: '3 1 0%', alignItems: 'center', cursor: 'pointer', fontWeight: 14 }} direction='row'>
                    Borrowed
                    </Stack>
                    <Stack sx={{ flex: '4.5 1 0%', alignItems: 'center', cursor: 'pointer', fontWeight: 14 }} direction='row'>
                    Health Factor
                    </Stack>
                    <Stack sx={{ flex: '2 1 0%', alignItems: 'center', cursor: 'pointer', fontWeight: 14 }} direction='row'>
                    Coll. Ratio
                    </Stack>
                    <Stack sx={{ flex: '2.5 1 0%', alignItems: 'center', cursor: 'pointer', fontWeight: 14 }} direction='row'>
                        <Typography sx={{marginLeft: 'auto', marginRight: '40px'}}>Liquidate</Typography>
                    </Stack>
                </Stack>

                {/* Collateral Group Stack*/}
                {collateralDetails && (
                    <Stack sx={{ mt: 4 }} position='relative' zIndex={1}>
                    {rows.length > 0 ? (
                        rows.map((row, index) => (
                        <LiquidationRow
                            row={row}
                            key={index}
                        />
                        ))
                    ) : (
                        <Box sx={{ p: 6, textAlign: 'center' }}>
                        <Typography variant='body1'>No matching module</Typography>
                        </Box>
                    )}
                    </Stack>
                )}
            </Box>
        </Box>
    )
}

export default Liquidation