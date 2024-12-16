import { Link, NavLink } from "react-router-dom";
import "../styles/components/Header.scss"

const Header = () => {
  return (
    <header className="header">
        <p className="project-name">MintEase</p>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <button>Connect</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
