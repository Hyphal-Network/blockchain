import "@nomiclabs/hardhat-waffle";
import { task } from "hardhat/config";
import { Sample__factory } from "../../typings/factories/Sample__factory";
import { Sample } from "../../typings/Sample";
import { sampleTokenContractAddresses } from "../constants/sampleConstants";

task("sample:deploy").setAction(async function (_, hre) {
  const Sample = <Sample__factory>await hre.ethers.getContractFactory("Sample");
  const sample = <Sample>(
    await Sample.deploy(sampleTokenContractAddresses[hre.network.name as keyof typeof sampleTokenContractAddresses], 18)
  );
  await sample.deployed();

  console.log("");
  console.log("===================================");
  console.log("|| Sample Smart Contract deployed to:", sample.address);
  console.log("|| On network:", hre.network.name);
  console.log("===================================");
  console.log("");
});
