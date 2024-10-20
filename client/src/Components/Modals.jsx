import React, { useEffect, useState } from "react";
import Card from "./Card";

const Modals = ({ contract, address }) => {
  const [access, setAccess] = useState("Gave Access");
  const [value, setValue] = useState("");
  const [acc, setAcc] = useState([]);
  const [data, setData] = useState([]);

  // Function to re-fetch accounts with access
  const fetchAccessGivenAccounts = async () => {
    if (!contract || !address) return;
    try {
      const items = await contract.togetaccesspersonsaddress(address);
      console.log("Fetched accounts", items);
      setAcc(items);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setAcc([]); // Clear accounts on error
    }
  };

  // Function to give access
  const gaveAccess = async () => {
    if (!contract || !address) return;
    try {
      await contract.togiveaccess(value);
      alert("Successfully given access to " + value);
      await fetchAccessGivenAccounts(); // Update account list
      window.location.reload();
    } catch (err) {
      console.error("Error in giving access to " + value, err);
    }
  };

  // Function to remove access
  const removeAccess = async () => {
    if (!contract || !address) return;
    try {
      await contract.tonotgiveaccess(value);
      alert("Successfully removed access for " + value);
      await fetchAccessGivenAccounts(); // Update account list
      window.location.reload();
    } catch (err) {
      console.error("Error in removing access for " + value, err);
    }
  };

  // Function to get access images
  const seeaccessimg = async () => {
    if (!contract || !address) return;
    try {
      const items = await contract.togetimgaccess(value);
      console.log("Fetched access images:", items);
      setData(items);
  
    } catch (err) {
      console.error("Error fetching access images:", err);
    }
  };

  // Fetch access-given accounts when the component mounts or contract changes
  useEffect(() => {
    fetchAccessGivenAccounts();
  }, [contract, address]);

  // Handler to manage button clicks based on 'access' state
  const handleAction = () => {
    if (access === "Gave Access") {
      gaveAccess();
    } else if (access === "Remove Access") {
      removeAccess();
    } else if (access === "See Access images") {
      seeaccessimg();
    }
  };

  return (
    <div>
      <div className="container">
        <button
          type="button"
          className="btn btn-danger m-3"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Manage Access
        </button>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add/Remove Account Access
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="input-group mb-3">
                <button
                  className="btn btn-danger dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {access}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setAccess("Gave Access")}
                    >
                      Gave Access
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setAccess("See Access images")}
                    >
                      See Access images
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setAccess("Remove Access")}
                    >
                      Remove Access
                    </button>
                  </li>
                </ul>
                <input
                  type="text"
                  className="form-control mx-2"
                  placeholder="Enter address"
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            </div>

            {access === "Gave Access" && (
              <div className="input-group mb-3">
                <label className="input-group-text ms-3">Accounts</label>
                <select
                  className="form-select me-3 ms-2"
                  id="inputGroupSelect01"
                  onChange={(e) => {
                    const selectedAccount = acc[e.target.value];
                    if (selectedAccount) {
                      navigator.clipboard.writeText(selectedAccount)
                        .then(() => {
                          alert(`Copied to clipboard: ${selectedAccount}`);
                        })
                        .catch((err) => {
                          console.error("Failed to copy text:", err);
                        });
                    }
                  }}
                >
                  <option value="">Choose...</option>
                  {acc &&
                    acc.map((val, key) => (
                      <option key={key} value={key}>
                        {val}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleAction} // Call the handler here
              >
                {access}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Display the card with the fetched data */}
     {data.length>0&& <Card data={data} />}
    </div>
  );
};

export default Modals;
