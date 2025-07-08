// Central export for all routes
import * as users from './users.js';
import * as donations from './donations.js';
import * as ngoVerification from './ngoVerification.js';
import * as blockchain from './blockchain.js';

const usersRouter = users.default;
const donationsRouter = donations.default;
const ngoVerificationRouter = ngoVerification.default;
const blockchainRouter = blockchain.default;

export {
  usersRouter,
  donationsRouter,
  ngoVerificationRouter,
  blockchainRouter
};
