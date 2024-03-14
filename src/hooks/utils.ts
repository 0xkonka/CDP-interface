import { CollateralType } from '@/types/collateral/types'
import { defillamaTokens } from '@/configs/defillamaTokens'

export const getOverView = (collateral: string) => {
    // Here we will get Detail values from <collateral> parameter (It is collateral asset name)
    if (collateral == 'WETH') {
        return {
            type: 'Volatile',
            platform: 'Uniswap v3',
            rateType: 'Variable Rate'
        }
    }

    return
}

export const formatMoney = (value: number) => {
    if (value < 1e3) return value.toString()
    if (value >= 1e3 && value < 1e6) return (value / 1e3).toFixed(2) + 'k'
    if (value >= 1e6 && value < 1e9) return (value / 1e6).toFixed(2) + 'M'
    if (value >= 1e9 && value < 1e12) return (value / 1e9).toFixed(2) + 'B'
    if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T'
}

export const formatPercent = (value: number, floating = 0) => {
    return value.toFixed(floating) + '%'
}

export const formatToThousands = (value: number) => {
    // return '$' + value.toLocaleString('en-US')
    return '$' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const removeComma = (amount: string) => {
    return amount.replace(/,/g, '')
}

export const shortenWalletAddress = (address: string, chars = 4) => {
    if (typeof address !== 'string' || address.length < chars * 2) {
        return address // Return original address if it's too short to shorten
    }

    // Take the first `chars` characters from the start, and `chars` from the end
    return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`
}

import { useEffect, useState } from 'react'
import axios from 'axios'

export const getDefillmaAPY = async (symbol: string) => {
    const POOL_ID = defillamaTokens.find(id => id.tokenSymbol === symbol)?.poolID

    try {
        const { data } = await axios.get(`https://yields.llama.fi/chart/${POOL_ID}`)

        if (data.status === 'success') {
            const APYResultList = data.data
            const length = data.data.length
            return APYResultList[length - 1].apy
        }
    } catch (err) {
        console.log('err', err)
        return 0
    }
}
