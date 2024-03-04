// React imports
import React, { 
    Fragment, useState, Ref, forwardRef, ReactElement, useEffect
} from 'react'

// MUI components
import {
    Dialog, SlideProps, Slide, Box, Typography, Button
} from "@mui/material"

// Core Components Imports
import Icon from '@/@core/components/icon'
import { TransactionOverView } from './transactionOverview'
import { AmountForm } from './amountForm'
import { showToast } from '@/hooks/toasts'

const Transition = forwardRef(function Transition(
    props: SlideProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Slide direction='up' ref={ref} {...props} />
})

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    type: string
    collateral: string
}
const getTitle = (type:string) => {
    switch(type) {
        case 'withdraw':
            return 'Withdraw Collateral'
        case 'borrow':
            return 'Borrow More'
        case 'deposit':
            return 'Deposit Collateral'
        case 'repay':
            return 'Repay trenUSD'
        case 'approve':
            return 'Add Collateral & Borrow'
        case 'default':
            return 'N/A'
    }
}
const getButtonLabel = (type: string) => {
    switch(type) {
        case 'withdraw':
            return 'Withdraw Collateral'
        case 'borrow':
            return 'Borrow trenUSD'
        case 'deposit':
            return 'Deposit Collateral'
        case 'repay':
            return 'Repay'
        case 'approve':
            return 'Borrow trenUSD'
        case 'default':
            return 'N/A'
    }
}

export const BorrowPopup = (props:Props) => {
    const {open, setOpen, type} = props
    let {collateral} = props
    collateral = type == 'borrow' ? 'trenUSD' : collateral

    const handleSubmit = () => {
        if(type == 'withdraw') {
            setOpen(false)
            showToast('success', 'Withdraw Success', 'You have successfully withdrawn collateral', 10000)
        } else if(type == 'borrow') {setOpen(false)
            setOpen(false)
            showToast('success', 'Borrow Success', 'You have successfully borrow trenUSD', 10000)
        } else if(type === 'deposit') {
            setOpen(false)
            showToast('success', 'Deposit Success', 'You have successfully deposit collateral', 10000)
        } else if(type == 'repay') {
            
        } else if(type === 'approve') {
            
        }
    }

    return (
        <Fragment>
            <Dialog
                open={open}
                // keepMounted
                onClose={() => {setOpen(false)}}
                TransitionComponent={Transition}
                maxWidth={'sm'}
                fullWidth={true}
                aria-labelledby='alert-dialog-slide-title'
                aria-describedby='alert-dialog-slide-description'
            >
                <Box p={6} position='relative'>
                    <Typography mb={8} fontWeight={600} variant='h4' color='white'>
                        {getTitle(type)}
                    </Typography>
                    <Icon style={{position: 'absolute', right: 20, top: 20, cursor: 'pointer', fontWeight: 'bold'}} icon='tabler:x' fontSize='1.75rem' onClick={() => {
                        setOpen(false)
                    }}/>
                    <AmountForm asset={String(collateral)} available={12.78}/>
                    <TransactionOverView healthFrom={14.54} healthTo={1.75} liquidationPrice={2520.78} gasFee={0.14}/>
                    <Button sx={{ 
                        color: 'white',
                        py: 3,
                        px: 20,
                        width: 1,
                        fontSize: 18
                    }} variant='outlined' onClick={handleSubmit}>
                        {getButtonLabel(type)}
                    </Button>
                </Box>
            </Dialog>
        </Fragment>
    )
}
