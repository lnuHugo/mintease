import { ethers } from "hardhat";

async function main() {
  const abstractUniverse = await ethers.getContractAt(
    "MintEaseNFT",
    "0x070519DC01351Fc29A37Dd89C081393E6ed4C97F"
  );

  const tokenURI =
    "https://gateway.pinata.cloud/ipfs/QmRjs47zT1LsZ2npBCGnPCpTWeP7TGGc8KxyY4mMkLKiZa";
  const recipient = "0xEf412930Dd0B2b7bc8121F7333b0d4d09659a553";

  console.log(`Minting NFT to ${recipient} with URI: ${tokenURI}`);

  const tx = await mintEaseNFT.mintNFT(recipient, tokenURI);
  await tx.wait();

  console.log("NFT minted successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
