require("@nomicfoundation/hardhat-toolbox");
const fs = require("fs");
const privateKey = fs.readFileSync("secrete.txt").toString();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {
      chainId: 4202,
    },

    BitTorrent: {
      url: "https://pre-rpc.bt.io/",
      accounts: [privateKey],
      gasPrice: 1000000000,
    },
  },
  solidity: "0.8.24",
  allowUnlimitedContractSize: true,
  throwOnTransactionFailures: true,
  throwOnCallFailures: true,
  loggingEnabled: true,
};

// npx hardhat ignition deploy ./ignition/modules/WebpageStorageModule.js --network BitTorrent
// 0x7E939AC65390E7a34e8E1b34B501D2D2a7FB2825
