export enum SupportedChainId {
    MAINNET = 1,
    TESTNET = 5,
    HEX_MAINNET = '0x1',
    HEX_TESTNET = '0x5'
}

type AddressMap = { [chainId: number]: string }

export const TREN_USD_ADDR: AddressMap = {
    [SupportedChainId.MAINNET]: '',
    [SupportedChainId.TESTNET]: '0xD2b5D15C1a66587c087cfde9317D58A3876cd187'
}

export const TREN_BOX_ADDR: AddressMap = {
    [SupportedChainId.MAINNET]: '',
    [SupportedChainId.TESTNET]: '0x04F95712aB38299D07a37dF0b66f224E7474D613'
}

export const TREN_MARKET_ADDR: AddressMap[] = [
    {
        [SupportedChainId.MAINNET]: '',
        [SupportedChainId.TESTNET]: '0x86a6f018B38eB8D121150d1ef5CCF81589849290'
    }
]

export const MARKET_LENS_ADDR: AddressMap = {
    [SupportedChainId.MAINNET]: '',
    [SupportedChainId.TESTNET]: '0x2daF4049d290A2D0413e6697F99c03C09caA1243'
}
