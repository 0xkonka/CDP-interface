import { Stack, Typography, Button, Link } from '@mui/material'

// Core components & types
import CustomChip from '@/@core/components/mui/chip'
import { Copy } from '../Copy';

export const StakeCardTren = () => {
    return (
        <Stack direction='column' alignItems='center' px={2.5} py={6} borderRadius={1.25} border='solid 1px #FFFFFF33'>
            <CustomChip label='Staked' color='secondary' variant='filled' sx={{px: 3, mb: 6}}/>
            <Typography fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`} variant='h2' color='white' mb={4}>2 TREN</Typography>
            <Typography color='#98999D' mb={6}>~ $300USD</Typography>
            <Button variant='outlined' color='secondary' sx={{maxWidth: '100%', width: 450, py: {xs: 2, lg: 3}, color: 'white', mb: 6, fontSize: {xs: 16, md: 18}, fontWeight: 400, borderRadius: '10px'}}>
                Claim Rewards
            </Button>
            <Stack direction='row' alignItems='center' justifyContent='space-between' pt={6} borderTop='solid 1px #C6C6C74D' sx={{maxWidth: '100%', width: 450}}>
                <Link href='https://sepolia.etherscan.io/tx/0x1c36dc0dc64bf5e690f021464c2b5ca86d7e6ffcf5a0cb95e04d3adf4a3b3fbe' target="_blank" maxWidth='90%'>
                    <Typography fontWeight={300} sx={{maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'underline', textDecorationColor: 'white'}}>
                        https://sepolia.etherscan.io/tx/0x1c36dc0dc64bf5e690f021464c2b5ca86d7e6ffcf5a0cb95e04d3adf4a3b3fbe
                    </Typography>
                </Link>
                <Copy text='https://sepolia.etherscan.io/tx/0x1c36dc0dc64bf5e690f021464c2b5ca86d7e6ffcf5a0cb95e04d3adf4a3b3fbe' />
            </Stack>
        </Stack>
    )
}