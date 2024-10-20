// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Upload {

    mapping(address => string[]) private imgurl; 
    mapping(address => mapping(address => bool)) private accessList; 
    mapping(address => address[]) private res;  // Mapping to store addresses with access

    // Function to add image URL
    function addimgurl(string memory url) external {
        imgurl[msg.sender].push(url);
    }

    // Function to grant access to another address
    function togiveaccess(address wantimgaccess) external { 
        if (!accessList[msg.sender][wantimgaccess]) {  
            accessList[msg.sender][wantimgaccess] = true;
            res[msg.sender].push(wantimgaccess);  // Add the address to the res list
        }
    }

    // Function to revoke access from a specific address
    function tonotgiveaccess(address wantimgaccess) external {
        if (accessList[msg.sender][wantimgaccess]) {
            accessList[msg.sender][wantimgaccess] = false;  
            
            // Remove the address from the res array
            for (uint i = 0; i < res[msg.sender].length; i++) {
                if (res[msg.sender][i] == wantimgaccess) {
                    res[msg.sender][i] = res[msg.sender][res[msg.sender].length - 1];  // Replace with last element
                    res[msg.sender].pop();  // Remove the last element
                    break;
                }
            }
        }
    }

    // Function to get the list of addresses that have access to the owner's images
    function togetaccesspersonsaddress(address owner) external view returns (address[] memory) {
        return res[owner];  // Return the list directly
    }

    // Function to get the images uploaded by a specific address (if access is granted)
    function togetimgaccess(address owner) external view returns (string[] memory) {
        // Allow access to the owner's images only if the caller has access
        require(owner == msg.sender || accessList[owner][msg.sender], "Access not granted");
        return imgurl[owner];
    }
}
