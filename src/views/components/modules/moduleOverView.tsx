// MUI imports and hooks
import { Stack, Typography, Tooltip, IconButton, Theme, useTheme } from '@mui/material'

// Core Components Imports
import Icon from '@/@core/components/icon'
import { useGlobalValues } from '@/context/GlobalContext'
import { formatMoney, formatPercent, getOverView } from '@/hooks/utils'
import { useProtocol } from '@/context/ProtocolProvider/ProtocolContext'
import { useMemo } from 'react'
import { formatEther, formatUnits } from 'viem'

interface Props {
  collateral: string
}
export const ModuleOverView = (props: Props) => {
  const { collateral } = props
  const theme: Theme = useTheme()
  const { isSmallScreen, isMediumScreen, radiusBoxStyle } = useGlobalValues()

  const { collateralDetails } = useProtocol()
  const collateralDetail = useMemo(
    () => collateralDetails.find(i => i.symbol === collateral),
    [collateral, collateralDetails]
  )
  const { totalAssetDebt, decimals, LTV, borrowingFee, interest, liquidation, totalBorrowAvailable, mintCap } =
    collateralDetail || {}

  const formattedBorrowAvailable = totalBorrowAvailable ? +formatUnits(totalBorrowAvailable!, decimals!) : 0
  const formattedMintCap = mintCap ? +formatUnits(mintCap!, decimals!) : 0

  const overview = getOverView(collateral)
  if (collateral == '' || !overview) return <></>

  const labels = [
    {
      key: 'TVL',
      tooltip: 'Total value locked',
      value: formatMoney(
        collateralDetail ? +formatUnits(totalAssetDebt!, decimals!) : 0
      )
    },
    {
      key: 'trenUSD Available',
      tooltip: 'trenUSD available to borrow/total trenUSD allocated',
      value: `${formatMoney(formattedBorrowAvailable)} / ${formatMoney(formattedMintCap)}`
    },
    {
      key: 'Utilization',
      tooltip: 'Total borrowed trenUSD/total trenUSD allocated',
      value: formatPercent((formattedBorrowAvailable / formattedMintCap) * 100, 2)
    },
    {
      key: 'Max LTV',
      tooltip: 'Maximum loan-to-value',
      value: formatPercent(LTV ? +formatEther(LTV) * 100 : 0)
    },
    {
      key: 'Interest',
      tooltip: 'Rate of debt accrual',
      value: formatPercent(interest || 0)
    },
    {
      key: 'Borrow Fee',
      tooltip: 'A one time fee paid upon opening a position Tooltip',
      value: formatPercent(borrowingFee ? +formatEther(borrowingFee) * 100 : 0, 2)
    },
    {
      key: 'Liquidation',
      tooltip: 'the LTV at which the position will be flagged for liquidation',
      value: formatPercent(liquidation ? +formatEther(liquidation) * 100 : 0)
    },
    {
      key: 'Rate Type',
      tooltip: 'The interest rate used for the pool',
      value: overview.rateType
    }
  ]

  const smallBoxStyle = {
    width: '100vw',
    marginLeft: isSmallScreen ? -4 : -8,
    padding: 4,
    marginBottom: 4,
    borderBottom: 'solid 1px',
    borderTop: 'solid 1px',
    borderColor: theme.palette.secondary.dark,
    gap: 6,
    overflowX: 'scroll'
  }

  const computedStyle = isMediumScreen ? smallBoxStyle : radiusBoxStyle
  return (
    <Stack
      direction='row'
      sx={{ ...computedStyle, flexWrap: isMediumScreen ? 'nowrap' : 'wrap', justifyContent: 'space-between' }}
    >
      {labels.map((label, index) => (
        <Stack key={index} sx={{ alignItems: 'center', gap: isSmallScreen ? 0 : 1 }}>
          <Typography
            variant='body1'
            color='#707175'
            sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}
          >
            {label.key}
            <Tooltip title={label.tooltip} placement='top'>
              <IconButton sx={{ bgcolor: 'transparent !important' }}>
                <Icon fontSize='14' icon='simple-line-icons:question' style={{ color: '#707175', cursor: 'pointer' }} />
              </IconButton>
            </Tooltip>
          </Typography>
          <Typography variant='body1'>{label.value}</Typography>
        </Stack>
      ))}
    </Stack>
  )
}
