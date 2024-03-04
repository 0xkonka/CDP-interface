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
}

export const AmountForm = (props: Props) => {
    const theme:Theme = useTheme()
    const {asset, available} = props
    const [borderColorStyle, setBorderColorStyle] = useState({})
    const [amount, setAmount] = useState('')
    const collateralUSD = 3469.53
    const {radiusBoxStyle} = useGlobalValues()

    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {   // Set border for input element as primrary.
        if (inputRef.current) {
            inputRef.current.focus()
        }
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
            <Typography variant='h5' color='#707175' display='flex' alignItems='center' whiteSpace={'nowrap'} mb={2}>
                Amount
                <Tooltip title='This is Amount' placement='top'>
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
                            alt='LinkedIn' height={25}
                        />
                        <Typography variant='h5'>{asset}</Typography>
                    </Stack>
                </Stack>
                <Stack direction='row' justifyContent='space-between' mt={1}>
                    <Typography variant='h5' color='#707175' fontWeight={400}>{formatToThousands(Number(amount) * collateralUSD)}</Typography>
                    <Stack direction='row' gap={2} alignItems='center'>
                        <Typography variant='h5' color='#707175' fontWeight={400}>Available {available}</Typography>
                        <Typography variant='body2' color='primary' fontWeight={600} sx={{cursor: 'pointer'}} onClick={() => {setAmount(String(available))}}>MAX</Typography>
                    </Stack>
                </Stack>
            </Box>
        </Stack>
    )
}