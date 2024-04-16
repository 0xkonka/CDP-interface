import { Box } from '@mui/material'
import { AreaChart } from "@/views/components/earns/AreaChart"
import { useGlobalValues } from '@/context/GlobalContext'

export const PositionsNet = () => {
    const {radiusBoxStyle} = useGlobalValues()
    return (
        <Box sx={{ ...radiusBoxStyle, pt: {xs: 1, md: 6} }}>
            <AreaChart title='Positions Profit vs. Loss' yAxisLabel='Positions Net PnL'/>
        </Box>
    )
}
