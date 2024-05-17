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

const BE_ENDPOINT = process.env.BE_ENDPOINT || 'https://be-express-lime.vercel.app' // 'http://localhost:8000'

const REFERRAL_DISTRIBUTION = process.env.REFERRAL_DISTRIBUTION || 2

interface PointContextValue {
  isUserRedeemed: boolean
  redeemedCode: string
  inviteCode: string
  setInviteCode: (inviteCode: string) => any
  userReferral: Referral[]
  userPoint?: Point
  validateInviteCode: (inviteCode: string) => any
  signMsg: (code: string) => any
  getRedeemCode: (address: string) => any
}

const PointContext = createContext<PointContextValue | undefined>(undefined)

interface Props {
  children: ReactNode
}

export const PointProvider: React.FC<Props> = ({ children }) => {
  const { address: account } = useAccount()

  const [isUserRedeemed, setIsUserRedeemed] = useState(false)
  const [redeemedCode, setRedeemedCode] = useState('')
  const [inviteCode, setInviteCode] = useState<string>('')
  const [userReferral, setReferral] = useState<Referral[]>([])
  const [userPoint, setPoint] = useState<Point>()

  useEffect(() => {
    const getUserReferral = async () => {
      if (!account) {
        setReferral([]);
        return
      }

      try {
        const { data: referralData } = await axios.get(`${BE_ENDPOINT}/api/referral/user/${account}`)

        if (referralData.redeemed) {
          setIsUserRedeemed(referralData.redeemed)
          setReferral(referralData.data)
          setRedeemedCode(referralData.referralCode)
          const { data: pointData } = await axios.get(`${BE_ENDPOINT}/api/point/user/${account}`)
          if (pointData.data.point) {
            const { xpPoint = 0, multiplier = 1, endTimestamp } = pointData.data.point
            setPoint({
              account,
              xpPoint,
              multiplier,
              endTimestamp,
              rank: xpPoint > 0 && pointData.data.rank
            })
          }
        }else {
          setIsUserRedeemed(false)
        }
      } catch (err) {
        console.error('Failed to fetch referral:', err)
        setIsUserRedeemed(false)
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
        showToast('success', 'Correct InviteCode', 'You have successfully entered eligable invite code', 3000)
        return true
      }
      return false
    } catch (error: any) {
      console.log('error', error)
      showToast('error', 'Error', error.response.data.messages, 3000)
      return false
    }
  }

  const signMsg = async (code: string) => {
    if (!account || code === '') return
    if (userReferral?.length >= +REFERRAL_DISTRIBUTION) {
      showToast('error', 'Redeeme Error', `You already redeemed and got ${REFERRAL_DISTRIBUTION} inviteCodes`, 3000)
      return
    }

    try {
      const response = await axios.post(BE_ENDPOINT + '/api/referral/user/redeem', {
        account,
        inviteCode: code,
        count: REFERRAL_DISTRIBUTION
      })

      if (response.data.result === true) {
        const hash = crypto.createHash('sha256')
        hash.update(code + account)
        const hashCode = hash.digest('hex')

        await signMessage(wagmiConfig, {
          message: `I’m joining Tren Finance with my wallet ${account} with invite code ${code}, and I accept the Terms of Service`
        })
        return true
      }
    } catch (err: any) {
      console.log('err', err)
      showToast('error', 'Error', err.response.data.messages, 3000)
      return false
    }
  }

  const getRedeemCode = async (address: string) => {
    try {
      const response = await axios.post(BE_ENDPOINT + '/api/referral/user/' + address)
      console.log('Get Redeemed Code:', response)
      if (response.data.result === true) {
        showToast('success', 'Correct InviteCode', 'You have successfully entered correct inviteCode', 3000)
        return true
      }
      return false
    } catch (error: any) {
      console.log('error', error)
      showToast('error', 'Error', error.response.data.messages, 3000)
      return false
    }
  }

  const value = {
    inviteCode,
    setInviteCode,
    isUserRedeemed,
    redeemedCode,
    userReferral,
    userPoint,
    validateInviteCode,
    signMsg,
    getRedeemCode
  }

  return <PointContext.Provider value={value}>{children}</PointContext.Provider>
}

export const usePoint = () => {
  const context = useContext(PointContext)
  if (!context) {
    throw new Error(`usePoint must be used within a PointProvider`)
  }
  return context
}
