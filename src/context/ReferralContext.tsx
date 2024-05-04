// React related imports
import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react'
import * as crypto from 'crypto'

import 'cleave.js/dist/addons/cleave-phone.us'
import { useAccount } from 'wagmi'
import { signMessage } from '@wagmi/core'
import { ReferralType } from '@/lib/types'
import { wagmiConfig } from '@/pages/_app'
import axios from 'axios'
import { showToast } from '@/hooks/toasts'
import { useRouter } from 'next/router'

const BE_ENDPOINT = process.env.BE_ENDPOINT || 'https://be-express-lime.vercel.app'

const REFERRAL_DISTRIBUTION = process.env.REFERRAL_DISTRIBUTION || 2

interface ReferralContextValue {
  inviteCode: string
  userReferral: ReferralType[]
  validateInviteCode: (inviteCode: string) => any
  signMsg: () => any
}

const ReferralContext = createContext<ReferralContextValue | undefined>(undefined)

interface Props {
  children: ReactNode
}

export const ReferralProvider: React.FC<Props> = ({ children }) => {
  const { address: account, isConnected } = useAccount()

  const [userReferral, setReferral] = useState<ReferralType[]>([])
  const [inviteCode, setInviteCode] = useState<string>('')
  const router = useRouter()

  console.log('userReferral', userReferral)

  useEffect(() => {
    if(!isConnected) {
      router.push('/')
    }
  }, [isConnected])

  useEffect(() => {
    const getUserReferral = async () => {
      if (!account) return

      try {
        const {data} = await axios.get(`${BE_ENDPOINT}/api/referral/user/${account}`)
        console.log('Fetched Referral:', data.data)
        setReferral(data.data)
      } catch (err) {
        console.error('Failed to fetch referral:', err)
      }
    }

    getUserReferral()
  }, [account])

  const validateInviteCode = async (inviteCode: string) => {
    // if (!account) return

    try {
      const response = await axios.post(BE_ENDPOINT + '/api/referral/user/validate', { inviteCode })
      console.log('Created Post:', response)
      if (response.data.result === true) {
        setInviteCode(inviteCode)
        showToast('success', 'Correct InviteCode', "You have successfully entered correct inviteCode", 3000)
        return true
      }
      return false
    } catch (error: any) {
      console.log('error', error)
      showToast('error', 'Error', error.response.data.messages, 3000)
      return false
    }
  }

  const signMsg = async () => {
    if (!account || inviteCode === '') return

    if(userReferral.length === REFERRAL_DISTRIBUTION ){
      showToast('error', 'Redeeme Error', `You already redeemed and got ${REFERRAL_DISTRIBUTION} inviteCodes`, 3000)
      return
    }

    try {
      const hash = crypto.createHash('sha256')
      hash.update(inviteCode + account)
      const hashCode = hash.digest('hex')

      const signResult = await signMessage(wagmiConfig, {
        message: `I’m joining Tren Finance with my wallet ${account} with invite code ${inviteCode}, and I accept the Terms of Service`
      })

      if(signResult) {
        const response = await axios.post(BE_ENDPOINT + '/api/referral/user/redeem', {
          account,
          inviteCode,
          count: REFERRAL_DISTRIBUTION,
          // signMsg
        })
        try {
          if (response.data.result === true) {
            showToast('success', 'Success', "Invitation code was successfully redeemed.", 3000)
            return true
          }
          return false
        } catch (error: any) {
          console.log('error', error)
          showToast('error', 'Error', error.response.data.messages, 3000)
          return false
        }
      }
    } catch (err) {
      console.log('err', err)
    }
  }

  const value = {
    inviteCode,
    userReferral,
    validateInviteCode,
    signMsg
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
