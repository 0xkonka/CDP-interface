// ** MUI Imports
import Box from '@mui/material/Box'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components

// ** Hook Import
import { useAuth } from 'src/hooks/useAuth'
import { Button } from '@mui/material'

interface Props {
  hidden: boolean
  settings: Settings
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings } = props

  // ** Hook
  const auth = useAuth()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}
      {auth.user && (
        <>
        </>
      )}
      <Button sx={{ 
          color: 'white',
          ml: {xs: 2, sm: 5},
          minWidth: 160
        }} variant='outlined'>Connect Wallet
      </Button>
    </Box>
  )
}

export default AppBarContent
