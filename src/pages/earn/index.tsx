import { Box, Typography, Stack } from '@mui/material'
import { useGlobalValues } from '@/context/GlobalContext'
import { formatToThousands } from '@/hooks/utils'
import { ToggleOnButton, ToggleOffButton } from '@/views/components/buttons'

import { useProtocol } from '@/context/ProtocolProvider/ProtocolContext'
import { CollateralParams } from '@/context/ModuleProvider/type'
import { getOverView } from '@/hooks/utils'

import React, {useState, useMemo, useEffect} from'react'
import { EarnRow } from '@/views/components/earns/EarnRow'
import { SortableHeaderItem } from '@/views/components/global/SortableHeaderItem'
import { StabilityPool } from '@/views/components/earns/StabilityPool'

const Earn = () => {
    const { isSmallScreen, isMediumScreen } = useGlobalValues()
    const [networkFilter, setNetworkFilter] = useState<string>('All')
    const [openRowIndex, setOpenRowIndex] = useState<number>(-1)
    const [sortBy, setSortBy]= useState('symbol')
    const [direction, setDirection] = useState('asc')

    const networkTypes: string[] = [
        'All', 'Ethereum', 'Binance', 'Polygon', 'Avalanche', 'Solana'
    ];
    const { collateralDetails } = useProtocol()
    const headerItems = [
        {
            label: 'Pools',
            key: 'symbol',  // This is sort key.
            flexWidth: 2,
            sortable: true
        },
        {
            label: 'Platform',
            key: 'platform',
            flexWidth: 1,
            sortable: true
        },
        {
            label: 'APY',
            key: 'borrowAPY',
            flexWidth: 1.5,
            sortable: true
        },
        {
            label: 'Liquidity',
            key: 'liquidity',
            flexWidth: 1.25,
            sortable: true
        },
        {
            label: '',
            key: '',
            flexWidth: 1,
            sortable: false
        },
    ]

    const rows = useMemo(() => {
        if (collateralDetails && collateralDetails.length > 0) {
        const _rows: CollateralParams[] = collateralDetails
            .map((collateral: CollateralParams, index) => {
            return {
                id: index + 1,
                ...collateral,
                ...getOverView(collateral.symbol),
                maxDepositAPY: +collateral.baseAPY.toFixed(3) + 30
            }
            })
            .filter(collateral => collateral !== undefined) as CollateralParams[]
        return _rows
        }
        return []
    }, [collateralDetails])

    const [filteredRows, setRows] = useState<CollateralParams[]>(rows)
    const handleRowClick = (index: number) => {
        setOpenRowIndex(openRowIndex === index ? -1 : index)
    }
    
    const setSortDetail = (sortBy: string, direction: string) => {
        setSortBy(sortBy)
        setDirection(direction)
    }

    // Comprehensive filter function
    const filterRows = () => {
        let newRows = rows
        if (networkFilter != 'All') {
            newRows = newRows.filter(row => row.network == networkFilter)
        }
        setRows(newRows)
    }
    
    useEffect(() => {
        filterRows()
    }, [rows, networkFilter])

      // Sory by different specs
  useEffect(() => {
    const sortKey = sortBy
    console.log(sortKey, direction)

    setRows(rows => {
      const sortedRows = [...rows]
      if (direction == 'desc') {
        return sortedRows.sort((a, b) => {
          if (a[sortKey] > b[sortKey]) {
            return -1
          }
          if (a[sortKey] < b[sortKey]) {
            return 1
          }
          return 0
        })
      } else if (direction == 'asc') {
        return sortedRows.sort((a, b) => {
          if (a[sortKey] < b[sortKey]) {
            return -1
          }
          if (a[sortKey] > b[sortKey]) {
            return 1
          }
          return 0
        })
      } else {
        return sortedRows
      }
    })
  }, [sortBy, direction])

    return (
        <Box>
            <Typography className='header-gradient' variant='h1'sx={{
                    mb: { xs: 4, md: 8 }, mt: 8,
                    fontSize: { xs: 36, md: 64, xl: 72 }
                }}
            >
                Earn
            </Typography>
            <Stack direction={isMediumScreen ? 'column' : 'row'} justifyContent='space-between' sx={{mb: { xs: 8, md: 16 }}} gap={8}>
                <Typography variant={isSmallScreen ? 'subtitle1' : 'h5'} color='#F3F3F3'
                    sx={{ fontWeight: 300, width: 730, maxWidth: '100%', lineHeight: { xs: 1.25, sm: 1.7 } }}>
                    Deposit your collateral tokens into a module in exchange for a trenUSD loan or Loop 
                    your assets in one click to leverage exposure for your spot assets. Pay back your loan later using trenUSD or your collateral.
                </Typography>
                <Stack direction='row' sx={{ width: { xs: 1, md: 'auto' }, gap: { xs: 8, md: 16 } }}>
                    <Box>
                        <Typography variant={isSmallScreen ? 'subtitle2' : 'subtitle1'} sx={{ mb: 1 }} color='#C6C6C7' fontWeight={400}>
                            Total Staked
                        </Typography>
                        <Typography variant={isSmallScreen ? 'subtitle1' : 'h4'} sx={{ fontWeight: 600 }}>
                            $ {formatToThousands(200000).slice(1)}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant={isSmallScreen ? 'subtitle2' : 'subtitle1'} sx={{ mb: 1 }} color='#C6C6C7' fontWeight={400}>
                            TREN per day
                        </Typography>
                        <Typography variant={isSmallScreen ? 'subtitle1' : 'h4'} sx={{ fontWeight: 600 }}>
                            $ {formatToThousands(150000).slice(1)}
                        </Typography>
                    </Box>
                </Stack>
            </Stack>
            <StabilityPool/>
            <Box sx={{ display: 'flex', gap: 4, overflowX: 'auto', py: {xs: 4, md: 10} }}>
                {networkTypes.map((value, index) => {
                    return value == networkFilter ? (
                        <ToggleOnButton
                            key={index}
                            onClick={() => {
                                setNetworkFilter(value)
                            }}
                        >
                            <span style={{ marginLeft: -6 }}>{value}</span>
                            <span style={{ position: 'absolute', right: 19 }}>
                                {filteredRows.length}
                            </span>
                        </ToggleOnButton>
                    ) : (
                        <ToggleOffButton
                            key={index}
                            onClick={() => {
                                setNetworkFilter(value)
                            }}
                        >
                            {value}
                        </ToggleOffButton>
                    )
                    })}
            </Box>
            {/* Collateral Table Header */}
            <Stack direction='row' sx={{
                px: 6, pt: 2, 
                display: {
                    xs: 'none',
                    lg: 'flex'
                }
            }}>
                {headerItems.map((item, index) => (
                    <SortableHeaderItem 
                        key={index}
                        label={item.label}
                        flexWidth={item.flexWidth}
                        sortBy={item.key}
                        direction={item.key == sortBy ? direction : 'none'}
                        onSort={setSortDetail}
                        sortable={item.sortable}
                    />
                ))}
            </Stack>

            {/* Collateral Group Stack*/}
            {collateralDetails && (
                <Stack sx={{ mt: 4 }} gap={isMediumScreen ? 5 : 0}>
                {filteredRows.length > 0 ? (
                    filteredRows.map((row, index) => (
                    <EarnRow
                        row={row}
                        onToogle={() => handleRowClick(index)}
                        isOpen={openRowIndex === index}
                        key={index}
                    />
                    ))
                ) : (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                        <Typography variant='body1'>No matching collateral</Typography>
                    </Box>
                )}
                </Stack>
            )}
        </Box>
    )
}

export default Earn