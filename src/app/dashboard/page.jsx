'use client';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import CampaignFactory from '../../../artifacts/contracts/Campaign.sol/CampaignFactory.json';
import PaidIcon from '@mui/icons-material/Paid';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EventIcon from '@mui/icons-material/Event';

export default function Dashboard() {
  const [campaignsData, setCampaignsData] = useState([]);

  useEffect(() => {
    const Request = async () => {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const Web3provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = Web3provider.getSigner();
      const Address = await signer.getAddress();

      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
      );

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        CampaignFactory.abi,
        provider
      );

      const getAllCampaigns = contract.filters.campaignCreated(null, null, Address);
      const AllCampaigns = await contract.queryFilter(getAllCampaigns);

      const AllData = AllCampaigns.map((e) => {
        return {
          title: e.args.title,
          image: e.args.imgURI,
          owner: e.args.owner,
          timeStamp: parseInt(e.args.timestamp),
          amount: ethers.utils.formatEther(e.args.requiredAmount),
          address: e.args.campaignAddress
        }
      });
      setCampaignsData(AllData);
    };
    Request();
  }, []);

  return (
    <Wrapper>
      <CardsGrid>
        {campaignsData.map((campaign, index) => (
          <Card key={index}>
            <CardImage
              src={`https://gateway.pinata.cloud/ipfs/${campaign.image}`}
              alt={campaign.title}
              width={400}
              height={180}
            />
            <CardContent>
              <CardTitle>{campaign.title}</CardTitle>
              <Info><AccountBoxIcon fontSize="small" />{campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}</Info>
              <Info><PaidIcon fontSize="small" />{campaign.amount} Matic</Info>
              <Info><EventIcon fontSize="small" />{new Date(campaign.timeStamp * 1000).toLocaleString()}</Info>
              <Link href={`/${campaign.address}`} passHref>
                <GoButton>GO TO CAMPAIGN</GoButton>
              </Link>
            </CardContent>
          </Card>
        ))}
      </CardsGrid>

      {campaignsData.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#6b7280' }}>
          No campaigns found.
        </p>
      )}
    </Wrapper>
  );
}
const Wrapper = styled.div`
  padding: 2rem 1rem;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
  }
`;

const CardImage = styled(Image)`
  object-fit: cover !important;
  width: 100% !important;
  height: 180px !important;
  border-bottom: 1px solid #e5e7eb;
`;

const CardContent = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CardTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #4b5563;
  gap: 0.5rem;
`;

const GoButton = styled.button`
  margin-top: 1rem;
  background-color: #10b981;
  color: #ffffff;
  width: 100%;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #059669;
  }
`;
