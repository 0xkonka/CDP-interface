// MUI imports and hooks
import {
    Stack, Typography, Box
} from '@mui/material'

interface Props {
    safety: number
}

export const getHealthColor = (value: number) => {
    if(value < 1.00)
        return '#D50126'
    if(value < 2.00)
        return '#CB5500'
    if(value < 3.00)
        return '#F9AA4B'
    if(value < 4.00)
        return '#85DA67'
    return '#67DAB1'
}

export const HealthFactor = (props: Props) => {
    let {safety} = props
    safety = safety > 0 ? safety : 0

    return (
        <Stack>
            <Stack direction='row' sx={{mb:2, display:'flex', justifyContent: 'space-between'}}>
                <Typography variant='subtitle1'>
                    Health factor
                </Typography>
            </Stack>
            <Box className='gradientProgress'>
                {
                    safety != 0 &&
                    <Box>
                        <Typography variant='subtitle2' color={getHealthColor(safety)} fontWeight={400}
                            style={{marginLeft: `${Math.min(100, Math.floor(safety * 100 / 5))}%`, marginBottom: -6, width: 'fit-content', transform: 'translate(-50%, 0)'}}>
                            {safety.toFixed(2)}
                        </Typography>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"
                            style={{marginLeft: `calc(-8px + ${Math.min(100, Math.floor(safety * 100 / 5))}%`, marginBottom: -6}}>
                            <path d="M13.7302 5.07458C13.6912 4.98206 13.6006 4.92188 13.5 4.92188L2.50002 4.922C2.39956 4.922 2.30886 4.98218 2.26968 5.07471C2.23061 5.16724 2.25076 5.27429 2.32082 5.34631L7.82082 11.0032C7.86782 11.0515 7.93252 11.0789 8.00002 11.0789C8.06753 11.0789 8.13223 11.0515 8.17922 11.0032L13.6792 5.34619C13.7493 5.27405 13.7693 5.16711 13.7302 5.07458Z" fill="white"/>
                        </svg>
                    </Box>
                }
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: 6,
                    mt: safety != 0 ? 0 : 9,
                    mb: 2,
                    borderRadius: 8,
                    background: safety == 0 ? '#141819' : 'linear-gradient(90deg, #D50026 0%, #FF9C19 50.38%, #00D084 100.77%)'
                }}>
                    {
                        safety != 0 &&
                        <Box sx={{position: 'absolute', left: `${Math.floor(1 * 100 / 5)}%`, top: -10}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="2" height="26" viewBox="0 0 2 26" fill="#FFF">
                                <path d="M1 0V26" stroke="white" strokeWidth="0.5"/>
                            </svg>
                        </Box>    
                    }
                </Box>
                {
                    safety != 0 &&
                    <Box>
                        <Typography variant='subtitle2' color='#D50126' fontWeight={400} mt={3}
                            style={{marginLeft: `${Math.floor(1 * 100 / 5)}%`, width: 'fit-content', transform: 'translate(-50%, 0)', lineHeight: 1}}>
                            1.00
                        </Typography>
                        <Typography variant='subtitle2' color='#D50126' fontWeight={400}
                            style={{marginLeft: `${Math.floor(1 * 100 / 5)}%`, width: 'fit-content', transform: 'translate(-50%, 0)'}}>
                            Liquidation
                        </Typography>
                    </Box>
                }
            </Box>
        </Stack>
    )
}