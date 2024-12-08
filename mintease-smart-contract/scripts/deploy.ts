import { ethers } from "hardhat";
import { AbstractUniverse } from "../typechain-types";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const AbstractUniverse = await ethers.getContractFactory("AbstractUniverse");

  const abstractUniverse = (await AbstractUniverse.deploy(
    deployer.address
  )) as AbstractUniverse;

  await abstractUniverse.deploymentTransaction()?.wait();

  console.log("AbstractUniverse deployed to:", abstractUniverse.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
