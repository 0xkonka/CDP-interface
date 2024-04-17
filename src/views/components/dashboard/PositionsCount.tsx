import { Box } from '@mui/material'
import { MultiBarchart } from "@/views/components/charts/MultiBarchart"
import { useGlobalValues } from '@/context/GlobalContext'

export const PositionsCount = () => {
    const {radiusBoxStyle} = useGlobalValues()
    return (
        <Box sx={{ ...radiusBoxStyle }}>
            <MultiBarchart title='Positions Profit vs. Loss' yAxisLabel='Numbers of Positions'/>
        </Box>
    )
}
