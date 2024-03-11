import { useGlobalValues } from '@/context/GlobalContext'
import { formatToThousands } from '@/hooks/utils'
import {
    Stack, Typography, Box, Tooltip, IconButton,
    Theme, useTheme
} from '@mui/material'

// Core Components Imports
import Icon from '@/@core/components/icon'
import { getHealthColor } from './healthFactor'

interface Props {
    healthFrom?: number
    healthTo: number
    liquidationPrice: number
    gasFee: number
    uptoFee?: number
    type?: string
    debt?: number
    amount?: string
}

export const TransactionOverView = (props: Props) => {
    const {radiusBoxStyle} = useGlobalValues()
    const theme:Theme = useTheme()
    const {healthFrom, healthTo, liquidationPrice, gasFee, uptoFee, type, debt, amount} = props

    return (
        <Stack>
            <Typography variant='h5' fontWeight={400} color='#707175' mt={4} mb={3}>
                Transaction overview
            </Typography>
            <Stack sx={radiusBoxStyle} gap={6}>
                {
                    debt != undefined &&
                    <Stack direction='row' justifyContent='space-between' alignItems='center'>
                        <Typography variant='h5' fontWeight={400}>Remaining debt</Typography>
                        <Stack direction='row' gap={3} alignItems='center'>
                            <Stack direction='row' gap={1} alignItems='end'>
                                <Typography variant='h5'>{formatToThousands(debt).substring(1)}</Typography>
                                <Typography variant='body2' color='#FFF'>trenUSD</Typography>
                            </Stack>
                            
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none">
                            <path d="M14.3536 4.35355C14.5488 4.15829 14.5488 3.84171 14.3536 3.64645L11.1716 0.464466C10.9763 0.269204 10.6597 0.269204 10.4645 0.464466C10.2692 0.659728 10.2692 0.976311 10.4645 1.17157L13.2929 4L10.4645 6.82843C10.2692 7.02369 10.2692 7.34027 10.4645 7.53553C10.6597 7.7308 10.9763 7.7308 11.1716 7.53553L14.3536 4.35355ZM0 4.5H14V3.5H0V4.5Z" fill="#707175"/>
                            </svg>
                            <Stack direction='row' gap={1} alignItems='end'>
                                <Typography variant='h5' color='#67DAB1'>{formatToThousands(debt-Number(amount)).substring(1)}</Typography>
                                <Typography variant='body2' color='#FFF'>trenUSD</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                }
                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <Typography variant='h5' fontWeight={400}>Health factor</Typography>
                    <Box>
                        <Stack direction='row' gap={2} justifyContent='flex-end' alignItems='center' sx={{marginRight: 4}}>
                            {
                                healthFrom != undefined &&
                                <Typography variant='h4' color={getHealthColor(healthFrom)}>{healthFrom}</Typography>
                            }
                            {
                                healthFrom == undefined &&
                                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                                <path d="M12.6875 17.2188C11.3848 18.6682 9.48787 19.9375 7.36328 19.9375C4.29789 19.9375 1.8125 17.502 1.8125 14.5C1.8125 11.498 4.29789 9.0625 7.36328 9.0625C11.7812 9.0625 14.5 14.5 14.5 14.5C14.5 14.5 17.2188 19.9375 21.6367 19.9375C24.7021 19.9375 27.1875 17.502 27.1875 14.5C27.1875 11.498 24.7021 9.0625 21.6367 9.0625C19.5121 9.0625 17.6152 10.3318 16.3125 11.7812" stroke="#67DAB1" strokeMiterlimit="10" strokeLinecap="round"/>
                                </svg>
                            }
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none">
                                <path d="M14.3536 4.35355C14.5488 4.15829 14.5488 3.84171 14.3536 3.64645L11.1716 0.464466C10.9763 0.269204 10.6597 0.269204 10.4645 0.464466C10.2692 0.659728 10.2692 0.976311 10.4645 1.17157L13.2929 4L10.4645 6.82843C10.2692 7.02369 10.2692 7.34027 10.4645 7.53553C10.6597 7.7308 10.9763 7.7308 11.1716 7.53553L14.3536 4.35355ZM0 4.5H14V3.5H0V4.5Z" fill="#707175"/>
                            </svg>
                            <Typography variant='h4' color={getHealthColor(healthTo)}>{healthTo}</Typography>
                        </Stack>
                        <Stack justifyContent='flex-end' mt={1}>
                            <Typography variant='h5' color='#707175' fontWeight={400}>
                                Liquidation Price: {formatToThousands(liquidationPrice)}
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>
            </Stack>
            <Stack direction='row' gap={2} ml={2} justifyContent='space-between'>
                <Typography fontSize={20} color='#707175' display='flex' alignItems='center' whiteSpace={'nowrap'} mb={2} gap={3}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <g clipPath="url(#clip0_1711_5642)">
                            <path d="M16.3901 2.35986L14.8901 0.859852C14.7436 0.713355 14.5063 0.713355 14.3599 0.859852C14.2134 1.00635 14.2134 1.24365 14.3599 1.39011L15.5947 2.62498L14.3599 3.85984C14.2896 3.93015 14.25 4.02536 14.25 4.12499V5.24999C14.25 6.07728 14.9228 6.75 15.75 6.75V13.125C15.75 13.3319 15.5819 13.5 15.375 13.5C15.1681 13.5 15 13.3319 15 13.125V12.375C15 11.7546 14.4954 11.25 13.875 11.25H13.5V1.50001C13.5 0.672715 12.8273 0 12 0H4.50002C3.67276 0 3.00001 0.672715 3.00001 1.50001V15C2.17275 15 1.5 15.6727 1.5 16.5V17.625C1.49997 17.6743 1.50965 17.7231 1.52848 17.7686C1.54731 17.8141 1.57494 17.8554 1.60977 17.8903C1.6446 17.9251 1.68595 17.9527 1.73146 17.9716C1.77698 17.9904 1.82576 18.0001 1.87501 18H14.625C14.6743 18.0001 14.7231 17.9904 14.7686 17.9716C14.8141 17.9527 14.8554 17.9251 14.8903 17.8903C14.9251 17.8554 14.9527 17.8141 14.9716 17.7686C14.9904 17.7231 15.0001 17.6743 15 17.625V16.5C15 15.6728 14.3273 15 13.5 15V12H13.875C14.0819 12 14.25 12.1681 14.25 12.375V13.125C14.25 13.7454 14.7547 14.25 15.375 14.25C15.9954 14.25 16.5 13.7454 16.5 13.125V2.62501C16.5 2.57576 16.4903 2.527 16.4715 2.4815C16.4526 2.43601 16.425 2.39468 16.3901 2.35986ZM12 6.38195C12 6.43121 11.9904 6.47998 11.9715 6.5255C11.9527 6.57101 11.9251 6.61237 11.8902 6.64719C11.8554 6.68202 11.8141 6.70965 11.7685 6.72848C11.723 6.74732 11.6743 6.75699 11.625 6.75696H4.875C4.82574 6.75699 4.77696 6.74732 4.73145 6.72848C4.68594 6.70965 4.64458 6.68202 4.60975 6.64719C4.57493 6.61237 4.5473 6.57101 4.52847 6.5255C4.50963 6.47998 4.49996 6.43121 4.49999 6.38195V1.87499C4.49996 1.82573 4.50963 1.77695 4.52847 1.73144C4.5473 1.68593 4.57493 1.64457 4.60975 1.60974C4.64458 1.57491 4.68594 1.54729 4.73145 1.52846C4.77696 1.50962 4.82574 1.49994 4.875 1.49998H11.625C11.6743 1.49994 11.723 1.50962 11.7685 1.52846C11.8141 1.54729 11.8554 1.57491 11.8902 1.60974C11.9251 1.64457 11.9527 1.68593 11.9715 1.73144C11.9904 1.77695 12 1.82573 12 1.87499V6.38195Z" fill="#707175"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_1711_5642">
                            <rect width="18" height="18" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                    {formatToThousands(gasFee)}
                    <Tooltip title='Gas fees are payments made by users to compensate for the computing energy required to process and validate transactions on the blockchain. Fees vary based on network congestion and transaction complexity.' placement='top'>
                        <IconButton sx={{bgcolor: 'transparent !important', p: 0}}>
                            <Icon fontSize='23' icon='ci:info' style={{color: '#707175', cursor: 'pointer'}}/>
                        </IconButton>
                    </Tooltip>
                </Typography>
                {
                    uptoFee != undefined &&
                    <Typography fontSize={20} color='#707175' marginRight={6}>
                        Fee ~ {formatToThousands(uptoFee)}
                    </Typography>

                }
            </Stack>
            <Box sx={{...radiusBoxStyle, backgroundColor: 'rgba(103, 218, 177, 0.10)', mt: 2, mb: 12}} display={type == 'repay' ? 'none' : 'block'}>
                <Typography variant='subtitle1' lineHeight='normal'>
                    <span style={{ color: theme.palette.primary.main, fontWeight: 600}}>Attention: </span>
                    Parameter changes via governance can alter your account health factor and risk of liquidation. Follow the Tren governance forum for updates.
                </Typography>
            </Box>
        </Stack>
    )
}