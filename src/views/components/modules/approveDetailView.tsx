import { useGlobalValues } from '@/context/GlobalContext'
import { useProtocol } from '@/context/ProtocolProvider/ProtocolContext'
import { RemoveComma } from '@/hooks/utils'
import { formatToThousands } from '@/hooks/utils'
import { Stack, Typography } from '@mui/material'
import { useMemo } from 'react'
import { formatUnits } from 'viem'

interface Props {
  depositAmount: string
  borrowAmount: string
  collateral: string
}

export const ApproveDetailView = (props: Props) => {
  const { collateral, depositAmount, borrowAmount } = props
  const { radiusBoxStyle } = useGlobalValues()

  const { collateralDetails } = useProtocol()
  const collateralDetail = useMemo(
    () => collateralDetails.find(i => i.symbol === collateral),
    [collateral, collateralDetails]
  )
  const collateralUSD = collateralDetail ? +formatUnits(collateralDetail.price, collateralDetail.decimals) : 0
  const trenUSD = 1.0

  return (
    <Stack>
      <Stack gap={4} sx={radiusBoxStyle}>
        <Typography color='#707175' fontWeight={500}>
          You Deposit
        </Typography>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Typography variant='h2' fontWeight={600}>
            {depositAmount}
          </Typography>
          <Stack direction='row' gap={2} alignItems='center'>
            <img
              src={`/images/tokens/${collateral.replace(/\s+/g, '').replace(/\//g, '-')}.png`}
              alt={collateral}
              height={25}
            />
            <Typography variant='h5'>{collateral}</Typography>
          </Stack>
        </Stack>
        <Typography color='#707175' fontWeight={500}>
          {formatToThousands(+RemoveComma(depositAmount) * collateralUSD)}
        </Typography>
      </Stack>
      <Stack gap={4} sx={radiusBoxStyle}>
        <Typography color='#707175' fontWeight={500}>
          You Borrow
        </Typography>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Typography variant='h2' fontWeight={600}>
            {borrowAmount}
          </Typography>
          <Stack direction='row' gap={2} alignItems='center'>
            <img src='/images/tokens/trenUSD.png' alt='trenUSD' height={25} />
            <Typography variant='h5'>trenUSD</Typography>
          </Stack>
        </Stack>
        <Typography color='#707175' fontWeight={500}>
          {formatToThousands(+RemoveComma(borrowAmount) * trenUSD)}
        </Typography>
      </Stack>
    </Stack>
  )
}
