import { defillamaTokens } from '@/configs/defillamaTokens'

export const getOverView = (collateral: string) => {
    // Here we have some static overview for collateral. (Jordan)
    // In future, we will remove this one and all values will be replaced with dynamic one which comes from contract.
    if (collateral == 'WETH') {
        return {
            type: 'Volatile',
            borrowAPY: 0,
            network: 'Ethereum',
            platform: 'Uniswap v3',
            rateType: 'Variable Rate'
        }
    } else if (collateral == 'TST') {
        return {
            type: 'Volatile',
            borrowAPY: 0,
            network: 'Solana',
            platform: 'Uniswap v3',
            rateType: 'Stable Rate'
        }
    } else if (collateral == 'FURY') {
        return {
            type: 'Volatile',
            borrowAPY: 0,
            network: 'Ethereum',
            platform: 'Uniswap v3',
            rateType: 'Stable Rate'
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

export const formatToThousands = (value: number, floating = 2) => {
    // return '$' + value.toLocaleString('en-US')
    return '$' + value.toFixed(floating).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const formatToThousandsInt = (value: number) => {
    // return '$' + value.toLocaleString('en-US')
    return value
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        .slice(0, -3)
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

export const getAssetPath = (str: string) => {
    return str.toLowerCase().replace(/\s+/g, '_')
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

export const generateRandomCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const digits = '0123456789'

    // Define the pattern of your code here, L for letter, D for digit
    const pattern = ['L', 'D', 'L', 'D', 'L']

    return pattern
        .map(type => {
            if (type === 'L') {
                return letters.charAt(Math.floor(Math.random() * letters.length))
            } else {
                return digits.charAt(Math.floor(Math.random() * digits.length))
            }
        })
        .join('-')
}
