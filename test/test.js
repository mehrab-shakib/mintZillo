const { expect } = require("chai");
const { ethers } = require("hardhat");
const { any } = require("hardhat/internal/core/params/argumentTypes");

const tokens = (n) => {
  return ethers.utils.parseUnit(n.toString(), "ether");
};

describe("Escrow", () => {
  // declare address
  let buyer, seller, lender, inspector;
  let re, escrow;

  //add before each
  beforeEach(async () => {
    // setup accounts

    [buyer, seller, lender, inspector] = await ethers.getSigners();

    //deploying  RealEstate contract
    const RE = await ethers.getContractFactory("RealEstate");
    re = await RE.deploy();
    console.log(re.target); 
    

    // mint
    let transaction = await re
      .connect(seller)
      .mint(
        "https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS"
      );
    await transaction.wait();

    // deploy escrow
    const ES = await ethers.getContractFactory("Escrow");
    escrow = await ES.deploy(
      re.target, //nftAddress
      seller.address,
      lender.address,
      inspector.address

      // re.target, 
      // seller.target, 
      // lender.target, 
      // inspector.target
    );
    console.log (escrow.target); 
  });

  // describe deployment

  describe("Deployment", () => {
    it("Returns NFT Address", async () => {
      const result = await escrow.nftAddress();
      expect(result).to.equal(re.target);
    });

    it("Returns Seller Address", async () => {
      const result = await escrow.seller();
      expect(result).to.equal(seller.address);
    });

    it("Returns Lender Address", async () => {
      const result = await escrow.lender();
      expect(result).to.equal(lender.address);
    });

    it("Returns Inspector Address", async () => {
      const result = await escrow.inspector();
      expect(result).to.equal(inspector.address);
    });
  });
});