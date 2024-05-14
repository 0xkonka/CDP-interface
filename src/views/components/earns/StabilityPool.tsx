import { Grid, Box } from '@mui/material'
import { TrenUSDPool } from './TrenUSDPool'
import { TrenPool } from './TrenPool'

export const StabilityPool = () => {
  return (
    <Box>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TrenUSDPool/>
        </Grid>
      </Grid>
    </Box>
  )
}
