import { JsonRpcSigner, ethers } from "ethers";

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

  // Create an Interface instance
  const iface = new ethers.Interface(abi);

  // Encode the function call
  // const encodedData = iface.encodeFunctionData("mintNFT", [recipientAddress]);

  const abiCoder = new ethers.AbiCoder();
  const encodedData = abiCoder.encode(["address"], [recipientAddress]);

  console.log(encodedData);

  return encodedData;
};

export async function createSignature(
  signer: JsonRpcSigner,
  mintPriceInWei: string
) {
  if (signer) {
    const abiCoder = new ethers.AbiCoder();
    const address = await signer.getAddress();

    const mintPriceInEth = ethers.formatUnits(mintPriceInWei, 18);

    const message = `
      By signing this message, you confirm the minting of an NFT.
      Address: ${address}
      Mint Price: ${mintPriceInEth} ETH
    `;

    const mintNFTData = abiCoder.encode(
      ["address", "uint256"],
      [address, mintPriceInWei]
    );

    const signature = await signer.signMessage(message);

    console.log("Signatur:", signature);
    return signature;
  }
}
