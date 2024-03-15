import { useAccount } from 'wagmi'
import { LandingView } from '../landingView'

type WalletConnectorProps = {
  children: React.ReactNode
  loader?: React.ReactNode
}

export const WalletConnector: React.FC<WalletConnectorProps> = ({ children }) => {
  const { isConnected, address } = useAccount()

  return (
    <div>
      <div className='wallet-connect-wrapper'>
        {isConnected ? children : <LandingView />}
      </div>
    </div>
  )
}
