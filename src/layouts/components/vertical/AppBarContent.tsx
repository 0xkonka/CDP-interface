// ** React Imports
import { MouseEvent, useState } from 'react'

// ** MUI Imports
import { styled, Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Button, {ButtonProps} from '@mui/material/Button'
import { ListItemIcon, ListItemText } from '@mui/material'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Image from 'next/image'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Hook Import
import ConnectWallet from 'src/pages/components/connect-wallet/ConnectWallet'


// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
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
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  // ** Hook

  // ** Wallet connection state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [walletAddress, setWalletAddress] = useState<string>('0x3be8905f243680d510f5ebc946faa3f3113bbb86')

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden && !settings.navHidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon fontSize='1.5rem' icon='tabler:menu-2' />
          </IconButton>
        ) : null}
        {/* {auth.user && <Autocomplete hidden={hidden} settings={settings} />} */}
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}
        <ConnectWallet />
        {/* When wallet is not connected*/}
        {/* <Button sx={{ 
            color: 'white',
            ml: {xs: 2, sm: 5},
            minWidth: 160
          }} variant='outlined'>Connect Wallet
        </Button> */}

        {/* Wallet Connected */}
        {/* <Button aria-haspopup='true' onClick={handleClick} aria-controls='wallet-connect'>
          <Icon icon='tabler:wallet' fontSize={28} style={{marginRight: 10}}/>
          {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
          
          <Icon icon='tabler:chevron-down' fontSize={18} style={{marginLeft: 5}}/>
        </Button>
        <Menu 
          keepMounted
          elevation={0}
          anchorEl={anchorEl}
          id='customized-menu'
          onClose={handleClose}
          open={Boolean(anchorEl)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Icon icon='mdi:content-copy' fontSize={20} />
            </ListItemIcon>
            <ListItemText primary='Copy Address' />
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Icon icon='tabler:mail-opened' fontSize={20} />
            </ListItemIcon>
            <ListItemText primary='Disconnect' />
          </MenuItem>
        </Menu> */}
      </Box>
    </Box>
  )
}

export default AppBarContent
