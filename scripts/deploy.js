const hre = require("hardhat");

async function main() {
    // Get the ContractFactory
    const Upload = await hre.ethers.getContractFactory("Upload");

    // Deploy the contract
    const upload = await Upload.deploy();

    await upload.deployed();

    console.log("Upload contract deployed to:", upload.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
