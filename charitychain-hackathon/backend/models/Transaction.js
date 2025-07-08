import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionHash: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fromAddress: {
    type: String,
    required: true,
    trim: true
  },
  toAddress: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  fee: {
    type: Number,
    required: true,
    min: 0
  },
  blockNumber: {
    type: Number,
    required: true
  },
  blockHash: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    required: true
  },
  type: {
    type: String,
    enum: ['donation', 'nft_mint', 'transfer'],
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  confirmations: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
transactionSchema.index({ transactionHash: 1 });
transactionSchema.index({ fromAddress: 1 });
transactionSchema.index({ toAddress: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ blockNumber: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
