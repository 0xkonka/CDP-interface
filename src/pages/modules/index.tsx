// External libraries
import React, { useEffect, useState } from 'react'
import {
    Typography, Box, InputAdornment, Switch, Stack,
} from '@mui/material'

// Core template components
import Icon from '@/@core/components/icon'
import CustomTextField from '@/@core/components/mui/text-field'
import SortByDropdown from '@/@core/components/sortby-dropdown'

// Project component views
import HeaderInfo from '@/views/headerInfo'
import CollateralRow from '@/views/collateralRow'
import { ToggleOnButton, ToggleOffButton } from '@/views/components/buttons'

// Contexts & Types
import { useGlobalValues } from '@/context/GlobalContext'
import { CollateralType } from '@/types/collateral/types'

// Utilities
import { getOverView } from '@/hooks/utils'
import { LiquityStoreState } from '@/lib-base'
import { useLiquitySelector } from '@/lib-react'

const collaterals = ['stETH']
const initialRows: CollateralType[] = collaterals.map((value, index) => {
    return {id: index + 1, ...getOverView(value)}
}).filter(collateral => collateral !== undefined) as CollateralType[];

const select = ({
    numberOfTroves,
    price,
    total,
    lusdInStabilityPool,
    borrowingRate,
    redemptionRate,
    totalStakedLQTY,
    frontend
  }: LiquityStoreState) => ({
    numberOfTroves,
    price,
    total,
    lusdInStabilityPool,
    borrowingRate,
    redemptionRate,
    totalStakedLQTY,
    kickbackRate: frontend.status === "registered" ? frontend.kickbackRate : null
  });
  

const Modules = () => {
    const [filterText, setFilterText] = useState<string>('')
    const [filterOnlyActive, setFilterOnlyActive] = useState<boolean>(false)
    const [assetFilter, setAssetFilter] = useState<string>('All')
    const [openRowIndex, setOpenRowIndex] = useState<number>(-1)
    const [sortBy, setSortBy] = useState<string>('+asset')
    const [rows, setRows] = useState<CollateralType[]>(initialRows)
    
    const assetTypes:string[] = ['All', 'LRT', 'LST', 'RWA', 'LP Token', 'Vault', 'PT Token', 'Meme', 'Volatile', 'Stable']
    const {isSmallScreen, isMediumScreen} = useGlobalValues()

    const {
        numberOfTroves,
        price,
        lusdInStabilityPool,
        total,
        borrowingRate,
        totalStakedLQTY,
        kickbackRate
      } = useLiquitySelector(select);

      console.log('price', +price)
      console.log('lusdInStabilityPool', +lusdInStabilityPool)
      console.log('total collateral', +total.collateral)
      console.log('total debt', +total.netDebt)
      console.log('borrowingRate', +borrowingRate)

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
                            <ToggleOnButton key={index} onClick={() => {setAssetFilter(value)}}>
                                {value + ' ' + rows.length}
                            </ToggleOnButton> :
                            <ToggleOffButton key={index} onClick={() => {setAssetFilter(value)}}>
                                {value}
                            </ToggleOffButton>
                    })
                }
            </Box>
            
            {/* Collateral Table Header */}
            <Stack direction='row' sx={{px: 6, pt: 2, display: {
                xs: 'none', lg: 'flex'
            }}}>
                <Stack sx={{flex: '2 1 0%', alignItems: 'center', cursor: 'pointer'}} direction='row'>
                    Asset
                </Stack>
                <Stack sx={{flex: '1 1 0%', alignItems: 'center', cursor: 'pointer'}} direction='row'>
                    Borrow APY
                </Stack>
                <Stack sx={{flex: '1 1 0%', alignItems: 'center', cursor: 'pointer'}} direction='row'>
                    MAX Leverage
                </Stack>
                <Stack sx={{flex: '2.5 1 0%', alignItems: 'center', cursor: 'pointer'}} direction='row'>
                    Deposit APY
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