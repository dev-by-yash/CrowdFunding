'use client';

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import CampaignFactory from '../../artifacts/contracts/Campaign.sol/CampaignFactory.json';
import CampaignsPage from '../../components/Explore';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem 1rem;
  min-height: 100vh;
`;

const FilterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 2.5rem;
`;

const FilterButton = styled.button.attrs((props) => ({
  $active: props.$active,
}))`
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  border: 1px solid ${({ $active }) => ($active ? '#047857' : '#d1d5db')};
  background-color: ${({ $active }) => ($active ? '#047857' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#1f2937')};
  font-weight: 600;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: ${({ $active }) => ($active ? '#065f46' : '#ecfdf5')};
  }
`;

const queryFilterWithPagination = async (contract, filter, startBlock, endBlock, chunkSize = 500) => {
  let logs = [];

  for (let from = startBlock; from <= endBlock; from += chunkSize) {
    const to = Math.min(from + chunkSize - 1, endBlock); // <-- Max 500 blocks
    try {
      const chunkLogs = await contract.queryFilter(filter, from, to);
      logs = logs.concat(chunkLogs);
    } catch (error) {
      console.error(`Error fetching logs from block ${from} to ${to}:`, error);
    }
  }

  return logs;
};


export default function Home() {
  const [AllData, setAllData] = useState([]);
  const [FilteredData, setFilteredData] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          'https://eth-sepolia.g.alchemy.com/v2/nfcq_-unKSrFw1hEogSES'
        );

        const contract = new ethers.Contract(
          '0x775E2929c5033efa42867B3886E8E6b07362f16F',
          CampaignFactory.abi,
          provider
        );

        const latestBlock = await provider.getBlockNumber();
        const deploymentBlock = 8663005;

        const logs = await queryFilterWithPagination(
          contract,
          contract.filters.campaignCreated(),
          deploymentBlock,
          latestBlock
        );

        const campaigns = logs.reverse().map((e) => ({
          title: e.args.title,
          image: e.args.imgURI,
          owner: e.args.owner,
          timeStamp: parseInt(e.args.timestamp),
          amount: ethers.utils.formatEther(e.args.requiredAmount),
          address: e.args.campaignAddress,
          category:
            typeof e.args.category === 'string'
              ? e.args.category.trim().toLowerCase()
              : 'uncategorized',
        }));

        setAllData(campaigns);
        setFilteredData(campaigns);
      } catch (err) {
        console.error('❌ Error fetching campaigns:', err);
      }
    };

    fetchCampaigns();
  }, []);

  const handleFilter = (category) => {
    setActiveFilter(category);
    if (category === 'All') {
      setFilteredData(AllData);
    } else {
      const filtered = AllData.filter(
        (c) => c.category === category.toLowerCase()
      );
      setFilteredData(filtered);
    }
  };

  return (
    <Container>
      <FilterWrapper>
        {['All', 'Health', 'Education', 'Animal'].map((cat) => (
          <FilterButton
            key={cat}
            onClick={() => handleFilter(cat)}
            $active={activeFilter === cat}
          >
            {cat}
          </FilterButton>
        ))}
      </FilterWrapper>
      <CampaignsPage campaigns={FilteredData} />
    </Container>
  );
}
