import { useEffect, useState } from 'react'
import {Box, Stack, Typography} from '@mui/material'

// Core Components Imports
import Icon from '@/@core/components/icon'

export const Copy = ({ text }: { text: string }) => {
    const [copySuccess, setCopySuccess] = useState(false)

    useEffect(() => {
        if(copySuccess == true) {
            setTimeout(() => {
                setCopySuccess(false)
            }, 2000)
        }
    }, [copySuccess])
    const copyToClipboard = async () => {
        if ('clipboard' in navigator) {
            try {
                await navigator.clipboard.writeText(text);
                setCopySuccess(true)
                // alert('Text copied to clipboard'); // You could use a more sophisticated method to notify user
            } catch (error) {
                console.error('Could not copy text: ', error);
                setCopySuccess(false)
            }
        } else {
            alert('Clipboard API not available.');
        }
    }
    return (
        <Stack position='relative'>
            <Icon icon={copySuccess ? 'tabler:check' : 'tabler:copy'} style={{cursor: 'pointer'}} fontSize={22} onClick={copyToClipboard}/>
            <Typography variant='subtitle2' color='#707175' fontWeight={400} position='absolute' top={-20} left={-10} display={copySuccess == true ? 'block' : 'none'}>Copied</Typography>
        </Stack>
    )
}