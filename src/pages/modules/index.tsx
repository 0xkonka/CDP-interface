import { useRouter } from 'next/router';

import { 
    Typography,
    Button, ButtonProps,
    Box,
    InputAdornment,
    Switch,
    Stack,
    // methods
    styled,
    useTheme, Theme,
    useMediaQuery
 } from '@mui/material'

// ** Core Components Import
import Icon from '@/@core/components/icon'
import CustomTextField from '@/@core/components/mui/text-field'
import SortByDropdown from '@/@core/components/sortby-dropdown'

// Import Basic React
import React, { useEffect, useState } from 'react'

// ** Types
import { CollateralType } from '@/types/collateral/types'

// Import Subviews
import HeaderInfo from '@/pages/modules/headerInfo'
import CollateralRow from '@/pages/modules/collateralRow'
import { useContractRead, useNetwork } from 'wagmi';

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
        backgroundColor: theme.palette.primary.main
    }
}))
const initialRows: CollateralType[] = [];

const Modules = () => {
    const [filterText, setFilterText] = useState<string>('')
    const [filterOnlyActive, setFilterOnlyActive] = useState<boolean>(false)
    const [assetFilter, setAssetFilter] = useState<string>('All')
    const [openRowIndex, setOpenRowIndex] = useState<number>(-1)
    const [sortBy, setSortBy] = useState<string>('+asset')
    const [rows, setRows] = useState<CollateralType[]>([])
    const router = useRouter()
    const { chain : chainId } = useNetwork()
    
    const assetTypes:string[] = ['All', 'LRT', 'LST', 'RWA', 'LP Token', 'Vault', 'PT Token', 'Meme', 'Volatile', 'Stable']
    const theme: Theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('lg'))

    


    const handleRowClick = (index: number) => {
        setOpenRowIndex(openRowIndex === index ? -1 : index);
    }

    useEffect(() => {
        filterRows()
    }, [filterText, filterOnlyActive, assetFilter])

    // Sory by different specs
    useEffect(() => {
        const direction = sortBy[0]
        const sortKey = sortBy.substring(1)

        setRows((rows) => {
            const sortedRows = [...rows]; 
            if(direction == '-') {
                return sortedRows.sort((a, b) => {
                    if (a[sortKey] > b[sortKey]) {
                        return -1;
                    }
                    if (a[sortKey] < b[sortKey]) {
                        return 1;
                    }
                    return 0;
                });
            } else {
                return sortedRows.sort((a, b) => {
                    if (a[sortKey] < b[sortKey]) {
                        return -1;
                    }
                    if (a[sortKey] > b[sortKey]) {
                        return 1;
                    }
                    return 0;
                });
            }
        })
    }, [sortBy])

    // Comprehensive filter function
    const filterRows = () => {
        let newRows = initialRows.filter((row) => row.asset.toLocaleLowerCase().includes(filterText.toLowerCase()))
        if(assetFilter != 'All') {
            newRows = newRows.filter((row) => row.type == assetFilter)
        }
        if(filterOnlyActive == true)
            newRows = newRows.filter((row) => row.active)
        setRows(newRows)
    }

    // Event : Search filter text value changes
    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setFilterText(value)
        filterRows()
    }
    
    // Event : Open Positions Only Toogle changes
    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked
        setFilterOnlyActive(isChecked)
        filterRows()
    }

    return (
        <Box>
            <HeaderInfo/>
            {/* Search and Multi Select Filter Section */}
            <Stack direction='row' sx={{ flexWrap: 'wrap', gap:2.5, justifyContent: 'space-between', alignItems: 'center', pb: 6}}>
                <Stack direction='row' sx={{ flexWrap: 'wrap', alignItems: 'center', gap: 4, order: {xs: 1, md: 0}, width: {xs: 1, md: 'auto'} }}>
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
                        sx={{
                            height: isSmallScreen ? 44 : 52,
                            flex: {xs: 1, md: 'auto'},
                            '& .MuiInputBase-root': {
                                width: 1,
                                height: 1,
                                '& input': {
                                    fontSize: isSmallScreen ? 16 : 18
                                }
                            }
                        }}
                    />
                    <SortByDropdown sortBy={sortBy} setSortBy={setSortBy} fields={[
                        {key: 'asset', label: 'Name'},
                        {key: 'borrowAPY', label: 'borrow APY'},
                        {key: 'maxLeverage', label: 'Max Leverage'},
                        {key: 'LTVRatio', label: 'LTV Ratio'},
                        {key: 'maxDepositAPY', label: 'Max Deposit APY'},
                        {key: 'baseDepositAPY', label: 'Base Deposit APY'},
                    ]}/>
                </Stack>
                <Stack direction='row' sx={{ width: {xs: 1, md: 'auto'}, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='h6' sx={{ fontWeight: 400, mt: 1 }}>
                        Open Positions Only
                    </Typography>
                    <Switch checked={filterOnlyActive} onChange={handleSwitchChange} />
                </Stack>
            </Stack>
            {/* Token Types Buttons Section */}
            <Box sx={{display: 'flex', gap: 4, overflowX: 'auto', pb: 10}}>
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
            <Stack direction='row' sx={{px: 6, pt: 2, display: {
                xs: 'none', lg: 'flex'
            }}}>
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
            <Stack sx={{mt: 4}} gap={isMediumScreen ? 5 : 0}>
                {rows.length > 0 ? 
                rows.map((row, index) => (
                    <CollateralRow row={row} onToogle={() => handleRowClick(index)} isOpen={openRowIndex === index} key={index}/>
                )) : 
                <Box sx={{p: 6, textAlign: 'center'}}>
                    <Typography variant='body1'>No matching collateral</Typography>
                </Box>
                }
            </Stack>
        </Box>
    )
}

export default Modules