// React related imports
import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react'
import * as crypto from 'crypto'

import 'cleave.js/dist/addons/cleave-phone.us'
import { useAccount } from 'wagmi'
import { signMessage } from '@wagmi/core'
import { ReferralType } from '@/lib/types'
import { wagmiConfig } from '@/pages/_app'

interface ReferralContextValue {
  inviteCodes: ReferralType[]
  isInvited: boolean
  signMsg: string
  getInviteCode: () => void
  generateInviteCode: (inviteCode: string) => void
  signReferral: (inviteCode: string) => void
}

const ReferralContext = createContext<ReferralContextValue | undefined>(undefined)

interface Props {
  children: ReactNode
}

export const ReferralProvider: React.FC<Props> = ({ children }) => {
  const { address: account } = useAccount()

  const [inviteCodes, setInviteCodes] = useState<ReferralType[]>([])
  const [isInvited, setIsInvited] = useState<boolean>(false)
  const [signMsg, setSignMsg] = useState<string>('')

  const getInviteCode = async () => {
    const res = await fetch('/api/referral?owner=' + account)
    setInviteCodes(await res.json())
  }

  const generateInviteCode = async (inviteCode: string) => {
    if (!account) return

    const inviteCodes: ReferralType = { owner: account as string, inviteCode }

    await fetch('/api/referral', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inviteCodes)
    })
  }

  const signReferral = async (inviteCode: string) => {
    // Check inviteKey exists
    const res = await fetch('/api/referral/' + inviteCode)
    const result: ReferralType = await res.json()

    if (result === null) {
      console.log('Wrong InviteCode')
    }
    if (result.redeemed) {
      console.log('InviteCode expired')
    } else {
      // If exists
      try {
        const hash = crypto.createHash('sha256')
        hash.update(result.inviteCode + result.owner + account)
        const hashCode = hash.digest('hex')

        const signMsg = await signMessage(wagmiConfig, {
          message: hashCode
        })
        
        await fetch('/api/referral/' + inviteCode, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inviteCode, redeemer: account, signMsg })
        })
      } catch (err) {
        console.log('err', err)
      }
    }
  }

  useEffect(() => {
    if (!account) return

    getInviteCode()
  }, [account])

  const value = {
    inviteCodes,
    isInvited,
    signMsg,
    getInviteCode,
    generateInviteCode,
    signReferral
  }

  return <ReferralContext.Provider value={value}>{children}</ReferralContext.Provider>
}

export const useReferral = () => {
  const context = useContext(ReferralContext)
  if (!context) {
    throw new Error(`useReferral must be used within a ReferralProvider`)
  }
  return context
}
