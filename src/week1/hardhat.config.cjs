/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config();

module.exports = {
  defaultNetwork: "goerli",
  networks: {
    hardhat: {
    },
    goerli: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
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
    sources: "./lesson3",
    tests: "./lesson3/test",
    cache: "./lesson3/cache",
    artifacts: "./lesson3/artifacts"
  },
};
