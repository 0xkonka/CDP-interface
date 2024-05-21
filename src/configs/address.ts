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

export const TRENBOX_STORAGE: AddressMap = {     // newly added 05/09/2024
    [SupportedChainId.SEPOLIA]: '0x75A27E6785ab614C93495F1Ec85e95A999FDd6Ee'
}

export const ADMIN_CONTRACT: AddressMap = {     // updated 05/09/2024
    [SupportedChainId.SEPOLIA]: '0xAF0e56d4490b9B019eBD67Bc2f6f79282Bf66561'
}

export const BORROWER_OPERATIONS: AddressMap = {    // updated 05/09/2024
    [SupportedChainId.SEPOLIA]: '0x31bEEee3CF731B1A4Cc4649504518DA3782c242e'
}

export const FEE_COLLECTOR: AddressMap = {  // updated 05/09/2024
    [SupportedChainId.SEPOLIA]: '0x953B34DD9dE4D78E372112d2b91DfDe67bEC77E5'
}

export const FLASH_LOAN: AddressMap = {  // updated 05/09/2024
    [SupportedChainId.SEPOLIA]: '0xDaA989CAB0cFB8C798e12AF5653A32Fa6ff1e844'
}

export const SORTED_TRENBOXES: AddressMap = {   // updated 05/09/2024
    [SupportedChainId.SEPOLIA]: '0xDC68844b2C1D2389ec569a573d7BbdBeea30eA90'
}

export const STABILITY_POOL: AddressMap = {  // updated 05/09/2024
    [SupportedChainId.SEPOLIA]: '0xf398661f226783080d44C8F31731DD42A52679C7'
}

export const TRENBOX_MANAGER: AddressMap = {  // updated 05/09/2024
    [SupportedChainId.SEPOLIA]: '0x5F92EB88746EDB19C4a5aE862d43bc0a26F94002'
}

export const TRENBOX_MANAGER_OPERATIONS: AddressMap = {  // updated 05/09/2024
    [SupportedChainId.SEPOLIA]: '0xF7F6D0a3af2dFD1968F4698076B50C6120334DeB'
}

export const PRICE_FEED: AddressMap = {  // updated 05/09/2024
    [SupportedChainId.SEPOLIA]: '0x706D55cB6Da5E2447846f01F49485b3d0d71474c'
}

export const TIME_LOCK_TESTOR: AddressMap = {   // updated 05/09/2024
    [SupportedChainId.SEPOLIA]: '0xA8c17cBE32958FC5a76ba2d56f77916E0924E38E'
}

export const DEBT_TOKEN: AddressMap = {   // updated 05/09/2024
    [SupportedChainId.SEPOLIA]: '0xAD525A54D2a761dFa921353512FF145f2B5B37fd'
}

export const DEBT_TOKEN_MANAGER: AddressMap = {
    [SupportedChainId.SEPOLIA]: '0xAb4C13ebF080972CCbE67231F4844a744252b81E'
}