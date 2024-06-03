import { useGlobalValues } from '@/context/GlobalContext'
import {Box, Typography, Stack, Button, CircularProgress} from '@mui/material'
import ReactCodeInput from 'react-code-input'
import { CSSProperties, useEffect, useRef, useState } from'react'
import { showToast } from '@/hooks/toasts'
import Icon from 'src/@core/components/icon'
import { Wizard } from '@/views/components/Wizard'
import { usePoint } from '@/context/PointContext'
import { useAccount } from 'wagmi'
import ConnectWalletWithIcon from '@/views/components/ConnectWalletWithIcon'
import { useRouter } from 'next/router'
import { GetServerSideProps, GetServerSidePropsContext } from 'next/types';

const Home = ({serverParamCode}: {serverParamCode: string}) => {
    const router = useRouter()
    
    // Get the inviteCode from the query object
    const paramCode = serverParamCode || router.query?.code?.toString() || ''
    
    const {isMobileScreen, isSmallScreen, isMediumScreen, isMediumLargeScreen} = useGlobalValues()
    const [currentStep, setCurrentStep] = useState(1)
    const [progressWidth, setProgressWidth] = useState('')
    const { isConnected } = useAccount()
    const { signMsg, validateInviteCode, isUserRedeemed, redeemedCode } = usePoint()
    const [code, setCode] = useState('')
    const [isValidated, setIsValidated] = useState(false)
    const [isChecking, setIsChecking] = useState(false)
    
    // Set steps based on validation states
    useEffect(() => {
        document.cookie = "user-redeemed=false; path=/";
        if(!isValidated) {
            setCurrentStep(1)
        } else if(!isConnected || !isUserRedeemed) {
            setCurrentStep(2)
        } else {
            setCurrentStep(3)
            document.cookie = "user-redeemed=true; path=/";
            setCode(redeemedCode)
        }
    }, [isValidated, isConnected, isUserRedeemed])
    
    /*
    // Set state and cookies.
    useEffect(() => {
        // console.log('isConnected: ', isConnected)
        console.log('isUserRedeemed: ', isUserRedeemed)
        if(isConnected && isUserRedeemed) {     // If the wallet connected and it is redeemed wallet.
            // console.log('Redeemed Code: ', redeemedCode)
            document.cookie = "user-redeemed=true; path=/";
            setCode(redeemedCode)
            setIsValidated(true)
            // setIsRedeemd(true)
        } else {
            document.cookie = "user-redeemed=false; path=/";
            setIsValidated(false)
            // setIsRedeemd(false)
        }    
    }, [isConnected, isUserRedeemed, redeemedCode])
    */

    // If user connect wallet and it is redeemed wallet, set the state as validated.
    useEffect(() => {
        if(isConnected && isUserRedeemed) {
            setIsValidated(true)
        }
    }, [isUserRedeemed, isConnected])

    // If the URL has the default code, we should set the code value as default.
    useEffect(() => {
        const validateParamCode = async () => {
            if(paramCode != '' ) {
                const result = await validateInviteCode(paramCode.toUpperCase(), false)
                if(result) {
                    setIsValidated(true)
                }
            }
        }
        validateParamCode()
    }, [paramCode])

    useEffect(() => {
        setProgressWidth(`calc(${16.5 * (2 * currentStep - 1)}%${currentStep == 3 ? ' + 10px': ''})`)
    }, [currentStep])

    const enterCode = async () => {
        if(isValidated) {
            return
        }
        setIsChecking(true)
        try {
            const result = await validateInviteCode(code.toUpperCase())
            if(result) {
                setIsValidated(true)
                return
            }
            setIsValidated(false)
        } catch (error) {
            console.error("Error validating invite code", error);
            setIsValidated(false)
        } finally {
            setIsChecking(false)
        }
    }

    const handleEnterPress = (event:React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          // Call your submit function here
          enterCode()
        }
    };

    const signWalletToRedeem = async () => {
        if(isUserRedeemed) {
            showToast("success", "Enter App", "You've already redeemed your invite code.", 3000)
            return;
        }
        try {
            const result = await signMsg(paramCode ? paramCode.toUpperCase() : code.toUpperCase())
            if(result) {
                showToast('success', 'Enter App', 'You have successfully redeemed invite code.', 3000)
                return
            }
        } catch (error) {
            console.error("Error Redeeming invite code", error);
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
        height: 55,
        width: 45,
        borderRadius: '3px',
        padding: 6,
        backgroundColor: '#0c1c174b',
        color: '#67DAB1',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#67dab14b',
        fontSize: 22,
        textTransform: 'uppercase',
        textAlign: 'center',
        fontFamily: `'Britanica-HeavySemiExpanded', sans-serif`,
        outline: 'none'
    }
    const inptuStyle1: CSSProperties = {...inputStyle}

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
                    Lock in Your 2X Mainnet Points Multiplier
                </Typography>
                
                <Typography sx={{
                    mb: {xs: 4, sm: 8},
                    fontSize: {xs: 16, md: 24}, 
                    fontWeight: {xs: 300, sm: 300},
                    width: {xs: 295, sm: 'auto'},
                    margin: 'auto',
                    textAlign: 'center',
                    color: {xs: '#F3F3F3', sm: '#FFF'},
                    maxWidth: 700
                }}>
                    Join the testnet by redeeming an invite code. Every invite comes with 2 invite codes to give to your friends.
                </Typography>
                <Stack position='relative' direction={isMediumScreen ? 'column' : 'row'} sx={{gap: {xs: 27, lg: 4}, pt: {xs: 0, lg: 16}, mt: {xs: 48, md: 72, lg: 32}, borderTop: '1px solid #CCCCCF4B'}}>
                    {/* Progress view here */}
                    <Box position='absolute' top={-1} left={0} height={3} width={progressWidth} borderTop='solid 1px #67DAB1' sx={{display: {xs: 'none', lg: 'block'}}}></Box>
                    <Box position='absolute' top={-1} left={-100} height={3} width={100} borderTop='solid 1px #67DAB1' sx={{display: {xs: 'none', lg: 'block'}}}></Box>
                    <Box position='absolute' top={-1} right={-100} height={3} width={100} borderTop='solid 1px #CCCCCF4B' sx={{display: {xs: 'none', lg: 'block'}}}></Box>

                    <Wizard step={1} isCompleted={currentStep >= 1} header='Enter Code' description='Enter an invite code to verify its eligibility. '>
                        <Stack justifyContent='space-between' alignItems='center' sx={{width: 1, flexDirection: {xs: 'column', xl: 'row'}, alignItems: {xs: 'center', lg: 'start', xl: 'center'}, gap: {xs: 8, lg: 4, xl: 4}}}>
                            <Stack direction='row' justifyContent='center' className='tren-connect-box' sx={{width: 'fit-content'}} onKeyDown={handleEnterPress}>
                                {
                                    (paramCode && !isUserRedeemed) && 
                                    <ReactCodeInput
                                        key={paramCode}
                                        name='pinCode'
                                        type='text'
                                        placeholder=''
                                        fields={5}
                                        value={paramCode}
                                        inputMode='verbatim'
                                        inputStyle={inptuStyle1}
                                        autoFocus={code.length !== 0}
                                        disabled={paramCode.length > 0}
                                    />
                                }
                                {
                                    (!paramCode || isUserRedeemed) &&
                                    <ReactCodeInput
                                        key={isValidated && isConnected && isUserRedeemed ? code : ''}
                                        name='pinCode1'
                                        type='text'
                                        placeholder=''
                                        fields={5}
                                        onChange={setCode}
                                        value={code}
                                        inputMode='verbatim'
                                        inputStyle={inputStyle}
                                        autoFocus={code.length !== 0}
                                        disabled={isValidated}
                                    />
                                }
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
                                endIcon={!isValidated ? <></> : <Icon icon='mingcute:check-fill' fontSize={20}/>}
                                // disabled={code.length < 5}
                                onClick={enterCode}
                            >
                            {!isValidated ? (paramCode ? 'Invalid Code' : 'Enter Code') : 'Code Eligible'}
                            {
                            isChecking && 
                            <CircularProgress color='primary' sx={{ml: 4, height: '20px !important', width: '20px !important', color: '#020101'}} />
                            }
                            </Button>
                        </Stack>
                    </Wizard>
                    <Wizard step={2} isCompleted={currentStep >= 2} header={!isConnected ? 'Connect Wallet' : 'Sign Message to Redeem Code'} 
                            description={!isConnected ? 'Using an EVM wallet of your choice, connect to Tren Finance.' : 'Let’s make it official. Sign the message to access testnet & lock in your 2X multiplier. The code is not redeemed until you have connected your wallet and signed the message.'} >
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
                                disabled={!isValidated}
                            >
                                Sign Message
                                <Icon icon='solar:key-outline' fontSize={isMobileScreen ? 16: 20} style={{marginLeft: 10}}/>
                            </Button>
                        }
                        </Box>
                    </Wizard>
                    <Wizard step={3} isCompleted={currentStep >= 3} header='Enter App' description='Head over to the Tren application to start using the testnet.'>
                        <Box mt={4} sx={{width: {xs: 1, sm: 'auto'}}}>
                            <Button
                                href='/modules'
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

export const getServerSideProps: GetServerSideProps = async(context: GetServerSidePropsContext) => {
    console.log('Query object:', context.query);
    // Get the 'code' query parameter from the context
    const { query } = context;
    const serverParamCode = query.code ? query.code.toString() : '';
    console.log('ServerSide: ', serverParamCode)
  
    return {
      props: {
        serverParamCode
      }
    };
}
  
export default Home
