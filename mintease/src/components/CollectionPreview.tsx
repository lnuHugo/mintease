import React, { useState } from "react";
import { ethers } from "ethers";
import { getMintPrice, mintNFT } from "../utils/contract";
import { connectWallet } from "../utils/metamask";

interface CollectionPreviewProps {
  collectionName: string;
  imageURL: string;
  mintPriceInWei: string;
}

const CollectionPreview: React.FC<CollectionPreviewProps> = ({
  collectionName,
  imageURL,
  mintPriceInWei,
}) => {
  const [isMinting, setIsMinting] = useState(false);

  const handleMint = async () => {
    setIsMinting(true);

    try {
      const recipient = await connectWallet()
      if (recipient == null) return

      const mintPrice = await getMintPrice()
      await mintNFT(recipient, mintPrice);
      alert("NFT successfully minted!");
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Minting failed. See console for details.");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="collection-preview">
      <h2>{collectionName}</h2>
      <img src={imageURL} alt={`${collectionName} Preview`} />
      <p>Mint Price: {ethers.formatEther(mintPriceInWei)} ETH</p>
      <button onClick={handleMint} disabled={isMinting}>
        {isMinting ? "Minting..." : "MINT"}
      </button>
    </div>
  );
};

export default CollectionPreview;
