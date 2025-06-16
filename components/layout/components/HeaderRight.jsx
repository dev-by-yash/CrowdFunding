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

// same styled components...

const HeaderRightWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
  height: 50%;
`
const ThemeToggle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.bgDiv};
  height: 100%;
  padding: 5px;
  width: 45px;
  border-radius: 12px;
  cursor: pointer;
`

export default HeaderRight