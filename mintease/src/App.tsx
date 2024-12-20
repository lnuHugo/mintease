import AppRouter from "./AppRouter";
import Header from "./components/Header";
import { BrowserRouter as Router } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";

function App() {
  return (
    <WalletProvider>
      <Router>
        <Header />
        <AppRouter />
      </Router>
    </WalletProvider>
  );
}

export default App;
