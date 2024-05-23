// React imports
import React, { useState } from 'react'

// Material-UI components
import {
    Stack, Box, Typography, Collapse, Link, Button,
    useTheme, Theme,
    Tooltip,
    CircularProgress
} from '@mui/material'

// Contexts
import { useGlobalValues } from '@/context/GlobalContext'

// Third-party libraries
import { CollateralParams } from '@/context/ModuleProvider/type'
import { useAccount, useChainId, useReadContract, BaseError } from 'wagmi'
import {ethers} from 'ethers'
import { formatToThousands, formatToThousandsInt, removeComma } from '@/hooks/utils'
import { erc20Abi, formatEther, formatUnits, parseUnits } from 'viem'
import { showToast } from '@/hooks/toasts'
import useFaucetStorage from '@/hooks/useFaucetStorage'

// Define Props
interface TableHeaderProps {
    row: CollateralParams
    isLastElement?: boolean
}

const FaucetRow = (props: TableHeaderProps) => {
    const {row, isLastElement} = props
    const theme: Theme = useTheme()
    const {isMobileScreen} = useGlobalValues()
    const [isLoading, setIsLoading] = useState(false)
    const chainId = useChainId()
    const { address: account } = useAccount()
    const maxDollar = 10000
    const { storage, entryExists, addToFaucetStorage } = useFaucetStorage()

    // Get collateral balance of wallet.
    const { data: collateralWalletBalance = BigInt(0), refetch: refetchBalance } = useReadContract({
        address: row.address as '0x{string}',
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [account as '0x{string}'],
    })

    const mintToken = async(ownerAddress: string, tokenAddress: string, amount: bigint) => {
        if(entryExists({account: ownerAddress, address: tokenAddress})){
            showToast('error', 'Error', 'You have already claimed this token.', 3000)
            return
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        
        setIsLoading(true)
        const contractAddress = tokenAddress;

        const signer = await provider.getSigner();
        const mintFunctionAbiFragment = [
            "function mint(address _addr, uint256 _amount) public returns (bool)"
        ];
        const contract = new ethers.Contract(contractAddress, mintFunctionAbiFragment, signer);

        try {
            const txResponse = await contract.mint(ownerAddress, amount);

            provider.once(txResponse.hash, (txReceipt) => {
                if (txReceipt.status === 1) {
                    refetchBalance()
                    setIsLoading(false)
                } else if (txReceipt.status === 0) {
                    showToast('error', 'Error', 'Transaction failed', 50000)
                    setIsLoading(false)
                }
            });

            await txResponse.wait();

            showToast(
                'success',
                'Success',
                `You have successfully minted ${formatToThousandsInt(+formatEther(amount))} ${row.symbol}.`,
                30000,
            )

            addToFaucetStorage({account: ownerAddress, address: tokenAddress})
        } catch (error) {
            setIsLoading(false)
            console.error("Transaction failed:", error);
            showToast('error', 'Error', (error as BaseError).shortMessage || 'An unexpected error occurred.', 50000)
        }
    }

    if (!row || typeof row.symbol === 'undefined') {
        console.error('CollateralRow component received undefined "row" or "row.symbol" property.');
        return <div>Missing data</div>; // You can customize this message or behavior as needed.
    }

    return (
        <Stack display='flex' sx={{
            borderRadius: '10px', border: `solid 1px transparent`, 
            cursor: 'pointer',
            background: 'transparent',
            [theme.breakpoints.up('md')] : {
                '&:hover': {
                    background: '#121212'
                }
            }}}>
            {isMobileScreen ? (
                <Stack sx={{px: 4, py: 4, width: 1, maxWidth: 700, gap: 4, borderBottom: isLastElement ? 'none' : 'solid 1px #67DAB14D'}}>
                    <Stack direction='row' justifyContent='space-between'>
                        <Stack direction='row' sx={{alignItems: 'center'}}>
                            <img 
                                src={`/images/tokens/${row.symbol.replace(/\//g, '-').replace(/\s+/g, '')}.png`}
                                alt={row.symbol} width={32} height={32}
                                style={{ width: 'auto', borderRadius: '100%' }}
                            />
                            <Typography variant='h5' sx={{fontWeight: 400, ml: 2, width: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                {row.symbol}
                            </Typography>
                        </Stack>
                        <Stack direction='row'>
                            <Tooltip title='Wallet Balance' placement='top'>
                                <Typography variant='h5' sx={{fontWeight: 400}}>
                                    {formatToThousands(+formatUnits(collateralWalletBalance, row.decimals), 3).substring(1)}
                                </Typography>
                            </Tooltip>
                        </Stack>
                    </Stack>
                    
                    <Stack direction='row' sx={{alignItems: 'center'}}>
                        <Button variant='outlined' color='primary' sx={{fontSize: 16, py: 2.5, color: '#FFF', fontWeight: 400, width: 1}} 
                            onClick={() => mintToken(account as '0x{string}', row.address, 
                            parseUnits(removeComma(formatToThousands(maxDollar / +formatEther(row.price), 2).substring(1)), row.decimals))}
                            disabled={isLoading || entryExists({account: account as '0x{string}', address: row.address})}>
                            {
                                isLoading && 
                                <CircularProgress sx={{color: '#FFF', mr: 4, height: '20px !important', width: '20px !important'}} />
                            }
                            Claim {formatToThousands(maxDollar / +formatEther(row.price), 2).substring(1)} tokens
                        </Button>
                    </Stack>
                </Stack>
            ) : (
                <Stack direction='row' sx={{alignItems: 'center', 
                    px: 3, py: 2
                }}>
                    <Stack direction='row' sx={{flex: '6 1 0%', alignItems: 'center'}}>
                        <img 
                            src={`/images/tokens/${row.symbol.replace(/\//g, '-').replace(/\s+/g, '')}.png`}
                            alt={row.symbol} width={32} height={32}
                            style={{ width: 'auto', borderRadius: '100%' }}
                        />
                        <Typography variant='h5' sx={{fontWeight: 400, ml: 2, width: 130, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{row.symbol}</Typography>
                    </Stack>
                    <Stack direction='row' sx={{flex: '4 1 0%'}}>
                        <Tooltip title='Wallet Balance' placement='top'>
                            <Typography variant='h5' sx={{fontWeight: 400}}>
                                {formatToThousands(+formatUnits(collateralWalletBalance, row.decimals), 3).substring(1)}
                            </Typography>
                        </Tooltip>
                    </Stack>
                    <Stack direction='row' sx={{flex: '6 1 0%', alignItems: 'center', gap: 8}}>
                        <Button variant='outlined' color='primary' sx={{fontSize: 18, py: 3, color: '#FFFFFF', fontWeight: 400, width: 1}} 
                            onClick={() => mintToken(account as '0x{string}', row.address, 
                                    parseUnits(removeComma(formatToThousands(maxDollar / +formatEther(row.price), 2).substring(1)), row.decimals))}
                            disabled={isLoading|| entryExists({account: account as '0x{string}', address: row.address})}>
                            {
                                isLoading && 
                                <CircularProgress sx={{color: '#FFF', mr: 4, height: '20px !important', width: '20px !important'}} />
                            }
                            Claim {formatToThousands(maxDollar / +formatEther(row.price), 2).substring(1)} tokens
                        </Button>
                    </Stack>
                </Stack>
            )}
        </Stack>
    )
}
export default FaucetRow