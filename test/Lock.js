const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Upload contract", function () {
  let upload;
  let owner, user1;
  const IMAGE_URL = "https://example.com/image1.jpg";

  beforeEach(async function () {
      // Get the signers
      [owner, user1] = await ethers.getSigners();

      // Get the contract factory and deploy the contract
      const UploadFactory = await ethers.getContractFactory("Upload");
      upload = await UploadFactory.deploy(); // Deploy the contract
      console.log("Upload deployed to:", upload.address);
  });

  it("Should set the manager as the deployer", async function () {
      expect(await upload.manager()).to.equal(owner.address); // Check if the owner is the manager
  })

 

  it("Should allow the manager to add an image URL", async function () {
    await upload.addimgurl(IMAGE_URL); // Add an image URL
    const imageUrls = await upload.togetimgonlyuser(); // Get image URLs
    expect(imageUrls[0]).to.equal(IMAGE_URL); // Verify the image URL is added correctly
  });

  it("Should not allow non-manager to get manager's images", async function () {
    await expect(upload.connect(user1).togetimgonlyuser()).to.be.revertedWith("Only the manager can access.");
  });

  it("Should allow the manager to give access to another user", async function () {
    await upload.togiveaccess(user1.address); // Manager gives access to user1
    const accessList = await upload.togetaccesspersonsaddress(); // Get access list
    expect(accessList[0]).to.equal(user1.address); // Check if user1 has access
  });

  it("Should allow the user with access to retrieve images", async function () {
    await upload.addimgurl(IMAGE_URL); // Add an image URL
    await upload.togiveaccess(user1.address); // Give access to user1
    const imageUrls = await upload.connect(user1).togetimgonlyaccess(); // User1 retrieves images
    expect(imageUrls[0]).to.equal(IMAGE_URL); // Check if the image URL is accessible to user1
  });

  it("Should allow the manager to revoke access from a user", async function () {
    await upload.togiveaccess(user1.address); // Give access to user1
    await upload.tonotgiveaccess(user1.address); // Revoke access from user1
    const accessList = await upload.togetaccesspersonsaddress(); // Get active addresses
    expect(accessList.length).to.equal(0); // User1 should not be in the list anymore
  });

  it("Should prevent users without access from retrieving images", async function () {
    const imageUrl = "https://example.com/image2.jpg";
    await upload.addimgurl(imageUrl); // Add an image URL
    await expect(upload.connect(user1).togetimgonlyaccess()).to.be.revertedWith("You don't have access to the images.");
  });
});
