import {
    Box, Typography, useTheme, Stack
} from '@mui/material'

import ReactApexcharts from '@/@core/components/react-apexcharts';
import { useState, useEffect } from 'react'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'
import { formatToThousands } from '@/hooks/utils';
import { useGlobalValues } from '@/context/GlobalContext';

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
  const [categories, setCategories] = useState<number[]>([])
  const {isSmallScreen, isMobileScreen} = useGlobalValues()

  useEffect(()=>{
    if (categories.length === 0) {
      setCategories(generateTimestamps())
    }
    if(series.length === 0) {
      setSeries(Array.from({ length: 200 }, () => Math.floor(Math.random() * 26) + 10))
      setSeries1(Array.from({ length: 200 }, () => Math.floor(Math.random() * 8) + 2))
    }
  }, [])

  const generateTimestamps = () => {
    const timestamps = [];
    const endDate = new Date();
    for (let i = 200; i >= 0; i--) {
      const date = new Date();
      date.setDate(endDate.getDate() - i);
      // Convert the date to a timestamp
      const timestamp = date.getTime();
      timestamps.push(timestamp);
    }
    return timestamps;
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
        style: { 
          colors: '#FFF',
          fontSize: isMobileScreen ? '12px' : '15px',
          fontWeight: 400,
        }
      },
    },
    xaxis: {
      tickAmount: 4,
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
        style: { 
          colors: '#FFF',
          fontSize: isMobileScreen ? '12px' : '15px',
          fontWeight: 400,
        },
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
        formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
          // Create an array of month names
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          
          // Use the given value (timestamp) to create a new Date object
          const date = new Date(value);
      
          // Use the month from the date and get the correct month name from the array
          const monthName = monthNames[date.getMonth()];
      
          // Format the date as 'Mar 2, 2024'
          return `${monthName} ${date.getDate()}, ${date.getFullYear()}`;
        }
      },
      y: {
        formatter: function (value) {
          return '$ ' + formatToThousands(value).slice(1)
        }
      }
    },
    legend: {
      show: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0,
        opacityTo: 0.2,
        stops: [0, 100],
        type: 'vertical',
        colorStops: [
          [
            {
              offset: 0,
              color: '#67DAB1',
              opacity: 0.2
            },
            {
              offset: 100,
              color: '#67DAB1',
              opacity: 0
            }
          ],
          [
            {
              offset: 0,
              color: '#FF5A75',
              opacity: 0.2
            },
            {
              offset: 100,
              color: '#FF5A75',
              opacity: 0
            }
          ]
        ]
      }
    }
  }

  return (
    <Box>
      <Stack direction='row' mb={4.5} justifyContent='space-between' alignItems='center' marginBottom={isSmallScreen ? 4 : 15} gap={2}>
        <Typography fontWeight={600} sx={{fontSize: {xs: 14, sm: 18}, ml: {xs: 0, sm: 8}}} >
          {title}
        </Typography>
        <Stack direction='row' sx={{ cursor: 'pointer' }}>
          <Box sx={{px: {xs: 2, sm: 3.5}, py: {xs: 1.5, sm: 2}, fontSize: 14, border: 'solid 1px #2E2E2E', borderTopLeftRadius: 6, borderBottomLeftRadius: 6, borderColor: period == 30 ? theme.palette.primary.main : '#2E2E2E'}}
              onClick={() => setPeriod(30)}>
            30d
          </Box>
          <Box sx={{px: {xs: 2, sm: 3.5}, py: {xs: 1.5, sm: 2}, fontSize: 14, border: 'solid 1px #2E2E2E', borderColor: period == 60 ? theme.palette.primary.main : '#2E2E2E'}}
              onClick={() => setPeriod(60)}>
            60d
          </Box>
          <Box sx={{px: {xs: 2, sm: 3.5}, py: {xs: 1.5, sm: 2}, fontSize: 14, border: 'solid 1px #2E2E2E', borderTopRightRadius: 6, borderBottomRightRadius: 6, borderColor: period == 200 ? theme.palette.primary.main : '#2E2E2E'}}
              onClick={() => setPeriod(200)}>
            All
          </Box>
        </Stack>
      </Stack>
      
      <ReactApexcharts
          type='area'
          height={isSmallScreen ? 300 : 400}
          options={options}
          // series={[{ data: [72000, 36000, 4200, 65000, 2100, 3500, 15000] }]}
          series={[{
            name: 'Profit',
            data:  series.slice(Math.max(series.length - period, 0)),
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