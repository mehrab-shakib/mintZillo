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
  const [provider, setProvider]= useState(null); 
  const [escrow, setEscrow]= useState(null); 
  const [homes, setHomes]= useState([]);

  //connecting Metamask;
  const loadChaindata = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork(); 

    console.log(config[network.chainId].re.address, config[network.chainId].escrow.address)

    const re = new ethers.Contract(config[network.chainId].re.address, RealEstate.abi, provider);

    const totalSupply = await  re.totalSupply();
    console.log(totalSupply.toString());
    // let homes =[]; 

    // for (var i=1; i<=totalSupply; i++){
    //   const uri = await re.tokenURI(i); 
    //   const response = await fetch(uri); 
    //   const metadata = await response.json(); 
    //   homes.push(metadata); 
    // }
   
    // setHomes(homes); 
    // console.log(homes); 
    

    // const escrow= new ethers.Contract(config[network.chainId].escrow.address, Escrow.abi, provider);
   

    // setEscrow(escrow); 
    // console.log(escrow)


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
          {
            homes.map((home, index)=>(
              <div className="card" key={index}>
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
              <p>Zindabazar, Sylhet </p>
            </div>
          </div>
            ))}
          

        </div>
      </div>
    </div>
  );
}

export default App;

// before going to deploy 3:33:47

// main timestamp 3:39:27