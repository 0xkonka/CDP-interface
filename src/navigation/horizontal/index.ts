// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => {
  return [
    {
      title: 'Pools',
      icon: 'pools',
      path: '/modules'
    },
    {
      title: 'Positions',
      icon: 'positions',
      path: '/positions'
    },
    {
      title: 'Stake',
      icon: 'stake',
      path: '/stake'
    },
    {
      title: 'Swap',
      icon: 'swap',
      path: '/swap'
    },
    {
      title: 'Farm',
      icon: 'farm',
      path: '/farm'
    },
    {
      title: 'Governance',
      icon: 'governance',
      path: '/governance'
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
