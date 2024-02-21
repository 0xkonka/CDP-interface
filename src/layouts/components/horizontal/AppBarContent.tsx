// ** React Imports
import { MouseEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Hook Import
import { Button, styled, ListItemIcon, ListItemText } from '@mui/material'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import WalletDropDown from 'src/@core/layouts/components/horizontal/navigation/WalletDropDown'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import ConnectWallet from 'src/pages/components/connect-wallet/ConnectWallet'

interface Props {
  hidden: boolean
  settings: Settings
  saveSettings: (values: Settings) => void
}


// Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    border: `1px solid ${theme.palette.divider}`
  }
}))

// Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  margin: 0,
  borderRadius: 0,
  '&:not(.Mui-focusVisible):hover': {
    backgroundColor: theme.palette.action.hover
  },
  '&.Mui-selected': {
    backgroundColor: hexToRGBA(theme.palette.primary.main, 0.08)
  },
  '&.Mui-focusVisible': {
    backgroundColor: theme.palette.primary.main,
    '& .MuiListItemIcon-root, & .MuiTypography-root': {
      color: theme.palette.common.white
    }
  }
}))

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings } = props

  // ** Hook

  // ** Wallet connection state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [walletAddress, setWalletAddress] = useState<string>('0x3be8905f243680d510f5ebc946faa3f3113bbb86')
  const walletItems = {
    title: `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`,
    icon: 'tabler:wallet',
    children: [
      {
        title: 'Copy Address',
        icon: 'mdi:content-copy',
        // path: '/analytics/analytics-1'
      },
      {
        title: 'Disconnect',
        // path: '/analytics/analytics-2',
        icon: 'tabler:logout'
      }
    ]
  }
  

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}

      {/* When wallet is not connected*/}
      {/* <Button sx={{ 
          color: 'white',
          ml: {xs: 2, sm: 5},
          minWidth: 160
        }} variant='outlined'>Connect Wallet
      </Button> */}

      {/* Wallet Connected */}
      <ConnectWallet />
      {/* <WalletDropDown item={
        walletItems
      } settings={settings}/> */}
    </Box>
  )
}

export default AppBarContent
