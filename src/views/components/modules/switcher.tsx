// MUI imports and hooks
import {
    Stack, Button, Link, Typography,
    Theme, useTheme
} from '@mui/material'

import { useGlobalValues } from '@/context/GlobalContext'
import { BORROWER_OPERATIONS } from '@/configs/address'
import { useChainId } from 'wagmi'

// Core Components Imports
import Icon from '@/@core/components/icon'

import { useRouter } from 'next/router';
import { shortenWalletAddress } from '@/hooks/utils';
import { Copy } from '../Copy';
import { Box } from '@mui/system'

interface Props {
    page: string
    collateral: string
}
export const Switcher = (props: Props) => {
    const router = useRouter()
    const {page, collateral} = props
    const theme: Theme = useTheme()
    const {isMediumScreen, setOpenSlippage} = useGlobalValues()
    const chainId = useChainId()
    const borrowContractAddr = BORROWER_OPERATIONS[chainId] as '0x{string}'

    if(collateral == '')
        return <></>

    return (
        <Stack direction={isMediumScreen ? 'column' : 'row'} sx={{alignItems: 'center', justifyContent: 'end', gap: 4, py: 4, mb: {xs: 4, lg: 0}}}>
            {/* <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'space-between', borderRadius: 2, border: 'solid 1px #C6C6C74D', width : {xs: 1, lg: 'auto'}}}>
                <Button variant='outlined' onClick={() => {
                    if(page == 'leverage')
                        router.push(`/modules/borrow/${collateral?.toString().trim().replace(/\s+/g, '')}`)
                    }} sx={{borderRadius: 2, px: 8, py: 2.5, fontSize: 16, fontWeight: 400, color: 'white',
                        width: 1/2,
                        border: page == 'leverage' ? 'solid 1px transparent' : '',
                        '&:hover': {
                            backgroundColor: 'transparent'
                        }
                    }}>
                    Borrow
                </Button>
                <Button variant='outlined' onClick={() => {
                    if(page == 'borrow')
                        router.push(`/modules/leverage/${collateral?.toString().trim().replace(/\s+/g, '')}`)
                    }} sx={{borderRadius: 2, px: 8, py: 2.5, fontSize: 16, fontWeight: 400, color: 'white', 
                        width: 1/2,
                        border: page == 'borrow' ? 'solid 1px transparent' : '',
                        '&:hover': {
                            borderColor: theme.palette.primary.main
                        }}}>
                        Leverage
                </Button>
            </Stack> */}
            <Stack direction='row' style={{alignItems: 'center'}} gap={3}>
                <Link href={`https://sepolia.etherscan.io/address/${borrowContractAddr}`} target='_blank' sx={{display: 'flex', alignItems: 'center'}}>
                    <Typography variant='h5' color='primary' sx={{fontWeight: 400}}>{shortenWalletAddress(borrowContractAddr)}</Typography>
                    <svg style={{marginLeft: 4, marginBottom: 4}} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <g clipPath="url(#clip0_719_13657)">
                            <path d="M11.625 0.75V4.125C11.625 4.33228 11.4573 4.5 11.25 4.5C11.0427 4.5 10.875 4.33228 10.875 4.125V1.65525L5.51512 7.01513C5.44191 7.08834 5.34591 7.125 5.25 7.125C5.15409 7.125 5.05809 7.08834 4.98488 7.01513C4.95003 6.98032 4.92239 6.93899 4.90353 6.8935C4.88467 6.84801 4.87496 6.79925 4.87496 6.75C4.87496 6.70075 4.88467 6.65199 4.90353 6.6065C4.92239 6.56101 4.95003 6.51968 4.98488 6.48487L10.3448 1.125H7.875C7.66772 1.125 7.5 0.957281 7.5 0.75C7.5 0.542719 7.66772 0.375 7.875 0.375H11.25C11.4573 0.375 11.625 0.542719 11.625 0.75ZM10.125 10.5V6C10.125 5.79272 9.95728 5.625 9.75 5.625C9.54272 5.625 9.375 5.79272 9.375 6V10.5C9.375 10.7069 9.20691 10.875 9 10.875H1.5C1.29309 10.875 1.125 10.7069 1.125 10.5V3C1.125 2.79309 1.29309 2.625 1.5 2.625H6C6.20728 2.625 6.375 2.45728 6.375 2.25C6.375 2.04272 6.20728 1.875 6 1.875H1.5C0.879656 1.875 0.375 2.37966 0.375 3V10.5C0.375 11.1203 0.879656 11.625 1.5 11.625H9C9.62034 11.625 10.125 11.1203 10.125 10.5Z" fill="#67DAB1"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_719_13657">
                            <rect width="12" height="12" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                </Link>
                <Box>
                    <Copy text={borrowContractAddr} />
                </Box>
                <Icon icon='tabler:settings' style={{cursor: 'pointer'}} fontSize={22} onClick={() => {setOpenSlippage(true)}}/>
            </Stack>
        </Stack>
    )
}