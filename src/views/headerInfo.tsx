//@ MUI components
import { Box, Typography, Stack } from '@mui/material'

//@ Contexts
import { useGlobalValues } from '@/context/GlobalContext'
import { useProtocol } from '@/context/ProtocolProvider/ProtocolContext'
import { useMemo } from 'react'
import { formatEther, formatUnits } from 'viem'
import ThreeCanvas from '@/views/components/framer/ThreeCanvas'

const HeaderInfo = () => {
  const { isSmallScreen } = useGlobalValues()
  const { collateralDetails } = useProtocol()

  const ProtocolInfo = useMemo(() => {
    let totalCollateral = 0
    let totalDebt = 0
    let totalAvailableUSD = 0
    if (collateralDetails.length > 0) {
      collateralDetails.map(collateralDetail => {
        totalCollateral +=
          +formatEther(collateralDetail.totalCollDeposited) *
          +formatUnits(collateralDetail.price, collateralDetail.decimals)
        totalDebt += +formatEther(collateralDetail.entireSystemDebt)
        totalAvailableUSD += +formatEther(collateralDetail.totalBorrowAvailable)
      })
      return { totalCollateral, totalDebt, totalAvailableUSD }
    }
  }, [collateralDetails])

  return (
    <Box>
      <Stack direction='row'>
        <Box>
          <Typography className='header-gradient' variant='h1' sx={{
              mb: { xs: 4, md: 8 }, mt: 8,
              fontSize: { xs: 36, md: 64, xl: 72 },
            }}
          >
            Isolated Modules
          </Typography>
          <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'}
            color='#F3F3F3'
            sx={{ mb: { xs: 8, md: 16 }, fontWeight: 300, width: 730, maxWidth: '100%', lineHeight: { xs: 1.25, sm: 1.7 } }}
          >
            Deposit your collateral tokens into a module in exchange for a trenUSD loan or Loop your assets in one click to
            leverage exposure for your spot assets. Pay back your loan later using trenUSD or your collateral.
          </Typography>
        </Box>
        <ThreeCanvas/>
      </Stack>
      {/* Total Info Group Seection */}
      <Stack
        id='total-info'
        direction='row'
        sx={{ mb: 12, justifyContent: 'space-between', flexWrap: 'wrap', gap: { xs: 8, md: 16 } }}
      >
        <Stack
          direction='row'
          sx={{ width: { xs: 1, md: 'auto' }, justifyContent: 'space-between', gap: { xs: 4, md: 16 } }}
        >
          <Box>
            <Typography variant={isSmallScreen ? 'subtitle2' : 'subtitle1'} sx={{ mb: 1 }} color='#C6C6C7' fontWeight={400}>
              Total Collateral
            </Typography>
            <Typography variant={isSmallScreen ? 'subtitle1' : 'h4'} sx={{ fontWeight: 600 }}>
              ${Number(ProtocolInfo?.totalCollateral).toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Typography variant={isSmallScreen ? 'subtitle2' : 'subtitle1'} sx={{ mb: 1 }} color='#C6C6C7' fontWeight={400}>
              Total Debts
            </Typography>
            <Typography variant={isSmallScreen ? 'subtitle1' : 'h4'} sx={{ fontWeight: 600 }}>
              ${Number(ProtocolInfo?.totalDebt).toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Typography variant={isSmallScreen ? 'subtitle2' : 'subtitle1'} sx={{ mb: 1 }} color='#C6C6C7' fontWeight={400}>
              TrenUSD Available
            </Typography>
            <Typography variant={isSmallScreen ? 'subtitle1' : 'h4'} sx={{ fontWeight: 600 }}>
              ${Number(ProtocolInfo?.totalAvailableUSD).toLocaleString()}
            </Typography>
          </Box>
        </Stack>
        <Stack
          direction='row'
          sx={{
            width: { xs: 1, md: 'auto' },
            justifyContent: 'center',
            alignItems: 'center',
            border: 'solid 1px #2D3131',
            borderRadius: 2.5,
            px: { xs: 4, md: 8 },
            py: { xs: 2, md: 4 },
            gap: 4.5
          }}
        >
          <Typography variant='subtitle1' color='#C6C6C7'>
            TVL
          </Typography>
          <Typography variant='h5' style={{ fontWeight: 600 }}>
            ${Number(ProtocolInfo?.totalDebt).toLocaleString()}
          </Typography>
          <Box sx={{ height: 1, borderLeft: 'solid 1px #2B3440' }}></Box>
          <Typography variant='h5' color='primary' sx={{ fontWeight: 400, cursor: 'pointer' }}>
            Analytics
            <svg
              style={{ marginLeft: 4, marginBottom: 2 }}
              xmlns='http://www.w3.org/2000/svg'
              width='12'
              height='12'
              viewBox='0 0 12 12'
              fill='none'
            >
              <g clipPath='url(#clip0_719_13657)'>
                <path
                  d='M11.625 0.75V4.125C11.625 4.33228 11.4573 4.5 11.25 4.5C11.0427 4.5 10.875 4.33228 10.875 4.125V1.65525L5.51512 7.01513C5.44191 7.08834 5.34591 7.125 5.25 7.125C5.15409 7.125 5.05809 7.08834 4.98488 7.01513C4.95003 6.98032 4.92239 6.93899 4.90353 6.8935C4.88467 6.84801 4.87496 6.79925 4.87496 6.75C4.87496 6.70075 4.88467 6.65199 4.90353 6.6065C4.92239 6.56101 4.95003 6.51968 4.98488 6.48487L10.3448 1.125H7.875C7.66772 1.125 7.5 0.957281 7.5 0.75C7.5 0.542719 7.66772 0.375 7.875 0.375H11.25C11.4573 0.375 11.625 0.542719 11.625 0.75ZM10.125 10.5V6C10.125 5.79272 9.95728 5.625 9.75 5.625C9.54272 5.625 9.375 5.79272 9.375 6V10.5C9.375 10.7069 9.20691 10.875 9 10.875H1.5C1.29309 10.875 1.125 10.7069 1.125 10.5V3C1.125 2.79309 1.29309 2.625 1.5 2.625H6C6.20728 2.625 6.375 2.45728 6.375 2.25C6.375 2.04272 6.20728 1.875 6 1.875H1.5C0.879656 1.875 0.375 2.37966 0.375 3V10.5C0.375 11.1203 0.879656 11.625 1.5 11.625H9C9.62034 11.625 10.125 11.1203 10.125 10.5Z'
                  fill='#67DAB1'
                />
              </g>
              <defs>
                <clipPath id='clip0_719_13657'>
                  <rect width='12' height='12' fill='white' />
                </clipPath>
              </defs>
            </svg>
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}

export default HeaderInfo
