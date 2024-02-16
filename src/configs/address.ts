export enum SupportedChainId {
    MAINNET = 1,
    TESTNET = 5,
    HEX_MAINNET = '0x1',
    HEX_TESTNET = '0x5'
}

type AddressMap = { [chainId: number]: string }

export const TREN_USD_ADDR: AddressMap = {
    [SupportedChainId.MAINNET]: '',
    [SupportedChainId.TESTNET]: '0xB5961a63a480032cF44cEE69f35Fd5042F6Cb5DF'
}

export const TREN_BOX_ADDR: AddressMap = {
    [SupportedChainId.MAINNET]: '',
    [SupportedChainId.TESTNET]: '0x04F95712aB38299D07a37dF0b66f224E7474D613'
}

export const TREN_MARKET_ADDR: AddressMap = {
    [SupportedChainId.MAINNET]: '',
    [SupportedChainId.TESTNET]: '0xa8cE869AAeA6b09f05eaA4Ca4f4704517dC6c0f8'
}

export const PRICE_ORACLE_ADDR: AddressMap = {
    [SupportedChainId.MAINNET]: '',
    [SupportedChainId.TESTNET]: '0x45eD94a18853097adc5E1e8c3c3A9d64b1407e21'
}

export const MARKET_LENS_ADDR: AddressMap = {
    [SupportedChainId.MAINNET]: '',
    [SupportedChainId.TESTNET]: '0x2daF4049d290A2D0413e6697F99c03C09caA1243'
}