import { Box, Typography, useTheme } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import ReactApexcharts from '@/@core/components/react-apexcharts';

const areaColors = {
    series1: '#6795DA',
    series2: '#67DAB1'
}

interface Props {
    title: string
}

export const PositionLineChart = (props: Props) => {
    const {title} = props
    // ** Hook
    const theme = useTheme()
    const series = [
        {
          name: 'Current',
          data: [15, 20, 25, 30, 40, 60, 100]
        },
        {
          name: 'Potential',
          data: [50, 60, 70, 90, 110, 140, 200]
        },
    ]
    const options: ApexOptions = {
        chart: {
            parentHeightOffset: 0,
            toolbar: { show: false },
            zoom: {
                enabled: false // This disables the zoom functionality
            }
        },
        tooltip: { shared: false },
        dataLabels: { enabled: false },
        stroke: {
            width: 1,
            show: true,
            curve: 'straight'
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          labels: { colors: theme.palette.text.secondary },
          markers: {
            offsetY: 1,
            offsetX: -3
          },
          itemMargin: {
            vertical: 3,
            horizontal: 20
          }
        },
        colors: [areaColors.series1, areaColors.series2],
        fill: {
          opacity: 0.1,
          type: 'solid'
        },
        grid: {
          show: true,
          strokeDashArray: 4,
          borderColor: theme.palette.divider,
          xaxis: {
            lines: { show: true }
          }
        },
        yaxis: {
          labels: {
            show: false,
            style: { colors: theme.palette.text.disabled }
          }
        },
        xaxis: {
          axisBorder: { show: false },
          axisTicks: {
            show: false // This hides the tick points on the x-axis
          },
          crosshairs: {
            stroke: { color: theme.palette.divider }
          },
          labels: {
            style: { colors: theme.palette.text.disabled }
          },
          categories: [
            'Apr 1',
            'Apr 2',
            'Apr 3',
            'Apr 4',
            'Apr 5',
            'Apr 6',
            'Apr 7'
          ]
        }
    }

    return (
        <Box position='relative'>
            <Typography sx={{position: 'absolute', top: 8, left: 20}}>Points</Typography>
            <ReactApexcharts type='area' height={350} options={options} series={series} />
        </Box>
    )
}