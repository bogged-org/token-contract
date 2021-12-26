import {Bogged} from "../typechain-hardhat/Bogged";
import {account, useChaiBN} from "@defi.org/web3-candies";
import {deployArtifact, resetNetworkFork, tag} from "@defi.org/web3-candies/dist/hardhat";

export let deployer: string;
export let address1: string;
export let address2: string;
export let devWallet: string;
export let bogged: Bogged;

useChaiBN();

export async function prepareForTests() {
    while (true) {
        try {
            return await doInitState();
        } catch (e) {
            console.error(e, "\ntrying again...");
        }
    }
}

async function doInitState() {
    await resetNetworkFork();

    deployer = await account(0);
    tag(deployer, "deployer");

    address1 = await account(1);
    address2 = await account(3);
    devWallet = await account(2);

    bogged = await deployArtifact<Bogged>("Bogged", {from: devWallet}, []);
}
