// Central export for all models
const User = require('./User.js');
const Donation = require('./Donation.js');
const NgoVerification = require('./NgoVerification.js');
const Transaction = require('./Transaction.js');

module.exports = {
  User,
  Donation,
  NgoVerification,
  Transaction
};
