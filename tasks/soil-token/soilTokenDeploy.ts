import "@nomiclabs/hardhat-waffle";
import { task } from "hardhat/config";
import { SoilToken } from "../../typings/SoilToken";
import { SoilToken__factory } from "./../../typings/factories/SoilToken__factory";

task("soiltoken:deploy").setAction(async function (_, hre) {
  const SoilToken = <SoilToken__factory>await hre.ethers.getContractFactory("SoilToken");
  const soilToken = <SoilToken>await SoilToken.deploy();
  await soilToken.deployed();

  console.log("");
  console.log("===================================");
  console.log("|| Soil Token deployed to:", soilToken.address);
  console.log("|| On network:", hre.network.name);
  console.log("===================================");
  console.log("");
});
