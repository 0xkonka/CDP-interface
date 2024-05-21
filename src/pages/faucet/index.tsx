import { Box, Stack, Typography, Button, Tooltip, CircularProgress } from '@mui/material'

import { useProtocol } from '@/context/ProtocolProvider/ProtocolContext'
import { useGlobalValues } from '@/context/GlobalContext'

import Debt_TOKEN_MANAGER_ABI from '@/abi/DebtTokenManager.json'
import FaucetRow from '@/views/faucetRow'
import { DEBT_TOKEN, DEBT_TOKEN_MANAGER } from '@/configs/address'
import { erc20Abi, formatEther, formatUnits, parseEther, parseUnits } from 'viem'
import { useAccount, useChainId, useReadContract, BaseError } from 'wagmi'
import { formatToThousandsInt } from '@/hooks/utils'
import {ethers} from 'ethers'
import { showToast } from '@/hooks/toasts'
import { useState } from 'react'

const Faucet = () => {
    const { collateralDetails } = useProtocol()
    const { isMobileScreen } = useGlobalValues()
    const chainId = useChainId()
    const { address: account } = useAccount()
    const debtTokenAddress = DEBT_TOKEN[chainId] as '0x{string}'
    const debtTokenMintContract = DEBT_TOKEN_MANAGER[chainId] as '0x{string}'
    const [isLoading, setIsLoading] = useState(false)

    // Get trenUSD balance of wallet.
    const { data: debtWalletBalance = BigInt(0), refetch: refetchBalance } = useReadContract({
        address: debtTokenAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [account as '0x{string}'],
    })

    const mintDebtToken = async(ownerAddress: string, tokenAddress: string, amount: bigint) => {
        const provider = new ethers.BrowserProvider(window.ethereum);

        setIsLoading(true)
        const contractAddress = tokenAddress;

        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, Debt_TOKEN_MANAGER_ABI, signer);

        try {
            const txResponse = await contract.mint(ownerAddress, amount);

            provider.once(txResponse.hash, (txReceipt) => {
                console.log("Transaction confirmed:", txReceipt.transactionHash);
                
                // Now you have the transaction receipt and can check the status
                if (txReceipt.status === 1) {
                    refetchBalance()
                    setIsLoading(false)
                } else if (txReceipt.status === 0) {
                    showToast('error', 'Error', 'Transaction failed', 50000)
                    setIsLoading(false)
                }
            });

            // Optionally, you can also wait for the transaction confirmation directly
            await txResponse.wait();

            showToast(
                'success',
                'Success',
                `You have successfully minted ${formatToThousandsInt(+formatEther(amount))} trenUSD.`,
                30000,
            )
        } catch (error) {
            setIsLoading(false)
            console.error("Transaction failed:", error);
            showToast('error', 'Error', (error as BaseError).shortMessage || 'An unexpected error occurred.', 50000)
        }
    }
    
    return (
        <Stack alignItems='center'>
            <iframe style={{position: 'absolute', left: -250, top: -100, width: 'calc(100vw + 500px)', height: 'calc(100% + 340px)'}} src='https://my.spline.design/waterv2copy-ff5ef8dc1c68ec421f00c0aeb688e639/' frameBorder='0' width='100%' height='100%'></iframe>
            <Typography className='header-gradient' variant='h1'sx={{
                    mb: { xs: 4, md: 8 }, mt: 8,
                    fontSize: { xs: 36, md: 64, xl: 72 },
                    textAlign: 'center'
                }}
            >
                Get Token
            </Typography>
            
            {isMobileScreen ? (
                <Stack sx={{px: 4, py: 4, width: 1, maxWidth: 700, gap: 4, border: 'solid 1px #67DAB1C4', borderRadius: '10px', mb: 8, boxShadow: 'inset 0 0 6px #67DAB1C4'}}>
                    <Stack direction='row' justifyContent='space-between'>
                        <Stack direction='row' sx={{alignItems: 'center'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <rect width="32" height="32" rx="16" fill="#1D1C1C"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M15.4996 7.14892C14.499 8.41759 13.3127 10.8541 14.6644 13.0151C14.8221 13.2672 15.0104 13.562 15.223 13.8909C14.2478 13.914 13.2733 14.2144 12.6626 15.0779C11.8181 16.2721 10.163 18.9599 8.82211 21.1374C8.338 21.9236 7.89484 22.6433 7.54556 23.2022C7.40424 23.4283 7.50078 23.7243 7.76012 23.7863C9.15816 24.1206 11.5628 23.9577 12.2779 22.8653L16.6912 16.123C18.4371 18.7474 20.6514 22.0018 21.8973 23.82C22.0514 24.0449 22.3693 24.0667 22.5234 23.8419C23.4785 22.4485 24.3613 19.4671 23.3788 17.9982L16.1475 7.18703C15.9942 6.95785 15.6703 6.93243 15.4996 7.14892Z" fill="white"/>
                            </svg>
                            <Typography variant='h5' sx={{fontWeight: 400, ml: 2, width: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>TrenUSD</Typography>
                        </Stack>
                        <Stack direction='row'>
                            <Tooltip title='Wallet Balance' placement='top'>
                                <Typography variant='h5' sx={{fontWeight: 400}}>
                                    {formatToThousandsInt(+formatEther(debtWalletBalance!))}
                                </Typography>
                            </Tooltip>
                        </Stack>
                    </Stack>
                    
                    <Stack direction='row' sx={{alignItems: 'center'}}>
                        <Button variant='contained' color='primary' sx={{fontSize: 16, py: 2.5, color: '#000', fontWeight: 600, width: 1}} 
                            onClick={() => mintDebtToken(account as '0x{string}', debtTokenMintContract, parseEther('1000'))}
                            disabled={isLoading}>
                            {
                                isLoading && 
                                <CircularProgress sx={{color: '#000', mr: 4, height: '20px !important', width: '20px !important'}} />
                            }
                            Claim 1000 tokens
                        </Button>
                    </Stack>
                </Stack>
            ) : (
                <Stack direction='row' alignItems='center' sx={{px: 3, py: 6, width: 1, maxWidth: 700, border: 'solid 1px #67DAB1C4', borderRadius: '10px', mb: 14, boxShadow: 'inset 0 0 6px #67DAB1C4'}}>
                    <Stack direction='row' sx={{flex: '6 1 0%', alignItems: 'center'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <rect width="32" height="32" rx="16" fill="#1D1C1C"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M15.4996 7.14892C14.499 8.41759 13.3127 10.8541 14.6644 13.0151C14.8221 13.2672 15.0104 13.562 15.223 13.8909C14.2478 13.914 13.2733 14.2144 12.6626 15.0779C11.8181 16.2721 10.163 18.9599 8.82211 21.1374C8.338 21.9236 7.89484 22.6433 7.54556 23.2022C7.40424 23.4283 7.50078 23.7243 7.76012 23.7863C9.15816 24.1206 11.5628 23.9577 12.2779 22.8653L16.6912 16.123C18.4371 18.7474 20.6514 22.0018 21.8973 23.82C22.0514 24.0449 22.3693 24.0667 22.5234 23.8419C23.4785 22.4485 24.3613 19.4671 23.3788 17.9982L16.1475 7.18703C15.9942 6.95785 15.6703 6.93243 15.4996 7.14892Z" fill="white"/>
                        </svg>
                        <Typography variant='h5' sx={{fontWeight: 400, ml: 2, width: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>TrenUSD</Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '4 1 0%'}}>
                        <Tooltip title='Wallet Balance' placement='top'>
                            <Typography variant='h5' sx={{fontWeight: 400}}>
                                {formatToThousandsInt(+formatEther(debtWalletBalance!))}
                            </Typography>
                        </Tooltip>
                    </Stack>
                    <Stack direction='row' sx={{flex: '6 1 0%', alignItems: 'center', gap: 8}}>
                        <Button variant='contained' color='primary' sx={{fontSize: 18, py: 3, color: '#000', fontWeight: 600, width: 1}} 
                            onClick={() => mintDebtToken(account as '0x{string}', debtTokenMintContract, parseEther('1000'))}
                            disabled={isLoading}>
                            {
                                isLoading && 
                                <CircularProgress sx={{color: '#000', mr: 4, height: '20px !important', width: '20px !important'}} />
                            }
                            Claim 1000 tokens
                        </Button>
                    </Stack>
                </Stack>
            )}
            
            

            {/* Collateral Group Stack*/}
            <Box sx={{background: '#10131499', borderRadius: '10px', border: 'solid 1px #67DAB14D', width: 1, maxWidth: 700}}>
                {collateralDetails && (
                    <Stack sx={{ py: 4 }} gap={0} position='relative' zIndex={1}>
                    {collateralDetails.length > 0 ? (
                        collateralDetails.map((row, index) => (
                        <FaucetRow
                            row={row}
                            key={index}
                            isLastElement={index === collateralDetails.length - 1}
                        />
                        ))
                    ) : (
                        <Box sx={{ p: 6, textAlign: 'center' }}>
                            <Typography variant='body1'>No matching collateral</Typography>
                        </Box>
                    )}
                    </Stack>
                )}
            </Box>
        </Stack>
    )
}

export default Faucet