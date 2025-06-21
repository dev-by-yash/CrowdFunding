// 'use client';
// import styled from "styled-components";
// import { ethers } from "ethers";
// import { useState } from "react";

// // Replace this with your localhost Hardhat config
// const networks = {
//   localhost: {
//     chainId: `0x${Number(31337).toString(16)}`, // Hardhat's default chainId = 31337
//     chainName: "Hardhat Localhost",
//     nativeCurrency: {
//       name: "ETH",
//       symbol: "ETH",
//       decimals: 18,
//     },
//     rpcUrls: ["http://127.0.0.1:8545"],
//     blockExplorerUrls: [],
//   },
// };

// const Wallet = () => {
//   const [address, setAddress] = useState("");
//   const [balance, setBalance] = useState("");

//   const connectWallet = async () => {
//   if (!window.ethereum) {
//     alert("MetaMask is not installed!");
//     return;
//   }

//   try {
//     const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
//     await provider.send("eth_requestAccounts", []);

//     const network = await provider.getNetwork();

//     if (network.chainId !== 31337) {
//       try {
//         await window.ethereum.request({
//           method: "wallet_addEthereumChain",
//           params: [
//             {
//               chainId: "0x7A69", // 31337 in hex
//               chainName: "Hardhat Localhost",
//               rpcUrls: ["http://127.0.0.1:8545"],
//               nativeCurrency: {
//                 name: "ETH",
//                 symbol: "ETH",
//                 decimals: 18,
//               },
//               blockExplorerUrls: [],
//             },
//           ],
//         });

//         // 🔁 After adding, switch to the network
//         await window.ethereum.request({
//           method: "wallet_switchEthereumChain",
//           params: [{ chainId: "0x7A69" }],
//         });
//       } catch (error) {
//         console.error("Failed to add or switch to Hardhat network", error);
//         return;
//       }
//     }

//     const signer = provider.getSigner();
//     const address = await signer.getAddress();
//     const balance = await signer.getBalance();
//     setAddress(address);
//     setBalance(ethers.utils.formatEther(balance));
//   } catch (err) {
//     console.error("Wallet connection failed:", err);
//   }
// };


//   return (
//     <ConnectWalletWrapper onClick={connectWallet}>
//       {balance === '' ? <Balance /> : <Balance>{balance.slice(0, 4)} ETH</Balance>}
//       {address === '' ? <Address>Connect Wallet</Address> : <Address>{address.slice(0, 6)}...{address.slice(-4)}</Address>}
//     </ConnectWalletWrapper>
//   );
// };


// const ConnectWalletWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   background-color: ${(props) => props.theme.bgDiv};
//   padding: 5px 9px;
//   height: 100%;
//   color: ${(props) => props.theme.color};
//   border-radius: 10px;
//   margin-right: 15px;
//   font-family: 'Roboto';
//   font-weight: bold;
//   font-size: small;
//   cursor: pointer;
// `;

// const Address = styled.h2`
//     background-color: ${(props) => props.theme.bgSubDiv};
//     height: 100%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     padding: 0 5px 0 5px;
//     border-radius: 10px;
// `

// const Balance = styled.h2`
//     display: flex;
//     height: 100%;
//     align-items: center;
//     justify-content: center;
//     margin-right: 5px;
// `

// export default Wallet;


'use client';
import styled from "styled-components";
import { ethers } from "ethers";
import { useWallet } from "@/context/WalletContext";

const Wallet = () => {
  const { address, setAddress, balance, setBalance } = useWallet();

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);

      const network = await provider.getNetwork();

      if (network.chainId !== 31337) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x7A69", // 31337 in hex
                chainName: "Hardhat Localhost",
                rpcUrls: ["http://127.0.0.1:8545"],
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: [],
              },
            ],
          });

          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x7A69" }],
          });
        } catch (error) {
          console.error("Failed to add or switch to Hardhat network", error);
          return;
        }
      }

      const signer = provider.getSigner();
      const addr = await signer.getAddress();
      const bal = await signer.getBalance();
      setAddress(addr);
      setBalance(ethers.utils.formatEther(bal));
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  return (
    <ConnectWalletWrapper onClick={connectWallet}>
      {balance === '' ? <Balance /> : <Balance>{balance.slice(0, 4)} ETH</Balance>}
      {address === '' ? (
        <Address>Connect Wallet</Address>
      ) : (
        <Address>{address.slice(0, 6)}...{address.slice(-4)}</Address>
      )}
    </ConnectWalletWrapper>
  );
};

const ConnectWalletWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.bgDiv};
  padding: 5px 9px;
  height: 100%;
  color: ${(props) => props.theme.color};
  border-radius: 10px;
  margin-right: 15px;
  font-family: 'Roboto';
  font-weight: bold;
  font-size: small;
  cursor: pointer;
`;

const Address = styled.h2`
  background-color: ${(props) => props.theme.bgSubDiv};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  border-radius: 10px;
`;

const Balance = styled.h2`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
`;

export default Wallet;
