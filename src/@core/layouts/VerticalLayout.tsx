// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Fab from '@mui/material/Fab'
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import {Stack, Typography, Link} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types'

// ** Components
import Footer from './components/shared-components/footer'
import AppBar from './components/vertical/appBar'
import Navigation from './components/vertical/navigation'
import ScrollToTop from 'src/@core/components/scroll-to-top'

const VerticalLayoutWrapper = styled('div')({
  height: '100%',
  display: 'flex'
})

const MainContentWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  backgroundColor: '#080B0B',
}))

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  paddingTop: theme.spacing(8),
  paddingLeft: theme.spacing(8),
  paddingRight: theme.spacing(8),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const VerticalLayout = (props: LayoutProps) => {
  // ** Props
  const { hidden, settings, children, scrollToTop, footerProps, contentHeightFixed, verticalLayoutProps } = props

  // ** Vars
  const { skin, navHidden, contentWidth } = settings
  const navigationBorderWidth = skin === 'bordered' ? 1 : 0
  const { navigationSize, disableCustomizer, collapsedNavigationSize } = themeConfig
  const navWidth = navigationSize
  const collapsedNavWidth = collapsedNavigationSize

  // ** States
  const [navVisible, setNavVisible] = useState<boolean>(false)

  // ** Toggle Functions
  const toggleNavVisibility = () => setNavVisible(!navVisible)

  return (
    <>
      <VerticalLayoutWrapper className='layout-wrapper'>
        {/* Navigation Menu */}
        <iframe style={{position: 'fixed', width: '100%', height: 'calc(100% + 60px)'}} src='https://my.spline.design/waterv2copy-ff5ef8dc1c68ec421f00c0aeb688e639/' frameBorder='0' width='100%' height='100%'></iframe>
        {navHidden && !(navHidden && settings.lastLayout === 'horizontal') ? null : (
          <Navigation
            // navWidth={navWidth}
            navWidth='100%'
            navVisible={navVisible}
            setNavVisible={setNavVisible}
            collapsedNavWidth={collapsedNavWidth}
            toggleNavVisibility={toggleNavVisibility}
            navigationBorderWidth={navigationBorderWidth}
            navMenuContent={verticalLayoutProps.navMenu.content}
            navMenuBranding={verticalLayoutProps.navMenu.branding}
            menuLockedIcon={verticalLayoutProps.navMenu.lockedIcon}
            verticalNavItems={verticalLayoutProps.navMenu.navItems}
            navMenuProps={verticalLayoutProps.navMenu.componentProps}
            menuUnlockedIcon={verticalLayoutProps.navMenu.unlockedIcon}
            afterNavMenuContent={verticalLayoutProps.navMenu.afterContent}
            beforeNavMenuContent={verticalLayoutProps.navMenu.beforeContent}
            footerProps={footerProps}
            {...props}
          />
        )}
        <MainContentWrapper
          className='layout-content-wrapper'
          sx={{ ...(contentHeightFixed && { maxHeight: '100vh' }) }}
        >
          {/* Announcement Bar */}
          <Box sx={{ width: '100%', background: '#67DAB1', zIndex: 10}}>
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
                  <Link style={{fontWeight: 600, color: '#000'}} href='https://mode.mirror.xyz/lQu3X5t-cKve4Yu2gfa49rPRS_0rhMq-4zXUyFCPH8M' target='_blank'>Read more</Link>
                </Typography>
                {/* <Box sx={{width: 16, height: 16, position: 'absolute', right: 24, top: '50%', transform: 'translate(0, -50%)', cursor: 'pointer'}} onClick={(closeAnnouncementBar)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8.9944 7.9958L14.8025 2.18772C14.9301 2.05561 15.0007 1.87868 14.9991 1.69503C14.9975 1.51137 14.9238 1.33569 14.7939 1.20582C14.6641 1.07596 14.4884 1.00229 14.3047 1.00069C14.1211 0.999099 13.9442 1.0697 13.8121 1.19729L8.00398 7.00537L2.1959 1.19589C2.06379 1.0683 1.88686 0.997698 1.70321 0.999294C1.51955 1.00089 1.34387 1.07455 1.214 1.20442C1.08414 1.33429 1.01047 1.50997 1.00888 1.69362C1.00728 1.87728 1.07788 2.05421 1.20547 2.18632L7.01355 7.9958L1.20407 13.8039C1.13717 13.8685 1.08381 13.9458 1.0471 14.0312C1.01039 14.1167 0.991069 14.2086 0.990261 14.3016C0.989453 14.3946 1.00717 14.4868 1.04239 14.5729C1.07761 14.659 1.12962 14.7372 1.19539 14.803C1.26116 14.8687 1.33936 14.9208 1.42544 14.956C1.51153 14.9912 1.60376 15.0089 1.69676 15.0081C1.78977 15.0073 1.88168 14.988 1.96714 14.9513C2.05259 14.9146 2.12989 14.8612 2.1945 14.7943L8.00398 8.98622L13.8121 14.7943C13.9442 14.9219 14.1211 14.9925 14.3047 14.9909C14.4884 14.9893 14.6641 14.9156 14.7939 14.7858C14.9238 14.6559 14.9975 14.4802 14.9991 14.2966C15.0007 14.1129 14.9301 13.936 14.8025 13.8039L8.9944 7.9958Z" fill="black"/>
                  </svg>
                </Box> */}
              </Stack>
          </Box>
          {/* AppBar Component */}
          <AppBar
            toggleNavVisibility={toggleNavVisibility}
            appBarContent={verticalLayoutProps.appBar?.content}
            appBarProps={verticalLayoutProps.appBar?.componentProps}
            {...props}
          />

          {/* Content */}
          <ContentWrapper
            className='layout-page-content'
            sx={{
              position: 'relative',
              ...(contentHeightFixed && {
                overflow: 'hidden',
                '& > :first-of-type': { height: '100%' }
              }),
              ...(contentWidth === 'boxed' && {
                mx: 'auto',
                '@media (min-width:1440px)': { maxWidth: 1440 },
                '@media (min-width:1200px)': { maxWidth: '100%' }
              }),
              overflowY: 'scroll',
              overflowX: 'hidden',
              '&::-webkit-scrollbar': {
                width: '6px', // Adjust as needed
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent', // Adjust track color as needed
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: (theme) => theme.palette.primary.main, // Adjust thumb color as needed
              }
            }}
          >
            {children}
            {/* Footer */}
            <Footer {...props} footerStyles={footerProps?.sx} footerContent={footerProps?.content} />
          </ContentWrapper>
        </MainContentWrapper>
      </VerticalLayoutWrapper>


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
    </>
  )
}

export default VerticalLayout
