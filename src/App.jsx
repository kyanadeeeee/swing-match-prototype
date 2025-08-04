import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { theme } from './styles/theme';

// ページコンポーネントのインポート
import HomePage from './pages/HomePage';
import CameraPage from './pages/CameraPage';
import AnalysisPage from './pages/AnalysisPage';
import VirtualHitPage from './pages/VirtualHitPage';
import RentalPage from './pages/RentalPage';

// グローバルスタイル
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${props => props.theme.typography.fontFamily};
    background: ${props => props.theme.colors.gradient.background};
    color: ${props => props.theme.colors.text.primary};
    line-height: 1.6;
    min-height: 100vh;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: ${props => props.theme.colors.gradient.primary};
  color: white;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.md};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.xxl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  text-align: center;
  margin: 0;
`;

const Main = styled.main`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
  width: 100%;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.md};
  }
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AppContainer>
          <Header>
            <HeaderTitle>Swing Match</HeaderTitle>
          </Header>
          <Main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/camera" element={<CameraPage />} />
              <Route path="/analysis/:id?" element={<AnalysisPage />} />
              <Route path="/virtual-hit" element={<VirtualHitPage />} />
              <Route path="/rental" element={<RentalPage />} />
            </Routes>
          </Main>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;