// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

async function main() {
  const [buyer, seller, lender, inspector] = await ethers.getSigners();
  //deploying  RealEstate contract
  const RE = await ethers.getContractFactory("RealEstate");
  const re = await RE.deploy();
  await re.waitForDeployment();

  console.log(`Deployed Real Estate Contract at: ${re.target}`);
  console.log(`Minting 3 properties...\n`);

  // Minting NFT
  for (let i = 0; i < 3; i++) {
    const transaction = await re
      .connect(seller)
      .mint(
        `https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/${
          i + 1
        }.json`
      );
    await transaction.wait();
  }

  // deploy escrow
  const ES = await ethers.getContractFactory("Escrow");
  const escrow = await ES.deploy(
    re.target, //nftAddress
    seller.address,
    lender.address,
    inspector.address
  );
  await escrow.waitForDeployment();

  console.log(`Deployed Escrow Contract at: ${escrow.target}`);
  console.log(`Listing 3 properties...\n`);

  // Property Approvement  from Seller

  for (let i = 0; i < 3; i++) {
    let transaction = await re.connect(seller).approve(escrow.target, i + 1);
    await transaction.wait();
  }

  // Listing properties...
  transaction = await escrow
    .connect(seller)
    .list(1, buyer.address, tokens(20), tokens(10));
  await transaction.wait();

  transaction = await escrow
    .connect(seller)
    .list(2, buyer.address, tokens(15), tokens(5));
  await transaction.wait();

  transaction = await escrow
    .connect(seller)
    .list(3, buyer.address, tokens(10), tokens(5));
  await transaction.wait();

  console.log(`Finished.`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
