import React, { ReactNode } from 'react'
import { useProtocol } from './ProtocolContext'
import { LiquityStoreProvider } from '@/lib-react'
import { TroveViewProvider } from './ModuleProvider/TroveViewProvider'
import { StabilityViewProvider } from './StabilityViewProvider.tsx/StabilityViewProvider'

interface Web3WrapperProps {
  children: ReactNode
}

export default function Web3Wrapper({ children }: Web3WrapperProps) {
  const { protocol } = useProtocol()

  return (
    <LiquityStoreProvider store={protocol.store}>
      <TroveViewProvider>
        <StabilityViewProvider>{children}</StabilityViewProvider>
      </TroveViewProvider>
    </LiquityStoreProvider>
  )
}
