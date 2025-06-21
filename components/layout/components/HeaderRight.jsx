import { useContext } from 'react';
import { AppContext } from '@/context/ThemeContext';
import Wallet from './Wallet';
import styled from 'styled-components';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const HeaderRight = () => {
  const ThemeToggler = useContext(AppContext);

  return (
    <HeaderRightWrapper>
      <Wallet />
      <ThemeToggle onClick={ThemeToggler.changeTheme}>
        {ThemeToggler.theme === 'light' ? <DarkModeIcon /> : <Brightness7Icon />}
      </ThemeToggle>
    </HeaderRightWrapper>
  );
};

const HeaderRightWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 16px;
`;

const ThemeToggle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.bgDiv};
  padding: 6px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.bgSubDiv};
    transform: scale(1.1);
  }

  svg {
    color: ${(props) => props.theme.color};
  }
`;

export default HeaderRight;
