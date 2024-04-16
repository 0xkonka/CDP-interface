import {
    Box, Typography, useTheme, Stack
} from '@mui/material'

import ReactApexcharts from '@/@core/components/react-apexcharts';
import { useState, useEffect } from 'react'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'
import { formatToThousands } from '@/hooks/utils';

interface Props {
  title: string
  yAxisLabel: string
    // More props types here
}

export const AreaChart = (props: Props) => {
  const {title, yAxisLabel} = props
  const theme = useTheme()
  const [period, setPeriod] = useState(30)
  const [series, setSeries] = useState<number[]>([])
  const [series1, setSeries1] = useState<number[]>([])
  const [categories, setCategories] = useState<string[]>([])

  useEffect(()=>{
    if (categories.length === 0) {
      setCategories(generateCategories())
    }
    if(series.length === 0) {
      setSeries(Array.from({ length: 90 }, () => Math.floor(Math.random() * 26) + 10))
      setSeries1(Array.from({ length: 90 }, () => Math.floor(Math.random() * 10)))
    }
  }, [])

  function generateCategories() {
    const tempCategories = [];
    const endDate = new Date();
    for (let i = 90; i >= 0; i--) {
      const date = new Date();
      date.setDate(endDate.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      tempCategories.push(dateString);
    }
    return tempCategories;
  }

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
    stroke: {
      // curve: 'stepline',
      width: 1
    },
    colors: ['#67DAB1', '#FF5A75'],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        // barHeight: '90%',
        horizontal: false,
        columnWidth: '40%',
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
      labels: {
        style: { colors: theme.palette.text.disabled }
      },
    },
    xaxis: {
      tickAmount: 10,
      axisBorder: {
        show: true,
        color: '#393939',
      },
      axisTicks: {
        show: false
      },
      // axisTicks: { color: theme.palette.divider },
      categories: categories.slice(Math.max(categories.length - period, 0)),
      type: 'datetime',
      labels: {
        style: { colors: theme.palette.text.disabled },
        formatter: function(value, timestamp) {
          if (timestamp === undefined) {
            return '';
          }
          const date = new Date(timestamp);
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return `${monthNames[date.getMonth()]} ${('0' + date.getDate()).slice(-2)}`;
        }
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
      y: {
        formatter: function (value) {
          return '$ ' + formatToThousands(value).slice(1)
        }
      }
    },
  }

  return (
    <Box>
      <Stack direction='row' mb={4.5} justifyContent='space-between' alignItems='center'>
        <Typography fontWeight={600}>
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
            90d
          </Box>
        </Stack>
      </Stack>
      
      <ReactApexcharts
          type='area'
          height={310}
          options={options}
          // series={[{ data: [72000, 36000, 4200, 65000, 2100, 3500, 15000] }]}
          series={[{
            name: 'Profit',
            data:  series.slice(Math.max(series.length - period, 0))
          },
          {
            name: 'Loss',
            data:  series1.slice(Math.max(series.length - period, 0))
          }
        ]}
      />
    </Box>
  )
}