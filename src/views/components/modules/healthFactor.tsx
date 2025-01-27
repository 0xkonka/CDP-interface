// MUI imports and hooks
import {
    Stack, Typography, Box
} from '@mui/material'

interface Props {
    safety: number
}

export const HealthFactor = (props: Props) => {
    const {safety} = props
    return (
        <Stack>
            <Stack direction='row' sx={{mb:2, display:'flex', justifyContent: 'space-between'}}>
                <Typography variant='subtitle1'>
                    Health factor
                </Typography>
                <Typography variant='subtitle1'>
                    {safety == 0 ? '-' : `${safety}%`}
                </Typography>
            </Stack>
            <Box className='gradientProgress'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"
                    style={{marginLeft: `calc(-8px + ${safety}%)`}}>
                    <path d="M13.7302 5.07458C13.6912 4.98206 13.6006 4.92188 13.5 4.92188L2.50002 4.922C2.39956 4.922 2.30886 4.98218 2.26968 5.07471C2.23061 5.16724 2.25076 5.27429 2.32082 5.34631L7.82082 11.0032C7.86782 11.0515 7.93252 11.0789 8.00002 11.0789C8.06753 11.0789 8.13223 11.0515 8.17922 11.0032L13.6792 5.34619C13.7493 5.27405 13.7693 5.16711 13.7302 5.07458Z" fill="white"/>
                </svg>
                <Box sx={{
                    width: '100%',
                    height: 6,
                    mb: 2,
                    borderRadius: 8,
                    background: 'linear-gradient(270deg, #00D084 0%, #FF9C19 54.06%, #FF5876 100.77%)'
                }}/>
            </Box>
            <Stack direction='row' sx={{justifyContent: 'space-between'}}>
                <Typography variant='subtitle2' color='#707175'>
                    Safe
                </Typography>
                <Typography variant='subtitle2' color='#707175'>
                    Risky
                </Typography>
            </Stack>
        </Stack>
    )
}