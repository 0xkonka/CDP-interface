// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Pools',
      icon: 'pools',
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
    {
      title: 'Swap',
      icon: 'stake',
      path: '/swap'
    },
    {
      title: 'Farm',
      icon: 'stake',
      path: '/farm'
    },
    {
      title: 'Governance',
      icon: 'stake',
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
