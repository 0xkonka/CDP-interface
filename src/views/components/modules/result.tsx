// MUI imports and hooks
import { useGlobalValues } from "@/context/GlobalContext"
import { formatToThousands } from "@/hooks/utils"
import {
    Grid, Stack, Typography
} from '@mui/material'

interface Props {
    featureValue?: number
    liquidationPrice: number
    ltv: number
    collateralValue: number
    loanValue: number
}

export const Result = (props: Props) => {
    const {featureValue, liquidationPrice, ltv, collateralValue, loanValue} = props
    const {isSmallScreen} = useGlobalValues()
    
    return (
        <Grid container spacing={isSmallScreen ? 4 : 8} sx={{justifyContent: 'space-between'}}>
            {featureValue != undefined &&
            <Grid item xs={12} md={6} lg={featureValue != undefined ? 2.4 : 3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', borderBottom: 'solid 1px #2C2D33', pb:1}}>
                    <Typography variant='body1' sx={{fontWeight: 600}}>
                        Feature value
                    </Typography>
                    <Typography variant='body1' sx={{fontWeight: 600}}>
                        {featureValue}
                    </Typography>
                </Stack>
            </Grid>}
            <Grid item xs={12} md={6} lg={featureValue != undefined ? 2.4 : 3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', borderBottom: 'solid 1px #2C2D33', pb:1}}>
                    <Typography variant='body1'>
                        Liquidation Price
                    </Typography>
                    <Typography variant='body1'>
                        {liquidationPrice}
                    </Typography>
                </Stack>
            </Grid>
            <Grid item xs={12} md={6} lg={featureValue != undefined ? 2.4 : 3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', borderBottom: 'solid 1px #2C2D33', pb:1}}>
                    <Typography variant='body1'>
                        LTV
                    </Typography>
                    <Typography variant='body1'>
                        {ltv}%
                    </Typography>
                </Stack>
            </Grid>
            <Grid item xs={12} md={6} lg={featureValue != undefined ? 2.4 : 3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', borderBottom: 'solid 1px #2C2D33', pb:1}}>
                    <Typography variant='body1'>
                        Collateral Value
                    </Typography>
                    <Typography variant='body1'>
                        {formatToThousands(collateralValue)}
                    </Typography>
                </Stack>
            </Grid>
            <Grid item xs={12} md={6} lg={featureValue != undefined ? 2 : 3}>
                <Stack direction='row' sx={{justifyContent: 'space-between', borderBottom: 'solid 1px #2C2D33', pb:1}}>
                    <Typography variant='body1'>
                        Loan Value
                    </Typography>
                    <Typography variant='body1'>
                        {formatToThousands(loanValue)}
                    </Typography>
                </Stack>
            </Grid>
        </Grid>
    )
}