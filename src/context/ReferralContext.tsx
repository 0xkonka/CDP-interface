// React related imports
import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react'
import * as crypto from 'crypto'

import 'cleave.js/dist/addons/cleave-phone.us'
import { useAccount } from 'wagmi'
import { signMessage } from '@wagmi/core'
import { Point, Referral } from '@/types'
import { wagmiConfig } from '@/pages/_app'
import axios from 'axios'
import { showToast } from '@/hooks/toasts'

const BE_ENDPOINT = process.env.BE_ENDPOINT || 'https://be-express-lime.vercel.app'

console.log('BE_ENDPOINT', BE_ENDPOINT)

const REFERRAL_DISTRIBUTION = process.env.REFERRAL_DISTRIBUTION || 2

interface ReferralContextValue {
  isUserRedeemed: boolean,
  userReferral: Referral[],
  userPoint?: Point,
}

const ReferralContext = createContext<ReferralContextValue | undefined>(undefined)

interface Props {
  children: ReactNode
}

export const ReferralProvider: React.FC<Props> = ({ children }) => {
  const { address: account } = useAccount()

  const [isUserRedeemed, setIsUserRedeemed] = useState(false)
  const [userReferral, setReferral] = useState<Referral[]>([])
  const [userPoint, setPoint] = useState<Point>()
  // const [inviteCode, setInviteCode] = useState<string>('')

  console.log('userReferral', userReferral)
  console.log('userPoint', userPoint)

  useEffect(() => {
    const getUserReferral = async () => {
      if (!account) return

      try {
        const { data } = await axios.get(`${BE_ENDPOINT}/api/referral/user/${account}`)
        console.log('Fetched Referral:', data)

        setIsUserRedeemed(data.redeemed)
        if(data.redeemed){
          setReferral(data.data.referral)
          setPoint(data.data.point)
        }
      } catch (err) {
        console.error('Failed to fetch referral:', err)
      }
    }

    getUserReferral()
  }, [account])

  const value = {
    isUserRedeemed,
    userReferral,
    userPoint
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
