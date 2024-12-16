import { expect } from "chai";
import { ethers } from "hardhat";
import { AbstractUniverse } from "../typechain-types";

describe("AbstractUniverse Contract", function () {
  let abstractUniverse: AbstractUniverse;
  let owner: any;
  let addr1: any;
  let addr2: any;

  const maxTokenCount = 5;
  const mintPriceInEth = 1;
  const baseTokenURI = "https://example.com/metadata";

  const predefinedURIs = [
    "https://gateway.pinata.cloud/ipfs/QmR7mZdjawmz6rsT2thrqpbniuuT1bKc2CJoCMPVXeoPXW",
    "https://gateway.pinata.cloud/ipfs/QmdGg2nHbU62UTdWqZ9u7pLiYDE8Qss2hoFQ2f4e8YycvZ",
    "https://gateway.pinata.cloud/ipfs/QmZkPAsjZsSmfVsb7PQUHE2hZfKfdqbg7hmJf3DQXcuXGh",
    "https://gateway.pinata.cloud/ipfs/QmeCXArEcnyYbsxVmCiTtqUQZCz8iAxHxSnwhZJKJqPTPW",
    "https://gateway.pinata.cloud/ipfs/QmVy6JTmugVrC5EdvznxQwoxKRoVykaMA7b4VRwva9qbfG",
];

  beforeEach(async function () {
    const [deployer, _addr1, _addr2] = await ethers.getSigners();
    owner = deployer;
    addr1 = _addr1;
    addr2 = _addr2;

    const AbstractUniverse = await ethers.getContractFactory("AbstractUniverse");
    abstractUniverse = await AbstractUniverse.deploy(deployer.address, maxTokenCount, mintPriceInEth, predefinedURIs);

    expect(await abstractUniverse.owner()).to.equal(deployer);    
  });

  it("Should deploy the contract with correct parameters", async function () {
    expect(await abstractUniverse.tokenCounter()).to.equal(0);
    expect(await abstractUniverse.maxTokenCount()).to.equal(maxTokenCount);
    expect(await abstractUniverse.mintPriceInWei()).to.equal(ethers.parseEther(mintPriceInEth.toString()));
  });

  it("Should mint an NFT correctly", async function () {
    // Mint NFT
    const tx = await abstractUniverse.connect(addr1).mintNFT(addr1.address, {
      value: ethers.parseEther(mintPriceInEth.toString()),
    });
    await tx.wait();

    // Verifiera att tokenCounter har ökat
    expect(await abstractUniverse.tokenCounter()).to.equal(1);

    // Verifiera att tokenURI för tokenId 0 är korrekt
    const tokenURI = await abstractUniverse.tokenURI(0);
    expect(tokenURI).to.equal(predefinedURIs[0]);

    // Verifiera att ägaren av NFT:n är addr1
    expect(await abstractUniverse.ownerOf(0)).to.equal(addr1.address);
  });

  it("Should allow the owner to update the mint price", async function () {
    const newPriceInEth = 2;
    await abstractUniverse.connect(owner).setMintPrice(newPriceInEth);

    expect(await abstractUniverse.mintPriceInWei()).to.equal(ethers.parseEther(newPriceInEth.toString()));
  });

  it("Should not allow a non-owner to update the mint price", async function () {
    const newPriceInEth = 2;

    await expect(
        abstractUniverse.connect(addr1).setMintPrice(newPriceInEth)
    ).to.be.revertedWithCustomError(
      abstractUniverse,
      "OwnableUnauthorizedAccount"
  );;
    
    const currentPrice = await abstractUniverse.mintPriceInWei();
    expect(currentPrice).to.equal(ethers.parseEther(mintPriceInEth.toString()));
});

it("Should allow the owner to update the base URI", async function () {
  const newBaseURI = "https://newbaseuri.com/metadata";
  
  await abstractUniverse.connect(owner).setBaseTokenURI(newBaseURI);

  const tokenURI = await abstractUniverse.generateTokenURI(0);
  expect(tokenURI).to.equal("https://newbaseuri.com/metadata/0.json");
});

  it("Should allow the owner to set a price for an NFT and allow it to be bought", async function () {
    const tokenId = 0;
    const priceInWei = ethers.parseEther("2");

    const mintTx = await abstractUniverse.connect(owner).mintNFT(addr1.address, { value: ethers.parseEther("1") });
    await mintTx.wait();

    await abstractUniverse.connect(addr1).setTokenPrice(tokenId, priceInWei);

    expect(await abstractUniverse.tokenPrices(tokenId)).to.equal(priceInWei);

    const balanceBefore = await ethers.provider.getBalance(addr1.address);

    const buyTx = await abstractUniverse.connect(addr2).buyNFT(tokenId, { value: priceInWei });
    await buyTx.wait();

    expect(await abstractUniverse.ownerOf(tokenId)).to.equal(addr2.address);

    const balanceAfter = await ethers.provider.getBalance(addr1.address);

    expect(balanceAfter - balanceBefore).to.equal(priceInWei);
});


  it("Should not allow a non-owner to set a price for an NFT", async function () {
    const tokenId = 0;
    const priceInWei = ethers.parseEther("2");

    const mintTx = await abstractUniverse.connect(addr1).mintNFT(addr1.address, { value: ethers.parseEther("1") });
    await mintTx.wait();

    await expect(
      abstractUniverse.connect(addr2).setTokenPrice(tokenId, priceInWei)
    ).to.be.revertedWith("You are not the owner of this NFT");
  });

  it("Should return all tokens", async function () {
    await abstractUniverse.mintNFT(addr1.address, { value: ethers.parseEther(mintPriceInEth.toString()) });
    await abstractUniverse.mintNFT(addr2.address, { value: ethers.parseEther(mintPriceInEth.toString()) });

    const allTokens = await abstractUniverse.getAllTokens();
    expect(allTokens.length).to.equal(2);
  });

  it("Should return tokens for sale", async function () {
    const tokenId = 0;
    const priceInWei = ethers.parseEther("2");

    const mintTx = await abstractUniverse.connect(addr1).mintNFT(addr1.address, { value: ethers.parseEther("1") });
    await mintTx.wait();

    await abstractUniverse.connect(addr1).setTokenPrice(tokenId, priceInWei);

    const tokensForSale = await abstractUniverse.getTokensForSale();
    expect(tokensForSale.length).to.equal(1);
    expect(tokensForSale[0]).to.equal(tokenId);
  });

  it("Should correctly convert uint to string", async function () {
    const tokenId = 123;
    const expectedString = "123";

    const tokenURI = await abstractUniverse.generateTokenURI(tokenId);
    expect(tokenURI).to.include(expectedString);
});
});