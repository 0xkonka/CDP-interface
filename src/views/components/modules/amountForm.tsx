import {
    Stack, Typography, Box,
    Tooltip, IconButton, Theme, useTheme
} from '@mui/material'

import Icon from '@/@core/components/icon'
import { useGlobalValues } from '@/context/GlobalContext'
import { formatToThousands, removeComma } from '@/hooks/utils'
import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useProtocol } from '@/context/ProtocolProvider/ProtocolContext'
import { formatEther } from 'viem'

// Styled Component Import
import CleaveWrapper from '@/@core/styles/libs/react-cleave'

// CleaveJS for input formatting
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'

interface Props {
    asset: string
    available: number
    type: string
    amount: string
    setAmount: (amount: string) => void
    showTooltip?: boolean
    debtAmount?: bigint // It is only for Repay popup
}

const getAmountTooltip = (type: string) => {
    switch(type) {
        case 'withdraw':
            return "Your withdrawal amount is tied to your loan size. Full collateral withdrawal requires full debt repayment. Using the MAX button to withdraw increases liquidation risk due to a high LTV ratio."
        case 'deposit':
            return "Deposit tokens to boost your collateral and health factor. The MAX button deposits your wallet's full token balance."
        case 'repay':
            return "Your repayment capacity is limited by your wallet's trenUSD balance. Use the MAX button to fully repay the loan if you have sufficient trenUSD, or to apply the full trenUSD from your wallet towards the loan repayment"
        case 'borrow':
            return "Your trenUSD amount is based on your borrowing power. Increase it by adding collateral. The MAX button uses all your borrowing power."
        case 'stability-withdraw':
            return "The total amount available to withdraw corresponds to the total balance deposited"
        case 'stability-deposit':
            return "The available amount to deposit corresponds to the trenUSD wallet balance."
        case 'default':
            return 'N/A'
    }
}

export const AmountForm = (props: Props) => {
    const theme:Theme = useTheme()
    const {asset, type, available, amount, setAmount, showTooltip = true, debtAmount} = props
    const [borderColorStyle, setBorderColorStyle] = useState({})
    const [collateralUSD, setCollateralUSD] = useState(1)
    const {radiusBoxStyle} = useGlobalValues()

    // === Get Collateral Detail === //
    const { collateralDetails } = useProtocol()
    const collateralDetail = useMemo(
        () => collateralDetails.find(i => i.symbol === asset),
        [asset, collateralDetails]
    )
    const { address = '', decimals = 18, liquidation = BigInt(1), price = BigInt(0), LTV = BigInt(1), minNetDebt = BigInt(0) } = collateralDetail || {}

    const inputRef = useRef<any>(null)
    useEffect(() => {   // Set border for input element as primrary.
        if (inputRef.current) {
            inputRef.current.element.focus()
        }
        setCollateralUSD(asset == 'trenUSD' ? 1 : +formatEther(price))
    }, [asset])

    const focusAmount = () => { // When the parent component clicked, it set focus for input
        if (inputRef.current) {
            inputRef.current.element.focus()
        }
    }

    const handleFocus = () => {  // When the inputbox get focus, it set primary border
        setBorderColorStyle({
            borderColor: theme.palette.primary.main
        })
    }
    const handleBlur = () => {  // When the inputbox lose focus, it set dark border
        setBorderColorStyle({
            borderColor: theme.palette.secondary.dark
        })
    }

    return (
        <Stack>
            {showTooltip == true &&
            <Typography variant='h5' fontWeight={400} color='#707175' display='flex' alignItems='center' whiteSpace={'nowrap'} mb={2}>
                Amount
                <Tooltip title={getAmountTooltip(type)} placement='top'>
                    <IconButton sx={{bgcolor: 'transparent !important'}}>
                        <Icon fontSize='20' icon='ci:info' style={{color: '#707175', cursor: 'pointer'}}/>
                    </IconButton>
                </Tooltip>
            </Typography>
            }
            <Box sx={{...radiusBoxStyle, ...borderColorStyle, pt: 2}} onClick={focusAmount}>
                <Stack direction='row' justifyContent='space-between'>
                    <CleaveWrapper style={{ position: 'relative' }}>
                        <Cleave
                            id='collateral-assets-amount'
                            ref={inputRef} 
                            style={{
                                fontSize: 24,
                                border: 'none',
                                fontWeight: 700,
                                paddingLeft: 6,
                                paddingBottom: 0,
                            }} 
                            placeholder='0.00'
                            options={{
                                numeral: true,
                                numeralThousandsGroupStyle: 'thousand',
                                numeralDecimalScale: 5, // Always show two decimal points
                                numeralDecimalMark: '.', // Decimal mark is a period
                                stripLeadingZeroes: false // Prevents stripping the leading zero before the decimal point
                            }}
                            value={amount}
                            onChange={e => setAmount(removeComma(e.target.value))}
                            onFocus={handleFocus} onBlur={handleBlur}
                            autoComplete='off'
                        />
                    </CleaveWrapper>
                    <Stack direction='row' gap={2} alignItems='center'>
                        <img 
                            src={`/images/tokens/${asset.replace(/\s+/g, '').replace(/\//g, '-')}.png`}
                            alt={asset} height={28}
                        />
                        <Typography variant='h5'>{asset}</Typography>
                    </Stack>
                </Stack>
                <Stack direction='row' justifyContent='space-between'>
                    <Stack direction='row' gap={1} alignItems='center'>
                        <img style={{marginLeft: 8}} src='/images/icons/customized-icons/approximate-icon.png' height='fit-content' alt='Approximate Icon'/>
                        <Typography variant='subtitle1' color='white' fontWeight={500} sx={{opacity: 0.5}}>{formatToThousands(+removeComma(amount) * collateralUSD)}</Typography>
                    </Stack>
                    <Stack direction='row' gap={2} alignItems='center'>
                        <Typography color='#707175' fontWeight={400}>{type == 'repay' ? 'Wallet balance:' : 'Available:'} {formatToThousands(available).substring(1)}</Typography>
                        <Typography variant='body2' color='primary' fontWeight={600} sx={{cursor: 'pointer'}} onClick={() => {setAmount(type != 'repay' ? String(available) : formatEther(debtAmount!))}}>MAX</Typography>
                    </Stack>
                </Stack>
            </Box>
        </Stack>
    )
}