import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Provider } from '@ethersproject/abstract-provider'
import { FallbackProvider } from '@ethersproject/providers'
import { useAccount, useChainId, useWalletClient, Config } from 'wagmi'
import type { Account, Chain, Client, Transport } from 'viem'
import { providers } from 'ethers'

import { BlockPolledLiquityStore, EthersLiquity, EthersLiquityWithStore, _connectByChainId } from '@/lib-ethers'

import { LiquityFrontendConfig, getConfig } from '../configs'
import { BatchedProvider } from './providers/BatchingProvider'

type ProtocolContextValue = {
  config: LiquityFrontendConfig
  account: string
  provider: Provider
  protocol: EthersLiquityWithStore<BlockPolledLiquityStore>
}

const ProtocolContext = createContext<ProtocolContextValue | undefined>(undefined)

type ProtocolProviderProps = {
  children: React.ReactNode
  loader?: React.ReactNode
  unsupportedNetworkFallback?: React.ReactNode
  unsupportedMainnetFallback?: React.ReactNode
}

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  if (client) {
    const { account, chain, transport } = client
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address
    }
    const provider = new providers.Web3Provider(transport, network)
    const signer = provider.getSigner(account.address)
    return signer
  }
}

// export async function useEthersSigner() {
//   const { data: client } = useWalletClient()
//   return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
// }

export const ProtocolProvider: React.FC<ProtocolProviderProps> = ({
  children,
  // loader,
  unsupportedNetworkFallback,
  unsupportedMainnetFallback
}) => {
  // const provider = useProvider<FallbackProvider>();
  // const signer = useSigner();
  const { connector, address: account } = useAccount()
  const chainId = useChainId()
  // const {data : signer} = useWalletClient()
  const [provider, setProvider] = useState<providers.BaseProvider | undefined>(undefined)
  const [config, setConfig] = useState<LiquityFrontendConfig>()

  const { data: client } = useWalletClient()
  console.log('client', client)
  const signer = clientToSigner(client!)

  const connection = useMemo(() => {
    if (config && account && connector && signer && provider) {
      // const provider = connector?.getProvider()

      const batchedProvider = new BatchedProvider(provider, chainId)
      // batchedProvider._debugLog = true;
      // console.log('batchedProvider', batchedProvider)
      try {
        return _connectByChainId(batchedProvider, signer, chainId, {
          userAddress: account,
          frontendTag: config.frontendTag,
          useStore: 'blockPolled'
        })
      } catch (err) {
        console.error(err)
      }
    }
  }, [config, signer, account, chainId, connector, provider])

  useEffect(() => {
    if (connector) {
      const getProvider = async () => {
        const provider = await connector?.getProvider()
        setProvider(provider)
      }

      getProvider()
    }
    getConfig().then(setConfig)
  }, [connector])

  if (!config || !signer || !account) {
    // return <>{loader}</>
    return <></>
  }

  if (config.testnetOnly && chainId === 1) {
    return <>{unsupportedMainnetFallback}</>
  }

  if (!connection) {
    return <>{unsupportedNetworkFallback}</>
  }

  const protocol = EthersLiquity._from(connection)
  protocol.store.logging = true

  console.log('connection', connection)
  console.log('config', config)
  console.log('liquity', protocol)

  return (
    <ProtocolContext.Provider value={{ config, account, provider: connection.provider, protocol }}>
      {children}
    </ProtocolContext.Provider>
  )
}

export const useProtocol = () => {
  const protocolContext = useContext(ProtocolContext)

  if (!protocolContext) {
    throw new Error('You must provide a LiquityContext via LiquityProvider')
  }

  return protocolContext
}
