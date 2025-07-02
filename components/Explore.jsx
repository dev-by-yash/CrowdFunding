
// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import Image from 'next/image';
// import Link from 'next/link';
// import PaidIcon from '@mui/icons-material/Paid';
// import AccountBoxIcon from '@mui/icons-material/AccountBox';
// import EventIcon from '@mui/icons-material/Event';

// const SearchWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   margin-bottom: 2rem;
// `;

// const SearchInput = styled.input`
//   width: 100%;
//   max-width: 500px;
//   padding: 0.7rem 1rem;
//   border: 1px solid #d1d5db;
//   border-radius: 0.5rem;
//   font-size: 1rem;
//   outline: none;

//   &:focus {
//     border-color: #10b981;
//     box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
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
// const CardImage = styled.div`
//   position: relative;
//   width: 100%;
//   height: 180px;
//   overflow: hidden;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: #f9fafb;
// `;

// const StyledImage = styled(Image)`
//   object-fit: contain !important;
//   width: auto !important;
//   height: 100% !important;
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

// export default function CampaignsPage({ campaigns }) {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredCampaigns, setFilteredCampaigns] = useState(campaigns);

//   useEffect(() => {
//     const filtered = campaigns.filter((c) =>
//       c.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredCampaigns(filtered);
//   }, [searchTerm, campaigns]);

//   return (
//     <>
//       <SearchWrapper>
//         <SearchInput
//           type="text"
//           placeholder="Search by campaign title..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </SearchWrapper>

//       <CardsGrid>
//         {filteredCampaigns.map((campaign, index) => (
//           <Card key={index}>
//             <CardImage>
//               <StyledImage
//                 src={`https://gateway.pinata.cloud/ipfs/${campaign.image}`}
//                 alt={campaign.title}
//                 width={280}
//                 height={180}
//                 quality={80}
//               />

//             </CardImage>


//             <CardContent>
//               <CardTitle>{campaign.title}</CardTitle>
//               <Info>
//                 <AccountBoxIcon fontSize="small" />
//                 {campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}
//               </Info>
//               <Info>
//                 <PaidIcon fontSize="small" />
//                 {campaign.amount} Matic
//               </Info>
//               <Info>
//                 <EventIcon fontSize="small" />
//                 {new Date(campaign.timeStamp * 1000).toLocaleString()}
//               </Info>
//               <Link href={`/${campaign.address}`}>
//                 <GoButton>GO TO CAMPAIGN</GoButton>
//               </Link>
//             </CardContent>
//           </Card>
//         ))}
//       </CardsGrid>

//       {filteredCampaigns.length === 0 && (
//         <p style={{ textAlign: 'center', marginTop: '2rem', color: '#6b7280' }}>
//           No campaigns match your search.
//         </p>
//       )}
//     </>
//   );
// }
// components/CampaignsPage.jsx
'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import PaidIcon from '@mui/icons-material/Paid';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EventIcon from '@mui/icons-material/Event';

const SearchWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 500px;
  padding: 0.7rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  }
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

const CardImage = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
`;

const StyledImage = styled(Image)`
  object-fit: contain !important;
  width: auto !important;
  height: 100% !important;
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

export default function CampaignsPage({ campaigns }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCampaigns, setFilteredCampaigns] = useState(campaigns);

  useEffect(() => {
    const filtered = campaigns.filter((c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCampaigns(filtered);
  }, [searchTerm, campaigns]);

  return (
    <>
      <SearchWrapper>
        <SearchInput
          type="text"
          placeholder="Search by campaign title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchWrapper>

      <CardsGrid>
        {filteredCampaigns.map((campaign, index) => (
          <Card key={index}>
            <CardImage>
              <StyledImage
                src={`https://gateway.pinata.cloud/ipfs/${campaign.image}`}
                alt={campaign.title}
                width={280}
                height={180}
                quality={80}
              />
            </CardImage>

            <CardContent>
              <CardTitle>{campaign.title}</CardTitle>
              <Info>
                <AccountBoxIcon fontSize="small" />
                {campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}
              </Info>
              <Info>
                <PaidIcon fontSize="small" />
                {campaign.amount} ETH
              </Info>
              <Info>
                <EventIcon fontSize="small" />
                {new Date(campaign.timeStamp * 1000).toLocaleString()}
              </Info>
              <Link href={`/${campaign.address}`}>
                <GoButton>GO TO CAMPAIGN</GoButton>
              </Link>
            </CardContent>
          </Card>
        ))}
      </CardsGrid>

      {filteredCampaigns.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#6b7280' }}>
          No campaigns match your search.
        </p>
      )}
    </>
  );
}
