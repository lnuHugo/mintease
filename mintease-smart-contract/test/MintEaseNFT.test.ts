import { expect } from "chai";
import { ethers } from "hardhat";
import { MintEaseNFT } from "../typechain-types";

describe("MintEaseNFT Contract", function () {
  let mintEaseNFT: MintEaseNFT;
  let owner: any;
  let addr1: any;

  beforeEach(async function () {
    const MintEaseNFT = await ethers.getContractFactory("MintEaseNFT");
    [owner, addr1] = await ethers.getSigners();

    mintEaseNFT = (await MintEaseNFT.deploy(owner.address)) as MintEaseNFT;
    await mintEaseNFT.deploymentTransaction()?.wait();
  });

  it("Should deploy with correct owner", async function () {
    const contractOwner = await mintEaseNFT.owner();
    expect(contractOwner).to.equal(owner.address);
  });

  it("Should allow owner to mint a new NFT", async function () {
    const tokenURI = "https://example.com/metadata/1.json";

    const tx = await mintEaseNFT.mintNFT(addr1.address, tokenURI);
    await tx.wait();

    const uri = await mintEaseNFT.tokenURI(0);
    expect(uri).to.equal(tokenURI);

    const nftOwner = await mintEaseNFT.ownerOf(0);
    expect(nftOwner).to.equal(addr1.address);
  });

  it("Should increment tokenCounter after minting", async function () {
    const tokenURI = "https://example.com/metadata/1.json";

    await mintEaseNFT.mintNFT(addr1.address, tokenURI);

    const counter = await mintEaseNFT.tokenCounter();
    expect(counter).to.equal(1);
  });

  it("Should not allow non-owner to mint NFT", async function () {
    const tokenURI = "https://example.com/metadata/1.json";

    await expect(
      mintEaseNFT.connect(addr1).mintNFT(addr1.address, tokenURI)
    ).to.be.revertedWithCustomError(mintEaseNFT, "OwnableUnauthorizedAccount");
  });
});
