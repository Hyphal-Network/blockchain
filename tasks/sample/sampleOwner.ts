import "@nomiclabs/hardhat-waffle";
import { task } from "hardhat/config";
import { Sample__factory } from "../../typings/factories/Sample__factory";
import { Sample } from "../../typings/Sample";
import { sampleContractAddresses } from "../constants/sampleConstants";

task("soil:owner", "Return wallet owning the contract").setAction(async (_, hre) => {
  const Sample = <Sample__factory>await hre.ethers.getContractFactory("Sample");

  const sample = <Sample>(
    Sample.attach(sampleContractAddresses[hre.network.name as keyof typeof sampleContractAddresses])
  );

  const res = await sample.owner();

  console.log("");
  console.log("===================================");
  console.log(
    "|| Contract on " +
      hre.network.name +
      " with address " +
      sampleContractAddresses[hre.network.name as keyof typeof sampleContractAddresses],
  );
  console.log("|| Is owned by wallet address: " + res);
  console.log("===================================");
  console.log("");
});

task("sample:transferOwner", "Transfers the ownership of the smart contract to a new address")
  .addParam("o", "Wallet address of the new Owner")
  .setAction(async ({ o }, hre) => {
    const Sample = <Sample__factory>await hre.ethers.getContractFactory("Sample");

    const sample = <Sample>(
      Sample.attach(sampleContractAddresses[hre.network.name as keyof typeof sampleContractAddresses])
    );

    const previousOwner = await sample.owner();

    const execute = await sample.transferOwnership(o, {
      gasPrice: hre.ethers.utils.parseUnits("80", "gwei"),
      gasLimit: 100000,
    });

    console.log("");
    console.log("===================================");
    console.log("|| Contract on " + hre.network.name + " has changed ownership ");
    console.log("|| From " + previousOwner);
    console.log("|| To: " + o);
    console.log("|| Awaiting 5 confirmations ");
    const receipt = await execute.wait(5);
    console.log("|| Tx: " + receipt.transactionHash);
    console.log("===================================");
    console.log("");
  });
