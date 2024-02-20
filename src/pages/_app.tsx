// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
// ** Web3 Modules Import
import {
  connectorsForWallets,
  RainbowKitProvider,
  lightTheme,
  darkTheme,
  Theme,
  getDefaultWallets
} from '@rainbow-me/rainbowkit'
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
import { mainnet, goerli } from 'wagmi/chains'
import { createConfig, configureChains, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

// ** Store Imports
import { store } from 'src/store'
import { Provider } from 'react-redux'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import 'src/configs/i18n'
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Fake-DB Import
import 'src/@fake-db'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import AclGuard from 'src/@core/components/auth/AclGuard'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import GuestGuard from 'src/@core/components/auth/GuestGuard'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext'
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
import '@rainbow-me/rainbowkit/styles.css';

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
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

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)

  const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  const aclAbilities = Component.acl ?? defaultACLObj

  return (
    <Provider store={store}>
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
        <Web3Wrapper>
          <AuthProvider>
            <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
              <SettingsConsumer>
                {({ settings }) => {
                  return (
                    <ThemeComponent settings={settings}>
                      {/* <Guard authGuard={authGuard} guestGuard={guestGuard}> */}
                      {/* <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard} authGuard={authGuard}> */}
                      {getLayout(<Component {...pageProps} />)}
                      {/* </AclGuard> */}
                      {/* </Guard> */}
                      <ReactHotToast>
                        <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                      </ReactHotToast>
                    </ThemeComponent>
                  )
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </AuthProvider>
        </Web3Wrapper>
      </CacheProvider>
    </Provider>
  )
}

export default App

// Web3 Configs
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [goerli],
  [
    // infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID !== '' && process.env.NEXT_PUBLIC_INFURA_ID }),
    // jsonRpcProvider({
    //   rpc: chain => {
    //     return {
    //       http: `${chain.rpcUrls.default}`,
    //     }
    //   },
    // }),
    publicProvider()
  ]
)

const projectId = 'e973a06523ca5ac45d042a4e0b9d73f7'

const { wallets } = getDefaultWallets({
  appName: 'Tren Finance',
  projectId,
  chains
})

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains })
    ]
  }
])

const wagmiClient = createConfig({ autoConnect: true, connectors, publicClient, webSocketPublicClient })

// Web3Wrapper
export function Web3Wrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <WagmiConfig config={wagmiClient}>
      <RainbowKitProvider
        // theme={myTheme}
        theme={darkTheme()}
        chains={chains}
        initialChain={5} // Optional, initialChain={1}, initialChain={chain.mainnet}, initialChain={gnosisChain}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
