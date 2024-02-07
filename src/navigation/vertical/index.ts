// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Modules',
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
          path: '/apps/analytics-1'
        },
        {
          title: 'Analytics 2',
          path: '/apps/analytics-2'
        },
        {
          title: 'Analytics 3',
          path: '/apps/analytics-3'
        },
      ]
    },
  ]
}

export default navigation
