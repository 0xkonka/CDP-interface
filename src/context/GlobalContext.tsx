// React related imports
import React, {
    Fragment,
    ReactNode,
    createContext,
    useContext,
    useState,
    Ref,
    forwardRef,
    ReactElement,
} from 'react'

// Material-UI components and hooks
import {
    Box,
    Typography,
    Dialog,
    Stack,
    Button,
    useTheme,
    Theme,
    Slide,
    SlideProps,
    useMediaQuery,
} from '@mui/material'

// Core Components Imports
import CleaveWrapper from '@/@core/styles/libs/react-cleave'
import Icon from '@/@core/components/icon'

// CleaveJS Imports for input formatting
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'

interface GlobaContextValue {
    slippageTolerance: number;
    setOpenSlippage: (value: boolean) => void; 
    isSmallScreen: boolean;
    isMediumScreen: boolean;
    isLargeScreen: boolean;
}

const defaultValues: GlobaContextValue = {
    slippageTolerance: 0.5,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setOpenSlippage: () => {},
    isSmallScreen: false,
    isMediumScreen: false,
    isLargeScreen: false
}

const Transition = forwardRef(function Transition(
    props: SlideProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Slide direction='up' ref={ref} {...props} />
})

const GlobalContext = createContext<GlobaContextValue>(defaultValues)

interface Props {
    children: ReactNode;
}

export const GlobalProvider: React.FC<Props> = ({ children }) => {
    const [slippageTolerance, setSlippageTolerance] = useState<number>(defaultValues.slippageTolerance)
    const [modeAuto, setModeAuto] = useState<boolean>(true)
    const [openSlippage, setOpenSlippage] = useState<boolean>(false)
    const theme: Theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('lg'))
    const isLargeScreen = useMediaQuery(theme.breakpoints.down('xl'))

    // Event : Change Slippage percent
    const changeSlippagePerent = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setModeAuto(value.length == 0)
        setSlippageTolerance((value && !Number.isNaN(Number(value))) ? Number(value) : 0.5)
    }

    const value = {
        slippageTolerance,
        setOpenSlippage,
        isSmallScreen,
        isMediumScreen,
        isLargeScreen
    }

    return (
        <GlobalContext.Provider value={value}>
            {children}
            {/* ===== Here are modals which will be used several times - Jordan */}
            {/* Repay Slippage Tolerance Popup */}
            <Fragment>
                <Dialog
                    open={openSlippage}
                    keepMounted
                    onClose={() => {setOpenSlippage(false)}}
                    TransitionComponent={Transition}
                    maxWidth='xs'
                    fullWidth={true}
                    aria-labelledby='alert-dialog-slide-title'
                    aria-describedby='alert-dialog-slide-description'
                >
                    <Box sx={{ p: 6, position: 'relative' }}>
                        <Typography sx={{textAlign: 'center', mb: 8, fontWeight: 600}} variant='h4'>
                            Slippage Tolerance
                        </Typography>
                        <Icon style={{position: 'absolute', right: 20, top: 20, cursor: 'pointer', fontWeight: 'bold'}} icon='tabler:x' fontSize='1.75rem' onClick={() => {setOpenSlippage(false)}}/>
                        <Typography sx={{textAlign: 'center', maxWidth: 490, m: 'auto'}}>
                            Price slippage is the difference in prices between the time a market order is placed and the time it completes on the blockchain or is filled.
                        </Typography>
                        <Stack direction='row' sx={{mt: 4, justifyContent: 'center', gap: 4}}>
                            <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'space-between', borderRadius: 2, border: 'solid 1px #C6C6C74D'}}>
                                <Button variant='outlined' onClick={() => {setModeAuto(true), setSlippageTolerance(0.5)}}
                                    sx={{borderRadius: 2, px: 4, py: 2, fontSize: 16, fontWeight: 400, color: 'white',
                                        border: modeAuto ? 'auto' : 'solid 1px transparent',
                                        '&:hover': {
                                            borderColor: modeAuto ? theme.palette.primary.main : 'transparent'
                                        }
                                    }}>
                                    Auto
                                </Button>
                                <Button variant='outlined' onClick={() => {setModeAuto(false), setSlippageTolerance(slippageTolerance ? slippageTolerance : 0.5)}}
                                    sx={{borderRadius: 2, px: 3, py: 2, fontSize: 16, fontWeight: 400, color: 'white', 
                                        border: modeAuto ? 'solid 1px transparent' : 'auto',
                                        '&:hover': {
                                            borderColor: modeAuto ? 'transparent' : theme.palette.primary.main
                                        }
                                    }}>
                                    Custom
                                </Button>
                            </Stack>
                            <CleaveWrapper style={{position: 'relative'}}>
                                <Cleave id='slippage-percentage' 
                                    placeholder='0.5' 
                                    options={{ 
                                        numeral: true,
                                        numeralThousandsGroupStyle: 'thousand',
                                        numeralDecimalScale: 2, // Always show two decimal points
                                        numeralDecimalMark: '.', // Decimal mark is a period
                                        stripLeadingZeroes: false // Prevents stripping the leading zero before the decimal point
                                    }} 
                                    style={{paddingRight: 28, textAlign: 'end', width: 100, borderRadius: 12}}
                                    value={modeAuto ? '' : slippageTolerance}
                                    onChange={changeSlippagePerent}
                                    max={50}
                                    autoComplete='off'
                                />
                                <Box sx={{position: 'absolute', right: 10, top: 7, fontSize: 16, pl: 1, color: '#FFF'}}>
                                    %
                                </Box>   
                            </CleaveWrapper>
                            {/* <CustomTextField
                                id='slippage-percentage'
                                placeholder='0.5'
                                InputProps={{
                                    endAdornment: <InputAdornment  position='end'>%</InputAdornment>
                                }}
                                inputProps={{ // Note this part for min and max
                                    min: 0, // Set the minimum value as needed
                                    max: "50" // Set the maximum value as needed
                                }}
                                value={modeAuto ? '' : slippageTolerance}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderRadius: '12px !important'
                                    },
                                    '& .MuiInputBase-input': {
                                        width: 40,
                                        textAlign: 'end',
                                    },
                                    '& .MuiInputBase-root:focus': {
                                        borderColor: '#C6C6C74D !important',
                                    }
                                }}
                                type='number'
                                autoComplete='off'
                                onChange={changeSlippagePerent}
                            /> */}
                        </Stack>
                    </Box>
                </Dialog>
            </Fragment>
            {/* End Slippage Tolerance Modal */}
        </GlobalContext.Provider>
    )
}

export const useGlobalValues = () => {
    const context = useContext(GlobalContext)
    if(!context) {
        throw new Error(`useGlobalValues must be used within a GlobalProvider`);
    }
    return context;
}