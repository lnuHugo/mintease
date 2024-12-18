import NftCard from "../components/NftCard";
import "../styles/pages/Marketplace.scss";

const Marketplace = () => {
  // Should fetch all NFTs for sale and render each as an NftCard
  return (
    <div className="marketplace">
      <h3>Nfts for Sale</h3>
      <div className="filter-div">
        <div className="sort">
          <p>Price low to high</p>
          <img src="/nav-arrow-down.svg" alt="" />
        </div>
        <div className="icon">
          <img src="/2x2-cell.svg" alt="" />
        </div>
        <div className="icon">
          <img src="/table-rows.svg" alt="" />
        </div>
        <div className="icon">
          <img src="/table.svg" alt="" />
        </div>
      </div>
      <NftCard />
    </div>
  );
};

export default Marketplace;
