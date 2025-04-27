// contracts/scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  // 1) Grab your contract factory
  const Factory = await ethers.getContractFactory("PatientRecords");
  // 2) Deploy it
  const contract = await Factory.deploy();
  // 3) Wait until the transaction is mined
  await contract.waitForDeployment();
  // 4) Print out the address
  console.log("PatientRecords deployed to:", await contract.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
