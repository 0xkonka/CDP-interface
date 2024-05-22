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
    let {percent, label, max} = props
    if(label == undefined)
        label = 'Borrowing power used'
    percent = percent > 0 ? percent : 0
    return (
        <Stack>
            <Typography variant='subtitle1'>
                {label}
            </Typography>
            <Typography variant='h5' textAlign='end'>
                {(percent == 0 || !percent) ? '-' : `${percent.toFixed(2)}%`}
            </Typography>
            {/* <Stack direction='row' sx={{mb:2, justifyContent: 'space-between'}}>
                
            </Stack> */}
            <Box sx={{
                mt: '19px',
                width: '100%',
                height: 6,
                mb: 2,
                borderRadius: 8,
                background: '#141819',
            }}>
                <Box sx={{
                    width: `${!percent ? 0 : Math.min(percent, 100)}%`,
                    height: 6,
                    borderRadius: 8,
                    background: 'linear-gradient(270deg, #67DAB1 0%, #0D8057 43.61%, #00200F 101.04%)'
                }}/>
            </Box>
            <Box sx={{display: max == 0 ? 'none' : 'flex', justifyContent: 'space-between'}}>
                <Typography variant='subtitle1' color='#707175'>
                    $0
                </Typography>
                <Typography variant='subtitle1' color='#707175'>
                    {formatToThousands(max, 2)}
                </Typography>
            </Box>
        </Stack>
    )
}