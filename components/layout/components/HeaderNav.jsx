'use client';

import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const HeaderNav = () => {
  const pathname = usePathname();

  return (
    <HeaderNavWrapper>
      <Link href="/" passHref>
        <HeaderNavLinks active={pathname === '/'}>
          Campaigns
        </HeaderNavLinks>
      </Link>
      <Link href="/createcampaign" passHref>
        <HeaderNavLinks active={pathname === '/createcampaign'}>
          Create Campaign
        </HeaderNavLinks>
      </Link>
      <Link href="/dashboard" passHref>
        <HeaderNavLinks active={pathname === '/dashboard'}>
          Dashboard
        </HeaderNavLinks>
      </Link>
    </HeaderNavWrapper>
  );
};

const HeaderNavWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.bgDiv};
  padding: 6px;
  height: 50%;
  border-radius: 10px;
`;

const HeaderNavLinks = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) =>
    props.active ? props.theme.bgSubDiv : props.theme.bgDiv};
  height: 100%;
  font-family: 'Roboto';
  margin: 5px;
  border-radius: 10px;
  padding: 0 5px;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
  font-size: small;
  text-decoration: none;
  color: ${(props) => (props.active ? props.theme.color : props.theme.textColor)};
`;

export default HeaderNav;
