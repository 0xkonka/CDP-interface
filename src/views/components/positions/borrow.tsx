//@ MUI components
import { Box, Typography, Grid, Stack, Button } from '@mui/material'

//@ Contexts
import { useGlobalValues } from '@/context/GlobalContext'
import { HealthFactor } from '../modules/healthFactor'
import { BorrowingPower } from '../modules/borrowingPower'
import { useModuleView } from '@/context/ModuleProvider/useModuleView'
import { formatEther, formatUnits } from 'viem'
import { CollateralParams } from '@/context/ModuleProvider/type'
import { formatToThousands } from '@/hooks/utils'

interface BorrowPostionProps {
  row: CollateralParams
}

export const BorrowPosition = (props: BorrowPostionProps) => {
  const { row } = props
  const { isSmallScreen } = useGlobalValues()

  const { moduleInfo } = useModuleView(row.symbol)
  const {
    healthFactor = 0,
    borrowingPower = 0,
    maximumBorrowingPower = BigInt(0),
    status: positionStatus = 'nonExistent',
    debt: debtAmount = BigInt(0),
    coll: depositedAmount = BigInt(0),
  } = moduleInfo || {}

  return (
    <Box className='borrow-position' sx={{ display: positionStatus === 'active' ? 'block' : 'none' }}>
      <Typography variant='subtitle1' sx={{ my: 4, fontWeight: 600 }}>
        Borrow Position
      </Typography>
      <Grid container spacing={8}>
        <Grid item xs={12} lg={6}>
          <HealthFactor safety={healthFactor} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <BorrowingPower
            percent={borrowingPower * 100}
            max={+formatEther(maximumBorrowingPower)}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Typography variant='subtitle1' sx={{ my: 4, fontWeight: 600 }}>
            Collateral
          </Typography>
          <Stack
            direction='row'
            sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}
          >
            <Stack direction='row' sx={{ width: { xs: 1, md: 'auto' }, justifyContent: 'space-between' }}>
              <Stack direction='row' sx={{ alignItems: 'center' }}>
                <img
                  src={`/images/tokens/${row.symbol.replace(/\//g, '-').replace(/\s+/g, '')}.png`}
                  alt={row.symbol}
                  height={isSmallScreen ? 36 : 42}
                  style={{ marginRight: 10 }}
                />
                {row.symbol}
              </Stack>
              <Stack sx={{ ml: isSmallScreen ? 0 : 12, alignItems: 'flex-end' }}>
                <Typography variant='subtitle1'>
                  {formatToThousands(+formatUnits(depositedAmount, row.decimals)).substring(1)}
                </Typography>
                <Stack direction='row' alignItems='center' gap={1}>
                  <img style={{marginLeft: 8}} src='/images/icons/customized-icons/approximate-icon.png' height='fit-content'/>
                  <Typography variant='subtitle2' sx={{ color: '#707175' }}>
                    {formatToThousands(+formatUnits(depositedAmount, row.decimals) * +formatEther(row.price))}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack direction='row'>
              <Button
                sx={{
                  mr: { xs: 2, md: 4 },
                  color: 'white',
                  borderColor: '#67DAB1'
                }}
                variant='outlined'
              >
                Deposit
              </Button>
              <Button
                sx={{
                  color: 'white',
                  borderColor: '#6795DA'
                }}
                variant='outlined'
              >
                Withdraw
              </Button>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Typography variant='subtitle1' sx={{ my: 4, fontWeight: 600 }}>
            Debt
          </Typography>
          <Stack
            direction='row'
            sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}
          >
            <Stack direction='row' sx={{ width: { xs: 1, md: 'auto' }, justifyContent: 'space-between' }}>
              <Stack direction='row' sx={{ alignItems: 'center' }}>
                <img
                  src='/images/tokens/trenUSD.png'
                  alt='LinkedIn'
                  style={{ borderRadius: '100%', marginRight: 10 }}
                />
                trenUSD
              </Stack>
              <Stack sx={{ ml: isSmallScreen ? 0 : 12, alignItems: 'flex-end' }}>
                <Typography variant='subtitle1'>
                  {formatToThousands(+formatEther(debtAmount)).substring(1)}
                </Typography>
                <Stack direction='row' alignItems='center' gap={1}>
                  <img style={{marginLeft: 8}} src='/images/icons/customized-icons/approximate-icon.png' height='fit-content'/>
                  <Typography variant='subtitle2' sx={{ color: '#707175', textAlign: 'end' }}>
                    {formatToThousands(+formatEther(debtAmount))}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack direction='row'>
              <Button
                sx={{
                  mr: { xs: 2, md: 4 },
                  color: 'white',
                  borderColor: '#C6E0DC'
                }}
                variant='outlined'
              >
                Borrow More
              </Button>
              <Button
                sx={{
                  color: 'white',
                  borderColor: '#C9A3FA'
                }}
                variant='outlined'
              >
                Repay
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
