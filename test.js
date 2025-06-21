const CampaignFactory = require("./artifacts/contracts/Campaign.sol/CampaignFactory.json");
const { ethers } = require("ethers");
require("dotenv").config({ path: "./.env.local" });

const main = async() => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

    const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        CampaignFactory.abi,
        provider
    );

    const events = await contract.queryFilter(contract.filters.campaignCreated());
    console.log("Total Events Found:", events.length);

    events.forEach((e, i) => {
        console.log(`\nEvent ${i + 1}:`);
        console.log("Title:", e.args.title);
        console.log("Category:", e.args.category);
        console.log("Campaign Address:", e.args.campaignAddress);
    });
};

main().catch((err) => {
    console.error(err);
});