// ** React Imports
import { ElementType, Fragment } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import MuiListItem, { ListItemProps } from '@mui/material/ListItem'

// ** Third Party Imports
import clsx from 'clsx'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { NavLink } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import CanViewNavLink from 'src/layouts/components/acl/CanViewNavLink'

// ** Util Imports
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { handleURLQueries } from 'src/@core/layouts/utils'
import { useAccount } from 'wagmi'
import { showToast } from '@/hooks/toasts'
import { usePoint } from '@/context/PointContext'

interface Props {
  item: NavLink
  settings: Settings
  hasParent: boolean
}

const ListItem = styled(MuiListItem)<
  ListItemProps & { component?: ElementType; href: string; target?: '_blank' | undefined; passHref?: boolean; }
>(({ theme }) => ({
  width: 'auto',
  borderRadius: theme.shape.borderRadius,
  '&:focus-visible': {
    outline: 0,
    backgroundColor: theme.palette.action.focus
  }
}))

const HorizontalNavLink = (props: Props) => {
  // ** Props
  const { item, settings, hasParent } = props
  const {isConnected} = useAccount()
  const { isUserRedeemed } = usePoint()

  // ** Hook & Vars
  const router = useRouter()
  const { navSubItemIcon, menuTextTruncate } = themeConfig

  const icon = item.icon ? item.icon : navSubItemIcon

  const Wrapper = !hasParent ? List : Fragment

  const isNavLinkActive = () => {
    if (router.pathname === item.path || handleURLQueries(router, item.path)) {
      return true
    } else {
      return false
    }
  }

  return (
    <CanViewNavLink navLink={item}>
      <Wrapper {...(!hasParent ? { component: 'div', sx: { py: settings.skin === 'bordered' ? 2 : 2.75 } } : {})}>
        <ListItem
          component={Link}
          passHref 
          disabled={item.disabled}
          {...(item.disabled && { tabIndex: -1 })}
          className={clsx({ active: isNavLinkActive() })}
          target={item.openInNewTab ? '_blank' : undefined}
          href={item.path === undefined ? '/' : `${item.path}`}
          onClick={e => {
            if(!isConnected) {
              showToast('success', 'Welcome', 'You should connect wallet to view protocol.', 3000)
            }
            else if(!isUserRedeemed) {
              showToast('success', 'Welcome', 'You should redeem the code to view protocol.', 3000)
            }
            if (item.path === undefined) {
              e.preventDefault()
              e.stopPropagation()
            }
          }}
          sx={{
            px: 6,
            ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' }),
            ...(!hasParent
              ? {
                  '&.active, &.active:hover': {
                    '&:focus-visible': {
                      background: theme =>
                        `linear-gradient(72.47deg, ${theme.palette.primary.dark} 22.16%, ${hexToRGBA(
                          theme.palette.primary.dark,
                          0.7
                        )} 76.47%)`
                    },
                    '& .MuiTypography-root, & .MuiListItemIcon-root': {
                      // color: theme => theme.palette.primary.main,
                      color: 'white',
                      fontWeight: 600,
                    }
                  }
                }
              : {
                  mx: 2,
                  width: theme => `calc(100% - ${theme.spacing(2 * 2)})`,
                  '&.active, &.active:hover': {
                    '&:focus-visible': {
                      backgroundColor: theme => hexToRGBA(theme.palette.primary.main, 0.24)
                    }
                  }
                })
          }}
        >
          <Box sx={{ gap: 2, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                ...(menuTextTruncate && { overflow: 'hidden' })
              }}
            >
              <ListItemIcon sx={{ mr: 2, color: 'text.secondary' }}>
                <UserIcon icon={icon} fontSize={icon === navSubItemIcon ? '0.625rem' : '1.375rem'} />
              </ListItemIcon>
              <Typography {...(menuTextTruncate && { noWrap: true })} sx={{ fontSize: 16, fontWeight: 500, color: '#C6C6C7', lineHeight: '19px' }}>
                <Translations text={item.title} />
              </Typography>
            </Box>
            {item.badgeContent ? (
              <Chip
                size='small'
                label={item.badgeContent}
                color={item.badgeColor || 'primary'}
                sx={{ height: 22, minWidth: 22, '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' } }}
              />
            ) : null}
          </Box>
        </ListItem>
      </Wrapper>
    </CanViewNavLink>
  )
}

export default HorizontalNavLink
