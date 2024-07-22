// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    // {
    //   title: 'Dashboard',
    //   icon: 'dashboard',
    //   path: '/dashboard'
    // },
    {
      title: 'Modules',
      icon: 'modules',
      path: '/modules'
    },
    {
      title: 'Earn',
      icon: 'earn',
      path: '/earn'
    },
    // {
    //   title: 'Points',
    //   icon: 'points',
    //   path: '/points'
    // },
    {
      title: 'Referrals',
      icon: 'referrals',
      path: '/referrals'
    },
    {
      title: 'Faucet',
      icon: 'faucet',
      path: '/faucet'
    }
    // {
    //   title: 'Swap',
    //   icon: 'swap',
    //   path: '/swap'
    // },
    // {
    //   title: 'Analytics',
    //   icon: 'analytics',
    //   children: [
    //     {
    //       title: 'Liquidation',
    //       path: '/liquidation'
    //     }
    //   ]
    // },
  ]
}

export default navigation
