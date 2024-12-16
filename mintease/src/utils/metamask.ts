import { ethers } from "ethers";
import { checkContractExists } from "./contract";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const connectWallet = async (): Promise<string | null> => {
  if (window.ethereum) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      checkContractExists()
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();   
      return address;
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
    localStorage.removeItem("connectedAddress"); // Ta bort anslutningsstatus
    console.log("Wallet disconnected.");
  };
