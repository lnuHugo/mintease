import { expect } from "chai";
import { ethers } from "hardhat";
import { AbstractUniverse } from "../typechain-types";

describe("AbstractUniverse Contract", function () {
  let abstractUniverse: AbstractUniverse;
  let owner: any;
  let addr1: any;

  beforeEach(async function () {
    const AbstractUniverseFactory = await ethers.getContractFactory(
      "AbstractUniverse"
    );

    [owner, addr1] = await ethers.getSigners();

    abstractUniverse = (await AbstractUniverseFactory.deploy(
      owner.address
    )) as AbstractUniverse;

    await abstractUniverse.deploymentTransaction()?.wait();
  });

  it("Should deploy with correct owner", async function () {
    const contractOwner = await abstractUniverse.owner();
    expect(contractOwner).to.equal(owner.address);
  });

  it("Should allow owner to mint a new NFT", async function () {
    const tokenURI = "https://example.com/metadata/1.json";

    const tx = await abstractUniverse.mintNFT(addr1.address, tokenURI);
    await tx.wait();

    const uri = await abstractUniverse.tokenURI(0);
    expect(uri).to.equal(tokenURI);

    const nftOwner = await abstractUniverse.ownerOf(0);
    expect(nftOwner).to.equal(addr1.address);
  });

  it("Should increment tokenCounter after minting", async function () {
    const tokenURI = "https://example.com/metadata/1.json";

    await abstractUniverse.mintNFT(addr1.address, tokenURI);

    const counter = await abstractUniverse.tokenCounter();
    expect(counter).to.equal(1);
  });

  it("Should not allow non-owner to mint NFT", async function () {
    const tokenURI = "https://example.com/metadata/1.json";

    await expect(
      abstractUniverse.connect(addr1).mintNFT(addr1.address, tokenURI)
    ).to.be.revertedWithCustomError(
      abstractUniverse,
      "OwnableUnauthorizedAccount"
    );
  });
});
