import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Card from './Card';
import Modals from './Modals';
import { ethers, Contract } from "ethers";
import axios from "axios";
import Upload from "../artifacts/contracts/Upload.sol/Upload.json"; // Import your contract ABI

const Form = () => {
  const [connect, setConnect] = useState(false);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
  const pinataSecretApiKey = import.meta.env.VITE_PINATA_SECERET_API_KEY;
  // console.log(pinataApiKey+"<----------------->"+pinataSecretApiKey);
  
  const [load, setLoad] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Select File To Upload");

  useEffect(() => {
    const connectMetamask = async () => {
      try {
        if (!window.ethereum) {
          console.log("MetaMask not installed; using read-only defaults");
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAddress(userAddress);

        // Contract deployment address
        const contractAddress = "0x43d233a8e9971132c2e297b9edca01dc06c5a560"; 

        // Create a new instance of the contract
        const contractInstance = new Contract(contractAddress, Upload.abi, signer);
        setContract(contractInstance);
        // console.log("Contract Instance:", contractInstance);

        setConnect(true);
      } catch (error) {
        console.error("Failed to connect to Metamask:", error);
      }
    };

    connectMetamask();

    // Event listener for account changes
    window.ethereum.on('accountsChanged', async (accounts) => {
      if (accounts.length > 0) {
        const newAddress = accounts[0];
        setAddress(newAddress);
       
      } else {
        console.log("Please connect to MetaMask.");
      }
    });

    return () => {
      // Clean up the event listener on component unmount
      window.ethereum.removeListener('accountsChanged', () => {});
    };
  }, []);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setFile(files[0]);
      setFileName(files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: pinataApiKey, 
            pinata_secret_api_key: pinataSecretApiKey, 
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        
        // Interact with smart contract to store IPFS hash
        if (contract) {
          const tx = await contract.addimgurl(ImgHash);
          await tx.wait();  // Wait for transaction to be mined
       
          alert("Successfully Image Uploaded to IPFS!");
          window.location.reload();

        }
        setFileName("Select File To Upload");
        setFile(null);
      } catch (error) {
        console.error("Error uploading to Pinata:", error);
        alert("Unable to upload image to Pinata");
      } finally {
        setLoad(false); // Stop loading in both success and error cases
      }
    } else {
      setLoad(false); // Stop loading if no file is selected
      alert("Please select a file to upload.");
    }
  };

  return (
    <div>
      <Navbar connect={connect} address={address} />
      <Modals contract={contract} address={address}/>
      {load && (
        <div className="container d-flex justify-content-center text-danger text-center my-3">
          <div className="spinner-border" role="status"></div>
        </div>
      )}

      <div className="container text-center d-flex justify-content-center border border-light">
        <div className="mb-3">
          <label htmlFor="formFileMultiple" className="form-label text-center m-3 fs-5">
            {fileName}
          </label>
          <input 
            className="form-control" 
            type="file" 
            id="formFileMultiple" 
            multiple 
            onChange={handleFileUpload} 
          />
          <button type="button" className="btn btn-danger m-3" onClick={handleSubmit} disabled={load}>
            Send
          </button>
        </div>
      </div>
      <br />
      <Card contract={contract} address={address}/>
    </div>
  );
};

export default Form;
