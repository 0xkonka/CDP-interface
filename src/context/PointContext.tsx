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

const BE_ENDPOINT = process.env.BE_ENDPOINT || 'https://be-express-lime.vercel.app' // 'http://localhost:8000

console.log('BE_ENDPOINT', BE_ENDPOINT)

const REFERRAL_DISTRIBUTION = process.env.REFERRAL_DISTRIBUTION || 2

interface PointContextValue {
  isUserRedeemed: boolean
  redeemedCode: string
  inviteCode: string
  userReferral: Referral[]
  userPoint?: Point
  validateInviteCode: (inviteCode: string) => any
  signMsg: () => any
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
      if (!account) return

      try {
        const { data: referralData } = await axios.get(`${BE_ENDPOINT}/api/referral/user/${account}`)
        console.log('Fetched Referral:', referralData)

        setIsUserRedeemed(referralData.redeemed)
        setRedeemedCode(referralData.referralCode)
        if (referralData.redeemed) {
          const { data: pointData } = await axios.get(`${BE_ENDPOINT}/api/point/user/${account}`)
          // console.log('pointData', pointData.data.point)
          const { xpPoint, multiplier, endTimestamp } = pointData.data.point
          setPoint({
            account,
            xpPoint,
            multiplier,
            endTimestamp,
            rank: pointData.data.rank
          })
          console.log('pointData.data', pointData.data.rank)

          setReferral(referralData.data)
        }
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

  const getRedeemCode = async (address: string) => {
    try {
      const response = await axios.post(BE_ENDPOINT + '/api/referral/user/' + address)
      console.log('Get Redeemed Code:', response)
      if (response.data.result === true) {
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

  const value = {
    inviteCode,
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
