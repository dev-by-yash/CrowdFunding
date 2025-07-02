'use client';

import styled from "styled-components";
import Image from "next/image";
import { ethers } from 'ethers';
import Campaign from '../../../artifacts/contracts/Campaign.sol/Campaign.json';
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';

export default function Detail() {
  const [data, setData] = useState(null);
  const [donationsData, setDonationsData] = useState([]);
  const [mydonations, setMydonations] = useState([]);
  const [story, setStory] = useState('');
  const [amount, setAmount] = useState('');
  const [change, setChange] = useState(false);

  const { address } = useParams();

  // 🧠 Helper to paginate event log queries (max 500 block range)
  const queryFilterWithPagination = async (contract, filter, startBlock, endBlock, chunkSize = 500) => {
    let logs = [];

    for (let from = startBlock; from <= endBlock; from += chunkSize) {
      const to = Math.min(from + chunkSize - 1, endBlock);
      try {
        const chunkLogs = await contract.queryFilter(filter, from, to);
        logs = logs.concat(chunkLogs);
      } catch (err) {
        console.error(`Error fetching logs from ${from} to ${to}:`, err);
      }
    }

    return logs;
  };

  useEffect(() => {
    const Request = async () => {
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

      fetch(`https://gateway.pinata.cloud/ipfs/${storyUrl}`)
        .then(res => res.text())
        .then(data => setStory(data));

      const latestBlock = await provider.getBlockNumber();
      const deploymentBlock = 8663005; // Update with actual deployment block if needed

      const donationFilter = contract.filters.donated();
      const userDonationFilter = contract.filters.donated(userAddress);

      const allDonations = await queryFilterWithPagination(contract, donationFilter, deploymentBlock, latestBlock);
      const userDonations = await queryFilterWithPagination(contract, userDonationFilter, deploymentBlock, latestBlock);

      setData({
        address,
        title,
        requiredAmount: ethers.utils.formatEther(requiredAmount),
        image,
        receivedAmount: ethers.utils.formatEther(receivedAmount),
        storyUrl,
        owner
      });

      setDonationsData(allDonations.map((e) => ({
        donar: e.args.donar,
        amount: ethers.utils.formatEther(e.args.amount),
        timestamp: parseInt(e.args.timestamp)
      })));

      setMydonations(userDonations.map((e) => ({
        donar: e.args.donar,
        amount: ethers.utils.formatEther(e.args.amount),
        timestamp: parseInt(e.args.timestamp)
      })));
    };

    if (address) {
      Request();
    }
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
      console.log(error);
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
            src={`https://gateway.pinata.cloud/ipfs/${data.image}`}
            objectFit="cover"
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
                <DonationData>{e.donar.slice(0, 6)}...{e.donar.slice(39)}</DonationData>
                <DonationData>{e.amount} Matic</DonationData>
                <DonationData>{new Date(e.timestamp * 1000).toLocaleString()}</DonationData>
              </Donation>
            ))}
          </LiveDonation>
          <MyDonation>
            <DonationTitle>My Past Donations</DonationTitle>
            {mydonations.map((e) => (
              <Donation key={e.timestamp}>
                <DonationData>{e.donar.slice(0, 6)}...{e.donar.slice(39)}</DonationData>
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

const DetailWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 30px 5%;
  gap: 40px;
`;

const LeftContainer = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 45%;
`;

const RightContainer = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 50%;
`;

const ImageSection = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

  img {
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const Text = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${(props) => props.theme.color};
  margin-top: 20px;
  background: ${(props) => props.theme.bgSubDiv};
  padding: 20px;
  border-radius: 12px;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
`;

const Title = styled.h1`
  font-family: "Poppins", sans-serif;
  font-size: 2rem;
  color: ${(props) => props.theme.color};
  margin-bottom: 20px;
`;

const DonateSection = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  border: 2px solid #00b71250;
  border-radius: 10px;
  outline: none;
  font-size: 1rem;
  transition: all 0.3s;

  &:focus {
    border-color: #5aff15;
    box-shadow: 0 0 8px #5aff1588;
  }
`;

const Donate = styled.button`
  padding: 12px 24px;
  background-image: linear-gradient(135deg, #00b712 0%, #5aff15 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background-image: linear-gradient(135deg, #5aff15 0%, #00b712 100%);
  }
`;

const FundsData = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const Funds = styled.div`
  flex: 1;
  min-width: 140px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 14px;
  text-align: center;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
`;

const FundText = styled.p`
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  margin: 4px 0;
`;

const Donated = styled.div`
  background: ${(props) => props.theme.bgDiv};
  padding: 20px;
  border-radius: 14px;
  margin-top: 25px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
`;

const LiveDonation = styled.div`
  max-height: 220px;
  overflow-y: auto;
  margin-bottom: 16px;
`;

const MyDonation = styled.div`
  max-height: 160px;
  overflow-y: auto;
`;

const DonationTitle = styled.div`
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  background: #4cd137;
  padding: 10px;
  border-radius: 10px;
  color: white;
  margin-bottom: 10px;
`;

const Donation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  margin-bottom: 8px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.bgSubDiv};
  transition: background 0.3s ease;

  &:hover {
    background-color: #5aff1510;
  }
`;

const DonationData = styled.p`
  font-size: 0.95rem;
  font-family: "Roboto", sans-serif;
  color: ${(props) => props.theme.color};
  margin: 0;
`;

