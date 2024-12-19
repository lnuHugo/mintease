import React from "react";
import "../styles/components/NftCard.scss";

interface Metadata {
  image: string;
  description: string;
  name: string;
}

interface NftCardProps {
  nft: {
    image: string;
    name: string;
    price: string;
    metadata: Metadata;
  };
  buttonText: string;
  onButtonClick: () => void;
}

const NftCard: React.FC<NftCardProps> = ({
  nft,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="nft-card">
      <img
        src={nft.metadata.image}
        alt={nft.metadata.name}
        className="nft-image"
      />
      <div className="content">
        <div className="text">
          <h3>{nft.metadata.name}</h3>
          <div className="price">
            <img src="/eth.svg" alt="ETH Icon" />
            <p>{nft.price}</p>
          </div>
        </div>
        <button onClick={onButtonClick}>{buttonText}</button>
      </div>
    </div>
  );
};

export default NftCard;
