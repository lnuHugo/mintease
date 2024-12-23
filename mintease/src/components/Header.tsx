import { Link, NavLink } from "react-router-dom";
import "../styles/components/Header.scss";
import { connectWallet, disconnectWallet } from "../utils/metamask";
import { useWallet } from "../context/WalletContext";
import { useEffect, useState } from "react";

const Header = () => {
  const { signer, setSigner } = useWallet();
  const [address, setAddress] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      if (signer == null) {
        setAddress(null);
      } else {
        const userAddress = await signer.getAddress();
        setAddress(userAddress);
      }
    };

    fetchAddress();
  }, [signer]);

  const handleConnect = async () => {
    try {
      const signer = await connectWallet();
      setSigner(signer);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDisconnect = () => {
    try {
      disconnectWallet();
      setSigner(null);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <Link to="/" className="project-name" onClick={toggleMenu}>
        MintEase
      </Link>
      <nav>
        <button className="menu-icon" onClick={toggleMenu}>
          <img src={isMenuOpen ? "/minus.svg" : "/menu.svg"} alt="Menu" />
        </button>

        <ul className={`menu ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}>
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
            {signer ? (
              <button onClick={handleDisconnect} className="logout-button">
                <img src="/log-out.svg" alt="Log Out" />
                <span className="wallet-address">
                  {address
                    ? `${address.slice(0, 6)}...${address.slice(-4)}`
                    : "Loading..."}
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
