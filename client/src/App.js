import { useEffect, useState } from "react";
import { ethers } from "ethers";

// importing abi
import RealEstate from "./contract_abi/RealEstate.json";
import Escrow from "./contract_abi/Escrow.json";

// importing components
import "./components/Navigation";
import "./components/Home";
import "./components/Search";

// importing config
import config from "./config.json";
import Navigation from "./components/Navigation";
import Search from "./components/Search"

function App() {
  const [account, setAccount] = useState(null);

  //connecting Metamask;
  const loadChaindata = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);

    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = ethers.getAddress(accounts[0])
      setAccount(account);
    })
  };

  useEffect(() => {
    loadChaindata();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount}/>
      <Search />
      <div className="cards__section">
        <h2>Homes For you.</h2>
        <hr/> 
        <div className="cards">
          <div className="card">
            <div className="card__image">
              <img src="" alt="Home" />
            </div>
            <div className="card__info">
              <h4>1 ETH</h4>
              <p>
                <strong>1 </strong>bds | 
                <strong> 2 </strong>ba | 
                <strong> 3 </strong>sqft | 
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
