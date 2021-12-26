import {HardhatUserConfig} from "hardhat/types";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "hardhat-tracer";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-etherscan";
import {bn9, web3} from "@defi.org/web3-candies";
import "hardhat-contract-sizer";
import {task} from "hardhat/config";
import {deployArtifact} from "@defi.org/web3-candies/dist/hardhat";
import {Bogged} from "./typechain-hardhat/Bogged";

function configFile() {
    return require("./.config.json");
}

task("deploy").setAction(async () => {
    const account = web3().eth.accounts.privateKeyToAccount("XXX");
    web3().eth.accounts.wallet.add(account);

    await deployArtifact<Bogged>("Bogged", {from: account.address, gas: 10_000_000, gasPrice: bn9("5").toString(10)}, [], 6);
    console.log("Finished!");
});

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.9",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 1,
                    },
                },
            }
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            forking: {
                url: `https://speedy-nodes-nyc.moralis.io/${configFile().moralisKey}/bsc/mainnet`,
            },
        },
        eth: {
            chainId: 1,
            url: "https://eth-mainnet.alchemyapi.io/v2/" + configFile().alchemyKey,
        },
        rinkeby: {
            chainId: 4,
            url: "https://eth-rinkeby.alchemyapi.io/v2/" + configFile().alchemyKey,
        },
        bsc: {
            chainId: 56,
            url: `https://speedy-nodes-nyc.moralis.io/${configFile().moralisKey}/bsc/mainnet`,
        }
    },
    typechain: {
        outDir: "typechain-hardhat",
        target: "web3-v1",
    },
    mocha: {
        timeout: 1_000_000,
        retries: 0,
        bail: false,
    },
    gasReporter: {
        currency: "USD",
        coinmarketcap: configFile().coinmarketcapKey,
        showTimeSpent: true,
    },
    etherscan: {
        apiKey: configFile().etherscanKey,
    },
    contractSizer: {
        runOnCompile: true
    }
};
export default config;
