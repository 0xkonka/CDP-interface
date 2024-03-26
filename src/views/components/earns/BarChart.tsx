import {
    Box, Typography, useTheme, Stack
} from '@mui/material'

import ReactApexcharts from '@/@core/components/react-apexcharts';
import { useState } from 'react'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

interface Props {
    title: string;
    // More props types here
}

export const BarChart = (props: Props) => {
    const {title} = props
    const theme = useTheme()
    const [period, setPeriod] = useState(30)

    const categories = generateCategories();
    function generateCategories() {
      const tempCategories = [];
      const endDate = new Date();
      for (let i = 30; i >= 0; i--) {
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
        }
      },
      colors: ['#67DAB1'],
      dataLabels: { enabled: false },
      plotOptions: {
        bar: {
          borderRadius: 8,
          barHeight: '30%',
          horizontal: false,
          startingShape: 'rounded'
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
        }
      },
      xaxis: {
        tickAmount: 10,
        // axisTicks: { color: theme.palette.divider },
        categories: categories,
        type: 'datetime',
        labels: {
          formatter: function(value, timestamp) {
            if (timestamp === undefined) {
              return '';
            }
            const date = new Date(timestamp);
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return `${monthNames[date.getMonth()]} ${('0' + date.getDate()).slice(-2)}`;
          }
        }
        // labels: {
        //   style: { colors: theme.palette.text.disabled }
        // }
      },
    }

    return (
      <Box>
        <Stack direction='row' mb={4.5} justifyContent='space-between'>
          <Typography fontWeight={600}>{title}</Typography>
          <Stack direction='row' sx={{ cursor: 'pointer' }}>
            <Box sx={{px: 3.5, py: 2.5, fontSize: 14, border: 'solid 1px #2E2E2E', borderTopLeftRadius: 6, borderBottomLeftRadius: 6, borderColor: period == 30 ? theme.palette.primary.main : '#2E2E2E'}}
                onClick={() => setPeriod(30)}>
              30d
            </Box>
            <Box sx={{px: 3.5, py: 2.5, fontSize: 14, border: 'solid 1px #2E2E2E', borderColor: period == 60 ? theme.palette.primary.main : '#2E2E2E'}}
                onClick={() => setPeriod(60)}>
              60d
            </Box>
            <Box sx={{px: 3.5, py: 2.5, fontSize: 14, border: 'solid 1px #2E2E2E', borderTopRightRadius: 6, borderBottomRightRadius: 6, borderColor: period == 90 ? theme.palette.primary.main : '#2E2E2E'}}
                onClick={() => setPeriod(90)}>
              90d
            </Box>
          </Stack>
        </Stack>
        
        <ReactApexcharts
            type='bar'
            height={400}
            options={options}
            // series={[{ data: [72000, 36000, 4200, 65000, 2100, 3500, 15000] }]}
            series={[{
              data: Array.from({ length: 30 }, () => Math.floor(Math.random() * (80000 - 2000 + 1)) + 2000)
            }]}
        />
      </Box>
    )
}