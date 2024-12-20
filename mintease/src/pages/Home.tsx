import { ethers } from "ethers";
import "../styles/pages/Home.scss";
import MintCard from "../components/MintCard";

const Home = () => {
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
            No crypto wallet? No problem.
          </p>
        </div>
        <div className="buttons">
          <button className="btn-standard">Explore Collection</button>
          <button className="btn-outline">List Artwork</button>
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
