import { Box, Typography, Stack, CircularProgress } from '@mui/material'

interface Props {
    content: string    
}

export const Loader = (props: Props) => {
    const {content} = props
    return (
        <Stack height='100vh' justifyContent='center' alignItems='center'>
            <CircularProgress color='primary' sx={{mb: 4}} />
            <Typography variant='h6' color='white'>{content}</Typography>
        </Stack>
    )
}