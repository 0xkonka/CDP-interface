import { Stack, Typography, Button, Link, Box } from '@mui/material'

// Core components & types
import CustomChip from '@/@core/components/mui/chip'
import { Copy } from '../Copy';

interface Props {
    balanceTren: number
    balanceUSD: number
    txHash: string
}

export const StakeCardTren = (props: Props) => {
    const {balanceTren, balanceUSD, txHash} = props

    return (
        <Box position='relative' borderRadius={1.25} border='solid 1px #FFFFFF33'>
            <Stack position='absolute' zIndex={10} top={0} left={0} sx={{width: 1, height: 1}} justifyContent='center' alignItems='center'>
                <Typography variant='h5'>TREN Coming Soon</Typography>
            </Stack>
        
            <Stack position='relative' direction='column' alignItems='center' px={2.5} py={6} sx={{opacity: 0.05}}>
                <CustomChip label='Staked' color='secondary' variant='filled' sx={{px: 3, mb: 6}}/>
                <Typography fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`} variant='h2' color='white' mb={4}>{balanceTren} TREN</Typography>
                <Typography color='#98999D' mb={6}>~ ${balanceUSD}USD</Typography>
                <Button variant='outlined' color='secondary' sx={{maxWidth: '100%', width: 450, py: {xs: 2, lg: 3}, color: 'white', mb: 6, fontSize: {xs: 16, md: 18}, fontWeight: 400, borderRadius: '10px'}}>
                    Claim Rewards
                </Button>
                <Stack direction='row' alignItems='center' justifyContent='space-between' pt={6} borderTop='solid 1px #C6C6C74D' sx={{maxWidth: '100%', width: 450}}>
                    <Link href={txHash} target="_blank" maxWidth='90%'>
                        <Typography fontWeight={300} sx={{maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'underline', textDecorationColor: 'white'}}>
                            {txHash}
                        </Typography>
                    </Link>
                    <Stack>
                        <Copy text={txHash} />
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    )
}