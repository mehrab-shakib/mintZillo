import { ethers } from "ethers";
import logo from "../assets/logo6.svg";
const Navigation = ({ account, setAccount }) => {
    const connectWalletHandler = async () => {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
          });

          setAccount(accounts[0]); 
    }

  return (
    <nav>
      <ul className="nav__links">
        <li>
          <a href="#">Buy</a>
        </li>
        <li>
          <a href="#">Rent</a>
        </li>
        <li>
          <a href="#">Sell</a>
        </li>
      </ul>

      <div className="nav__brand">
        <img src={logo} alt="Logo" />
        
      </div>
      {account ? (
                <button
                    type="button"
                    className='nav__connect'
                >
                    {account.slice(0, 6) + '...' + account.slice(38, 42)}
                </button>
            ) : (
                <button
                    type="button"
                    className='nav__connect'
                    onClick={connectWalletHandler}
                >
                    Connect
                </button>
            )}
      
    </nav>
  );
};

export default Navigation;