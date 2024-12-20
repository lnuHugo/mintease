import { Link, NavLink } from "react-router-dom";
import "../styles/components/Header.scss";
import { connectWallet, disconnectWallet } from "../utils/metamask";
import { useWallet } from "../context/WalletContext";

const Header = () => {
  const { walletAddress, setWalletAddress } = useWallet();

  const handleConnect = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDisconnect = () => {
    try {
      disconnectWallet();
      setWalletAddress(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="header">
      <Link to="/" className="project-name">
        MintEase
      </Link>
      <nav>
        <ul>
          <li>
            <NavLink to="/marketplace">Marketplace</NavLink>
          </li>
          <li>
            <NavLink to="/mint">Mint</NavLink>
          </li>
          <li>
            <NavLink to="/profile">Profile</NavLink>
          </li>
          <li>
            {walletAddress ? (
              <button onClick={handleDisconnect} className="logout-button">
                <img src="/log-out.svg" alt="Log Out" />
                <span className="wallet-address">
                  {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                </span>
              </button>
            ) : (
              <button onClick={handleConnect}>
                <img src="/metamask.svg" alt="MetaMask" />
                Connect
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
