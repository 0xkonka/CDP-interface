import {
    Box, Typography, useTheme
} from '@mui/material'

import ReactApexcharts from '@/@core/components/react-apexcharts';

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

interface Props {
    title: string;
    // More props types here
}

export const BarChart = (props: Props) => {
    const {title} = props
    const theme = useTheme()

    const options: ApexOptions = {
        chart: {
          parentHeightOffset: 0,
          toolbar: { show: false }
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
          axisBorder: { show: false },
          axisTicks: { color: theme.palette.divider },
          categories: ['MON, 11', 'THU, 14', 'FRI, 15', 'MON, 18', 'WED, 20', 'FRI, 21', 'MON, 23'],
          labels: {
            style: { colors: theme.palette.text.disabled }
          }
        }
    }

    return (
        <Box>
            <Typography fontWeight={600}>{title}</Typography>
            <ReactApexcharts
                type='bar'
                height={400}
                options={options}
                series={[{ data: [700, 350, 480, 600, 210, 550, 150] }]}
            />
        </Box>
    )
}