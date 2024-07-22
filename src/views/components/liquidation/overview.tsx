import { Stack, Typography, Tooltip, IconButton, Theme, useTheme } from '@mui/material'
import { useGlobalValues } from '@/context/GlobalContext'
import Icon from '@/@core/components/icon'
import { formatMoney, formatPercent } from '@/hooks/utils'

export const LiquidationOverview = () => {
    const theme: Theme = useTheme()
    const { isSmallScreen, isMediumScreen, radiusBoxStyle } = useGlobalValues()
    const smallBoxStyle = {
        width: '100vw',
        marginLeft: isSmallScreen ? -4 : -8,
        padding: 4,
        marginBottom: 4,
        borderBottom: 'solid 1px',
        borderTop: 'solid 1px',
        borderColor: theme.palette.secondary.dark,
        gap: 10,
        overflowX: 'scroll'
    }
    const computedStyle = isMediumScreen ? smallBoxStyle : radiusBoxStyle

    const labels = [
        {
            key: 'Borrowing Fee',
            tooltip: 'A one time fee paid upon opening a position Tooltip',
            value: formatPercent(0.5, 2)
        },
        {
            key: 'TVL',
            tooltip: 'Total value locked',
            value: '152K ETH ($575M)'
        },
        {
            key: 'Troves',
            tooltip: 'Troves',
            value: '471'
        },
        {
            key: 'LUSD supply',
            tooltip: 'LUSD supply',
            value: formatMoney(81500000),
        },
        {
            key: 'LUSD in Stability Pool',
            tooltip: 'LUSD in Stability Pool',
            value: `${formatMoney(432500000)} (${formatPercent(53, 2)})`
        },
        {
            key: 'Staked LQTY',
            tooltip: 'Staked LQTY',
            value: formatMoney(43900000),
        },
        {
            key: 'Total Collateral Ratio',
            tooltip: 'Total Collateral Ratio',
            value: formatPercent(705.1, 2),
        },
        {
            key: 'RecoveryMode',
            tooltip: 'RecoveryMode',
            value: 'No'
        }
      ]

    return  (
        <Stack direction='row' sx={{ ...computedStyle, flexWrap: isMediumScreen ? 'nowrap' : 'wrap', justifyContent: 'space-between', px: {xs: 4, md: 12}, background: '#1013149C' }}>
        {labels.map((label, index) => (
            <Stack key={index} sx={{ alignItems: 'center', gap: isSmallScreen ? 0 : 1 }}>
            <Typography
                variant='body1'
                color='#707175'
                sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', position:'relative' }}
            >
                {label.key}
                <Tooltip title={label.tooltip} placement='top'>
                <IconButton sx={{ position: 'absolute', bgcolor: 'transparent !important', right: -28 }}>
                    <Icon fontSize='14' icon='simple-line-icons:question' style={{ color: '#707175', cursor: 'pointer' }} />
                </IconButton>
                </Tooltip>
            </Typography>
            <Typography variant='body1' sx={{whiteSpace: 'nowrap'}}>
                {label.value}
                {/* {
                label.key != 'trenUSD Available' ? 
                    label.value : 
                    <span>{label.value} <span style={{color: '#707175'}}> / {label.value2}</span></span>
                } */}
            </Typography>
            </Stack>
        ))}
        </Stack>
    )
}
