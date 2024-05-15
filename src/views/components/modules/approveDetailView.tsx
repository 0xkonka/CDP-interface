import { useGlobalValues } from '@/context/GlobalContext'
import { useProtocol } from '@/context/ProtocolProvider/ProtocolContext'
import { removeComma } from '@/hooks/utils'
import { formatToThousands } from '@/hooks/utils'
import { Stack, Typography } from '@mui/material'
import { useMemo } from 'react'
import { formatEther, formatUnits } from 'viem'

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
  const collateralUSD = collateralDetail ? +formatEther(collateralDetail.price) : 0
  const trenUSD = 1.0

  return (
    <Stack>
      <Stack sx={{...radiusBoxStyle, gap: 1}}>
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
              height={30}
              style={{borderRadius: '100%'}}
            />
            <Typography variant='h5'>{collateral}</Typography>
          </Stack>
        </Stack>
        <Typography color='#707175' fontWeight={500}>
          {formatToThousands(+removeComma(depositAmount) * collateralUSD)}
        </Typography>
      </Stack>
      <Stack sx={{...radiusBoxStyle, gap: 1}}>
        <Typography color='#707175' fontWeight={500}>
          You Borrow
        </Typography>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Typography variant='h2' fontWeight={600}>
            {formatToThousands(+removeComma(borrowAmount)).substring(1)}
          </Typography>
          <Stack direction='row' gap={2} alignItems='center'>
            <img src='/images/tokens/trenUSD.png' alt='trenUSD' height={30} style={{borderRadius: '100%'}}/>
            <Typography variant='h5'>trenUSD</Typography>
          </Stack>
        </Stack>
        <Typography color='#707175' fontWeight={500}>
          {formatToThousands(+removeComma(borrowAmount) * trenUSD)}
        </Typography>
      </Stack>
    </Stack>
  )
}
