export enum SupportedChainId {
    MAINNET = 1,
    BSC = 56,
    AVAX = 43114,
    ARBI = 43621,
    BASE = 8453,
    GOERLI = 5,
    SEPOLIA = 11155111,
    HEX_MAINNET = '0x1',
    HEX_BSC = '0x38',
    HEX_AVAX = '0xa86a',
    HEX_ARBI = '0xa4b1',
    HEX_BASE = '0x2105',
    HEX_GOERLI = '0xaa36a7',
    HEX_SEPOLIA = '0xaa36a7'
}

type AddressMap = { [chainId: number]: string }

export const ETHERSCAN_BASE_URL = 'https://sepolia.etherscan.io'

export const ACTIVE_POOL: AddressMap = {
    [SupportedChainId.GOERLI]: '0x53De404DE4a3bC176fC63f2ec7b8A1bc2015B5eA',
    [SupportedChainId.SEPOLIA]: '0x7769AD8a49AAC23b3033825509e0D3A6B2E8BBb1'
}

export const ADMIN_CONTRACT: AddressMap = {
    [SupportedChainId.GOERLI]: '0xC1d85dB2C62536C120FC3c8735B5317EF9a1D56F',
    [SupportedChainId.SEPOLIA]: '0x863FFDaC7C9544AB44E53dcECb8eBb9B14Ed6B21'
}

export const BORROWER_OPERATIONS: AddressMap = {
    [SupportedChainId.GOERLI]: '0xA98AF95c2abcF7EE108ed0aeFf85b7992717e787',
    [SupportedChainId.SEPOLIA]: '0x1bCa9909c9Fcbc4B78953C70F4F63D5799bF0f9a'
}

export const COLL_SURPLUS_POOL: AddressMap = {
    [SupportedChainId.GOERLI]: '0x90787aB3879d2d26c385B2FbaF528592181bf82C',
    [SupportedChainId.SEPOLIA]: '0xC0C9115914Ca0a58163510202A3D0c743ae8C779'
}

export const DEFAULT_POOL: AddressMap = {
    [SupportedChainId.GOERLI]: '0x92768C8B2Dac41e3253F67Bf7Cccf2bAcABD3aE1',
    [SupportedChainId.SEPOLIA]: '0xe9D1c8488B0afa43f5F2a18bF2E227c0ed64B7be'
}

export const FEE_COLLECTOR: AddressMap = {
    [SupportedChainId.GOERLI]: '0x43224DEBdA936a16C09e669F957A5D7539AE815f',
    [SupportedChainId.SEPOLIA]: '0x6DBcc4Cb52F5e2f55c41bAa940b460005b3C89c2'
}

export const FLASH_LOAN: AddressMap = {
    [SupportedChainId.GOERLI]: '',
    [SupportedChainId.SEPOLIA]: '0xF3aD401DBfEec52F2e72a01ea8F2AD0b13D34cEc'
}

export const SORTED_MODULES: AddressMap = {
    [SupportedChainId.GOERLI]: '0x7671f328Eb430597D2cAf69E6D760708Fd2179E6',
    [SupportedChainId.SEPOLIA]: '0xC1285000cAf54bCe997366Cd524460ff1750501e'
}

export const STABILITY_POOL: AddressMap = {
    [SupportedChainId.GOERLI]: '0x308A5FCeFe09705d64A6F71828428CDa1901Cc8C',
    [SupportedChainId.SEPOLIA]: '0x208214951bf662be2Da0B3eeDB5be6eC04690296'
}

export const MODULE_MANAGER: AddressMap = {
    [SupportedChainId.GOERLI]: '0x0F065FBfC74a354b10598f859CEc56bE23d8FdD4',
    [SupportedChainId.SEPOLIA]: '0x448Da42C46Ed92D63f5F89bdE8307A8f36Cb521E'
}

export const MODULE_MANAGER_OPERATIONS: AddressMap = {
    [SupportedChainId.GOERLI]: '0x4F8DE0245544C4896F3D3c4D96F2B3b2cE1F6239',
    [SupportedChainId.SEPOLIA]: '0x84fbf3bd03072c8b32cDB35A04F4d663a0Ed31f8'
}

export const GAS_POOL: AddressMap = {
    [SupportedChainId.GOERLI]: '0xF4c24132EfcE04422deC0F46d203f6D37Dc45b16',
    [SupportedChainId.SEPOLIA]: '0x9F1D032414891D21f7D640755D161d54d6823f19'
}

export const PRICE_FEED: AddressMap = {
    [SupportedChainId.GOERLI]: '0xd1e4bf40e0A3102d0377da4f432b272715b29A2B',
    [SupportedChainId.SEPOLIA]: '0x49Ec94291dBb2B42ec07b168a5DcC724c59C6bDb'
}

export const TIME_LOCK_TESTOR: AddressMap = {
    [SupportedChainId.GOERLI]: '0x04E7b5b54BfE1e1caA80b4Da73ba6F3474937b7d',
    [SupportedChainId.SEPOLIA]: '0x6e7647Fa48cC8DC99717cA4847A5197B540eA2dA'
}

export const DEBT_TOKEN: AddressMap = {
    [SupportedChainId.GOERLI]: '0xDA57F2DA78A38413fD7eF53D2E72aE319E0964Aa',
    [SupportedChainId.SEPOLIA]: '0xb3054320D50B5B18F0ca66E6Fd7E800fea7721B5'
}
