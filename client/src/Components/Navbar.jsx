import { ethers } from "ethers";

const Navbar = ({ connect, address }) => {
  return (
    <div className="container-fluid navbar-expand-lg navbar-dark bg-light">
      <nav className="navbar">
        <div className="container">
          <a className="navbar-brand fst-italic">
            Decentralized <span className="text-danger fw-bold">Uploads</span>
          </a>
          <form className="d-flex" role="search">
            <button
              className={connect ? "btn btn-outline-success" : "btn btn-outline-danger"}
              type="button"
              disabled={connect} // Disable button if connected
              onClick={()=>{ window.ethereum.request({ method: 'eth_requestAccounts' });
              }}
            >
              {connect && address.length > 0 ? address : "Connect"}
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
