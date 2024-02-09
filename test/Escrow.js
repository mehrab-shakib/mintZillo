const { expect } = require("chai");
const { ethers } = require("hardhat");


const { extendEnvironment } = require("hardhat/config");
const { any } = require("hardhat/internal/core/params/argumentTypes");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
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
    );

    // approve property
    transaction = await re.connect(seller).approve(escrow.target, 1);
    await transaction.wait();

    // list property
    transaction = await escrow
      .connect(seller)
      .list(1, buyer.address, tokens(10), tokens(5));
    await transaction.wait();
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

  describe("Listing", () => {
    it("NFT Listed", async () => {
      const result = await escrow.isListed(1);
      expect(result).to.equal(true);
    });

    it("Updates Ownership", async () => {
      expect(await re.ownerOf(1)).to.equal(escrow.target);
    });

    it("Returns Buyer", async () => {
      const result = await escrow.buyer(1);
      expect(result).to.equal(buyer.address);
    });

    it("Returns Purchase Price", async () => {
      const result = await escrow.purchasePrice(1);
      expect(result).to.equal(tokens(10));
    });

    it("Returns Escrow amount", async () => {
      const result = await escrow.escrowAmount(1);
      expect(result).to.equal(tokens(5));
    });
  });

  describe("Deposits", () => {
    it("updates contracts balance", async () => {
      const transaction = await escrow
        .connect(buyer)
        .depositEarnest(1, { value: tokens(5) });
      await transaction.wait();
      const result = await escrow.getBalance(); 
      expect(result).to.equal(tokens(5)); 
    });
  });
  describe("Inspection", () => {
    it("updates Inspection Status", async () => {
       const transaction = await escrow.connect(inspector).inspectionStatus(1, true); 
       await transaction.wait(); 
       const result = await escrow.inspectionPassed(1); 
       expect(result).to.equal(true); 
    });
  });
  describe('Approval', ()=>{
    it('Udates Approval', async ()=>{
      let transaction = await escrow.connect(buyer).approveSale(1); 
      await transaction.wait(); 

       transaction = await escrow.connect(seller).approveSale(1);
       await transaction.wait(); 
       
       transaction = await escrow.connect(lender).approveSale(1); 
       await transaction.wait(); 

       expect( await escrow.saleApproval(1, buyer.address)).to.equal(true); 

       expect (await escrow.saleApproval(1, seller.address)).to.equal(true); 

       expect (await escrow.saleApproval(1, lender.address)).to.equal(true); 
    })
  })  
});
