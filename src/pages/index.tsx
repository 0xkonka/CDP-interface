import { useGlobalValues } from '@/context/GlobalContext'
import {Box, Typography, Stack, Button} from '@mui/material'
import ReactCodeInput from 'react-code-input'
import { CSSProperties, useEffect, useState } from'react'
import { showToast } from '@/hooks/toasts'
import Icon from 'src/@core/components/icon'
import { Wizard } from '@/views/components/Wizard'
import { useReferral } from '@/context/ReferralContext'
import { useAccount } from 'wagmi'
import ConnectWalletWithIcon from '@/views/components/ConnectWalletWithIcon'

const Connect = () => {
    const {isMobileScreen, isSmallScreen, isMediumScreen, isMediumLargeScreen} = useGlobalValues()
    const [currentStep, setCurrentStep] = useState(1)
    const [progressWidth, setProgressWidth] = useState('')
    const { isConnected } = useAccount()
    const { signMsg, inviteCode, userReferral, validateInviteCode } = useReferral()
    const [code, setCode] = useState(inviteCode)
    const [isValidating, setIsValidating] = useState(inviteCode ? true : false)
    const [isRedeemd, setIsRedeemd] = useState(false)

    useEffect(() => {
        console.log(isValidating, isConnected, isRedeemd)
        if(!isValidating) {
            setCurrentStep(1)
        } else if(!isConnected || !isRedeemd) {
            setCurrentStep(2)
        } else {
            setCurrentStep(3)
        }
    }, [isValidating, isConnected, isRedeemd])

    useEffect(() => {
        setProgressWidth(`calc(${16.5 * (2 * currentStep - 1)}%${currentStep == 3 ? ' + 10px': ''})`)
    }, [currentStep])

    const enterCode = async () => {
        if(inviteCode.length === 5 && code.length === 5) {
            return
        }
        try {
            const result = await validateInviteCode(code.toUpperCase())
            console.log('Enter Code Result', result)
            if(result) {
                setIsValidating(true)
                return
            }
            setIsValidating(false)
        } catch (error) {
            console.error("Error validating invite code", error);
            setIsValidating(false)
        }
    }

    const signWalletToRedeem = async () => {
        try {
            const result = await signMsg()
            console.log('SignMsg Result:', result)
            if(result) {
                setIsRedeemd(true)
                return
            }
            setIsRedeemd(false)
        } catch (error) {
            console.error("Error Redeeming invite code", error);
            setIsRedeemd(false)
        }
    }
    
    const lightPrimaryBlendingStyle = {
        borderRadius: '2010px',
        background: '#67DAB1',
        filter: 'blur(400px)',
        width: '100%',
        height: 132,
        bottom: 0,
        zIndex: 1
    }

    const inputStyle: CSSProperties = {
        height: 45,
        width: 40,
        borderRadius: '3px',
        padding: 6,
        backgroundColor: '#0c1c174b',
        color: '#67DAB1',
        border: '1px solid #67dab14b',
        fontSize: 24,
        textTransform: 'uppercase',
        textAlign: 'center',
        fontFamily: `'Britanica-HeavySemiExpanded', sans-serif`,
        outline: 'none'
    }

    return (
        <Box>
            <Box className='content' zIndex={10} position='relative'>
                <Typography className='header-gradient' variant='h1' sx={{
                    mb: { xs: 4, md: 4 }, mt: 10,
                    fontSize: { xs: 32, md: 48, xl: 64 },
                    textAlign: 'center',
                    width: {xs: 275, sm: 'auto'},
                    marginX: {xs: 'auto', sm: 'none'},
                    fontWeight: {xs: 600, md: 500},
                    lineHeight: 1.2,
                    maxWidth: 800
                }}>
                    Secure 2X points multiplier on Mainnet!
                </Typography>
                
                <Typography sx={{
                    mb: {xs: 4, sm: 8},
                    fontSize: {xs: 16, md: 24}, 
                    fontWeight: {xs: 300, sm: 300},
                    width: {xs: 295, sm: 'auto'},
                    margin: 'auto',
                    textAlign: 'center',
                    color: {xs: '#F3F3F3', sm: '#FFF'},
                    maxWidth: 600
                }}>
                    We can have some descriptive text here We can have some descriptive text here
                </Typography>
                <Stack position='relative' direction={isMediumScreen ? 'column' : 'row'} sx={{gap: {xs: 27, lg: 4}, pt: {xs: 0, lg: 16}, mt: {xs: 48, md: 72, lg: 32}, borderTop: '1px solid #CCCCCF4B'}}>
                    {/* Progress view here */}
                    <Box position='absolute' top={-1} left={0} height={3} width={progressWidth} borderTop='solid 1px #67DAB1' sx={{display: {xs: 'none', lg: 'block'}}}></Box>
                    <Box position='absolute' top={-1} left={-100} height={3} width={100} borderTop='solid 1px #67DAB1' sx={{display: {xs: 'none', lg: 'block'}}}></Box>
                    <Box position='absolute' top={-1} right={-100} height={3} width={100} borderTop='solid 1px #CCCCCF4B' sx={{display: {xs: 'none', lg: 'block'}}}></Box>

                    <Wizard step={1} isCompleted={currentStep >= 1} header='Enter Code' description='Here is the description of the task. Here is the description of the task. the description of the task.'>
                        <Stack justifyContent='space-between' alignItems='center' sx={{width: 1, flexDirection: {xs: 'column', xl: 'row'}, alignItems: {xs: 'center', lg: 'start', xl: 'center'}, gap: {xs: 8, lg: 4, xl: 4}}}>
                            <Stack direction='row' justifyContent='center' className='tren-connect-box' sx={{width: 'fit-content'}}>
                                <ReactCodeInput
                                    name='pinCode'
                                    type='text'
                                    placeholder=''
                                    fields={5}
                                    onChange={setCode}
                                    value={inviteCode}
                                    inputMode='verbatim'
                                    inputStyle={inputStyle}
                                    pattern='0-9'
                                    autoFocus={false}
                                    disabled={inviteCode.length === 5}
                                />
                            </Stack>
                            <Button
                                sx={{
                                    py: {xs: 2, md: 3},
                                    px: 7,
                                    fontSize: {xs: 14, lg: 18},
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    color: '#020101',
                                    background: '#67DAB1',
                                    width: {xs: '100%', sm: 'fit-content'},
                                }}
                                variant='contained'
                                endIcon={inviteCode.length < 5 ? <></> : <Icon icon='mingcute:check-fill' fontSize={20}/>}
                                // disabled={code.length < 5}
                                onClick={enterCode}
                            >
                            {inviteCode.length < 5 ? 'Enter Code' : 'Code Entered'}
                            </Button>
                        </Stack>
                    </Wizard>
                    <Wizard step={2} isCompleted={currentStep >= 2} header='Sign wallet to Redeem 2X Points multiplier' description='Here is the description of the task.'>
                        <Box mt={4} sx={{width: {xs: 1, sm: 'auto'}}}>
                        {
                            !isConnected &&
                            <ConnectWalletWithIcon />
                        }
                        {
                            isConnected && 
                            <Button
                                className='gradient-stroke-button'
                                onClick={signWalletToRedeem}
                                sx={{
                                    py: {xs: 2, md: 3},
                                    px: 6,
                                    fontSize: {xs: 14, lg: 18},
                                    borderRadius: '10px',
                                    color: '#FFF',
                                    width: 1,
                                }}
                                variant='outlined'
                            >
                                Sign Wallet
                                <Icon icon='solar:key-outline' fontSize={isMobileScreen ? 16: 20} style={{marginLeft: 10}}/>
                            </Button>
                        }
                        </Box>
                    </Wizard>
                    <Wizard step={3} isCompleted={currentStep >= 3} header='Enter App' description='Here is the description of the task.Here is the description of the task.'>
                        <Box mt={4} sx={{width: {xs: 1, sm: 'auto'}}}>
                            <Button
                                href='/points'
                                className='gradient-stroke-button'
                                sx={{
                                    py: {xs: 2, md: 3},
                                    px: 6,
                                    fontSize: {xs: 14, lg: 18},
                                    borderRadius: '10px',
                                    color: '#FFF',
                                    width: 1,
                                }}
                                variant='outlined'
                                disabled={currentStep !== 3}
                            >
                            Enter App
                            <Icon icon='ph:arrow-right-bold' fontSize={isMobileScreen ? 16: 20} style={{marginLeft: 10}}/>
                            </Button>
                        </Box>
                    </Wizard>
                </Stack>
            </Box>
          
            <Box sx={{
                width: {xs: '600px', sm: '100vw'},
                height: {xs: '600px', sm: 'calc(100vh + 170px)'},
                position: isSmallScreen ? 'absolute' : 'fixed',
                zIndex: '1',
                top: {xs: 0, sm: -170},
                left: {xs: '50%', sm: 0},
                transform: {xs: 'translate(-50%, 0)', sm: 'none'},
                overflow: 'hidden'
            }}>
                <img src='/images/backgrounds/testnet-background.png' alt='background' width='100%'/>
                <Box sx={{background: 'rgba(0, 0, 0, 0.64)'}} width='100%' height='100%' position='absolute' top={0} left={0} zIndex={1}></Box>
            </Box>
            <Box sx={{display: {xs: 'block', md: 'none'},position: 'absolute', background: '#0B1412', filter: 'blur(31px)', width: 1, height: 172, top: 540, left: 0, zIndex: 1}}></Box>    
            <Box sx={{
                display: {xs: 'none', md: 'block'},
                width: '100vw',
                height: '100vh',
                position: 'fixed',
                zIndex: '1',
                top: 0,
                left: 0,
                overflow: 'hidden',
                background: 'rgba(0, 0, 0, 0.53)'
            }}></Box>
            <Box position='absolute' sx={{
                display: {xs: 'none', md: 'block'}
            }} style={lightPrimaryBlendingStyle}></Box>
        </Box>
    )
}

export default Connect