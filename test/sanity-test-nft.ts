import {deployer, devWallet, bogged, prepareForTests, address1, address2} from "./test-base";
import {bn, bn18, contract, erc20, erc20s, expectRevert, web3, zero} from "@defi.org/web3-candies";
import {impersonate, mineBlock, mineBlocks} from "@defi.org/web3-candies/dist/hardhat";
import {expect} from "chai";
import {PancakeRouterAbi} from "../typechain-abi/pancakeRouterAbi";

describe("----------  The Collectors Tests ---------- ", () => {
    beforeEach(async () => {
        await prepareForTests();
    });

    const pancakeRouter = contract<PancakeRouterAbi>(require('../abi/pancakeRouterAbi.json'), "0x10ED43C718714eb63d5aA57B78B54704E256024E");

    it("Simple testing", async () => {
        await bogged.methods.transfer(deployer, bn18(100)).send({from: devWallet});
        expect(await bogged.methods.balanceOf(deployer).call()).bignumber.eq(bn18(100));
        await expectRevert(async () => await bogged.methods.transfer(address1, bn18(100)).send({from: deployer}), 'Trading is not active.');

        const balance = await bogged.methods.balanceOf(devWallet).call();
        await bogged.methods.approve(pancakeRouter.options.address, balance).send({from:devWallet});
        await pancakeRouter.methods.addLiquidityETH(
            bogged.options.address,
            balance,
            balance,
            bn18(10),
            devWallet,
            Math.round(new Date().getTime() / 1000)
        ).send({from: devWallet, value: bn18(10)});

        await bogged.methods.updateSwapEnabled(true).send({from: devWallet});
        await bogged.methods.enableTrading().send({from: devWallet});
        await bogged.methods.disableTransferDelay().send({from: devWallet});

        await pancakeRouter.methods.swapExactETHForTokens(
            bn18(1000),
            [
                "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
                bogged.options.address
            ],
            address1,
            Math.round(new Date().getTime() / 1000)
        ).send({from: address1, value: bn18(0.01)});

        await pancakeRouter.methods.swapExactETHForTokens(
            bn18(1000),
            [
                "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
                bogged.options.address
            ],
            address2,
            Math.round(new Date().getTime() / 1000)
        ).send({from: address2, value: bn18(0.01)});

        await pancakeRouter.methods.swapExactETHForTokens(
            bn18(1000),
            [
                "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
                bogged.options.address
            ],
            address2,
            Math.round(new Date().getTime() / 1000)
        ).send({from: address2, value: bn18(0.01)});

        await pancakeRouter.methods.swapExactETHForTokens(
            bn18(1000),
            [
                "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
                bogged.options.address
            ],
            address1,
            Math.round(new Date().getTime() / 1000)
        ).send({from: address1, value: bn18(0.05)});

        await pancakeRouter.methods.swapExactETHForTokens(
            bn18(1000),
            [
                "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
                bogged.options.address
            ],
            address2,
            Math.round(new Date().getTime() / 1000)
        ).send({from: address2, value: bn18(0.05)});

        await pancakeRouter.methods.swapExactETHForTokens(
            bn18(1000),
            [
                "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
                bogged.options.address
            ],
            deployer,
            Math.round(new Date().getTime() / 1000)
        ).send({from: deployer, value: bn18(0.05)});

        await bogged.methods.approve(pancakeRouter.options.address, balance).send({from:address2});
        await pancakeRouter.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
            bn18(1000000),
            1,
            [
                bogged.options.address,
                "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
            ],
            address2,
            Math.round(new Date().getTime() / 1000)
        ).send({from: address2});

        console.log(await bogged.methods.balanceOf(address1).call());
        console.log(await bogged.methods.tokensForMarketing().call());
        console.log(await web3().eth.getBalance(await bogged.methods.marketingWallet().call()));

    });

});
