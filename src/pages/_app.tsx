// ** React Imports 0xd012930642103A5C4EC173eC47E6412DbCA4D158
import { ReactNode, useEffect, useState } from 'react'

// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
// ** Web3 Modules Import
import {
  connectorsForWallets,
  getDefaultConfig,
  RainbowKitProvider,
  lightTheme,
  darkTheme,
  Theme,
  getDefaultWallets
} from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  injectedWallet,
  metaMaskWallet,
  braveWallet,
  coinbaseWallet,
  walletConnectWallet,
  ledgerWallet,
  rainbowWallet,
  argentWallet,
  trustWallet
} from '@rainbow-me/rainbowkit/wallets'
import { Chain } from '@rainbow-me/rainbowkit'

import { http, WagmiProvider } from 'wagmi'
import { mainnet, goerli, sepolia } from 'wagmi/chains'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import 'src/configs/i18n'
import themeConfig from 'src/configs/themeConfig'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

import 'src/iconify-bundle/icons-bundle-react'

// ** Global css styles
import '../../styles/globals.css'
import '../../styles/rainbowwallet.css'
import '@rainbow-me/rainbowkit/styles.css'
import { ProtocolProvider } from '@/context/ProtocolProvider/ProtocolProvider'
import { GlobalProvider } from '@/context/GlobalContext'
import { ReferralProvider } from '@/context/ReferralContext'
import { WalletConnector } from '@/views/components/WalletConnector'
import { createPublicClient } from 'viem'
import { StabilityPoolProvider } from '@/context/StabilityPoolProvider/StabilityPoolProvider'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)

  const setConfig = Component.setConfig ?? undefined

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{`${themeConfig.templateName}`}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName} – TrenFi – is the DeFi Application based on Tren Finance.`}
        />
        <meta name='keywords' content='DeFi, TrenFi, Tren Finance, TrenFinance App' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <Web3Provider>
        {/* <WalletConnector> */}
        <ProtocolProvider>
          <StabilityPoolProvider>
            <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
              <SettingsConsumer>
                {({ settings }) => {
                  return (
                    <ThemeComponent settings={settings}>
                      <GlobalProvider>
                        <ReferralProvider>
                          {getLayout(<Component {...pageProps} />)}
                          <ReactHotToast>
                            <Toaster
                              position={settings.toastPosition}
                              toastOptions={{ className: 'react-hot-toast' }}
                            />
                          </ReactHotToast>
                        </ReferralProvider>
                      </GlobalProvider>
                    </ThemeComponent>
                  )
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </StabilityPoolProvider>
        </ProtocolProvider>
        {/* </WalletConnector> */}
      </Web3Provider>
    </CacheProvider>
  )
}

export default App

// Web3 Configs

const projectId = '2112f934dd189c5ea9c90e2d55b04bb5'
const { wallets } = getDefaultWallets()

export const wagmiConfig = getDefaultConfig({
  appName: 'Tren Finance',
  projectId,
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [argentWallet, trustWallet, ledgerWallet]
    }
  ],
  chains: [sepolia],
  transports: {
    [goerli.id]: http('https://goerli.infura.io/v3/118cc3d82f0c4673bb11fef068b8c5d5'),
    [sepolia.id]: http('https://rpc-sepolia.rockx.com')
  }
  // ssr: true
})
const queryClient = new QueryClient()

// Web3Provider
export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()} initialChain={5}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
