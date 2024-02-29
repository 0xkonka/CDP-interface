import {
    Button, ButtonProps,
    styled
} from '@mui/material'

export const ToogleOnButton = styled(Button)<ButtonProps>(({ theme }) => ({
    borderRadius: '50px', 
    fontWeight: 600, 
    backgroundColor: theme.palette.primary.main, 
    color: '#101617',
    minWidth: 'fit-content',
    paddingLeft: 20,
    paddingRight: 20,
    height: 35,
    '&:hover': {
        backgroundColor: theme.palette.primary.main
    }
}))

export const ToogleOffButton = styled(Button)<ButtonProps>(({ theme }) => ({
    borderRadius: '50px', 
    fontWeight: 400, 
    backgroundColor: '#191D1C', 
    color: '#FFFFFF', 
    border: 'solid 1px #2D3131',
    minWidth: 'fit-content',
    paddingLeft: 20,
    paddingRight: 20,
    height: 35,
    '&:hover': {
        color: 'black',
        backgroundColor: theme.palette.primary.main
    }
}))