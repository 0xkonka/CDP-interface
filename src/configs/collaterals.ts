import { parseEther } from 'viem'

export const ETHERSCAN_BASE_URL = 'https://goerli.etherscan.io/address'

export const COLLATERAL = [
    {
        name: 'wETH',
        address: '0x2df77eE5a6FcF23F666650ed53bE071E7288eCb6',
        oracleAddress: '0xC526a88daEEa6685E4D46C99512bEB0c85a8b1c7',
        oracleTimeoutMinutes: 1440,
        oracleIsEthIndexed: false,
        MCR: parseEther('1.111'),
        CCR: parseEther('1.4'),
        borrowingFee: parseEther('0.01'),
        minNetDebt: parseEther('2000'),
        gasCompensation: parseEther('200'),
        mintCap: parseEther('1500000')
    },
    {
        name: 'rETH',
        address: '0x178E141a0E3b34152f73Ff610437A7bf9B83267A',
        oracleAddress: '0xbC204BDA3420D15AD526ec3B9dFaE88aBF267Aa9',
        oracleTimeoutMinutes: 1440,
        oracleIsEthIndexed: false,
        MCR: parseEther('1.176'),
        CCR: parseEther('1.4'),
        borrowingFee: parseEther('0.01'),
        minNetDebt: parseEther('2000'),
        gasCompensation: parseEther('200'),
        mintCap: parseEther('1500000')
    },
    {
        name: 'wstETH',
        address: '0xcef9cd8BB310022b5582E55891AF043213110783',
        oracleAddress: '0x01fDd44216ec3284A7061Cc4e8Fb8d3a98AAcfa8',
        oracleTimeoutMinutes: 1440,
        oracleIsEthIndexed: false,
        MCR: parseEther('1.176'),
        CCR: parseEther('1.4'),
        borrowingFee: parseEther('0.01'),
        minNetDebt: parseEther('2000'),
        gasCompensation: parseEther('200'),
        mintCap: parseEther('1500000')
    },
    {
        name: 'bLUSD',
        address: '0x9A1Dd4C18aeBaf8A07556248cF4A7A2F2Bb85784',
        oracleAddress: '0xFf92957A8d0544922539c4EA30E7B32Fd6cEC5D3',
        oracleTimeoutMinutes: 1440,
        oracleIsEthIndexed: false,
        MCR: parseEther('1.01'),
        CCR: parseEther('1'),
        borrowingFee: parseEther('0.01'),
        minNetDebt: parseEther('2000'),
        gasCompensation: parseEther('0'),
        mintCap: parseEther('1500000')
    }
]

