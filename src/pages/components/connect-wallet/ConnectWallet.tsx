import { useAccount } from 'wagmi'
import { RainbowKitProvider, darkTheme, ConnectButton } from '@rainbow-me/rainbowkit'

interface Props {
  show?: 'always' | 'connected' | 'disconnected'
}

export default function ConnectWallet({ show = 'always' }: Props) {
  const { isConnected } = useAccount()
  console.log('isConnected', isConnected)
  if ((show === 'connected' && !isConnected) || (show === 'disconnected' && isConnected)) return null
  return (
      <ConnectButton accountStatus='address' showBalance={false}/> 
  )
}
