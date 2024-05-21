import { Box } from '@mui/material'
import { AreaChart } from "@/views/components/charts/AreaChart"
import { useGlobalValues } from '@/context/GlobalContext'

export const PositionsNet = () => {
    const {radiusBoxStyle} = useGlobalValues()
    return (
        <Box sx={{ ...radiusBoxStyle, mb: 0 }}>
            <AreaChart title='Positions Profit vs. Loss' yAxisLabel='Positions Net PnL'/>
        </Box>
    )
}
