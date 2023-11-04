/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config({ path: './.env' });
require("@nomicfoundation/hardhat-ethers");
module.exports = {
  defaultNetwork: "goerli",
  networks: {
    hardhat: {
    },
    goerli: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY || '']
    }
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./scripts/test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};
