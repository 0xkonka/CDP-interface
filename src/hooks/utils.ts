import { CollateralType } from "@/types/collateral/types"

export const getOverView = (collateral:string) => {
    // Here we will get Detail values from <collateral> parameter (It is collateral asset name)
    if(collateral == 'stETH') {
        return {
            asset: 'stETH',
            type: 'LST',
            borrowAPY: 10,
            maxLeverage: 30,
            LTVRatio: 95,
            maxDepositAPY: 30,
            baseDepositAPY: 10,
            active: true,
            platform: 'Uniswap v3',
            liquidationThreshold: 80,
            totalTrenUSD: 800000,
            tvlLeverage: 25,
            tvl: 4300000,
            borrowFee: 6.263,
            availableTrenUSD: 500000,
            interestRate: 5,
            rateType: 'Variable Rate'
        }
    }
    return
}

export const formatMoney = (value:number) => {
    if (value < 1e3) return value.toString();
    if (value >= 1e3 && value < 1e6) return (value / 1e3).toFixed(2) + "k";
    if (value >= 1e6 && value < 1e9) return (value / 1e6).toFixed(2) + "M";
    if (value >= 1e9 && value < 1e12) return (value / 1e9).toFixed(2) + "B";
    if (value >= 1e12) return (value / 1e12).toFixed(2) + "T";
}

export const formatPercent = (value:number, floating = 0) => {
    return value.toFixed(floating) + '%'
}

export const formatToThousands = (value:number) => {
    // return '$' + value.toLocaleString('en-US')
    return '$' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
}