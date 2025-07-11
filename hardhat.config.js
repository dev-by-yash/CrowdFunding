// /** @type import('hardhat/config').HardhatUserConfig */
// require("@nomiclabs/hardhat-waffle");
// require('dotenv').config({ path: './.env.local' });
// task("accounts", "Prints the list of accounts", async(taskArgs, hre) => {
//     const accounts = await hre.ethers.getSigners();

//     for (const account of accounts) {
//         console.log(account.address);
//     }
// });
// const privatekey = process.env.NEXT_PRIVATE_KEY
// module.exports = {
//     solidity: "0.8.28",
//     defaultNetwork: "hardhat",
//     networks: {
//         hardhat: {
//             chainId: 31337, // ✅ Add this to stay consistent
//         },
//         localhost: {
//             url: "http://127.0.0.1:8545",
//             chainId: 31337, // ✅ Fix this line
//             accounts: [privatekey],
//         },
//     },
// };
require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: './.env.local' });

const privatekey = process.env.NEXT_PRIVATE_KEY;
const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL;

task("accounts", "Prints the list of accounts", async(taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
        console.log(account.address);
    }
});

module.exports = {
    solidity: "0.8.28",
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
            accounts: [privatekey],
        },
        sepolia: {
            url: sepoliaRpcUrl,
            chainId: 11155111,
            accounts: [privatekey.startsWith("0x") ? privatekey : `0x${privatekey}`],
        },
    },
};