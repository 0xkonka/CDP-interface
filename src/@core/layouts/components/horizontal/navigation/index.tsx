// ** MUI Imports
import Box from '@mui/material/Box'

// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types'

// ** Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Menu Components
import HorizontalNavItems from './HorizontalNavItems'
import { useAccount } from 'wagmi'

// ** Types
interface Props {
  settings: LayoutProps['settings']
  horizontalNavItems: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['navMenu']>['navItems']
}

const Navigation = (props: Props) => {
  const {isConnected} = useAccount()
  return (
    <Box
      className='menu-content'
      sx={{
        display: 'flex',
        px: 2,
        background: '#1A1D1E91',
        border: 'solid 1px #2D3131',
        borderRadius: '6px',
        flexWrap: 'wrap',
        alignItems: 'center',
        '& > *': {
          '&:not(:last-child)': { mr: 1 },
          ...(themeConfig.menuTextTruncate && { maxWidth: 200 })
        }
      }}
    >
      {/* {
        isConnected && */}
        <HorizontalNavItems {...props} />
      {/* } */}
    </Box>
  )
}

export default Navigation
