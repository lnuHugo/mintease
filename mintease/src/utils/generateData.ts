import { ethers } from "ethers";
import { signSmartContractData } from '@wert-io/widget-sc-signer';

// 54ba0f27000000000000000000000000ef412930dd0b2b7bc8121f7333b0d4d09659a553
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

export async function createSignature(
  options: any,
) {  
  const signedOptions = signSmartContractData(options, wertKey);
    
    return signedOptions;
  }
