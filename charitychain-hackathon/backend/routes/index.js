// Central export for all routes
const usersRouter = require('./users.js');
const donationsRouter = require('./donations.js');
const ngoVerificationRouter = require('./ngoVerification.js');
const blockchainRouter = require('./blockchain.js');

module.exports = {
  usersRouter,
  donationsRouter,
  ngoVerificationRouter,
  blockchainRouter
};
