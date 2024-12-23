import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import Marketplace from "./pages/Marketplace";
import MintPage from "./pages/MintPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/mint" element={<MintPage />} />
    </Routes>
  );
};

export default AppRouter;
