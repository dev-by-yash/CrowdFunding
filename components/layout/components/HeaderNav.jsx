'use client';

import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const HeaderNav = () => {
  const pathname = usePathname();

  return (
    <HeaderNavWrapper>
      <NavItem href="/" $active={pathname === '/'}>Campaigns</NavItem>
      <NavItem href="/createcampaign" $active={pathname === '/createcampaign'}>Create Campaign</NavItem>
      <NavItem href="/dashboard" $active={pathname === '/dashboard'}>Dashboard</NavItem>
    </HeaderNavWrapper>
  );
};

const HeaderNavWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.bgDiv};
  padding: 8px 16px;
  border-radius: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const NavItem = styled(Link)`
  padding: 8px 14px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.$active ? props.theme.bgSubDiv : 'transparent'};
  color: ${(props) =>
    props.$active ? props.theme.color : props.theme.textColor};
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.bgSubDiv};
    color: ${(props) => props.theme.color};
    transform: scale(1.05);
  }
`;

export default HeaderNav;
