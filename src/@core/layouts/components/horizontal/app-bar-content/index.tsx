// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import MuiToolbar, { ToolbarProps } from '@mui/material/Toolbar'

// ** Type Import
import { LayoutProps, HorizontalLayoutProps } from 'src/@core/layouts/types'

// ** Import from Next
import Image from 'next/image'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'
import Navigation from '../navigation'

interface Props {
  hidden: LayoutProps['hidden']
  settings: LayoutProps['settings']
  saveSettings: LayoutProps['saveSettings']
  appBarContent: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['appBar']>['content']
  appBarBranding: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['appBar']>['branding']
  horizontalLayoutProps: HorizontalLayoutProps | undefined
}

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8)
}))

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

const AppBarContent = (props: Props) => {
  // ** Props
  const { appBarContent: userAppBarContent, appBarBranding: userAppBarBranding, settings, horizontalLayoutProps } = props
  const userNavMenuContent = horizontalLayoutProps?.navMenu?.content

  
  // ** Vars
  const { skin, appBar, navHidden, appBarBlur, contentWidth } = settings
  // ** Hooks
  const theme = useTheme()

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {userAppBarBranding ? (
        userAppBarBranding(props)
      ) : (
        <LinkStyled href='/'>
          <Image src='/images/logos/logo.svg' alt='TrenFi Logo' sizes="100vw"
            width={207}
            height={24}
            style={{
              width: '100%',
              height: 'auto',
              minHeight: 32
            }}
            priority />
        </LinkStyled>
      )}
      {navHidden ? null : (
        <Box className='layout-horizontal-nav' sx={{ width: '100%', ...horizontalLayoutProps?.navMenu?.sx }}>
          <Toolbar
            className='horizontal-nav-content-container'
            sx={{
              mx: 'auto',
              display: 'flex', 
              justifyContent: 'center', 
              ...(contentWidth === 'boxed' && { '@media (min-width:1440px)': { maxWidth: 1440 } }),
              minHeight: `${(theme.mixins.toolbar.minHeight as number) - 4 - (skin === 'bordered' ? 1 : 0)}px !important`
            }}
          >
            {(userNavMenuContent && userNavMenuContent(props)) || (
              <Navigation
                {...props}
                horizontalNavItems={
                  (horizontalLayoutProps as NonNullable<LayoutProps['horizontalLayoutProps']>).navMenu?.navItems
                }
              />
            )}
          </Toolbar>
        </Box>
      )}
      {userAppBarContent ? userAppBarContent(props) : null}
    </Box>
  )
}

export default AppBarContent
