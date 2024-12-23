import "../styles/components/Footer.scss";

const Footer = () => {
  return (
    <footer>
      <div className="bottom">
        <p className="large">Use MintEase Now!</p>
        <div className="buttons">
          <button className="btn-standard">Explore NFTs</button>
          <button className="btn-outline">List Artwork</button>
        </div>
      </div>
      <div className="footer-container">
        <div className="footer-logo">
          <h1>MintEase</h1>
        </div>
        <nav className="footer-nav">
          <ul>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#pricing">Pricing</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </nav>
        <div className="footer-social">
          <a href="https://twitter.com" target="_blank" aria-label="Twitter">
            <img src="/twitter.svg" alt="Twitter" className="social-icon" />
          </a>
          <a href="https://twitter.com" target="_blank" aria-label="Telegram">
            <img src="/telegram.svg" alt="Telegram" className="social-icon" />
          </a>
          <a href="https://twitter.com" target="_blank" aria-label="Discord">
            <img src="/discord.svg" alt="Discord" className="social-icon" />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 MintEase. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
