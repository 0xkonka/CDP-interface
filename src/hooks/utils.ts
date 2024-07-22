import { defillamaTokens } from '@/configs/defillamaTokens'

export const getOverView = (collateral: string) => {
    // Here we have some static overview for collateral. (Jordan)
    // In future, we will remove this one and all values will be replaced with dynamic one which comes from contract.
    if (collateral == 'WETH') {
        return {
            type: 'Spot',
            borrowAPY: 0,
            network: 'Ethereum',
            platform: 'Uniswap v3',
            rateType: 'Variable Rate'
        }
    } else if (collateral == 'PEPE') {
        return {
            type: 'Meme',
            borrowAPY: 0,
            network: 'Solana',
            platform: 'Uniswap v3',
            rateType: 'Stable Rate'
        }
    } else if (collateral == 'PT-weETH-26DEC2024') {
        return {
            type: 'PT Token',
            borrowAPY: 0,
            network: 'Ethereum',
            platform: 'Uniswap v3',
            rateType: 'Stable Rate'
        }
    } else if (collateral == 'tricryptov2') {
        return {
            type: 'LP Token',
            borrowAPY: 0,
            network: 'Ethereum',
            platform: 'Uniswap v3',
            rateType: 'Stable Rate'
        }
    } else if (collateral == 'sDAI') {
        return {
            type: 'Vault',
            borrowAPY: 0,
            network: 'Ethereum',
            platform: 'Uniswap v3',
            rateType: 'Stable Rate'
        }
    } else if (collateral == 'TRUMP') {
        return {
            type: 'Meme',
            borrowAPY: 0,
            network: 'Ethereum',
            platform: 'Uniswap v3',
            rateType: 'Stable Rate'
        }
    } else if (collateral == 'eETH') {
        return {
            type: 'LRT',
            borrowAPY: 0,
            network: 'Ethereum',
            platform: 'Uniswap v3',
            rateType: 'Stable Rate'
        }
    } else if (collateral == 'USDC') {
        return {
            type: 'Stable',
            borrowAPY: 0,
            network: 'Ethereum',
            platform: 'Uniswap v3',
            rateType: 'Stable Rate'
        }
    } else if (collateral == 'ONDO') {
        return {
            type: 'RWA',
            borrowAPY: 0,
            network: 'Ethereum',
            platform: 'Uniswap v3',
            rateType: 'Stable Rate'
        }
    } else if (collateral == 'wstETH') {
        return {
            type: 'LST',
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
    if (value >= 1e3 && value < 1e6) return (value / 1e3).toFixed(2) + 'K'
    if (value >= 1e6 && value < 1e9) return (value / 1e6).toFixed(2) + 'M'
    if (value >= 1e9 && value < 1e12) return (value / 1e9).toFixed(2) + 'B'
    if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T'
}

export const formatPercent = (value: number, floating = 0) => {
    return value.toFixed(floating) + '%'
}

export const formatToThousands = (value: number, floating = 5) => {
    // // First, round the number to the desired precision to avoid floating point representation issues
    // const roundedValue = Math.round(value * Math.pow(10, floating)) / Math.pow(10, floating);
    // // Convert the number to a string splitting at the decimal point (if any)
    // let [integerPart, decimalPart] = roundedValue.toString().split('.');

     // First, truncate the number to the desired precision to avoid floating point representation issues
     const factor = Math.pow(10, floating);
     const truncatedValue = Math.floor(value * factor) / factor;
     // Convert the number to a string splitting at the decimal point (if any)
     let [integerPart, decimalPart] = truncatedValue.toString().split('.');
     
    // Add thousands separator to the integer part only
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // Return formatted value with or without decimal part
    return '$' + (decimalPart ? `${integerPart}.${decimalPart}` : integerPart);
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

export function truncateFloating(number: number, decimalPlaces: number) {
    const factor = Math.pow(10, decimalPlaces);
    return Math.floor(number * factor) / factor;
}

import { useEffect, useState } from 'react'
import axios from 'axios'

export const getDefillmaAPY = async (symbol: string) => {
    const POOL_ID = defillamaTokens.find(id => id.tokenSymbol === symbol)?.poolID
    if(POOL_ID == undefined)
        return 0

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
