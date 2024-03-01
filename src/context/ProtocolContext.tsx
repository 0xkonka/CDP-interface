import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Provider } from '@ethersproject/abstract-provider'
import { Config, useAccount, useChainId, useClient, useWalletClient } from 'wagmi'
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
  // loader?: React.ReactNode
}

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<Transport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    )
  return new providers.JsonRpcProvider(transport.url, network)
}

/** Hook to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider({
  chainId,
}: { chainId?: number | undefined } = {}) {
  const client = useClient<Config>({ chainId })
  return useMemo(() => clientToProvider(client as any), [client])
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

export const ProtocolProvider: React.FC<ProtocolProviderProps> = ({ children }) => {
  const { connector, address: account } = useAccount()
  const chainId = useChainId()
  // const [provider, setProvider] = useState<FallbackProvider | undefined>(undefined)
  const [config, setConfig] = useState<LiquityFrontendConfig>()
  const provider = useEthersProvider()
  const { data: client } = useWalletClient()
  const signer = clientToSigner(client!)

  const connection = useMemo(() => {
    if (config && account && connector && signer && provider) {
      const batchedProvider = new BatchedProvider(provider, chainId)
      // batchedProvider._debugLog = true;
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
    setConfig(getConfig())
  }, [connector])

  if (!config || !connection || !account) {
    return <></>
  }

  const protocol = EthersLiquity._from(connection)
  protocol.store.logging = true

  return (
    <ProtocolContext.Provider value={{ config, account, provider: connection.provider, protocol }}>
      {children}
    </ProtocolContext.Provider>
  )
}

export const useProtocol = () => {
  const protocolContext = useContext(ProtocolContext)

  if (!protocolContext) {
    throw new Error('You must provide a ProtocolContext via ProtocolProvider')
  }

  return protocolContext
}
