// 'use client';

// import React, { useEffect, useState } from 'react';
// import { ethers } from 'ethers';
// import CampaignFactory from '../../artifacts/contracts/Campaign.sol/CampaignFactory.json';
// import Image from 'next/image';
// import Link from 'next/link';
// import styled from 'styled-components';
// import PaidIcon from '@mui/icons-material/Paid';
// import AccountBoxIcon from '@mui/icons-material/AccountBox';
// import EventIcon from '@mui/icons-material/Event';
// import CampaignsPage from '../../components/Explore';

// const Container = styled.div`
//   padding: 2rem 1rem;
//   min-height: 100vh;
// `;

// const Title = styled.h1`
//   font-size: 2.5rem;
//   font-weight: bold;
//   text-align: center;
//   color: #111827;
//   margin-bottom: 2rem;
// `;

// const FilterWrapper = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   justify-content: center;
//   gap: 1rem;
//   margin-bottom: 2.5rem;
// `;

// const FilterButton = styled.button.attrs((props) => ({
//     $active: props.$active,
// }))`
//   padding: 0.5rem 1.5rem;
//   border-radius: 9999px;
//   border: 1px solid ${({ $active }) => ($active ? '#047857' : '#d1d5db')};
//   background-color: ${({ $active }) => ($active ? '#047857' : '#ffffff')};
//   color: ${({ $active }) => ($active ? '#ffffff' : '#1f2937')};
//   font-weight: 600;
//   transition: all 0.3s ease-in-out;

//   &:hover {
//     background-color: ${({ $active }) => ($active ? '#065f46' : '#ecfdf5')};
//   }
// `;

// const CardsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
//   gap: 2rem;
//   max-width: 1200px;
//   margin: 0 auto;
// `;

// const Card = styled.div`
//   background-color: #ffffff;
//   border-radius: 1rem;
//   overflow: hidden;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
//   display: flex;
//   flex-direction: column;
//   transition: box-shadow 0.3s ease;

//   &:hover {
//     box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
//   }
// `;

// const CardImage = styled(Image)`
//   object-fit: cover !important;
//   width: 100% !important;
//   height: 180px !important;
//   border-bottom: 1px solid #e5e7eb;
// `;

// const CardContent = styled.div`
//   padding: 1rem;
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
// `;

// const CardTitle = styled.h2`
//   font-size: 1.2rem;
//   font-weight: 700;
//   color: #111827;
//   margin: 0;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
// `;

// const Info = styled.div`
//   display: flex;
//   align-items: center;
//   font-size: 0.875rem;
//   color: #4b5563;
//   gap: 0.5rem;
// `;

// const GoButton = styled.button`
//   margin-top: 1rem;
//   background-color: #10b981;
//   color: #ffffff;
//   width: 100%;
//   padding: 0.6rem 1rem;
//   border-radius: 0.5rem;
//   font-weight: 600;
//   font-size: 1rem;
//   cursor: pointer;
//   border: none;
//   transition: background-color 0.2s ease;

//   &:hover {
//     background-color: #059669;
//   }
// `;

// export default function Home() {
//     const [AllData, setAllData] = useState([]);
//     const [FilteredData, setFilteredData] = useState([]);
//     const [activeFilter, setActiveFilter] = useState('All');

//     useEffect(() => {
//         const fetchCampaigns = async () => {
//             const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
//             const contract = new ethers.Contract(
//                 process.env.NEXT_PUBLIC_ADDRESS,
//                 CampaignFactory.abi,
//                 provider
//             );

//             const all = await contract.queryFilter(contract.filters.campaignCreated());

//             const mapped = all.reverse().map((e) => {
//                 const rawCategory = e.args.category;
//                 const category =
//                     typeof rawCategory === 'string'
//                         ? rawCategory.trim().toLowerCase()
//                         : 'uncategorized'; // fallback for old hashed values

//                 return {
//                     title: e.args.title,
//                     image: e.args.imgURI,
//                     owner: e.args.owner,
//                     timeStamp: parseInt(e.args.timestamp),
//                     amount: ethers.utils.formatEther(e.args.requiredAmount),
//                     address: e.args.campaignAddress,
//                     category,
//                 };
//             });


//             setAllData(mapped);
//             setFilteredData(mapped);
//         };

//         fetchCampaigns();
//     }, []);

//     const handleFilter = (category) => {
//         setActiveFilter(category);

//         if (category === 'All') {
//             setFilteredData(AllData);
//         } else {
//             const filtered = AllData.filter(
//                 (c) => c.category === category.toLowerCase()
//             );
//             setFilteredData(filtered);
//         }
//     };

//     return (
//         <Container>
//             <CampaignsPage campaigns={FilteredData} />
//             <FilterWrapper>
//                 {['All', 'Health', 'Education', 'Animal'].map((cat) => (
//                     <FilterButton
//                         key={cat}
//                         onClick={() => handleFilter(cat)}
//                         $active={activeFilter === cat}
//                     >
//                         {cat}
//                     </FilterButton>
//                 ))}
//             </FilterWrapper>

//             <CardsGrid>
//                 {FilteredData.map((campaign, index) => (
//                     <Card key={index}>
//                         <CardImage
//                             src={`https://gateway.pinata.cloud/ipfs/${campaign.image}`}
//                             alt={campaign.title}
//                             width={400}
//                             height={180}
//                         />
//                         <CardContent>
//                             <CardTitle>{campaign.title}</CardTitle>
//                             <Info>
//                                 <AccountBoxIcon fontSize="small" />
//                                 {campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}
//                             </Info>
//                             <Info>
//                                 <PaidIcon fontSize="small" />
//                                 {campaign.amount} Matic
//                             </Info>
//                             <Info>
//                                 <EventIcon fontSize="small" />
//                                 {new Date(campaign.timeStamp * 1000).toLocaleString()}
//                             </Info>
//                             <Link href={`/${campaign.address}`}>

//                                 <GoButton>GO TO CAMPAIGN</GoButton>
//                             </Link>
//                         </CardContent>
//                     </Card>
//                 ))}
//             </CardsGrid>

//             {FilteredData.length === 0 && (
//                 <p style={{ textAlign: 'center', marginTop: '2rem', color: '#6b7280' }}>
//                     No campaigns found for <strong>{activeFilter}</strong>.
//                 </p>
//             )}
//         </Container>
//     );
// }
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

export default function Home() {
  const [AllData, setAllData] = useState([]);
  const [FilteredData, setFilteredData] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchCampaigns = async () => {
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        CampaignFactory.abi,
        provider
      );

      const all = await contract.queryFilter(contract.filters.campaignCreated());

      const mapped = all.reverse().map((e) => {
        const rawCategory = e.args.category;
        const category =
          typeof rawCategory === 'string'
            ? rawCategory.trim().toLowerCase()
            : 'uncategorized';

        return {
          title: e.args.title,
          image: e.args.imgURI,
          owner: e.args.owner,
          timeStamp: parseInt(e.args.timestamp),
          amount: ethers.utils.formatEther(e.args.requiredAmount),
          address: e.args.campaignAddress,
          category,
        };
      });

      setAllData(mapped);
      setFilteredData(mapped);
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
