import styled from 'styled-components';

const HeaderLogo = () => {
  return (
    <Logo>
      Fund<span>Fusion</span>
    </Logo>
  );
};

const Logo = styled.h1`
  font-weight: bold;
  font-size: 36px;
  margin-left: 16px;
  font-family: 'Praise', cursive;
  letter-spacing: 2px;
  cursor: pointer;
  color: ${(props) => props.theme.color};

  span {
    color: #3ddc97; /* Accent color */
  }

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

export default HeaderLogo;
