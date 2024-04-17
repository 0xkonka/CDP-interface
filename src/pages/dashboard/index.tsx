import { Typography, Grid } from '@mui/material'
import Box from '@mui/material/Box'
import { PositionsNet } from '@/views/components/dashboard/PositionsNet'
import { PositionsCount } from '@/views/components/dashboard/PositionsCount'

const Dashboard = () => {
    return (
        <Box>
            <Typography className='header-gradient' variant='h1'sx={{
                    mb: { xs: 4, md: 8 }, mt: 8,
                    fontSize: { xs: 36, md: 64, xl: 72 }
                }}
            >
                Dashboard
            </Typography>
            <Grid container spacing={10} sx={{ mt: {xs: 10, lg:30} }}>
                <Grid item xs={12} lg={6}>
                    <PositionsNet/>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <PositionsCount/>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Dashboard