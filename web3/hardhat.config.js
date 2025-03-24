require("@matterlabs/hardhat-zksync-solc");
require("@matterlabs/hardhat-zksync-verify");
require("dotenv").config();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // Set the default network to sepolia
  defaultNetwork: 'sepolia',
  // Add sepolia (and Hardhat) network configuration along with your zkSync networks
  networks: {
    hardhat: {},
    sepolia: {
      url: 'https://ethereum-sepolia-rpc.publicnode.com',
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    },
    zkSyncSepoliaTestnet: {
      url: "https://sepolia.era.zksync.dev",
      ethNetwork: "sepolia",
      zksync: true,
      chainId: 300,
      verifyURL: "https://explorer.sepolia.era.zksync.dev/contract_verification",
    },
    zkSyncMainnet: {
      url: "https://mainnet.era.zksync.io",
      ethNetwork: "mainnet",
      zksync: true,
      chainId: 324,
      verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
    },
  },
  // zkSync-specific compiler configuration
  zksolc: {
    version: "1.4.1",
    compilerSource: "binary",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  // Define the paths used by Hardhat
  paths: {
    artifacts: "./artifacts-zk",
    cache: "./cache-zk",
    sources: "./contracts",
    tests: "./test",
  },
  // Standard Solidity compiler configuration
  solidity: {
    version: "0.8.23",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};