import {
    Stack, Typography, Box,
    Tooltip, IconButton, Input, Theme, useTheme
} from '@mui/material'

import Icon from '@/@core/components/icon'
import { useGlobalValues } from '@/context/GlobalContext'
import { formatToThousands } from '@/hooks/utils'
import React, { useEffect, useRef, useState } from 'react'

interface Props {
    asset: string
    available: number
    type: string
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
            return 'Your trenUSD amount is based on your borrowing power. Increase it by adding collateral. The MAX button uses all your borrowing power.'
        case 'default':
            return 'N/A'
    }
}

export const AmountForm = (props: Props) => {
    const theme:Theme = useTheme()
    const {asset, type, available} = props
    const [borderColorStyle, setBorderColorStyle] = useState({})
    const [amount, setAmount] = useState('')
    const [collateralUSD, setCollateralUSD] = useState(1)
    const {radiusBoxStyle} = useGlobalValues()

    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {   // Set border for input element as primrary.
        if (inputRef.current) {
            inputRef.current.focus()
        }
        setCollateralUSD(asset == 'trenUSD' ? 1.001 : 3469.53)
    }, [asset])

    const focusAmount = () => { // When the parent component clicked, it set focus for input
        if(inputRef.current)
            inputRef.current.focus()
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
    const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value)
    }

    return (
        <Stack>
            <Typography variant='h5' fontWeight={400} color='#707175' display='flex' alignItems='center' whiteSpace={'nowrap'} mb={2}>
                Amount
                <Tooltip title={getAmountTooltip(type)} placement='top'>
                    <IconButton sx={{bgcolor: 'transparent !important'}}>
                        <Icon fontSize='20' icon='ci:info' style={{color: '#707175', cursor: 'pointer'}}/>
                    </IconButton>
                </Tooltip>
            </Typography>
            <Box sx={{...radiusBoxStyle, ...borderColorStyle}} onClick={focusAmount}>
                <Stack direction='row' justifyContent='space-between'>
                    <Input inputRef={inputRef} value={amount} sx={{
                        fontSize: 20,
                        ':hover': {
                            '&&&:before': {
                            borderBottom: 'none'
                            }
                        },
                        '&&&:after': {
                            borderBottom: 'none'
                        },
                        '&&&:before': {
                            borderBottom: 'none'
                        },
                    }} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}/>
                    <Stack direction='row' gap={2} alignItems='center'>
                        <img 
                            src={`/images/tokens/${asset.replace(/\s+/g, '').replace(/\//g, '-')}.png`}
                            alt={asset} height={25}
                        />
                        <Typography variant='h5'>{asset}</Typography>
                    </Stack>
                </Stack>
                <Stack direction='row' justifyContent='space-between' mt={1}>
                    <Typography variant='h5' color='#707175' fontWeight={400}>{formatToThousands(Number(amount) * collateralUSD)}</Typography>
                    <Stack direction='row' gap={2} alignItems='center'>
                        <Typography color='#707175' fontWeight={400}>{type == 'repay' ? 'Wallet balance' : 'Available'} {formatToThousands(available).substring(1)}</Typography>
                        <Typography variant='body2' color='primary' fontWeight={600} sx={{cursor: 'pointer'}} onClick={() => {setAmount(String(available))}}>MAX</Typography>
                    </Stack>
                </Stack>
            </Box>
        </Stack>
    )
}