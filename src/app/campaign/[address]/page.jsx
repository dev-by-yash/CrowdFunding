'use client';

import styled from "styled-components";
import Image from "next/image";
import { ethers } from 'ethers';
import Campaign from '../../../../artifacts/contracts/Campaign.sol/Campaign.json';
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';

export default function Detail() {
  const [data, setData] = useState(null);
  const [donationsData, setDonationsData] = useState([]);
  const [mydonations, setMydonations] = useState([]);
  const [story, setStory] = useState('');
  const [amount, setAmount] = useState('');
  const [change, setChange] = useState(false);

  const params = useParams();
  const address = Array.isArray(params.address) ? params.address[0] : params.address;

  async function queryFilterWithPagination(contract, filter, startBlock, endBlock, chunkSize = 500) {
    const logs = [];
    for (let i = startBlock; i <= endBlock; i += chunkSize + 1) {
      const from = i;
      const to = Math.min(i + chunkSize, endBlock);
      const chunkLogs = await contract.queryFilter(filter, from, to);
      logs.push(...chunkLogs);
    }
    return logs;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!ethers.utils.isAddress(address)) {
          console.error("Invalid address");
          return;
        }

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const Web3provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = Web3provider.getSigner();
        const userAddress = await signer.getAddress();

        const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
        const contract = new ethers.Contract(address, Campaign.abi, provider);

        const title = await contract.title();
        const requiredAmount = await contract.requiredAmount();
        const image = await contract.image();
        const storyUrl = await contract.story();
        const owner = await contract.owner();
        const receivedAmount = await contract.receivedAmount();

        fetch('https://crowdfunding.infura-ipfs.io/ipfs/' + storyUrl)
          .then(res => res.text())
          .then(data => setStory(data));

        const latestBlock = await provider.getBlockNumber();
        const startBlock = latestBlock - 2000;

        const donations = await queryFilterWithPagination(contract, contract.filters.donated(), startBlock, latestBlock);
        const myDonations = await queryFilterWithPagination(contract, contract.filters.donated(userAddress), startBlock, latestBlock);

        setData({
          address,
          title,
          requiredAmount: ethers.utils.formatEther(requiredAmount),
          image,
          receivedAmount: ethers.utils.formatEther(receivedAmount),
          storyUrl,
          owner
        });

        setDonationsData(donations.map(e => ({
          donar: e.args.donar,
          amount: ethers.utils.formatEther(e.args.amount),
          timestamp: parseInt(e.args.timestamp)
        })));

        setMydonations(myDonations.map(e => ({
          donar: e.args.donar,
          amount: ethers.utils.formatEther(e.args.amount),
          timestamp: parseInt(e.args.timestamp)
        })));
      } catch (error) {
        console.error("Error fetching campaign details:", error);
      }
    };

    if (address) fetchData();
  }, [change, address]);

  const DonateFunds = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, Campaign.abi, signer);

      const transaction = await contract.donate({ value: ethers.utils.parseEther(amount) });
      await transaction.wait();

      setChange(!change);
      setAmount('');
    } catch (error) {
      console.error("Donation failed:", error);
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <DetailWrapper>
      <LeftContainer>
        <ImageSection>
          <Image
            alt="crowdfunding dapp"
            layout="fill"
            src={`https://crowdfunding.infura-ipfs.io/ipfs/${data.image}`}
          />
        </ImageSection>
        <Text>{story}</Text>
      </LeftContainer>
      <RightContainer>
        <Title>{data.title}</Title>
        <DonateSection>
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            placeholder="Enter Amount To Donate"
          />
          <Donate onClick={DonateFunds}>Donate</Donate>
        </DonateSection>
        <FundsData>
          <Funds>
            <FundText>Required Amount</FundText>
            <FundText>{data.requiredAmount} Matic</FundText>
          </Funds>
          <Funds>
            <FundText>Received Amount</FundText>
            <FundText>{data.receivedAmount} Matic</FundText>
          </Funds>
        </FundsData>
        <Donated>
          <LiveDonation>
            <DonationTitle>Recent Donations</DonationTitle>
            {donationsData.map((e) => (
              <Donation key={e.timestamp}>
                <DonationData>{e.donar.slice(0, 6)}...{e.donar.slice(-4)}</DonationData>
                <DonationData>{e.amount} Matic</DonationData>
                <DonationData>{new Date(e.timestamp * 1000).toLocaleString()}</DonationData>
              </Donation>
            ))}
          </LiveDonation>
          <MyDonation>
            <DonationTitle>My Past Donations</DonationTitle>
            {mydonations.map((e) => (
              <Donation key={e.timestamp}>
                <DonationData>{e.donar.slice(0, 6)}...{e.donar.slice(-4)}</DonationData>
                <DonationData>{e.amount} Matic</DonationData>
                <DonationData>{new Date(e.timestamp * 1000).toLocaleString()}</DonationData>
              </Donation>
            ))}
          </MyDonation>
        </Donated>
      </RightContainer>
    </DetailWrapper>
  );
}

// Styled Components
const DetailWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  width: 98%;
`;
const LeftContainer = styled.div`
  width: 45%;
`;
const RightContainer = styled.div`
  width: 50%;
`;
const ImageSection = styled.div`
  width: 100%;
  position: relative;
  height: 350px;
`;
const Text = styled.p`
  font-family: "Roboto";
  font-size: large;
  color: ${(props) => props.theme.color};
  text-align: justify;
`;
const Title = styled.h1`
  font-family: "Poppins";
  font-size: x-large;
  color: ${(props) => props.theme.color};
`;
const DonateSection = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;
const Input = styled.input`
  padding: 8px 15px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: large;
  width: 40%;
  height: 40px;
`;
const Donate = styled.button`
  width: 40%;
  padding: 15px;
  color: white;
  background-color: #00b712;
  background-image: linear-gradient(180deg, #00b712 0%, #5aff15 80%);
  border: none;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px;
  font-size: large;
`;
const FundsData = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  width: 100%;
`;
const Funds = styled.div`
  width: 45%;
  background-color: ${(props) => props.theme.bgDiv};
  padding: 8px;
  border-radius: 8px;
  text-align: center;
`;
const FundText = styled.p`
  margin: 2px;
  font-family: "Poppins";
`;
const Donated = styled.div`
  height: 280px;
  margin-top: 15px;
  background-color: ${(props) => props.theme.bgDiv};
`;
const LiveDonation = styled.div`
  height: 65%;
  overflow-y: auto;
`;
const MyDonation = styled.div`
  height: 35%;
  overflow-y: auto;
`;
const DonationTitle = styled.div`
  font-family: "Roboto";
  font-size: x-small;
  text-transform: uppercase;
  padding: 4px;
  text-align: center;
  background-color: #4cd137;
`;
const Donation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  background-color: ${(props) => props.theme.bgSubDiv};
  padding: 4px 8px;
`;
const DonationData = styled.p`
  color: ${(props) => props.theme.color};
  font-family: "Roboto";
  font-size: large;
  margin: 0;
`;