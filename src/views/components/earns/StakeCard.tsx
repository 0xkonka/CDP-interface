import { Stack, Typography, Button, Link } from '@mui/material'

// Core components & types
import CustomChip from '@/@core/components/mui/chip'
import { Copy } from '../Copy'
import { useProtocol } from '@/context/ProtocolProvider/ProtocolContext'
import { parseEther } from 'viem'
import { formatMoney } from '@/hooks/utils'

interface Props {
  balanceUSD: number
  poolShare: number
  txHash: string
  handleWithdraw?: (amount: bigint) => void
  isPending?: boolean
  isConfirming?:boolean
}

export const StakeCard = (props: Props) => {
  const { balanceUSD, poolShare, txHash, handleWithdraw, isPending, isConfirming } = props

  return (
    <Stack direction='column' alignItems='center' px={2.5} py={6} borderRadius={1.25} border='solid 1px #FFFFFF33'>
      <CustomChip label='Staked' color='primary' variant='filled' sx={{ px: 3, mb: 6 }} />
      <Typography fontFamily={`'Britanica-HeavySemiExpanded', sans-serif`} variant='h2' color='primary' mb={4}>
        {formatMoney(balanceUSD)} trenUSD
      </Typography>
      <Typography color='#98999D' mb={6}>
        ~ ${formatMoney(balanceUSD)}USD ~ Pool share {poolShare}%
      </Typography>
      <Button
        variant='outlined'
        color='primary'
        sx={{
          maxWidth: '100%',
          width: 450,
          py: { xs: 2, lg: 3 },
          color: 'white',
          mb: 6,
          fontSize: { xs: 16, md: 18 },
          fontWeight: 400,
          borderRadius: '10px'
        }}
        onClick={() => handleWithdraw && handleWithdraw(parseEther('100'))}
        disabled={isPending || isConfirming}
      >
        Withdraw
      </Button>
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        pt={6}
        borderTop='solid 1px #C6C6C74D'
        sx={{ maxWidth: '100%', width: 450 }}
      >
        <Link href={txHash} target='_blank' maxWidth='90%'>
          <Typography
            fontWeight={300}
            sx={{
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textDecoration: 'underline',
              textDecorationColor: 'white'
            }}
          >
            {txHash}
          </Typography>
        </Link>
        <Stack>
          <Copy text={txHash} />
        </Stack>
      </Stack>
    </Stack>
  )
}
