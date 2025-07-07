const { BlockFrostAPI } = require('@blockfrost/blockfrost-js');

class BlockfrostService {
  constructor() {
    this.api = new BlockFrostAPI({
      projectId: process.env.BLOCKFROST_API_KEY,
      customBackend: 'https://cardano-testnet.blockfrost.io/api/v0'
    })
  }

  async getTransaction(txHash) {
    try {
      const tx = await this.api.txs(txHash)
      const utxos = await this.api.txsUtxos(txHash)
      
      return {
        ...tx,
        inputs: utxos.inputs,
        outputs: utxos.outputs
      }
    } catch (error) {
      console.error('Error fetching transaction:', error)
      return null
    }
  }

  async verifyTransaction(txHash) {
    try {
      const tx = await this.api.txs(txHash)
      const utxos = await this.api.txsUtxos(txHash)
      const latestBlock = await this.api.blocksLatest()
      
      const confirmations = latestBlock.height - tx.block_height
      
      return {
        isValid: true,
        details: tx,
        blockNumber: tx.block_height,
        blockHash: tx.block_hash,
        timestamp: new Date(tx.block_time * 1000),
        confirmations,
        fee: tx.fees,
        inputs: utxos.inputs,
        outputs: utxos.outputs
      }
    } catch (error) {
      console.error('Error verifying transaction:', error)
      return {
        isValid: false,
        error: error.message
      }
    }
  }

  async getAddressBalance(address) {
    try {
      const addressInfo = await this.api.addresses(address)
      return {
        amount: addressInfo.amount,
        assets: addressInfo.amount.filter(asset => asset.unit !== 'lovelace')
      }
    } catch (error) {
      console.error('Error fetching address balance:', error)
      return { amount: [], assets: [] }
    }
  }

  async getAddressTransactions(address, page = 1, count = 100) {
    try {
      return await this.api.addressesTransactions(address, { page, count })
    } catch (error) {
      console.error('Error fetching address transactions:', error)
      return []
    }
  }

  async getAddressUtxos(address) {
    try {
      return await this.api.addressesUtxos(address)
    } catch (error) {
      console.error('Error fetching address UTXOs:', error)
      return []
    }
  }

  async getAddressAssets(address) {
    try {
      const addressInfo = await this.api.addresses(address)
      return addressInfo.amount.filter(asset => asset.unit !== 'lovelace')
    } catch (error) {
      console.error('Error fetching address assets:', error)
      return []
    }
  }

  async getNetworkInfo() {
    try {
      const latest = await this.api.blocksLatest()
      const epoch = await this.api.epochsLatest()
      const params = await this.api.epochsLatestParameters()
      
      return {
        epoch: epoch.epoch,
        block_count: latest.height,
        network: 'testnet',
        protocol_params: params
      }
    } catch (error) {
      console.error('Error fetching network info:', error)
      return null
    }
  }

  async getConfirmations(blockHeight) {
    try {
      const latestBlock = await this.api.blocksLatest()
      return latestBlock.height - blockHeight
    } catch (error) {
      console.error('Error getting confirmations:', error)
      return 0
    }
  }

  async submitTransaction(signedTx) {
    try {
      const result = await this.api.txSubmit(signedTx)
      return {
        success: true,
        transactionHash: result,
        message: 'Transaction submitted successfully'
      }
    } catch (error) {
      console.error('Error submitting transaction:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to submit transaction'
      }
    }
  }

  async getAssetInfo(assetId) {
    try {
      return await this.api.assets(assetId)
    } catch (error) {
      console.error('Error fetching asset info:', error)
      return null
    }
  }

  async getAssetHistory(assetId) {
    try {
      return await this.api.assetsHistory(assetId)
    } catch (error) {
      console.error('Error fetching asset history:', error)
      return []
    }
  }

  async getAssetTransactions(assetId) {
    try {
      return await this.api.assetsTransactions(assetId)
    } catch (error) {
      console.error('Error fetching asset transactions:', error)
      return []
    }
  }

  async getPoolInfo(poolId) {
    try {
      return await this.api.pools(poolId)
    } catch (error) {
      console.error('Error fetching pool info:', error)
      return null
    }
  }
}

const blockfrostService = new BlockfrostService();

module.exports = { blockfrostService };
