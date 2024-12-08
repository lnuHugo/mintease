import { ethers } from "hardhat";

async function main() {
  const abstractUniverse = await ethers.getContractAt(
    "AbstractUniverse",
    "0xDb4156E9D17a2eF1873C39AEb3b6B6Dc9CCd2B8d"
  );

  const tokenURI =
    "https://gateway.pinata.cloud/ipfs/QmSW97WvsqL1yaQKrUoWq6GL1voiCz4Y8MRWGohusErdno";
  const recipient = "0xEf412930Dd0B2b7bc8121F7333b0d4d09659a553";

  console.log(`Minting NFT to ${recipient} with URI: ${tokenURI}`);

  const tx = await abstractUniverse.mintNFT(recipient, tokenURI);
  await tx.wait();

  console.log("NFT minted successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
