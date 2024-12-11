import { ethers } from "ethers";
import AbstractUniverseABI from "../abi/AbstractUniverseABI.json";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY

const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`);

export const getTokenCounter = async (): Promise<number> => {
  const contract = new ethers.Contract(contractAddress, AbstractUniverseABI, provider);
  const tokenCounter = await contract.tokenCounter();
  return Number(tokenCounter);
};

export const getTokenURI = async (tokenId: number): Promise<string> => {
  const contract = new ethers.Contract(contractAddress, AbstractUniverseABI, provider);
  const tokenURI = await contract.tokenURI(tokenId);
  return tokenURI;
};
