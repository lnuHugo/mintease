import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  getMaxCount,
  getMintPrice,
  getTokenCounter,
  mintNFT,
} from "../utils/contract";
import "../styles/components/MintCard.scss";
import { useWallet } from "../context/WalletContext";

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
  const [tokenCounter, setTokenCounter] = useState<number | null>(null);
  const [maxCount, setMaxCount] = useState<number | null>(null);
  const { signer } = useWallet();

  useEffect(() => {
    const fetchTokenCounter = async () => {
      try {
        const counter = await getTokenCounter();
        const maxCount = await getMaxCount();
        setTokenCounter(counter);
        setMaxCount(maxCount);
      } catch (error) {
        console.error("Error fetching token counter:", error);
      }
    };

    fetchTokenCounter();
  }, []);

  const handleMint = async () => {
    setIsMinting(true);

    try {
      if (!signer) {
        return;
      }

      const mintPrice = await getMintPrice();
      console.log(mintPrice);

      // const mintPriceInEth = ethers.formatEther(mintPrice);
      // console.log(mintPriceInEth);

      await mintNFT(signer, mintPrice);
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
          <div className="info">
            <div className="price">
              <img src="/eth.svg" alt="" />
              <p>{ethers.formatEther(mintPriceInWei)} ETH</p>
            </div>
            <p>
              {tokenCounter} / {maxCount}
            </p>
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
