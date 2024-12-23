import { ethers } from "ethers";
import AbstractUniverseABI from "../abi/AbstractUniverseABI.json";
import { NFT } from "../data/interface";
import { createSignature, prepareMintNFTData } from "./generateData";
import { JsonRpcSigner } from "ethers";
import { mintWithWert } from "../services/wert";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY;
const alchemyProvider = new ethers.JsonRpcProvider(
  `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`
);
const alchemyContract = new ethers.Contract(
  contractAddress,
  AbstractUniverseABI,
  alchemyProvider
);

export const getTokenCounter = async (): Promise<number> => {
  const tokenCounter = await alchemyContract.tokenCounter();
  return Number(tokenCounter);
};

export const getMaxCount = async (): Promise<number> => {
  const maxCount = await alchemyContract.maxTokenCount();
  return Number(maxCount);
};

export const getTokenURI = async (tokenId: number): Promise<string> => {
  const tokenURI = await alchemyContract.tokenURI(tokenId);
  return tokenURI;
};

export const connectContract = async () => {
  try {
    if (!window.ethereum) {
      throw new Error(
        "MetaMask is not installed. Please install it to continue."
      );
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      AbstractUniverseABI,
      signer
    );

    return contract;
  } catch (error) {
    console.error("Error connecting to contract:", error);
    throw error;
  }
};

export async function checkContractExists() {
  const code = await alchemyProvider.getCode(contractAddress);
  if (code === "0x") {
    console.log("Contract not found at this address.");
  } else {
    console.log("Contract found at this address.");
  }
}

export const getMintPrice = async () => {
  const mintPriceInWei = await alchemyContract.mintPriceInWei();

  return mintPriceInWei;
};

export const mintNFT = async (
  signer: JsonRpcSigner,
  mintPriceInWei: string
) => {
  try {
    const contract = await connectContract();

    if (!contract) {
      throw new Error("Failed to connect to contract");
    }

    const mintPriceInEth = parseFloat(
      ethers.formatEther(mintPriceInWei)
    ).toString();

    const recipient = await signer.getAddress();
    const signature = await createSignature(signer, mintPriceInWei);
    const mintNFTData = prepareMintNFTData(recipient);

    console.log(recipient);

    if (!signature) return;

    mintWithWert({
      commodity_amount: Number(mintPriceInEth),
      sc_input_data: mintNFTData,
      signature,
    });

    /* const tx = await contract.mintNFT(recipient, {
      value: mintPriceInWei,
    });

    await tx.wait(); */

    console.log("NFT minted successfully!");
  } catch (error) {
    console.error("Minting failed:", error);
    throw error;
  }
};

export const getOwnedNFTs = async (address: string): Promise<NFT[]> => {
  const nftList: NFT[] = [];

  try {
    const allTokens = await alchemyContract.getAllTokens();

    for (const tokenId of allTokens) {
      const owner = await alchemyContract.ownerOf(tokenId);

      if (owner.toLowerCase() === address.toLowerCase()) {
        const tokenURI = await alchemyContract.tokenURI(tokenId);

        const response = await fetch(tokenURI);
        const metadata = await response.json();

        nftList.push({
          tokenId: tokenId.toString(),
          metadata: {
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error fetching NFTs:", error);
  }

  return nftList;
};

export const setNFTForSale = async (
  tokenId: number,
  priceInEth: string
): Promise<void> => {
  try {
    const contract = await connectContract();
    if (!contract) {
      throw new Error("Failed to connect to the contract");
    }

    const priceInWei = ethers.parseEther(priceInEth);

    const tx = await contract.setTokenPrice(tokenId, priceInWei);

    await tx.wait();

    console.log(
      `NFT with tokenId ${tokenId} is now listed for sale at ${priceInEth} ETH.`
    );
  } catch (error) {
    console.error("Failed to set NFT for sale:", error);
    throw error;
  }
};

export const getNFTsForSaleByOwner = async (owner: string) => {
  try {
    const tokensForSale = await alchemyContract.getTokensForSale();
    const userTokensForSale: NFT[] = [];

    for (const tokenId of tokensForSale) {
      const tokenOwner = await alchemyContract.ownerOf(tokenId);
      if (tokenOwner.toLowerCase() === owner.toLowerCase()) {
        const tokenURI = await alchemyContract.tokenURI(tokenId);
        const metadata = await fetch(tokenURI).then((res) => res.json());
        const price = ethers.formatEther(
          await alchemyContract.tokenPrices(tokenId)
        );
        userTokensForSale.push({
          tokenId: tokenId.toString(),
          metadata,
          price,
        });
      }
    }

    return userTokensForSale;
  } catch (error) {
    console.error("Error fetching NFTs for sale by owner:", error);
    throw error;
  }
};

export const getNFTsForSale = async () => {
  try {
    const tokensForSale = await alchemyContract.getTokensForSale();
    const nftsForSale = [];

    for (const tokenId of tokensForSale) {
      const tokenURI = await alchemyContract.tokenURI(tokenId);
      const metadata = await fetch(tokenURI).then((res) => res.json());
      const price = ethers.formatEther(
        await alchemyContract.tokenPrices(tokenId)
      );

      nftsForSale.push({
        tokenId: tokenId.toString(),
        metadata,
        price,
      });
    }

    return nftsForSale;
  } catch (error) {
    console.error("Error fetching NFTs for sale:", error);
    throw error;
  }
};

export const buyNFT = async (tokenId: number): Promise<void> => {
  try {
    const contract = await connectContract();

    if (!contract) {
      throw new Error("Failed to connect to the contract");
    }

    const price: bigint = await contract.tokenPrices(tokenId);

    if (!price || price === 0n) {
      throw new Error("NFT is not listed for sale.");
    }

    const tx = await contract.buyNFT(tokenId, {
      value: price,
    });

    await tx.wait();

    console.log(`NFT with tokenId ${tokenId} purchased successfully!`);
  } catch (error) {
    console.error("Error purchasing NFT:", error);
    throw error;
  }
};

export const removeNFTFromSale = async (tokenId: number): Promise<void> => {
  try {
    const contract = await connectContract();

    if (!contract) {
      throw new Error("Failed to connect to contract");
    }

    const tx = await contract.removeNFTFromSale(tokenId);
    await tx.wait();

    console.log(`NFT with tokenId ${tokenId} removed from sale successfully.`);
  } catch (error) {
    console.error("Error removing NFT from sale:", error);
    throw error;
  }
};
