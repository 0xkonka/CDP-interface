// ** MUI Imports
import Fab from '@mui/material/Fab'
import AppBar from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import { Stack, Typography, Link } from '@mui/material'
import MuiToolbar, { ToolbarProps } from '@mui/material/Toolbar'
import useScrollTrigger from '@mui/material/useScrollTrigger'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types'

// ** Components
import Footer from './components/shared-components/footer'
import ScrollToTop from 'src/@core/components/scroll-to-top'
import AppBarContent from './components/horizontal/app-bar-content'
import { useRouter } from 'next/router';

// ** Util Import
import { hexToRGBA } from '../utils/hex-to-rgba'
import { useState } from 'react'

const HorizontalLayoutWrapper = styled('div')({
  height: '100%',
  display: 'flex',
  backgroundColor: '#080B0B',
  ...(themeConfig.horizontalMenuAnimation && { overflow: 'clip' })
})

const MainContentWrapper = styled(Box)<BoxProps>({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
})

const Toolbar = styled(MuiToolbar)<ToolbarProps>(({ theme }) => ({
  width: '100%',
  padding: `${theme.spacing(0, 6)} !important`,
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(4)
  },
  [theme.breakpoints.down('xs')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}))

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  // width: '100%',
  padding: theme.spacing(6),
  paddingBottom: theme.spacing(12),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const HorizontalLayout = (props: LayoutProps) => {
   
  // ** Props
   const {
    hidden,
    children,
    settings,
    scrollToTop,
    footerProps,
    saveSettings,
    contentHeightFixed,
    horizontalLayoutProps,
  } = props

  // ** Vars
  const { skin, appBar, navHidden, appBarBlur, contentWidth } = settings
  const appBarProps = horizontalLayoutProps?.appBar?.componentProps

  const [showBar, setShowBar] = useState(true)

   // ** init trigger for scroll down 100px
  const trigger = useScrollTrigger({
    threshold: 100,
    disableHysteresis: true
  })


  let userAppBarStyle = {}
  if (appBarProps && appBarProps.sx) {
    userAppBarStyle = appBarProps.sx
  }
  const userAppBarProps = Object.assign({}, appBarProps)
  delete userAppBarProps.sx

  const router = useRouter()
  const isHomePath = router.pathname === '/';
  const showWater = router.pathname === '/faucet' || router.pathname === '/referrals';

  const closeAnnouncementBar = () => {
    setShowBar(false)
  }

  return (
    <HorizontalLayoutWrapper className='layout-wrapper'>
      <iframe style={{display: showWater ? 'block': 'none', position: 'fixed', width: '100%', height: 'calc(100% + 60px)'}} src='https://my.spline.design/waterv2copy-ff5ef8dc1c68ec421f00c0aeb688e639/' frameBorder='0' width='100%' height='100%'></iframe>
      <MainContentWrapper className='layout-content-wrapper' sx={{ ...(contentHeightFixed && { maxHeight: '100vh' }), zIndex: 10 }}>
        {/* Navbar (or AppBar) and Navigation Menu Wrapper */}
        <AppBar
          color='default'
          elevation={skin === 'bordered' ? 0 : 2}
          className='layout-navbar-and-nav-container'
          position={appBar === 'fixed' ? 'sticky' : 'static'}
          sx={{
            alignItems: 'center',
            color: 'text.primary',
            justifyContent: 'center',
            ...(appBar === 'static' && { zIndex: 13 }),
            transition: 'border-bottom 0.2s ease-in-out',
            ...(appBarBlur && { backdropFilter: 'blur(6px)' }),
            //backgroundColor: trigger ? '#101818' : 'transparent',       // Topbar background - DesktopView.
            backgroundColor: 'transparent',
            // ...(skin === 'bordered' && { borderBottom: theme => `1px solid ${theme.palette.divider}` }),
            ...userAppBarStyle
          }}
          {...userAppBarProps}
        >
          {/* Navbar / AppBar */}
          <Box
            className='layout-navbar'
            sx={{
              width: '100%'
              // ...(navHidden ? {} : { borderBottom: theme => `1px solid ${theme.palette.divider}` })
            }}
          >
            <Box sx={{ width: '100%', background: '#67DAB1'}} display={showBar ? 'block' : 'none'}>
              <Stack sx={{
                position: 'relative', width: '100%', py: 3, justifyContent: 'center',
                mx: 'auto', 
                ...(contentWidth === 'boxed' && { 
                  '@media (min-width:1440px)': { maxWidth: '95%' },
                  '@media (min-width:1680px)': { maxWidth: '95%' }, 
                  '@media (min-width:2560px)': { maxWidth: '1920px !important' },
                })
              }}>
                <Typography sx={{color: '#000', fontWeight: 500, textAlign: 'center'}}>
                  Tren has been accepted into Mode Network’s Yield Accelerator.&nbsp;
                  <Link style={{fontWeight: 600, color: '#000'}} href='https://blog.tren.finance/mode-announcement' target='_blank'>Read more</Link>
                </Typography>
                {/* <Box sx={{width: 16, height: 16, position: 'absolute', right: 24, top: '50%', transform: 'translate(0, -50%)', cursor: 'pointer'}} onClick={(closeAnnouncementBar)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8.9944 7.9958L14.8025 2.18772C14.9301 2.05561 15.0007 1.87868 14.9991 1.69503C14.9975 1.51137 14.9238 1.33569 14.7939 1.20582C14.6641 1.07596 14.4884 1.00229 14.3047 1.00069C14.1211 0.999099 13.9442 1.0697 13.8121 1.19729L8.00398 7.00537L2.1959 1.19589C2.06379 1.0683 1.88686 0.997698 1.70321 0.999294C1.51955 1.00089 1.34387 1.07455 1.214 1.20442C1.08414 1.33429 1.01047 1.50997 1.00888 1.69362C1.00728 1.87728 1.07788 2.05421 1.20547 2.18632L7.01355 7.9958L1.20407 13.8039C1.13717 13.8685 1.08381 13.9458 1.0471 14.0312C1.01039 14.1167 0.991069 14.2086 0.990261 14.3016C0.989453 14.3946 1.00717 14.4868 1.04239 14.5729C1.07761 14.659 1.12962 14.7372 1.19539 14.803C1.26116 14.8687 1.33936 14.9208 1.42544 14.956C1.51153 14.9912 1.60376 15.0089 1.69676 15.0081C1.78977 15.0073 1.88168 14.988 1.96714 14.9513C2.05259 14.9146 2.12989 14.8612 2.1945 14.7943L8.00398 8.98622L13.8121 14.7943C13.9442 14.9219 14.1211 14.9925 14.3047 14.9909C14.4884 14.9893 14.6641 14.9156 14.7939 14.7858C14.9238 14.6559 14.9975 14.4802 14.9991 14.2966C15.0007 14.1129 14.9301 13.936 14.8025 13.8039L8.9944 7.9958Z" fill="black"/>
                  </svg>
                </Box> */}
              </Stack>
            </Box>
            <Toolbar
              className='navbar-content-container'
              sx={{
                mx: 'auto',
                ...(contentWidth === 'boxed' && { 
                  '@media (min-width:1440px)': { maxWidth: '95%' },
                  '@media (min-width:1680px)': { maxWidth: '95%' }, 
                  '@media (min-width:2560px)': { maxWidth: '1920px !important' },
                }),
                minHeight: theme => `${(theme.mixins.toolbar.minHeight as number) - 2}px !important`
              }}
            >
              <AppBarContent
                {...props}
                hidden={hidden}
                settings={settings}
                saveSettings={saveSettings}
                appBarContent={horizontalLayoutProps?.appBar?.content}
                appBarBranding={horizontalLayoutProps?.appBar?.branding}
                horizontalLayoutProps={horizontalLayoutProps}
              />
            </Toolbar>
          </Box>
        </AppBar>
        {/* Content */}
        <ContentWrapper
          className='layout-page-content'
          sx={{
            width: '100%',
            position: 'relative',
            ...(contentHeightFixed && { display: 'flex', overflow: 'hidden' }),
            ...(contentWidth === 'boxed' && {
              mx: 'auto',
              '@media (min-width:1200px)': { maxWidth: '100%' },
              '@media (min-width:1440px)': { maxWidth: '95%' },
              '@media (min-width:1680px)': { maxWidth: '95%' },
              '@media (min-width:2560px)': { maxWidth: '1920px !important' },
            })
          }}
        >
          {children}
        </ContentWrapper>
        {/* Footer */}
        {!isHomePath && (
          <Footer {...props} footerStyles={footerProps?.sx} footerContent={footerProps?.content} />
        )}
        {/* Scroll to top button */}
        {scrollToTop ? (
          scrollToTop(props)
        ) : (
          <ScrollToTop className='mui-fixed'>
            <Fab size='small' aria-label='scroll back to top' sx={{
              backgroundColor: 'transparent',
              color: theme => theme.palette.primary.main,
              border: theme => `solid 1px ${theme.palette.primary.main}`,
              '&:hover': {
                backgroundColor: theme => theme.palette.primary.main,
                color: '#000',
                border: 'none'
              }
            }}>
              <Icon icon='tabler:arrow-up' />
            </Fab>
          </ScrollToTop>
        )}
      </MainContentWrapper>
    </HorizontalLayoutWrapper>
  )
}

export default HorizontalLayout
