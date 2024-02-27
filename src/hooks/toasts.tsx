import {
    Stack, Box, useTheme, Typography
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'

interface ContentProps {
  t: any
  header: string
  content: string
  duration: number
}

const ErrorContent = ({t, header, content, duration}: ContentProps) => {
  const theme = useTheme()
  return (
    <Stack direction='row' sx={{
      position: 'relative',
      pl: 4,
      pr: 12,
      py: 4,
      width: 'fit-content',
      color: '#FFF',
      border: 'solid 1px #873535',
      backgroundColor: '#EA5455',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 4,
    }}>
      <Icon icon='mdi:error' fontSize={40}/>
      <Box>
        <Typography variant='h4' sx={{mb: 1}}>{header}</Typography>
        <Typography variant='subtitle1'>{content}</Typography>
      </Box>
      <Icon icon='tabler:x' fontSize='1.5rem' onClick={() => toast.dismiss(t.id)} style={{     
          position: 'absolute',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          right: 15,
          top: 15,
          color: 'white',
        }}
      />
      <Box style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '2px',
        backgroundColor: '#FFF', 
        animation: `progress-bar ${duration / 1000}s linear`,
      }} />
    </Stack>
  )
}

const SuccessContent = ({t, header, content, duration}: ContentProps) => {
  const theme = useTheme()
  return (
    <Stack direction='row' sx={{
      position: 'relative',
      pl: 4,
      pr: 12,
      py: 4,
      width: 'fit-content',
      color: theme.palette.primary.main,
      border: 'solid 1px #12201F',
      backgroundColor: '#102522',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 4,
    }}>
      <Icon icon='mdi:success-circle' fontSize={40}/>
      <Box>
        <Typography variant='h4' sx={{mb: 1}}>{header}</Typography>
        <Typography variant='subtitle1'>{content}</Typography>
      </Box>
      <Icon icon='tabler:x' fontSize='1.5rem' onClick={() => toast.dismiss(t.id)} style={{     
          position: 'absolute',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          right: 15,
          top: 15,
          color: 'white',
        }}
      />
      <Box style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '2px',
        backgroundColor: theme.palette.primary.main,
        animation: `progress-bar ${duration / 1000}s linear`,
      }} />
    </Stack>
  )
}

export const showToast = (type: 'success' | 'error', header: string, content: string, duration: number) => {
  if( type == 'success') {
    return toast((t) => <SuccessContent t={t} header={header} content={content} duration={duration}/>, {
      duration: duration,
    })
  } else if( type == 'error') {
    return toast((t) => <ErrorContent t={t} header={header} content={content} duration={duration}/>, {
      duration: duration,
    })
  }
}