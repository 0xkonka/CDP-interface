import assert from 'assert'
import { AddressZero } from '@ethersproject/constants'

import {
  Decimal,
  TrenStoreState,
  TrenStoreBaseState,
  ModuleWithPendingRedistribution,
  StabilityDeposit,
  TrenStore,
  Fees
} from '@/lib-base'

import { decimalify, promiseAllValues } from './_utils'
import { ReadableEthersTren } from './ReadableEthersTren'
import { EthersTrenConnection, _getProvider } from './EthersTrenConnection'
import { EthersCallOverrides, EthersProvider } from './types'

/**
 * Extra state added to {@link @tren/lib-base#TrenStoreState} by
 * {@link BlockPolledTrenStore}.
 *
 * @public
 */
export interface BlockPolledTrenStoreExtraState {

  /**
   * Number of block that the store state was fetched from.
   *
   * @remarks
   * May be undefined when the store state is fetched for the first time.
   */
  blockTag?: number

  /**
   * Timestamp of latest block (number of seconds since epoch).
   */
  blockTimestamp: number

  /** @internal */
  _feesFactory: (blockTimestamp: number, recoveryMode: boolean) => Fees
}

/**
 * The type of {@link BlockPolledTrenStore}'s
 * {@link @tren/lib-base#TrenStore.state | state}.
 *
 * @public
 */
export type BlockPolledTrenStoreState = TrenStoreState<BlockPolledTrenStoreExtraState>

/**
 * Ethers-based {@link @tren/lib-base#TrenStore} that updates state whenever there's a new
 * block.
 *
 * @public
 */
export class BlockPolledTrenStore extends TrenStore<BlockPolledTrenStoreExtraState> {
  readonly connection: EthersTrenConnection

  private readonly _readable: ReadableEthersTren
  private readonly _provider: EthersProvider

  constructor(readable: ReadableEthersTren) {
    super()

    this.connection = readable.connection
    this._readable = readable
    this._provider = _getProvider(readable.connection)
  }

  private async _getRiskiestModuleBeforeRedistribution(
    overrides?: EthersCallOverrides
  ): Promise<ModuleWithPendingRedistribution> {
    const riskiestModules = await this._readable.getModules(
      { first: 1, sortedBy: 'ascendingCollateralRatio', beforeRedistribution: true },
      overrides
    )

    if (riskiestModules.length === 0) {
      return new ModuleWithPendingRedistribution(AddressZero, 'nonExistent')
    }

    return riskiestModules[0]
  }

  private async _get(
    blockTag?: number
  ): Promise<[baseState: TrenStoreBaseState, extraState: BlockPolledTrenStoreExtraState]> {
    const { userAddress, frontendTag } = this.connection

    const { blockTimestamp, _feesFactory, ...baseState } = await promiseAllValues({
      blockTimestamp: this._readable._getBlockTimestamp(blockTag),
      _feesFactory: this._readable._getFeesFactory({ blockTag }),

      price: this._readable.getPrice({ blockTag }),
      numberOfModules: this._readable.getNumberOfModules({ blockTag }),
      totalRedistributed: this._readable.getTotalRedistributed({ blockTag }),
      total: this._readable.getTotal({ blockTag }),
      trenUSDInStabilityPool: this._readable.getTrenUSDInStabilityPool({ blockTag }),
      _riskiestModuleBeforeRedistribution: this._getRiskiestModuleBeforeRedistribution({ blockTag }),
      totalStakedUniTokens: this._readable.getTotalStakedUniTokens({ blockTag }),

      frontend: frontendTag
        ? this._readable.getFrontendStatus(frontendTag, { blockTag })
        : { status: 'unregistered' as const },

      ...(userAddress
        ? {
          accountBalance: this._provider.getBalance(userAddress, blockTag).then(decimalify),
          trenUSDBalance: this._readable.getTrenUSDBalance(userAddress, { blockTag }),
          uniTokenBalance: this._readable.getUniTokenBalance(userAddress, { blockTag }),
          uniTokenAllowance: this._readable.getUniTokenAllowance(userAddress, { blockTag }),
          liquidityMiningStake: this._readable.getLiquidityMiningStake(userAddress, { blockTag }),
          collateralSurplusBalance: this._readable.getCollateralSurplusBalance(userAddress, {
            blockTag
          }),
          moduleBeforeRedistribution: this._readable.getModuleBeforeRedistribution(userAddress, {
            blockTag
          }),
          stabilityDeposit: this._readable.getStabilityDeposit(userAddress, { blockTag }),
          ownFrontend: this._readable.getFrontendStatus(userAddress, { blockTag })
        }
        : {
          accountBalance: Decimal.ZERO,
          trenUSDBalance: Decimal.ZERO,
          uniTokenBalance: Decimal.ZERO,
          uniTokenAllowance: Decimal.ZERO,
          liquidityMiningStake: Decimal.ZERO,
          collateralSurplusBalance: Decimal.ZERO,
          moduleBeforeRedistribution: new ModuleWithPendingRedistribution(AddressZero, 'nonExistent'),
          stabilityDeposit: new StabilityDeposit(Decimal.ZERO, Decimal.ZERO, Decimal.ZERO, Decimal.ZERO, AddressZero),
          ownFrontend: { status: 'unregistered' as const }
        })
    })

    return [
      {
        ...baseState,
        _feesInNormalMode: _feesFactory(blockTimestamp, false)
      },
      {
        blockTag,
        blockTimestamp,
        _feesFactory
      }
    ]
  }

  /** @internal @override */
  protected _doStart(): () => void {
    this._get().then(state => {
      if (!this._loaded) {
        this._load(...state)
      }
    })

    const handleBlock = async (blockTag: number) => {
      const state = await this._get(blockTag)

      if (this._loaded) {
        this._update(...state)
      } else {
        this._load(...state)
      }
    }

    let latestBlock: number | undefined
    let timerId: ReturnType<typeof setTimeout> | undefined

    const blockListener = (blockTag: number) => {
      latestBlock = Math.max(blockTag, latestBlock ?? blockTag)

      if (timerId !== undefined) {
        clearTimeout(timerId)
      }

      timerId = setTimeout(() => {
        assert(latestBlock !== undefined)
        handleBlock(latestBlock)
      }, 50)
    }

    this._provider.on('block', blockListener)

    return () => {
      this._provider.off('block', blockListener)

      if (timerId !== undefined) {
        clearTimeout(timerId)
      }
    }
  }

  /** @internal @override */
  protected _reduceExtra(
    oldState: BlockPolledTrenStoreExtraState,
    stateUpdate: Partial<BlockPolledTrenStoreExtraState>
  ): BlockPolledTrenStoreExtraState {
    return {
      blockTag: stateUpdate.blockTag ?? oldState.blockTag,
      blockTimestamp: stateUpdate.blockTimestamp ?? oldState.blockTimestamp,
      _feesFactory: stateUpdate._feesFactory ?? oldState._feesFactory
    }
  }
}
