import { Grid, Box } from '@mui/material'
import { TrenUSDPool } from './TrenUSDPool'
import { TrenPool } from './TrenPool'

export const StabilityPool = () => {
  return (
    <Box>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={6}>
          <TrenUSDPool/>
        </Grid>
        <Grid item xs={12} lg={6} position='relative'>
          <Box position='absolute' zIndex={10} top={0} left={0} sx={{width: 1, height: 1}} justifyContent='center' alignItems='center'/>
          <TrenPool/>
        </Grid>
      </Grid>
      
    </Box>
  )
}
