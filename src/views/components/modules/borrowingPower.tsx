// MUI imports and hooks
import { formatToThousands } from '@/hooks/utils'
import {
    Stack, Typography, Box
} from '@mui/material'

interface Props {
    label?: string
    percent: number
    max: number
}

export const BorrowingPower = (props: Props) => {
    const {percent, max} = props
    let {label} = props
    if(label == undefined)
        label = 'Borrowing power used'
    return (
        <Stack>
            <Stack direction='row' sx={{mb:2, justifyContent: 'space-between'}}>
                <Typography variant='subtitle1'>
                    {label}
                </Typography>
                <Typography variant='subtitle1'>
                    {percent == 0 ? '-' : `${percent}%`}
                </Typography>
            </Stack>
            <Box sx={{
                mt: '22px',
                width: '100%',
                height: 6,
                mb: 2,
                borderRadius: 8,
                background: '#141819',
            }}>
                <Box sx={{
                    width: `${percent}%`,
                    height: 6,
                    borderRadius: 8,
                    background: 'linear-gradient(270deg, #67DAB1 0%, #0D8057 43.61%, #00200F 101.04%)'
                }}/>
            </Box>
            <Box sx={{display:'flex', justifyContent: 'space-between'}}>
                <Typography variant='subtitle2' color='#707175'>
                    $0
                </Typography>
                <Typography variant='subtitle2' color='#707175'>
                    {formatToThousands(max)}
                </Typography>
            </Box>
        </Stack>
    )
}