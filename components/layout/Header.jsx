// import React from 'react'
// import styled from 'styled-components';
// import HeaderLogo from './components/HeaderLogo';
// import HeaderNav from './components/HeaderNav';
// import HeaderRight from './components/HeaderRight';
// const Header = () => {
//     return (
//         <HeaderWrapper>
//             <HeaderLogo />
//             <HeaderNav />
//             <HeaderRight />
//         </HeaderWrapper>
//     )
// }
// const HeaderWrapper = styled.div`
//   width: 100%;
//   height: 70px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// `
// export default Header
'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import HeaderLogo from './components/HeaderLogo';
import HeaderNav from './components/HeaderNav';
import HeaderRight from './components/HeaderRight';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <HeaderWrapper>
        <HeaderContent>
          <HeaderLeft>
            <HeaderLogo />
          </HeaderLeft>

          {/* Desktop Navigation */}
          <NavWrapper>
            <HeaderNav />
          </NavWrapper>

          {/* Desktop Right Side */}
          <RightWrapper>
            <HeaderRight />
          </RightWrapper>

          {/* Mobile Hamburger */}
          <MobileMenuIcon onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </MobileMenuIcon>
        </HeaderContent>
      </HeaderWrapper>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <MobileMenu>
          <HeaderNav />
          <HeaderRightMobile>
            <HeaderRight />
          </HeaderRightMobile>
        </MobileMenu>
      )}
    </>
  );
};

export default Header;
const HeaderWrapper = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  width: 100%;
  max-width: 1280px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    width: 90%; /* ✅ Make navbar 90% width on mobile */
  }
`;

const HeaderLeft = styled.div`
  flex-shrink: 0;
`;

const NavWrapper = styled.div`
  display: flex;
  @media (max-width: 768px) {
    display: none;
  }
`;

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuIcon = styled.div`
  display: none;
  font-size: 28px;
  color: ${(props) => props.theme.color};
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.bgDiv};
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 16px;
  border-top: 1px solid ${(props) => props.theme.bgSubDiv};
  z-index: 999;

  @media (max-width: 768px) {
    width: 90%;
    margin: auto;
  }
`;

const HeaderRightMobile = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;
