import { ethers } from "hardhat";
import { MintEaseNFT } from "../typechain-types";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const MintEaseNFT = await ethers.getContractFactory("MintEaseNFT");

  const mintEaseNFT = (await MintEaseNFT.deploy(
    deployer.address
  )) as MintEaseNFT;

  await mintEaseNFT.deploymentTransaction()?.wait();

  console.log("MintEaseNFT deployed to:", mintEaseNFT.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
