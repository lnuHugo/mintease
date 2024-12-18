import { ethers } from "ethers";
import AbstractUniverseABI from "../abi/AbstractUniverseABI.json";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
console.log(contractAddress);

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
