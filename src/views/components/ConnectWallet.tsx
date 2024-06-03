import { Stack } from '@mui/material'
import { useAccount } from 'wagmi'
import { RainbowKitProvider, darkTheme, ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

interface Props {
  show?: 'always' | 'connected' | 'disconnected'
}

export default function ConnectWallet({ show = 'always'}: Props) {
  const { isConnected } = useAccount()
  const router = useRouter()
  const paramCode = router.query?.code?.toString() || ''

  const connectedStyle = {
    px: 2, 
    background: '#1A1D1E91', 
    height: {xs: 40, md: 50}, 
    borderRadius: '6px', 
    border: 'solid 1px #2D3131'
  }
  
  useEffect(() => {
    if(router.pathname !== '/' && !isConnected) {
      router.replace('/')
    }
    if (isConnected) {
      document.cookie = "wallet-connected=true; path=/";
    } else {
      document.cookie = "wallet-connected=false; path=/";
    }
  }, [isConnected, paramCode])

  if ((show === 'connected' && !isConnected) || (show === 'disconnected' && isConnected)) return null
  return (
    <Stack direction='row' id='navigation-wallet' alignItems='center' sx={isConnected ? connectedStyle : undefined}>
      {
        isConnected &&
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 36 36" fill="none">
          <path d="M28.7516 17.6065H28.4812V14.9546C28.4812 13.3496 27.1754 12.044 25.5705 12.044H25.3801L23.8446 8.9692C23.494 8.26657 22.6768 7.94932 21.9435 8.23154L12.0365 12.044H11.0397C9.43473 12.044 8.12891 13.3496 8.12891 14.9546V26.1679C8.12891 27.7728 9.43473 29.0786 11.0397 29.0786H25.5705C27.1754 29.0786 28.4812 27.7728 28.4812 26.1679V23.5158H28.7516C29.4859 23.5158 30.0832 22.9186 30.0832 22.1842V18.938C30.0831 18.2038 29.4859 17.6065 28.7516 17.6065ZM22.1898 8.87168C22.5912 8.71676 23.0385 8.89096 23.2308 9.27569L24.6133 12.0439H13.9465L22.1898 8.87168ZM27.7952 26.1679C27.7952 27.3946 26.7972 28.3926 25.5705 28.3926H11.0397C9.81289 28.3926 8.81498 27.3946 8.81498 26.1679V14.9546C8.81498 13.728 9.81295 12.73 11.0397 12.73H25.5705C26.7972 12.73 27.7952 13.728 27.7952 14.9546V17.6065H23.9988C22.3801 17.6065 21.0462 18.9143 21.0462 20.5592C21.0462 22.1895 22.3708 23.5159 23.9988 23.5159H27.7952V26.1679ZM29.3971 22.1843C29.3971 22.5402 29.1075 22.8298 28.7516 22.8298H23.9988C22.7489 22.8298 21.7323 21.8113 21.7323 20.5592C21.7323 19.2941 22.7586 18.2926 23.9988 18.2926H28.7516C29.1075 18.2926 29.3971 18.582 29.3971 18.938V22.1843Z" fill="white"/>
          <path d="M24.3402 19.1021C23.5366 19.1021 22.8828 19.7576 22.8828 20.5635C22.8828 21.367 23.5366 22.0207 24.3402 22.0207C25.1437 22.0207 25.7975 21.367 25.7975 20.5635C25.7975 19.7576 25.1437 19.1021 24.3402 19.1021ZM24.3402 21.3347C23.915 21.3347 23.5689 20.9888 23.5689 20.5635C23.5689 20.1361 23.915 19.7881 24.3402 19.7881C24.7655 19.7881 25.1114 20.136 25.1114 20.5635C25.1114 20.9888 24.7655 21.3347 24.3402 21.3347Z" fill="white"/>
        </svg>
      }
      
      <ConnectButton accountStatus='address' showBalance={false}/> 
    </Stack>
  )
}
