import {
    Box, Typography, useTheme, Stack
} from '@mui/material'

import ReactApexcharts from '@/@core/components/react-apexcharts';
import { useState, useEffect } from 'react'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'
import { useGlobalValues } from '@/context/GlobalContext';

interface Props {
  title?: string
  yAxisLabel?: string
    // More props types here
}

export const MultiBarchart = (props: Props) => {
  const {title, yAxisLabel} = props
  const theme = useTheme()
  const [period, setPeriod] = useState(30)
  const [seriesProfit, setSeriesProfit] = useState<number[]>([])
  const [seriesLoss, setSeriesLoss] = useState<number[]>([])
  const [categories, setCategories] = useState<string[]>(['TST', 'WETH', 'FURY'])
  const {isSmallScreen} = useGlobalValues()
  const ticksAmount = Math.max(10, categories.length)

  useEffect(()=>{
    if(seriesProfit.length === 0) {
      setSeriesProfit(Array.from({ length: categories.length }, () => Math.floor(Math.random() * 18 + 18)))
      setSeriesLoss(Array.from({ length: categories.length }, () => Math.floor(Math.random() * 12 + 2)))
    }
  }, [])
  
  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      zoom: {
        enabled: false
      },
      animations: {
        enabled: false,
      }
    },
    colors: ['#67DAB1', '#FF5A75'],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        startingShape: 'rounded',
        horizontal: false,
        columnWidth: isSmallScreen ? '60%' : '30%',
        borderRadius: 8
      }
    },
    grid: {
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: false }
      },
      padding: {
        top: -10
      }
    },
    yaxis: {
      title: {
        text: isSmallScreen ? undefined : yAxisLabel,
        offsetX: -10,
        style: {
          color: '#98999D',
          fontSize: '18px',
          fontWeight: 400,
        }
      },
      labels: {
        style: { colors: '#FFF', fontSize: '15px' },
      },
    },
    xaxis: {
      tickAmount: ticksAmount,
      axisBorder: {
        show: true,
        color: '#393939',
      },
      axisTicks: {
        show: false
      },
      categories: [...categories, ...Array(Math.max(0, ticksAmount - categories.length)).fill('')],
      type: 'category',
      labels: {
        style: { colors: '#FFF', fontSize: '15px' },
      },
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '16px',
        fontFamily: undefined,
      },
      x: {
        format: 'dd MMM yyyy' // Format date for x-axis tooltip
      },
    },
    legend: {
      show: false,
    },
  }

  return (
    <Box>
      <Stack direction={isSmallScreen ? 'column' : 'row'} mb={4.5} justifyContent='space-between' alignItems={isSmallScreen ? 'end' : 'center'} marginBottom={isSmallScreen ? 10 : 15} gap={2}>
        <Typography fontWeight={600} sx={{fontSize: 18, ml: 8}} >
          {title}
        </Typography>
        <Stack direction='row' sx={{ cursor: 'pointer' }}>
          <Box sx={{px: 3.5, py: 2, fontSize: 14, border: 'solid 1px #2E2E2E', borderTopLeftRadius: 6, borderBottomLeftRadius: 6, borderColor: period == 30 ? theme.palette.primary.main : '#2E2E2E'}}
              onClick={() => setPeriod(30)}>
            30d
          </Box>
          <Box sx={{px: 3.5, py: 2, fontSize: 14, border: 'solid 1px #2E2E2E', borderColor: period == 60 ? theme.palette.primary.main : '#2E2E2E'}}
              onClick={() => setPeriod(60)}>
            60d
          </Box>
          <Box sx={{px: 3.5, py: 2, fontSize: 14, border: 'solid 1px #2E2E2E', borderTopRightRadius: 6, borderBottomRightRadius: 6, borderColor: period == 90 ? theme.palette.primary.main : '#2E2E2E'}}
              onClick={() => setPeriod(90)}>
            All
          </Box>
        </Stack>
      </Stack>
      
      <ReactApexcharts
          type='bar'
          height={isSmallScreen ? 300 : 400}
          options={options}
          series={[{
            name: 'Profit',
            data: [...seriesProfit, ...Array(Math.max(0, ticksAmount - categories.length)).fill(0)]
          },{
            name: 'Loss',
            data: [...seriesLoss, ...Array(Math.max(0, ticksAmount - categories.length)).fill(0)]
          }]}
      />
    </Box>
  )
}