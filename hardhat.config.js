/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");
require('dotenv').config({ path: './.env.local' });
task("accounts", "Prints the list of accounts", async(taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});
const privatekey = process.env.NEXT_PRIVATE_KEY
module.exports = {
    solidity: "0.8.28",
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {},
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 1337,
            accounts: [privatekey]
        }
    }
};