import { ethers } from "ethers";
import AbstractUniverseABI from "../abi/AbstractUniverseABI.json";
import { NFT } from "../data/interface";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY;

// const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`);

export const getTokenCounter = async (): Promise<number> => {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const contract = new ethers.Contract(
    contractAddress,
    AbstractUniverseABI,
    provider
  );
  const tokenCounter = await contract.tokenCounter();
  return Number(tokenCounter);
};

export const getTokenURI = async (tokenId: number): Promise<string> => {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const contract = new ethers.Contract(
    contractAddress,
    AbstractUniverseABI,
    provider
  );
  const tokenURI = await contract.tokenURI(tokenId);
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
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  console.log(contractAddress);

  const code = await provider.getCode(contractAddress);
  if (code === "0x") {
    console.log("Contract not found at this address.");
  } else {
    console.log("Contract found at this address.");
  }
}

export const getMintPrice = async () => {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const contract = new ethers.Contract(
    contractAddress,
    AbstractUniverseABI,
    provider
  );
  const mintPriceInWei = await contract.mintPriceInWei();

  return ethers.formatEther(mintPriceInWei);
};

export const mintNFT = async (recipient: string, mintPriceInEth: string) => {
  try {
    const contract = await connectContract();

    if (!contract) {
      throw new Error("Failed to connect to contract");
    }

    const mintPriceInWei = ethers.parseEther(mintPriceInEth);

    const tx = await contract.mintNFT(recipient, {
      value: mintPriceInWei,
    });

    await tx.wait();

    console.log("NFT minted successfully!");
    return tx;
  } catch (error) {
    console.error("Minting failed:", error);
    throw error;
  }
};

export const getOwnedNFTs = async (address: string): Promise<NFT[]> => {
  const nftList: NFT[] = [];
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  const contract = new ethers.Contract(
    contractAddress,
    AbstractUniverseABI,
    provider
  );

  try {
    const allTokens = await contract.getAllTokens();

    for (const tokenId of allTokens) {
      const owner = await contract.ownerOf(tokenId);

      if (owner.toLowerCase() === address.toLowerCase()) {
        const tokenURI = await contract.tokenURI(tokenId);

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
