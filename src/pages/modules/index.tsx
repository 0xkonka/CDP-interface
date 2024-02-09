import { useRouter } from 'next/router';

import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Button, {ButtonProps} from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import Switch from '@mui/material/Switch'
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme, Theme } from '@mui/material/styles';

// Import from Next
import Image from 'next/image'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import MultiSelectDropdown from 'src/@core/components/multi-select-dropdown'

import React, { useEffect, useState } from 'react'

// Define Pool Type
interface Pool {
    id: number
    collateral: string
    tvl: string
    trenUSD_borrowed: string
    trenUSD_available: string
    interest: string
    actions: string
    active?: boolean
}

// Static rows data
const initialRows: Pool[] = [
    {
        id: 1,
        collateral: 'PEPE',
        tvl: '$ 989.48k',
        trenUSD_borrowed: '$ 560.98k',
        trenUSD_available: '$ 196.92k',
        interest: '10%',
        actions: 'Action',
        active: true,
    },
    {
        id: 2,
        collateral: 'FLOKI',
        tvl: '$ 989.48k',
        trenUSD_borrowed: '$ 560.98k',
        trenUSD_available: '$ 196.92k',
        interest: '10%',
        actions: 'Action',
        active: true,
    },
    {
        id: 3,
        collateral: 'T-WBTC-C',
        tvl: '$ 989.48k',
        trenUSD_borrowed: '$ 560.98k',
        trenUSD_available: '$ 196.92k',
        interest: '10%',
        actions: 'Action',
        active: true,
    },
    {
        id: 4,
        collateral: 'wTAO',
        tvl: '$ 989.48k',
        trenUSD_borrowed: '$ 560.98k',
        trenUSD_available: '$ 196.92k',
        interest: '10%',
        actions: 'Action',
        active: true,
    },
    {
        id: 5,
        collateral: 'BONE',
        tvl: '$ 989.48k',
        trenUSD_borrowed: '$ 560.98k',
        trenUSD_available: '$ 196.92k',
        interest: '10%',
        actions: 'Action',
        active: true,
    },
    {
        id: 6,
        collateral: 'T-APE-C',
        tvl: '$ 989.48k',
        trenUSD_borrowed: '$ 560.98k',
        trenUSD_available: '$ 196.92k',
        interest: '10%',
        actions: 'Action',
        active: false,
    },
    {
        id: 7,
        collateral: 'DOGE',
        tvl: '$ 989.48k',
        trenUSD_borrowed: '$ 560.98k',
        trenUSD_available: '$ 196.92k',
        interest: '10%',
        actions: 'Action',
        active: true,
    },
    {
        id: 8,
        collateral: 'ELON',
        tvl: '$ 989.48k',
        trenUSD_borrowed: '$ 560.98k',
        trenUSD_available: '$ 196.92k',
        interest: '10%',
        actions: 'Action',
        active: false,
    },
    {
        id: 9,
        collateral: 'WSTETH-ETHX',
        tvl: '$ 989.48k',
        trenUSD_borrowed: '$ 560.98k',
        trenUSD_available: '$ 196.92k',
        interest: '10%',
        actions: 'Action',
        active: true,
    },
    {
        id: 10,
        collateral: 'XAUt',
        tvl: '$ 989.48k',
        trenUSD_borrowed: '$ 560.98k',
        trenUSD_available: '$ 196.92k',
        interest: '10%',
        actions: 'Action',
        active: false,
    },
    {
        id: 11,
        collateral: 'wTAO',
        tvl: '$ 989.48k',
        trenUSD_borrowed: '$ 560.98k',
        trenUSD_available: '$ 196.92k',
        interest: '10%',
        actions: 'Action',
        active: true,
    },
    {
        id: 12,
        collateral: 'T-APE-C',
        tvl: '$ 989.48k',
        trenUSD_borrowed: '$ 560.98k',
        trenUSD_available: '$ 196.92k',
        interest: '10%',
        actions: 'Action',
        active: true,
    },
    {
        id: 13,
        collateral: 'ELON',
        tvl: '$ 989.48k',
        trenUSD_borrowed: '$ 560.98k',
        trenUSD_available: '$ 196.92k',
        interest: '10%',
        actions: 'Action',
        active: false,
    },
    {
        id: 14,
        collateral: 'BONE',
        tvl: '$ 989.48k',
        trenUSD_borrowed: '$ 560.98k',
        trenUSD_available: '$ 196.92k',
        interest: '10%',
        actions: 'Action',
        active: true,
    },
    {
        id: 15,
        collateral: 'DOGE',
        tvl: '$ 989.48k',
        trenUSD_borrowed: '$ 560.98k',
        trenUSD_available: '$ 196.92k',
        interest: '10%',
        actions: 'Action',
        active: true,
    },
    {
        id: 16,
        collateral: 'PEPE',
        tvl: '$ 989.48k',
        trenUSD_borrowed: '$ 560.98k',
        trenUSD_available: '$ 196.92k',
        interest: '10%',
        actions: 'Action',
        active: false,
    },
    {
        id: 17,
        collateral: 'XAUt',
        tvl: '$ 989.48k',
        trenUSD_borrowed: '$ 560.98k',
        trenUSD_available: '$ 196.92k',
        interest: '10%',
        actions: 'Action',
        active: true,
    },
]

const ToogleOnButton = styled(Button)<ButtonProps>(({ theme }) => ({
    borderRadius: '50px', 
    fontWeight: 600, 
    backgroundColor: theme.palette.primary.main, 
    color: '#101617',
    minWidth: 'fit-content',
    '&:hover': {
        backgroundColor: theme.palette.primary.main
    }
}))

const ToogleOffButton = styled(Button)<ButtonProps>(({ theme }) => ({
    borderRadius: '50px', 
    fontWeight: 400, 
    backgroundColor: '#191D1C', 
    color: '#FFFFFF', 
    border: 'solid 1px #2D3131',
    minWidth: 'fit-content',
    '&:hover': {
        color: 'black',
        backgroundColor: theme.palette.secondary.main
    }
}))
  
const Modules = () => {
    const [rows, setRows] = useState<Pool[]>(initialRows)
    const [filterText, setFilterText] = useState<string>('')
    const [filterOnlyActive, setFilterOnlyActive] = useState<boolean>(true)
    const [assetFilter, setAssetFilter] = useState<string>('All')
    const router = useRouter()

    const assetTypes:string[] = ['All', 'LRTs', 'LSTs', 'RWAs', 'LP tokens', 'Vault', 'PT Tokens', 'Meme']
    const theme: Theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

    useEffect(() => {
        filterRows()
    }, [filterText, filterOnlyActive])

    const filterRows = () => {
        let newRows = initialRows.filter((row) => row.collateral.toLocaleLowerCase().includes(filterText.toLowerCase()))
        if(filterOnlyActive == true)
            newRows = newRows.filter((row) => row.active)
        setRows(newRows)
    }

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setFilterText(value)
        filterRows()
    }
    
    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked
        setFilterOnlyActive(isChecked)
        filterRows()
    }

    return (
        <Box>
            <Typography variant='h1' sx={{ mb: 8, fontSize: {xs:36, md: 64, xl: 72} }}>
                Isolated Modules
            </Typography>
            <Typography variant='h5' sx={{ mb: 16, fontWeight: 300, width: 730, maxWidth: '100%' }}>
                Deposit your collateral tokens into a module in exchange for a trenUSD loan or Loop 
                your assets in one click to leverage exposure for your spot assets. Pay back your loan 
                later using trenUSD or your collateral.
            </Typography>
            <Box id="total-info" sx={{display: 'flex', mb: 12, justifyContent: 'space-between', flexWrap: 'wrap', gap: {xs: 8, md: 16}}}>
                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: {xs: 8, md: 16}}}>
                    <Box>
                        <Typography variant='subtitle1' color='#C6C6C7'>Total Collateral</Typography>
                        <Typography variant='h4'>$200,000.00</Typography>
                    </Box>
                    <Box>
                        <Typography variant='subtitle1' color='#C6C6C7'>Total Debts</Typography>
                        <Typography variant='h4'>$ 50,000.00</Typography>
                    </Box>
                    <Box>
                        <Typography variant='subtitle1' color='#C6C6C7'>Net Worth</Typography>
                        <Typography variant='h4'>$ 150,000.00</Typography>
                    </Box>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', border: 'solid 1px #2D3131', borderRadius: 2.5, px: {xs: 4, md: 8}, py: {xs: 2, md: 4}, gap: 4.5}}>
                    <Typography variant='subtitle1' color='#C6C6C7'>TVL</Typography>
                    <Typography variant='h5' style={{fontWeight: 600}}>$ 100.5m</Typography>
                    <Box sx={{height: '100%',borderLeft: 'solid 1px #2B3440'}}></Box>
                    <Typography variant='h5' color='primary' sx={{cursor: 'pointer'}}>
                        Analytics
                        <svg style={{marginLeft: 4}} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <g clip-path="url(#clip0_719_13657)">
                            <path d="M11.625 0.75V4.125C11.625 4.33228 11.4573 4.5 11.25 4.5C11.0427 4.5 10.875 4.33228 10.875 4.125V1.65525L5.51512 7.01513C5.44191 7.08834 5.34591 7.125 5.25 7.125C5.15409 7.125 5.05809 7.08834 4.98488 7.01513C4.95003 6.98032 4.92239 6.93899 4.90353 6.8935C4.88467 6.84801 4.87496 6.79925 4.87496 6.75C4.87496 6.70075 4.88467 6.65199 4.90353 6.6065C4.92239 6.56101 4.95003 6.51968 4.98488 6.48487L10.3448 1.125H7.875C7.66772 1.125 7.5 0.957281 7.5 0.75C7.5 0.542719 7.66772 0.375 7.875 0.375H11.25C11.4573 0.375 11.625 0.542719 11.625 0.75ZM10.125 10.5V6C10.125 5.79272 9.95728 5.625 9.75 5.625C9.54272 5.625 9.375 5.79272 9.375 6V10.5C9.375 10.7069 9.20691 10.875 9 10.875H1.5C1.29309 10.875 1.125 10.7069 1.125 10.5V3C1.125 2.79309 1.29309 2.625 1.5 2.625H6C6.20728 2.625 6.375 2.45728 6.375 2.25C6.375 2.04272 6.20728 1.875 6 1.875H1.5C0.879656 1.875 0.375 2.37966 0.375 3V10.5C0.375 11.1203 0.879656 11.625 1.5 11.625H9C9.62034 11.625 10.125 11.1203 10.125 10.5Z" fill="#67DAB1"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_719_13657">
                            <rect width="12" height="12" fill="white"/>
                            </clipPath>
                        </defs>
                        </svg>
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap:2.5, justifyContent: 'space-between', alignItems: 'center', pb: 8}}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
                    <CustomTextField
                        label=''
                        id='input-with-icon-textfield'
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                            <Icon icon='tabler:search' />
                            </InputAdornment>
                            )
                        }}
                        value={filterText}
                        onChange={handleFilterChange}
                        placeholder='Search....'
                    />
                    <MultiSelectDropdown 
                        availableFilters = {['LP Token', 'Volatile', 'Vault', 'RWA', 'Stable', 'Trades']}
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant='h6' sx={{ fontWeight: 400, mt: 1 }}>
                        Open Positions Only
                    </Typography>
                    <Switch checked={filterOnlyActive} onChange={handleSwitchChange} />
                </Box>
            </Box>
            <Box sx={{display: 'flex', gap: 4, overflowX: 'auto', pb: 4}}>
                {
                    assetTypes.map((value, index) => {
                        return value == assetFilter ? 
                            <ToogleOnButton key={index} onClick={() => {setAssetFilter(value)}}>
                                {value == 'All' ? 'All 292' : value}
                            </ToogleOnButton> :
                            <ToogleOffButton key={index} onClick={() => {setAssetFilter(value)}}>
                                {value == 'All' ? 'All 292' : value}
                            </ToogleOffButton>
                    })
                }
            </Box>
            <Box sx={{height: 500}}>
                
            </Box>
        </Box>
    )
}

export default Modules