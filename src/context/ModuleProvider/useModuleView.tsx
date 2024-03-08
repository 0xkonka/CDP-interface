import React, { useState, useCallback, useEffect, useRef } from 'react'
import { multicall, readContract, getBalance } from '@wagmi/core'
import { ModuleViewContext } from './ModuleViewContext'
import { ModuleEvent, ModuleView } from '@/types'
import MODULE_MANAGER_ABI from '@/abi/ModuleManager.json'
import { MODULE_MANAGER } from '@/configs/address'
import { wagmiConfig } from '@/pages/_app'
import { useAccount, useChainId } from 'wagmi'
import { BigNumber } from 'ethers'

type ModuleEventTransitions = Record<ModuleView, Partial<Record<ModuleEvent, ModuleView>>>

const transitions: ModuleEventTransitions = {
  NONE: {
    OPEN_MODULE_PRESSED: 'OPENING',
    MODULE_OPENED: 'ACTIVE'
  },
  LIQUIDATED: {
    OPEN_MODULE_PRESSED: 'OPENING',
    MODULE_SURPLUS_COLLATERAL_CLAIMED: 'NONE',
    MODULE_OPENED: 'ACTIVE'
  },
  REDEEMED: {
    OPEN_MODULE_PRESSED: 'OPENING',
    MODULE_SURPLUS_COLLATERAL_CLAIMED: 'NONE',
    MODULE_OPENED: 'ACTIVE'
  },
  OPENING: {
    CANCEL_ADJUST_MODULE_PRESSED: 'NONE',
    MODULE_OPENED: 'ACTIVE'
  },
  ADJUSTING: {
    CANCEL_ADJUST_MODULE_PRESSED: 'ACTIVE',
    MODULE_ADJUSTED: 'ACTIVE',
    MODULE_CLOSED: 'NONE',
    MODULE_LIQUIDATED: 'LIQUIDATED',
    MODULE_REDEEMED: 'REDEEMED'
  },
  CLOSING: {
    CANCEL_ADJUST_MODULE_PRESSED: 'ACTIVE',
    MODULE_CLOSED: 'NONE',
    MODULE_ADJUSTED: 'ACTIVE',
    MODULE_LIQUIDATED: 'LIQUIDATED',
    MODULE_REDEEMED: 'REDEEMED'
  },
  ACTIVE: {
    ADJUST_MODULE_PRESSED: 'ADJUSTING',
    CLOSE_MODULE_PRESSED: 'CLOSING',
    MODULE_CLOSED: 'NONE',
    MODULE_LIQUIDATED: 'LIQUIDATED',
    MODULE_REDEEMED: 'REDEEMED'
  }
}

type UserModuleStatus = 'nonExistent' | 'active' | 'closedByOwner' | 'closedByLiquidation' | 'closedByRedemption'

type ModuleStateEvents = Partial<Record<UserModuleStatus, ModuleEvent>>

const moduleStatusEvents: ModuleStateEvents = {
  active: 'MODULE_OPENED',
  closedByOwner: 'MODULE_CLOSED',
  closedByLiquidation: 'MODULE_LIQUIDATED',
  closedByRedemption: 'MODULE_REDEEMED'
}

const transition = (view: ModuleView, event: ModuleEvent): ModuleView => {
  const nextView = transitions[view][event] ?? view
  return nextView
}

const getInitialView = (moduleStatus: UserModuleStatus): ModuleView => {
  if (moduleStatus === 'closedByLiquidation') {
    return 'LIQUIDATED'
  }
  if (moduleStatus === 'closedByRedemption') {
    return 'REDEEMED'
  }
  if (moduleStatus === 'active') {
    return 'ACTIVE'
  }
  return 'NONE'
}

const getUserModuleStatus = (num: number): UserModuleStatus => {
  switch (num) {
    case 0:
      return 'nonExistent'
    case 1:
      return 'active'
    case 2:
      return 'closedByOwner'
    case 3:
      return 'closedByLiquidation'
    case 4:
      return 'closedByRedemption'
    default:
      throw new Error('Invalid module status')
  }
}

// const select = ({ module: { status } }: LiquityStoreState) => status

export interface Module {
  debt: BigNumber
  coll: BigNumber
  stake: BigNumber
  status: UserModuleStatus
  arrayIndex: BigNumber
}

export const useModuleView = (collateral: string) => {
  const chainId = useChainId()
  const { address: account } = useAccount()

  const [moduleStatus, setModuleStatus] = useState<UserModuleStatus>('active')
  const [view, setView] = useState<ModuleView>(getInitialView(moduleStatus))
  const viewRef = useRef<ModuleView>(view)

  useEffect(() => {
    if (!account || !chainId || !collateral) return
    const getModuleInfo = async () => {
      const _module: any = await readContract(wagmiConfig, {
        abi: MODULE_MANAGER_ABI,
        address: MODULE_MANAGER[chainId] as '0x{string}',
        functionName: 'Modules',
        args: [account, collateral]
      })

      const _moduleInfo: Module = {
        debt: BigNumber.from(_module[0]),
        coll: BigNumber.from(_module[1]),
        stake: BigNumber.from(_module[2]),
        status: getUserModuleStatus(_module[3]) as UserModuleStatus,
        arrayIndex:BigNumber.from(_module[4])
      }

      setModuleStatus(_moduleInfo.status)
      setView(getInitialView(_moduleInfo.status))
    }
    getModuleInfo()
  }, [chainId, account, collateral])

  const dispatchEvent = useCallback((event: ModuleEvent) => {
    const nextView = transition(viewRef.current, event)

    // console.log('dispatchEvent() [current-view, event, next-view]', viewRef.current, event, nextView)
    setView(nextView)
  }, [])

  useEffect(() => {
    viewRef.current = view
  }, [view])

  useEffect(() => {
    const event = moduleStatusEvents[moduleStatus] ?? null
    if (event !== null) {
      dispatchEvent(event)
    }
  }, [moduleStatus, dispatchEvent])

  return { view, dispatchEvent }
}
