import { useRouter } from 'next/router';

import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
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

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .row--even': {
      backgroundColor: 'transparent',
    },
    '& .row--odd': {
      backgroundColor: '#0F1312',
    },
}));

const useViewportWidth = () => {
    // State to store the current width
    const [width, setWidth] = useState(0);
  
    useEffect(() => {
      // Handler to call on window resize
      const handleResize = () => {
        // Set window width to state
        setWidth(window.innerWidth);
      };
  
      // Add event listener
      window.addEventListener('resize', handleResize);
  
      // Call handler right away so state gets updated with initial window size
      handleResize();
  
      // Remove event listener on cleanup
      return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect runs only on mount and unmount
  
    console.log(width)
    return width;
};
  
const Pools = () => {
    const [rows, setRows] = useState<Pool[]>(initialRows)
    const [filterText, setFilterText] = useState<string>('')
    const [filterOnlyActive, setFilterOnlyActive] = useState<boolean>(true)
    const theme: Theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
    const width = useViewportWidth()
    const router = useRouter()
    
    const columns: GridColDef[] = [
        {
            flex: 0.25,
            field: 'collateral',
            headerName: 'Collateral',
            renderCell: (params) => {
                if(isSmallScreen) {
                    return (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Image 
                                        src={`/images/tokens/${params.row.collateral}.png`}
                                        alt='LinkedIn' width={32} height={32}
                                        style={{ borderRadius: '100%' }}
                                    />
                                    <span style={{fontSize: 18, marginLeft: 16}}>{ params.row.collateral }</span>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <Box>
                                    <Typography variant='body2'>
                                        trenUSD Borrowed
                                    </Typography>
                                    <Typography variant='body1' color='primary'>
                                        { params.row.trenUSD_borrowed }
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <Box>
                                    <Typography variant='body2'>
                                        trenUSD Available
                                    </Typography>
                                    <Typography variant='body1' color='primary'>
                                        { params.row.trenUSD_available }
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <Box>
                                    <Typography variant='body2'>
                                        TVL
                                    </Typography>
                                    <Typography variant='body1' color='primary'>
                                        { params.row.tvl }
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <Box>
                                    <Typography variant='body2'>
                                        Interest
                                    </Typography>
                                    <Typography variant='body1' color='primary'>
                                        { params.row.interest }
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Box sx={{ width: '100%', display: 'flex', gap: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }} 
                                        onClick={() => handleBorrowClick(params.row)}>
                                        <Typography variant='body1'>
                                            Borrow
                                        </Typography>
                                        <Icon fontSize='1.125rem' icon='eva:diagonal-arrow-right-up-fill' />
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }} 
                                        onClick={() => handleLeverageClick(params.row)}>
                                        <Typography variant='body1'>
                                            Leverage
                                        </Typography>
                                        <Icon fontSize='1.125rem' icon='eva:diagonal-arrow-right-up-fill' />
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    )   
                } else {
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Image 
                                src={`/images/tokens/${params.row.collateral}.png`}
                                alt='LinkedIn' width={32} height={32}
                                style={{ borderRadius: '100%' }}
                            />
                            <span>{ params.row.collateral }</span>
                        </Box>
                    )
                }
            }
        },
        {
            flex: isSmallScreen ? 0 : 0.1,
            field: 'tvl',
            headerName: 'TVL',
            minWidth: 140,
            width: 0,
            renderCell: () => {
                if(isSmallScreen)
                    return null
            },
        },
        {
            flex: isSmallScreen ? 0 : 0.15,
            field: 'trenUSD_borrowed',
            headerName: 'trenUSD Borrowed',
            minWidth: 185,
            renderHeader: (params) => {
                const headerName = params.colDef.headerName ?? '';
                return (
                    <span style={{ lineHeight: '1.5em', fontWeight: 'bold', textAlign: 'center',        display: 'block' }}>
                        {headerName.split(' ').map((line, index) => (
                        <Box key={index} sx={{fontSize: theme => theme.typography.h6.fontSize}}>
                            {line}
                            <br />
                        </Box>
                        ))}
                    </span>
                )
            },
            renderCell: () => {
                if(isSmallScreen)
                    return null
            }
        },
        {
            flex: isSmallScreen ? 0 : 0.15,
            field: 'trenUSD_available',
            headerName: 'trenUSD Available',
            minWidth: 185,
            renderHeader: (params) => {
                const headerName = params.colDef.headerName ?? '';
                return (
                    <span style={{ lineHeight: '1.5em', fontWeight: 'bold', textAlign: 'center', display: 'block' }}>
                        {headerName.split(' ').map((line, index) => (
                        <Box key={index} sx={{fontSize: theme => theme.typography.h6.fontSize}}>
                            {line}
                            <br />
                        </Box>
                        ))}
                    </span>
                )
            },
            renderCell: () => {
                if(isSmallScreen)
                    return null
            }
        },
        {
            flex: isSmallScreen ? 0 : 0.1,
            minWidth: 125,
            field: 'interest',
            headerName: 'Interest',
            renderCell: () => {
                if(isSmallScreen)
                    return null
            }
        },
        {
            flex: isSmallScreen ? 0 : 0.25,
            maxWidth: 190,
            field: 'actions',
            headerName: 'Actions',
            renderCell: (params) => {
                if(isSmallScreen) 
                    return null
                
                return (
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }} 
                            onClick={() => handleBorrowClick(params.row)}>
                            <span>Borrow</span>
                            <Icon fontSize='1.125rem' icon='eva:diagonal-arrow-right-up-fill' />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }} 
                            onClick={() => handleLeverageClick(params.row)}>
                            <span>Leverage</span>
                            <Icon fontSize='1.125rem' icon='eva:diagonal-arrow-right-up-fill' />
                        </Box>
                    </Box>
                )
            }
        }
    ]
    if (isSmallScreen) {
        // Hide all columns except for the first one by setting their width to 0
        columns.slice(1).forEach(column => {
          column.minWidth = 0
          column.width = 0
        });
    }
    
    useEffect(() => {
        filterRows()
    }, [filterText, filterOnlyActive])

    const handleBorrowClick = (row:any) => {
        router.push(`/pools/borrow/${row.collateral}`)
        // router.push(`/edit/${row.id}`);
    }
    
    const handleLeverageClick = (row:any) => {
        console.log('Leverage Clicked: ', row)
    }

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
        <Box sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Typography variant='h2' sx={{ mb: 2 }}>
                Pools
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap:2.5, justifyContent: 'space-between', alignItems: 'center', py: 4}}>
                <Box>
                    <FormControl sx={{width: '240px'}}>
                        <InputLabel sx={{background: 'transparent', top: -6}} id='demo-simple-select-outlined-label'>
                            Sort by
                        </InputLabel>
                        <Select
                            label='Sort by'
                            defaultValue=''
                            id='sort-by-select'
                            labelId='sort-by-select-outlined-label'
                            sx={{
                                '.MuiOutlinedInput-input': {
                                  paddingTop: '8px', // Decrease the top padding
                                  paddingBottom: '8px', // Decrease the bottom padding
                                },
                                '.MuiSelect-select': {
                                    minHeight: '32', // Reduce the minimum height if necessary
                                },
                            }}
                        >
                            <MenuItem value='none'>None</MenuItem>
                            <MenuItem value='market_size'>Market Size</MenuItem>
                            <MenuItem value='available_to_borrow'>Available to borrow</MenuItem>
                            <MenuItem value='base_apr'>Base APR</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                    <Typography variant='h6' sx={{ fontWeight: 400, ml: 8 }}>
                        Active Markets Only
                    </Typography>
                    <Switch checked={filterOnlyActive} onChange={handleSwitchChange}
                    />
                </Box>
            </Box>
            <Box style={{ flexGrow: 1 }}>
                <StyledDataGrid 
                    columns={columns} 
                    rows={rows} 
                    disableColumnMenu
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? 'row--even' : 'row--odd'
                    }
                    rowHeight={isSmallScreen ? 200 : 50}
                    sx={{
                        // Conditionally hide the header depending on the screen size
                        '& .MuiDataGrid-columnHeaders': {
                          display: isSmallScreen ? 'none' : 'flex',
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: isSmallScreen ? '1px solid #c3c3c3' : null,
                        },

                    }}
                />
            </Box>
        </Box>
    )
}

export default Pools