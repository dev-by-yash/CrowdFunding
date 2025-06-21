'use client';
import React from 'react';
import styled from 'styled-components';

const SearchCampaigns = ({ searchTerm, setSearchTerm }) => {
  return (
    <SearchBar>
      <input
        type="text"
        placeholder="Search by campaign title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </SearchBar>
  );
};

export default SearchCampaigns;

const SearchBar = styled.div`
  margin: 1rem 0;
  width: 100%;
  input {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
  }
`;
