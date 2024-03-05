import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

type WalletConnectorProps = {
  children: React.ReactNode
  loader?: React.ReactNode
}

export const WalletConnector: React.FC<WalletConnectorProps> = ({ children }) => {
  const { isConnected, address } = useAccount()

  return (
    <div>
      <div className='flex w-full flex-col items-center'>{isConnected ? children : <ConnectButton />}</div>
    </div>
  )
}
