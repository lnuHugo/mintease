import { ethers } from "ethers";
import { signSmartContractData } from "@wert-io/widget-sc-signer";

const wertKey = import.meta.env.VITE_WERT_PRIVATE_KEY;

export const prepareMintNFTData = (recipientAddress: string) => {
  const abi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "recipient",
          type: "address",
        },
      ],
      name: "mintNFT",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
  ];

  const iface = new ethers.Interface(abi);
  const hexString = iface.encodeFunctionData("mintNFT", [recipientAddress]);
  const encodedData = hexString.slice(2);

  return encodedData;
};

export const prepareBuyNFTData = (tokenId: number, recipient: string) => {
  const abi = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "recipient",
          type: "address",
        },
      ],
      name: "buyNFT",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
  ];

  const iface = new ethers.Interface(abi);
  const hexString = iface.encodeFunctionData("buyNFT", [tokenId, recipient]);
  const encodedData = hexString.slice(2);

  return encodedData;
};

export async function createSignature(options: any) {
  const signedOptions = signSmartContractData(options, wertKey);

  return signedOptions;
}
