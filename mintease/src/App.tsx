import AppRouter from "./AppRouter";
import Header from "./components/Header";
import { BrowserRouter as Router } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <WalletProvider>
        <Header />
        <AppRouter />
        <Footer />
      </WalletProvider>
    </Router>
  );
}

export default App;
