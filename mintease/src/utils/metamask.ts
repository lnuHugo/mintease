import { ethers, JsonRpcSigner } from "ethers";
import { checkContractExists } from "./contract";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const connectWallet = async (): Promise<JsonRpcSigner | null> => {
  if (window.ethereum) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      checkContractExists();
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      return signer;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return null;
    }
  } else {
    alert("MetaMask not detected. Please install it from https://metamask.io/");
    return null;
  }
};

export const disconnectWallet = (): void => {
  localStorage.removeItem("connectedAddress");
  console.log("Wallet disconnected.");
};
