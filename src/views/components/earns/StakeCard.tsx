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
    <></>
  )
}
