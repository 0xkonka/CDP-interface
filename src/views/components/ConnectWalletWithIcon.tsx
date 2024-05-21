import { Stack, Box } from '@mui/material'
import { useAccount } from 'wagmi'
import { RainbowKitProvider, darkTheme, ConnectButton } from '@rainbow-me/rainbowkit'

interface Props {
  show?: 'always' | 'connected' | 'disconnected'
}

export default function ConnectWalletWithIcon({ show = 'always' }: Props) {
  const { isConnected } = useAccount()
  
  if ((show === 'connected' && !isConnected) || (show === 'disconnected' && isConnected)) return null
  return (
    <Stack direction='row' id='wallet-with-icon' position='relative'>
      <ConnectButton accountStatus='address' showBalance={false}/> 
      {
        !isConnected &&
        <Box position='absolute' sx={{top: {xs: 8, lg: 12}, right: {xs: 'calc(50% - 65px)', lg: 22}}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="21" viewBox="0 0 22 21" fill="none">
            <path d="M16.6242 6.96094H4.77708C3.79562 6.96094 3 7.75656 3 8.73801V15.8463C3 16.8278 3.79562 17.6234 4.77708 17.6234H16.6242C17.6057 17.6234 18.4013 16.8278 18.4013 15.8463V8.73801C18.4013 7.75656 17.6057 6.96094 16.6242 6.96094Z" stroke="white" strokeLinejoin="round"/>
            <path d="M16.4525 6.9612V5.85053C16.4524 5.57812 16.3922 5.30908 16.2761 5.06262C16.1601 4.81616 15.9911 4.59835 15.7812 4.42473C15.5713 4.2511 15.3256 4.12594 15.0618 4.05818C14.798 3.99042 14.5224 3.98173 14.2548 4.03272L4.50459 5.69688C4.08117 5.77757 3.69919 6.00349 3.42452 6.33568C3.14985 6.66787 2.99971 7.0855 3 7.51653V9.33063" stroke="white" strokeLinejoin="round"/>
            <path d="M14.8468 13.4769C14.6125 13.4769 14.3835 13.4074 14.1886 13.2772C13.9938 13.147 13.842 12.962 13.7523 12.7455C13.6626 12.529 13.6392 12.2908 13.6849 12.061C13.7306 11.8312 13.8434 11.6201 14.0091 11.4544C14.1748 11.2887 14.3859 11.1759 14.6157 11.1302C14.8455 11.0845 15.0837 11.1079 15.3002 11.1976C15.5167 11.2873 15.7017 11.4391 15.8319 11.6339C15.9621 11.8288 16.0315 12.0578 16.0315 12.2921C16.0315 12.6063 15.9067 12.9077 15.6845 13.1299C15.4624 13.352 15.161 13.4769 14.8468 13.4769Z" fill="white"/>
          </svg>
        </Box>
      }
    </Stack>
  )
}
