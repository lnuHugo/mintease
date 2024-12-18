import React, { useState } from "react";
import { ethers } from "ethers";
import { getMintPrice, mintNFT } from "../utils/contract";
import { connectWallet } from "../utils/metamask";
import "../styles/components/MintCard.scss";

interface MintCardProps {
  collectionName: string;
  imageURL: string;
  mintPriceInWei: string;
}

const MintCard: React.FC<MintCardProps> = ({
  collectionName,
  imageURL,
  mintPriceInWei,
}) => {
  const [isMinting, setIsMinting] = useState(false);

  const handleMint = async () => {
    setIsMinting(true);

    try {
      const recipient = await connectWallet();
      if (recipient == null) return;

      const mintPrice = await getMintPrice();
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
    <div className="mint-card">
      <img
        src={imageURL}
        alt={`${collectionName} Preview`}
        className="preview"
      />
      <div className="content">
        <div className="text">
          <h2>{collectionName}</h2>
          <p>
            A captivating creation from the Abstract Universe collection, this
            NFT showcases the harmony of vibrant colors and fluid forms,
            offering a truly one-of-a-kind artistic experience.
          </p>
        </div>
        <div className="details">
          <div className="price">
            <img src="/eth.svg" alt="" />
            <p>{ethers.formatEther(mintPriceInWei)} ETH</p>
          </div>
          <button onClick={handleMint} disabled={isMinting}>
            {isMinting ? "Minting..." : "Mint"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MintCard;
