// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      path: '/dashboard'
    },
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
    {
      title: 'Points',
      icon: 'points',
      path: '/points'
    },

    // =========== These are for testnet only ========== //
    // {
    //   title: 'Referrals',
    //   icon: 'referrals',
    //   path: '/referrals'
    // },
    // {
    //   title: 'Faucet',
    //   icon: 'faucet',
    //   path: '/faucet'
    // }

    {
      title: 'Swap',
      icon: 'swap',
      path: '/swap'
    },
    {
      title: 'Analytics',
      icon: 'analytics',
      children: [
        {
          title: 'Analytics 1',
          path: '/analytics/analytics-1'
        },
        {
          title: 'Analytics 2',
          path: '/analytics/analytics-2'
        },
        {
          title: 'Analytics 3',
          path: '/analytics/analytics-3'
        },
      ]
    },
  ]
}

export default navigation
