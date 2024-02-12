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
import Stack from '@mui/material/Stack'

// Import from Next
import Image from 'next/image'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import MultiSelectDropdown from 'src/@core/components/multi-select-dropdown'
import CustomChip from 'src/@core/components/mui/chip'

import React, { useEffect, useState } from 'react'

// Define Pool Type
interface Pool {
    id: number
    asset: string
    type: string
    borrowAPY: number
    maxLeverage: number
    LTVRatio: number
    maxDepositAPY: number
    baseDepositAPY: number
    active?: boolean
}

// Static rows data
const initialRows: Pool[] = [
    {
        id: 1,
        asset: 'PEPE',
        type: 'Meme',
        borrowAPY: 10,
        maxLeverage: 30,
        LTVRatio: 95,
        maxDepositAPY: 922.12,
        baseDepositAPY: 61.25,
        active: false,
    },
    {
        id: 2,
        asset: 'GRAIL / USDC.e',
        type: 'LP Token',
        borrowAPY: 10,
        maxLeverage: 30,
        LTVRatio: 95,
        maxDepositAPY: 86.40,
        baseDepositAPY: 61.25,
        active: true,
    },
    {
        id: 3,
        asset: 'FLOKI',
        type: 'Meme',
        borrowAPY: 10,
        maxLeverage: 30,
        LTVRatio: 95,
        maxDepositAPY: 722.24,
        baseDepositAPY: 61.25,
        active: false,
    },
    {
        id: 4,
        asset: 'T-WBTC-C',
        type: 'Vault',
        borrowAPY: 10,
        maxLeverage: 30,
        LTVRatio: 95,
        maxDepositAPY: 18.02,
        baseDepositAPY: 61.25,
        active: true,
    },
    {
        id: 5,
        asset: 'GRAIL / ETH',
        type: 'Stable',
        borrowAPY: 10,
        maxLeverage: 30,
        LTVRatio: 95,
        maxDepositAPY: 42.93,
        baseDepositAPY: 61.25,
        active: false,
    },
    {
        id: 6,
        asset: 'wTAO',
        type: 'Stable',
        borrowAPY: 10,
        maxLeverage: 30,
        LTVRatio: 95,
        maxDepositAPY: 640.08,
        baseDepositAPY: 61.25,
        active: false,
    },
    {
        id: 7,
        asset: 'BONE',
        type: 'Volatile',
        borrowAPY: 10,
        maxLeverage: 30,
        LTVRatio: 95,
        maxDepositAPY: 32.68,
        baseDepositAPY: 61.25,
        active: false,
    },
    {
        id: 8,
        asset: 'T-APE-C',
        type: 'Vault',
        borrowAPY: 10,
        maxLeverage: 30,
        LTVRatio: 95,
        maxDepositAPY: 12,
        baseDepositAPY: 61.25,
        active: false,
    },
    {
        id: 9,
        asset: 'ELON',
        type: 'RWA',
        borrowAPY: 10,
        maxLeverage: 30,
        LTVRatio: 95,
        maxDepositAPY: 243.63,
        baseDepositAPY: 61.25,
        active: false,
    },
    {
        id: 10,
        asset: 'GRAIL / USDC.e',
        type: 'Volatile',
        borrowAPY: 10,
        maxLeverage: 30,
        LTVRatio: 95,
        maxDepositAPY: 15.82,
        baseDepositAPY: 61.25,
        active: false,
    },
]

const ToogleOnButton = styled(Button)<ButtonProps>(({ theme }) => ({
    borderRadius: '50px', 
    fontWeight: 600, 
    backgroundColor: theme.palette.primary.main, 
    color: '#101617',
    minWidth: 'fit-content',
    paddingLeft: 20,
    paddingRight: 20,
    height: 35,
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
    paddingLeft: 20,
    paddingRight: 20,
    height: 35,
    '&:hover': {
        color: 'black',
        backgroundColor: theme.palette.secondary.main
    }
}))
  
const Modules = () => {
    const [rows, setRows] = useState<Pool[]>(initialRows)
    const [filterText, setFilterText] = useState<string>('')
    const [filterOnlyActive, setFilterOnlyActive] = useState<boolean>(false)
    const [assetFilter, setAssetFilter] = useState<string>('All')
    const router = useRouter()

    const assetTypes:string[] = ['All', 'LRT', 'LST', 'RWA', 'LP Token', 'Vault', 'PT Token', 'Meme', 'Volatile', 'Stable']
    const theme: Theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

    const getChipTheme = (label: string) => {
        switch(label) {
            case 'LRT':
                return 'secondary';
            case 'LST':
                return 'secondary';
            case 'RWA':
                return 'error';
            case 'LP Token':
                return 'primary';
            case 'Vault':
                return 'info';
            case 'PT Tokens':
                return 'secondary';
            case 'Meme':
                return 'secondary';
            case 'Volatile':
                return 'warning';
            case 'Stable':
                return 'success';
            default:
                return 'secondary';
        }
    }

    useEffect(() => {
        console.log(filterText)
        filterRows()
    }, [filterText, filterOnlyActive, assetFilter])

    const filterRows = () => {
        let newRows = initialRows.filter((row) => row.asset.toLocaleLowerCase().includes(filterText.toLowerCase()))
        if(assetFilter != 'All') {
            newRows = newRows.filter((row) => row.type == assetFilter)
        }
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
            {/* Total Info Group Seection */}
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
                    <Typography variant='h5' color='primary' sx={{fontWeight: 400, cursor: 'pointer'}}>
                        Analytics
                        <svg style={{marginLeft: 4}} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <g clipPath="url(#clip0_719_13657)">
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
            {/* Search and Multi Select Filter Section */}
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
            {/* Token Types Buttons Section */}
            <Box sx={{display: 'flex', gap: 4, overflowX: 'auto', pb: 8}}>
                {
                    assetTypes.map((value, index) => {
                        return value == assetFilter ? 
                            <ToogleOnButton key={index} onClick={() => {setAssetFilter(value)}}>
                                {value + ' ' + rows.length}
                            </ToogleOnButton> :
                            <ToogleOffButton key={index} onClick={() => {setAssetFilter(value)}}>
                                {value}
                            </ToogleOffButton>
                    })
                }
            </Box>
            
            {/* Sort By Columns Header */}
            <Stack direction='row' sx={{px: 3, py: 2}}>
                <Stack sx={{flex: '2 1 0%', alignItems: 'center', cursor: 'pointer'}} direction='row'>
                    Asset
                    <svg style={{marginLeft: 8}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M7.80835 14.4621C7.86901 14.4873 7.93405 14.5002 7.99971 14.5001C8.06538 14.5002 8.13042 14.4873 8.19108 14.4621C8.25175 14.437 8.30685 14.4001 8.35322 14.3536L11.8532 10.8541C11.947 10.7603 11.9998 10.6332 11.9998 10.5005C11.9999 10.3679 11.9472 10.2407 11.8535 10.1468C11.7597 10.053 11.6325 10.0003 11.4999 10.0002C11.3673 10.0002 11.24 10.0528 11.1462 10.1466L7.99971 13.2926L4.85321 10.1466C4.75891 10.0555 4.63261 10.0051 4.50151 10.0063C4.37042 10.0074 4.24501 10.06 4.15231 10.1527C4.0596 10.2454 4.00702 10.3708 4.00588 10.5019C4.00474 10.633 4.05514 10.7593 4.14622 10.8536L7.64621 14.3536C7.69258 14.4001 7.74768 14.437 7.80835 14.4621Z" fill="#D4D4D4"/>
                    <path d="M11.3083 5.96191C11.369 5.98705 11.434 5.99996 11.4997 5.99989C11.5986 5.99987 11.6952 5.97054 11.7774 5.91559C11.8596 5.86065 11.9237 5.78257 11.9616 5.69122C11.9994 5.59987 12.0093 5.49935 11.99 5.40238C11.9707 5.3054 11.9231 5.21632 11.8532 5.14639L8.35322 1.64639C8.25945 1.55266 8.1323 1.5 7.99971 1.5C7.86713 1.5 7.73998 1.55266 7.64621 1.64639L4.14622 5.14639C4.05514 5.24069 4.00474 5.367 4.00588 5.49809C4.00702 5.62919 4.0596 5.7546 4.15231 5.8473C4.24501 5.94001 4.37042 5.99259 4.50151 5.99373C4.63261 5.99487 4.75891 5.94447 4.85321 5.85339L7.99971 2.70689L11.1462 5.85339C11.1926 5.89989 11.2477 5.93677 11.3083 5.96191Z" fill="#D4D4D4"/>
                    </svg>
                </Stack>
                <Stack sx={{flex: '1 1 0%', alignItems: 'center', cursor: 'pointer'}} direction='row'>
                    Borrow APY
                    <svg style={{marginLeft: 8}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M7.80835 14.4621C7.86901 14.4873 7.93405 14.5002 7.99971 14.5001C8.06538 14.5002 8.13042 14.4873 8.19108 14.4621C8.25175 14.437 8.30685 14.4001 8.35322 14.3536L11.8532 10.8541C11.947 10.7603 11.9998 10.6332 11.9998 10.5005C11.9999 10.3679 11.9472 10.2407 11.8535 10.1468C11.7597 10.053 11.6325 10.0003 11.4999 10.0002C11.3673 10.0002 11.24 10.0528 11.1462 10.1466L7.99971 13.2926L4.85321 10.1466C4.75891 10.0555 4.63261 10.0051 4.50151 10.0063C4.37042 10.0074 4.24501 10.06 4.15231 10.1527C4.0596 10.2454 4.00702 10.3708 4.00588 10.5019C4.00474 10.633 4.05514 10.7593 4.14622 10.8536L7.64621 14.3536C7.69258 14.4001 7.74768 14.437 7.80835 14.4621Z" fill="#D4D4D4"/>
                    <path d="M11.3083 5.96191C11.369 5.98705 11.434 5.99996 11.4997 5.99989C11.5986 5.99987 11.6952 5.97054 11.7774 5.91559C11.8596 5.86065 11.9237 5.78257 11.9616 5.69122C11.9994 5.59987 12.0093 5.49935 11.99 5.40238C11.9707 5.3054 11.9231 5.21632 11.8532 5.14639L8.35322 1.64639C8.25945 1.55266 8.1323 1.5 7.99971 1.5C7.86713 1.5 7.73998 1.55266 7.64621 1.64639L4.14622 5.14639C4.05514 5.24069 4.00474 5.367 4.00588 5.49809C4.00702 5.62919 4.0596 5.7546 4.15231 5.8473C4.24501 5.94001 4.37042 5.99259 4.50151 5.99373C4.63261 5.99487 4.75891 5.94447 4.85321 5.85339L7.99971 2.70689L11.1462 5.85339C11.1926 5.89989 11.2477 5.93677 11.3083 5.96191Z" fill="#D4D4D4"/>
                    </svg>
                </Stack>
                <Stack sx={{flex: '1 1 0%', alignItems: 'center', cursor: 'pointer'}} direction='row'>
                    MAX Leverage
                    <svg style={{marginLeft: 2}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M7.80835 14.4621C7.86901 14.4873 7.93405 14.5002 7.99971 14.5001C8.06538 14.5002 8.13042 14.4873 8.19108 14.4621C8.25175 14.437 8.30685 14.4001 8.35322 14.3536L11.8532 10.8541C11.947 10.7603 11.9998 10.6332 11.9998 10.5005C11.9999 10.3679 11.9472 10.2407 11.8535 10.1468C11.7597 10.053 11.6325 10.0003 11.4999 10.0002C11.3673 10.0002 11.24 10.0528 11.1462 10.1466L7.99971 13.2926L4.85321 10.1466C4.75891 10.0555 4.63261 10.0051 4.50151 10.0063C4.37042 10.0074 4.24501 10.06 4.15231 10.1527C4.0596 10.2454 4.00702 10.3708 4.00588 10.5019C4.00474 10.633 4.05514 10.7593 4.14622 10.8536L7.64621 14.3536C7.69258 14.4001 7.74768 14.437 7.80835 14.4621Z" fill="#D4D4D4"/>
                    <path d="M11.3083 5.96191C11.369 5.98705 11.434 5.99996 11.4997 5.99989C11.5986 5.99987 11.6952 5.97054 11.7774 5.91559C11.8596 5.86065 11.9237 5.78257 11.9616 5.69122C11.9994 5.59987 12.0093 5.49935 11.99 5.40238C11.9707 5.3054 11.9231 5.21632 11.8532 5.14639L8.35322 1.64639C8.25945 1.55266 8.1323 1.5 7.99971 1.5C7.86713 1.5 7.73998 1.55266 7.64621 1.64639L4.14622 5.14639C4.05514 5.24069 4.00474 5.367 4.00588 5.49809C4.00702 5.62919 4.0596 5.7546 4.15231 5.8473C4.24501 5.94001 4.37042 5.99259 4.50151 5.99373C4.63261 5.99487 4.75891 5.94447 4.85321 5.85339L7.99971 2.70689L11.1462 5.85339C11.1926 5.89989 11.2477 5.93677 11.3083 5.96191Z" fill="#D4D4D4"/>
                    </svg>
                </Stack>
                <Stack sx={{flex: '2.5 1 0%', alignItems: 'center', cursor: 'pointer'}} direction='row'>
                    Deposit APY
                    <svg style={{marginLeft: 2}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M7.80835 14.4621C7.86901 14.4873 7.93405 14.5002 7.99971 14.5001C8.06538 14.5002 8.13042 14.4873 8.19108 14.4621C8.25175 14.437 8.30685 14.4001 8.35322 14.3536L11.8532 10.8541C11.947 10.7603 11.9998 10.6332 11.9998 10.5005C11.9999 10.3679 11.9472 10.2407 11.8535 10.1468C11.7597 10.053 11.6325 10.0003 11.4999 10.0002C11.3673 10.0002 11.24 10.0528 11.1462 10.1466L7.99971 13.2926L4.85321 10.1466C4.75891 10.0555 4.63261 10.0051 4.50151 10.0063C4.37042 10.0074 4.24501 10.06 4.15231 10.1527C4.0596 10.2454 4.00702 10.3708 4.00588 10.5019C4.00474 10.633 4.05514 10.7593 4.14622 10.8536L7.64621 14.3536C7.69258 14.4001 7.74768 14.437 7.80835 14.4621Z" fill="#D4D4D4"/>
                    <path d="M11.3083 5.96191C11.369 5.98705 11.434 5.99996 11.4997 5.99989C11.5986 5.99987 11.6952 5.97054 11.7774 5.91559C11.8596 5.86065 11.9237 5.78257 11.9616 5.69122C11.9994 5.59987 12.0093 5.49935 11.99 5.40238C11.9707 5.3054 11.9231 5.21632 11.8532 5.14639L8.35322 1.64639C8.25945 1.55266 8.1323 1.5 7.99971 1.5C7.86713 1.5 7.73998 1.55266 7.64621 1.64639L4.14622 5.14639C4.05514 5.24069 4.00474 5.367 4.00588 5.49809C4.00702 5.62919 4.0596 5.7546 4.15231 5.8473C4.24501 5.94001 4.37042 5.99259 4.50151 5.99373C4.63261 5.99487 4.75891 5.94447 4.85321 5.85339L7.99971 2.70689L11.1462 5.85339C11.1926 5.89989 11.2477 5.93677 11.3083 5.96191Z" fill="#D4D4D4"/>
                    </svg>
                </Stack>
            </Stack>
            {/* Collateral Group Stack*/}
            <Stack>
                {rows.map((row, index) => (
                    <Stack key={index} direction='row' sx={{p: 3, alignItems: 'center', borderRadius:2, border: 'solid 1px transparent', 
                        '& .arrow-right': {
                            display: 'none'
                        },
                        '&:hover': {
                            borderColor: theme.palette.primary.main,
                            '& .active-open': {
                                color: theme.palette.primary.main,
                                '& .arrow-diagonal': {
                                    display: 'none'
                                },
                                '& .arrow-right': {
                                    display: 'block'
                                }
                            },
                        },
                    }}>
                        <Stack direction='row' sx={{flex: '2 1 0%', alignItems: 'center'}}>
                            <img 
                                src={`/images/tokens/${row.asset.replace(/\//g, '-').replace(/\s+/g, '')}.png`}
                                alt={row.asset} width={32} height={32}
                                style={{ width: 'auto' }}
                            />
                            <Typography variant='h5' sx={{fontWeight: 400, ml: 2}}>{row.asset}</Typography>
                            <CustomChip label={row.type} skin='light' color={getChipTheme(row.type)} style={{marginLeft: 16}}/>
                        </Stack>
                        <Stack direction='row' sx={{flex: '1 1 0%'}}>
                            <Typography variant='h5' sx={{fontWeight: 400}}>{row.borrowAPY}%</Typography>
                        </Stack>
                        <Stack direction='row' sx={{flex: '1 1 0%', alignItems: 'center'}}>
                            <Typography variant='h5' sx={{fontWeight: 400}}>{row.maxLeverage}x&nbsp;</Typography>
                            <Typography variant='subtitle1' color='#98999D'>{row.LTVRatio}% LTV</Typography>
                        </Stack>
                        <Stack direction='row' sx={{flex: '1.25 1 0%', alignItems: 'center'}}>
                            <Typography variant='h5' sx={{fontWeight: 400}} color='primary'>{row.maxDepositAPY}%&nbsp;</Typography>
                            <Icon icon='bi:fire' color={theme.palette.primary.main} fontSize={18}/>
                            <Typography variant='subtitle1' color='#98999D' sx={{display: 'flex', alignItems: 'center'}}>
                                &nbsp;(Base&nbsp;
                                    <Icon icon='mi:circle-information' fontSize={18}/>
                                &nbsp;: {row.baseDepositAPY}%)
                            </Typography>
                        </Stack>
                        <Stack direction='row' sx={{flex: '1.25 1 0%', justifyContent:'space-between', alignItems: 'center'}}>
                            <Stack direction='row' sx={{cursor: 'pointer'}} className='active-open'>
                                Open
                                <Icon style={{marginLeft: 4}} icon='eva:diagonal-arrow-right-up-outline' className='arrow-diagonal'/>
                                <Icon style={{marginLeft: 4}} icon='ph:arrow-right' className='arrow-right'/>
                            </Stack>
                            <Box>
                                <Typography color='primary'>{row.active ? 'Active' : ''}</Typography>
                            </Box>
                            <Icon icon='solar:alt-arrow-down-outline' style={{cursor: 'pointer'}}/>
                        </Stack>
                    </Stack>
                ))}
            </Stack>
        </Box>
    )
}

export default Modules