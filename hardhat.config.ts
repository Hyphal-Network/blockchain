import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import { config as dotenvConfig } from "dotenv";
import "hardhat-gas-reporter";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import { resolve } from "path";
import "solidity-coverage";
import "./tasks/sample";
import "./tasks/soil-token";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY;
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

const mnemonic: string | undefined = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

const chainIds = {
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
  moonbeam: 1284,
  moonbase: 1287,
  bsc: 56,
  bsctest: 97,
  xinfin: 50,
  apothem: 51,
  polygon: 137,
  mumbai: 80001,
};

const chainUrls = {
  hardhat: "localhost",
  mainnet: "https://mainnet.infura.io/v3/" + infuraApiKey,
  rinkeby: "https://rinkeby.infura.io/v3/" + infuraApiKey,
  goerli: "https://goerli.infura.io/v3/" + infuraApiKey,
  kovan: "https://kovan.infura.io/v3/" + infuraApiKey,
  ropsten: "https://ropsten.infura.io/v3/" + infuraApiKey,
  moonbeam: "https://rpc.api.moonbeam.network",
  moonbase: "https://rpc.api.moonbase.moonbeam.network",
  bsc: "https://bsc-dataseed.binance.org",
  bsctest: "https://data-seed-prebsc-1-s1.binance.org:8545",
  xinfin: "https://erpc.xinfin.network",
  apothem: "https://rpc.apothem.network",
  polygon: "https://polygon-rpc.com/",
  mumbai: "https://rpc-mumbai.maticvigil.com/",
};

function getChainConfig(network: keyof typeof chainIds): NetworkUserConfig {
  return {
    accounts: {
      count: 10,
      mnemonic,
      path: "m/44'/60'/0'/0",
    },
    chainId: chainIds[network],
    url: chainUrls[network],
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.9",
    settings: {
      metadata: {
        bytecodeHash: "none",
      },
      // Disable the optimizer when debugging
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  typechain: {
    outDir: "typings",
    target: "ethers-v5",
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 80,
    enabled: !!process.env.REPORT_GAS,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic: mnemonic,
        accountsBalance: "100000000000000000000000000",
      },
      chainId: chainIds.hardhat,
      forking: process.env.FORK
        ? {
            url: process.env.FORK,
          }
        : undefined,
    },
    mainnet: getChainConfig("mainnet"),
    rinkeby: getChainConfig("rinkeby"),
    goerli: getChainConfig("goerli"),
    kovan: getChainConfig("kovan"),
    ropsten: getChainConfig("ropsten"),
    moonbeam: getChainConfig("moonbeam"),
    moonbase: getChainConfig("moonbase"),
    bsc: getChainConfig("bsc"),
    bsctest: getChainConfig("bsctest"),
    xinfin: getChainConfig("xinfin"),
    apothem: getChainConfig("apothem"),
    polygon: getChainConfig("polygon"),
    mumbai: getChainConfig("mumbai"),
  },
};

export default config;
