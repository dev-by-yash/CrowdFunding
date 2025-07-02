const hre = require('hardhat');

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    const balance = await deployer.getBalance();
    console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");

    const CampaignFactory = await hre.ethers.getContractFactory("CampaignFactory");
    const campaignFactory = await CampaignFactory.deploy();
    await campaignFactory.deployed();

    console.log("Factory deployed to:", campaignFactory.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });