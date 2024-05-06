import {
    Button, ButtonProps,
    styled
} from '@mui/material'

export const ToggleOnButton = styled(Button)<ButtonProps>(({ theme }) => ({
    borderRadius: '6px', 
    fontWeight: 600, 
    backgroundColor: theme.palette.primary.main, 
    color: '#101617',
    minWidth: 'fit-content',
    paddingLeft: 26,
    paddingRight: 33,
    height: 35,
    '&:hover': {
        backgroundColor: theme.palette.primary.main
    }
}))

export const ToggleOffButton = styled(Button)<ButtonProps>(({ theme }) => ({
    borderRadius: '6px', 
    fontWeight: 400, 
    backgroundColor: '#191D1C', 
    color: '#FFFFFF', 
    border: 'solid 1px #2D3131',
    minWidth: 'fit-content',
    paddingLeft: 26,
    paddingRight: 26,
    height: 35,
    '&:hover': {
        color: 'black',
        backgroundColor: theme.palette.primary.main
    }
}))