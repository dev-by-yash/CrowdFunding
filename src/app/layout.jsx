'use client';
import Header from "../../components/layout/Header";
import themes from "../../components/layout/themes";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppProvider } from "@/context/ThemeContext";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
`;

const LayoutWrapper = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.bgColor};
  background-image: ${(props) => props.theme.bgImage};
  color: ${(props) => props.theme.color};
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <ThemeProviderWrapper>
            <ToastContainer />
            <LayoutWrapper>
              <GlobalStyle />
              <Header />
              {children}
            </LayoutWrapper>
          </ThemeProviderWrapper>
        </AppProvider>
      </body>
    </html>
  );
}

// Theme wrapper using the context
import { useContext } from "react";
import { AppContext } from "@/context/ThemeContext";

const ThemeProviderWrapper = ({ children }) => {
  const { theme } = useContext(AppContext);
  return <ThemeProvider theme={themes[theme]}>{children}</ThemeProvider>;
};
