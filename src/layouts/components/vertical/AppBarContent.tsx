// ** MUI Imports
import { styled, Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Button, {ButtonProps} from '@mui/material/Button'
import Image from 'next/image'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import Autocomplete from 'src/layouts/components/Autocomplete'
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import SocialsDropdown, {SocialsType} from 'src/@core/layouts/components/shared-components/SocialsDropdown'

// ** Hook Import
import { useAuth } from 'src/hooks/useAuth'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const socials: SocialsType[] = [
  {
    title: 'Discord',
    url: 'https://twitter.com/TrenFinance',
    icon: 'discord',
  },
  {
    title: 'Instagram',
    url: 'https://twitter.com/TrenFinance',
    icon: 'instagram',
  },
  {
    title: 'Twitter',
    icon: 'twitter',
    url: 'https://twitter.com/TrenFinance',
  },
  {
    title: 'Telegram',
    icon: 'telegram',
    url: 'https://twitter.com/TrenFinance',
  },
  {
    title: 'LinkedIn',
    icon: 'linkedin',
    url: 'https://twitter.com/TrenFinance',
  },
]
// ** Styled Components
const SquareSocialButton = styled(Button)<ButtonProps>(() => ({
  padding: 4,
  marginLeft: 8,
  marginRight: 8,
  minWidth: 38,
  minHeight: 38,
  border: 'solid 1px #53545F',
  borderRadius: 10,
}))

const ConnectWalletButton = styled(Button)<ButtonProps>(() => ({
  color: 'white',
}))

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  // ** Hook
  const auth = useAuth()

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
        {auth.user && (
          <>
          </>
        )}
        {hidden && !settings.navHidden ? 
          (<SocialsDropdown settings={settings} shortcuts={socials} />) : (
          <Box>
            {socials.map(social => (
              <SquareSocialButton variant='outlined' color='secondary' href={social.url} key={social.title}>
                <Image src={`/images/icons/social-icons/${social.icon}.svg`}
                  alt={social.title}
                  width={20}
                  height={20}
                />
              </SquareSocialButton>
            ))}
          </Box>
        )}
        <ConnectWalletButton sx={{ 
          ml: {xs: 2, sm: 5}
        }} variant='outlined'>Connect Wallet</ConnectWalletButton>
      </Box>
    </Box>
  )
}

export default AppBarContent
