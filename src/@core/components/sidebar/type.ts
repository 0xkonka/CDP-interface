// ** React Imports
import { ReactNode } from 'react'

export type SidebarType = {
  show: boolean
  handleOpen?: () => void
  children: ReactNode
  onClose?: () => void
  hideBackdrop?: boolean
  backDropClick?: () => void
  direction?: 'left' | 'right'
}
