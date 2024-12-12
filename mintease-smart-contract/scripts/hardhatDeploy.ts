import { ethers } from "hardhat";

async function main() {
    const AbstractUniverse = await ethers.getContractFactory("AbstractUniverse");

    const contract = await AbstractUniverse.deploy(
        "0xYourInitialOwnerAddress",
        100,
        1,
        "https://example.com/metadata/"
    );

    await contract.waitForDeployment();

    console.log("Contract deployed to:", await contract.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
