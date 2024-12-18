import "../styles/components/NftCard.scss";

const NftCard = () => {
  // Should take image, name, price & button text as props
  // When button is clicked Nft should be purchased and be removed from marketplace
  return (
    <div className="nft-card">
      <img src="/abstractuniverse1.png" alt="" />
      <div className="content">
        <div className="text">
          <h3>Artwork name</h3>
          <div>
            <img src="/eth.svg" alt="" />
            <p>1</p>
          </div>
        </div>
        <button>Buy Now</button>
      </div>
    </div>
  );
};

export default NftCard;
