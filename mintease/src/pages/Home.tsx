import { ethers } from "ethers";
import "../styles/pages/Home.scss";
import MintCard from "../components/MintCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <section className="hero">
        <div className="text">
          <h1>
            Mint Your <span className="nft">NFT</span>
            <br /> with <span>Ease</span>
          </h1>
          <p>
            The simplest platform to mint and purchase NFTs using fiat payments.
            No crypto funds? No problem.
          </p>
        </div>
        <div className="buttons">
          <button
            className="btn-standard"
            onClick={() => navigate("/mint")}
          >
            Explore Collection
          </button>
          <button
            className="btn-outline"
            onClick={() => navigate("/profile")}
          >
            List Artwork
          </button>
        </div>
      </section>
      <section className="mint-section">
        <h2>Get Started with Abstract Universe</h2>
        <MintCard
          collectionName="Abstract Universe"
          imageURL="https://gateway.pinata.cloud/ipfs/QmRU4pAAWQrDzvsgSvnQm14fi5odcF9vCBkpUZjJNfeh4c"
          mintPriceInWei={ethers.parseEther("0.01").toString()}
        />
      </section>
    </div>
  );
};

export default Home;
