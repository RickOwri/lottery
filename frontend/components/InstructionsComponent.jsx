import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
import { ethers } from 'ethers';

import WalletInfo from "./walletInfo";
import { BuyingToken } from "./BuyTokens";
import { State } from "./CheckState";
import { OpenBets } from "./OpenBets";
import { ClosingLottery } from "./ClosingBets";

import {DisplayTokenBalance} from "./DisplayTokenBalance"
import { ClaimPrize } from "./ClaimPrize";
import { DisplayBalance } from "./DisplayBalance";
import { WithdrawTokens } from "./WithdrawToken";

require('dotenv').config();

export default function InstructionsComponent() {
	const router = useRouter();
	return (
		<div className={styles.container}>
			<header className={styles.header_container}>
				<h1>
					Lottery Dapp
				</h1>
			</header>
			<div className={styles.buttons_container}>
				<h2 className={styles.header_container}>What do you want to do ?</h2>
				<h2>Wallet Informations</h2>
				<WalletInfo></WalletInfo>
				<h2>Buying Token</h2>
				<BuyingToken></BuyingToken>
				<h2>Check State</h2>
				<State></State>
				<h2>Open Bets</h2>
				<OpenBets></OpenBets>
				<h2>Closing Lottery</h2>
				<ClosingLottery></ClosingLottery>
				<h2>Claim Prize</h2>
				<ClaimPrize></ClaimPrize>
				<h2>Display balance</h2>
				<DisplayBalance></DisplayBalance>
				<h2>Display token balance</h2>
				<DisplayTokenBalance></DisplayTokenBalance>
				<h2>Withdraw Tokens</h2>
				<WithdrawTokens></WithdrawTokens>
			</div>
			<div className={styles.footer}>
				Footer
			</div>
		</div>
	);
}


async function displayBalance(index) {
	// const balanceBN = await provider.getBalance(accounts[Number(index)].getAddress());
	const balanceBN = await accounts[Number(index)].getBalance();
	const balance = ethers.utils.formatEther(balanceBN);
	console.log(
		`The account address ${accounts[Number(index)].getAddress()} has ${balance} ETH\n`
	);
}


async function bet(index, amount) {

	const allowTx = await token
		.connect(accounts[Number(index)])
		.approve(contract.address, ethers.constants.MaxUint256);
	await allowTx.wait();
	const tx = await contract.connect(accounts[Number(index)]).betMany(amount);
	const receipt = await tx.wait();
	console.log(`Bets placed (${receipt.transactionHash})\n`);
}



async function displayPrize(index) {
	const prizeBN = await contract.prize(accounts[Number(index)].getAddress());
	const prize = ethers.utils.formatEther(prizeBN);
	console.log(
		`The account of address ${accounts[Number(index)].getAddress()
		} has earned a prize of ${prize} Tokens\n`
	);
	return prize;
}


async function displayOwnerPool() {
	const balanceBN = await contract.ownerPool();
	const balance = ethers.utils.formatEther(balanceBN);
	console.log(`The owner pool has (${balance}) Tokens \n`);
}

async function withdrawTokens(amount) {
	const tx = await contract.ownerWithdraw(ethers.utils.parseEther(amount));
	const receipt = await tx.wait();
	console.log(`Withdraw confirmed (${receipt.transactionHash})\n`);
}

async function burnTokens(index, amount) {
	const allowTx = await token
		.connect(accounts[Number(index)])
		.approve(contract.address, ethers.constants.MaxUint256);
	const receiptAllow = await allowTx.wait();
	console.log(`Allowance confirmed (${receiptAllow.transactionHash})\n`);
	const tx = await contract
		.connect(accounts[Number(index)])
		.returnTokens(ethers.utils.parseEther(amount));
	const receipt = await tx.wait();
	console.log(`Burn confirmed (${receipt.transactionHash})\n`);
}