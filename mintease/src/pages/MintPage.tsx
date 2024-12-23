import { ethers } from "ethers";
import MintCard from "../components/MintCard";
import "../styles/pages/MintPage.scss";

const MintPage = () => {
  return (
    <section className="mint-page">
      <div className="image-container">
        <div className="text-div">
          <h3>Abstract Universe</h3>
          <p>Check out the colorful universe</p>
        </div>
        <img src="/banner2.jpg" alt="" />
      </div>
      <div className="mint-section">
        <MintCard
          collectionName="Abstract Universe"
          imageURL="https://gateway.pinata.cloud/ipfs/QmRU4pAAWQrDzvsgSvnQm14fi5odcF9vCBkpUZjJNfeh4c"
          mintPriceInWei={ethers.parseEther("0.01").toString()}
        />
      </div>

      <div className="gallery">
        <h3>Gallery</h3>
        <div className="grid">
          <img src="/abstractuniverse3.jpg" alt="" />
          <img src="/abstractuniverse4.jpg" alt="" />
          <img src="/abstractuniverse5.jpg" alt="" />
          <img src="/abstractuniverse6.jpg" alt="" />
        </div>
        <div className="button-div">
          <button className="btn-standard">Mint</button>
        </div>
      </div>
      <div className="about">
        <div className="artist">
          <div className="text">
            <h3>Hugo Barlind</h3>
            <p>
              Hugo Barlind is a visionary artist who merges traditional
              techniques with digital innovation to create works that resonate
              deeply with both heart and mind. <br />
              <br />
              With a background in classical painting and modern digital art,
              Hugo seeks to explore the boundaries between the abstract and the
              tangible. <br />
              <br />
              His art is a journey through colors, shapes, and emotions,
              inviting the viewer to interpret their own story. <br />
              <br />
              Abstract Universe is his latest collection, capturing the infinite
              beauty and complexity of the universe through vibrant hues and
              fluid forms. With each piece, Hugo aims to inspire and foster a
              profound connection between art and its audience.
            </p>
          </div>
          <div className="img-container">
            <img src="/hugobarlind.jpg" alt="" />
          </div>
        </div>

        <div className="art">
          <img src="/abstractuniverse4.jpg" alt="" />
          <div className="text">
            <h3>Abstract Universe</h3>
            <p>
              Abstract Universe is a captivating collection that explores the
              harmony of vibrant colors and fluid forms. Each piece is a
              testament to the boundless creativity of the cosmos, offering a
              unique blend of movement and emotion. <br />
              <br />
              This NFT collection transcends traditional artistic boundaries,
              delivering a one-of-a-kind experience that invites viewers to
              immerse themselves in the beauty of abstraction. <br />
              <br />
              Whether you're drawn to its vivid palette or the story it tells,
              Abstract Universe offers a mesmerizing glimpse into the artistry
              of infinite possibilities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MintPage;
