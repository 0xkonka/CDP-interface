//@ MUI components
import { Box, Typography, Grid, Stack, Button } from '@mui/material'

//@ Contexts
import { useGlobalValues } from '@/context/GlobalContext'
import { HealthFactor } from '../modules/healthFactor'
import { BorrowingPower } from '../modules/borrowingPower'
import { useModuleView } from '@/context/ModuleProvider/useModuleView'
import { erc20Abi, formatEther, formatUnits, parseUnits } from 'viem'
import { CollateralParams } from '@/context/ModuleProvider/type'
import { formatToThousands } from '@/hooks/utils'
import { useProtocol } from '@/context/ProtocolProvider/ProtocolContext'
import { BorrowPopup } from '@/views/components/popups/borrowPopup'

// React imports
import React, { useState, useMemo, useEffect } from 'react'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { getBalance } from '@wagmi/core'
import { wagmiConfig } from '@/pages/_app'
import { BORROWER_OPERATIONS } from '@/configs/address'

interface BorrowPostionProps {
  row: CollateralParams
}

export const BorrowPosition = (props: BorrowPostionProps) => {
  const { row } = props
  const { isSmallScreen } = useGlobalValues()
  // Modal Props
  const [open, setOpen] = useState<boolean>(false)
  const [type, setType] = useState<string>('withdraw')
  const [walletBalance, setWalletBalance] = useState(0)

  // Wallet Address
  const { address: account } = useAccount()

   // === Get Collateral Detail === //
   const { collateralDetails } = useProtocol()
   const collateralDetail = useMemo(
     () => collateralDetails.find(i => i.symbol === row.symbol),
     [row, collateralDetails]
  )
  const { address = '', decimals = 18, liquidation = BigInt(1), price = BigInt(0), LTV = BigInt(1), minNetDebt = BigInt(0), debtTokenGasCompensation = BigInt(0) } = collateralDetail || {}

  // === User Trove management === //
  const { moduleInfo } = useModuleView(row.symbol)
  let {
    healthFactor = 0,
    borrowingPower = 0,
    maximumBorrowingPower = BigInt(0),
    status: positionStatus = 'nonExistent',
    debt: debtAmount = BigInt(0),
    coll: depositedAmount = BigInt(0),
  } = moduleInfo || {}

  // Minus Gas compensation from trenBox Debt  @Alex R
  if(debtAmount > debtTokenGasCompensation)
    debtAmount -= debtTokenGasCompensation

  // Get Allowance
  const chainId = useChainId()
  const { data: allowance } = useReadContract({
    address: collateralDetail?.address as '0x{string}',
    abi: erc20Abi,
    functionName: 'allowance',
    args: [account as '0x${string}', BORROWER_OPERATIONS[chainId] as '0x${string}']
  })

  // Setup user collateral value for state
  useEffect(() => {
    console.log("Are you calling me?")
    if (!account || !address) return
    const getUserInfo = async () => {
      const _userCollateralBal = await getBalance(wagmiConfig, {
        address: account as '0x${string}',
        token: address as '0x${string}'
      })
      setWalletBalance(+formatUnits(_userCollateralBal.value, decimals!))
    }
    getUserInfo()
  }, [account, address])

  const handleWithdraw = () => {
    setOpen(true)
    setType('withdraw')
  }
  const handleDepositMore = () => {
    setOpen(true)
    setType('deposit')
  }
  const handleBorrowMore = () => {
    setOpen(true)
    setType('borrow')
  }
  const handleRepay = () => {
    setOpen(true)
    setType('repay')
  }

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
                  {formatToThousands(+formatEther(depositedAmount)).substring(1)}
                </Typography>
                <Stack direction='row' alignItems='center' gap={1}>
                  <img style={{marginLeft: 8}} src='/images/icons/customized-icons/approximate-icon.png' height='fit-content' alt='Approximate Icon'/>
                  <Typography variant='subtitle2' sx={{ color: '#707175' }}>
                    {formatToThousands(+formatEther(depositedAmount) * +formatEther(row.price))}
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
                onClick={handleDepositMore}
              >
                Deposit More
              </Button>
              <Button
                sx={{
                  color: 'white',
                  borderColor: '#6795DA'
                }}
                variant='outlined'
                onClick={handleWithdraw}
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
                  alt='TrenUSD'
                  style={{ borderRadius: '100%', marginRight: 10 }}
                />
                trenUSD
              </Stack>
              <Stack sx={{ ml: isSmallScreen ? 0 : 12, alignItems: 'flex-end' }}>
                <Typography variant='subtitle1'>
                  {formatToThousands(+formatEther(debtAmount)).substring(1)}
                </Typography>
                <Stack direction='row' alignItems='center' gap={1}>
                  <img style={{marginLeft: 8}} src='/images/icons/customized-icons/approximate-icon.png' height='fit-content' alt='Approximate Icon'/>
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
                onClick={handleBorrowMore}
              >
                Borrow More
              </Button>
              <Button
                sx={{
                  color: 'white',
                  borderColor: '#C9A3FA'
                }}
                variant='outlined'
                onClick={handleRepay}
              >
                Repay
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
      {collateralDetail && allowance !== undefined && (
        <BorrowPopup
          open={open}
          setOpen={setOpen}
          type={type}
          collateral={String(row.symbol)}
          collateralDetail={collateralDetail}
          allowance={allowance}
          userCollateralBal={parseUnits(walletBalance.toString(), row.decimals)}
          depositAmount=''
          borrowAmount=''
        />
      )}
    </Box>
  )
}
