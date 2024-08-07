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

const BE_ENDPOINT = process.env.BE_ENDPOINT || 'https://api.tren.finance' // 'http://localhost:8000'

const REFERRAL_DISTRIBUTION = process.env.REFERRAL_DISTRIBUTION || 1

interface PointContextValue {
  isUserRedeemed: boolean
  redeemedCode: string
  inviteCode: string
  setInviteCode: (inviteCode: string) => any
  userReferral: Referral|undefined
  userPoint?: Point
  validateInviteCode: (inviteCode: string, showSuccessToast?: boolean) => any
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
  const [userReferral, setReferral] = useState()
  const [userPoint, setPoint] = useState<Point>()

  useEffect(() => {
    const getUserReferral = async () => {
      if (!account) {
        setIsUserRedeemed(false)
        // setReferral();
        return
      }

      try {
        const { data: referralData } = await axios.get(`${BE_ENDPOINT}/api/referral/user/${account}?inviteCodeType=mainnet`)

        if (referralData.redeemed) {
          setIsUserRedeemed(referralData.redeemed)
          setReferral(referralData.data)
          setRedeemedCode(referralData.referralCode)
          const { data: pointData } = await axios.get(`${BE_ENDPOINT}/api/point/offChain/user/${account}`)
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

  const validateInviteCode = async (inviteCode: string, showSuccessToast?: boolean) => {
    // if (!account) return

    try {
      const response = await axios.post(BE_ENDPOINT + '/api/referral/user/validate', { inviteCode, inviteCodeType: 'mainnet' })
      if (response.data.result === true) {
        if(showSuccessToast) {
          setInviteCode(inviteCode)
          showToast('success', 'Correct InviteCode', 'You have successfully entered eligible invite code', 3000)
        }
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
    if (!account || code === '') return false
    if (userReferral) {
      showToast('error', 'Redeeme Error', `You already redeemed and got ${REFERRAL_DISTRIBUTION} inviteCodes`, 3000)
      return false
    }

    try {
      const signResult = await signMessage(wagmiConfig, {
        message: `I’m joining Tren Finance with my wallet ${account} with invite code ${code}, and I accept the Terms of Service`
      })
      const hash = crypto.createHash('sha256')
      hash.update(code + account)
      const hashCode = hash.digest('hex')

      if(signResult) {
        const response = await axios.post(BE_ENDPOINT + '/api/referral/user/redeem', {
          account,
          inviteCode: code,
          count: REFERRAL_DISTRIBUTION,
          inviteCodeType: "mainnet"
        })

        if (response.data.result === true) {
          setIsUserRedeemed(true)
          return true
        }
        return false
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
      // console.log('Get Redeemed Code:', response)
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
