import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAnalysisHistory } from '../services/mockApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressIndicator from '../components/ProgressIndicator';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const WelcomeSection = styled.section`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.xxxl};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

const Subtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xl};
  line-height: 1.8;
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.theme.colors.gradient.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.md};
  transition: ${props => props.theme.transitions.normal};
  min-width: 280px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    min-width: 100%;
    padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  }
`;

const HistorySection = styled.section`
  margin-top: ${props => props.theme.spacing.xxl};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`;

const HistoryList = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.md};
`;

const HistoryItem = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.accent};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-1px);
  }
`;

const HistoryDate = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.light};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const HistoryDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.sm};
`;

const HistoryDetail = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  
  strong {
    color: ${props => props.theme.colors.primary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.text.light};
  font-style: italic;
  padding: ${props => props.theme.spacing.xl};
`;

function HomePage() {
  const navigate = useNavigate();
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getAnalysisHistory();
        setAnalysisHistory(history);
      } catch (error) {
        console.error('履歴の取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const handleStartAnalysis = () => {
    navigate('/camera');
  };

  const handleHistoryItemClick = (item) => {
    navigate(`/analysis/${item.id}`, { state: { analysisData: item } });
  };

  if (loading) {
    return <LoadingSpinner message="履歴を読み込み中..." />;
  }

  return (
    <Container>
      <ProgressIndicator currentStep={1} completedSteps={[]} />
      
      <WelcomeSection>
        <Title>あなたのスイングを分析しましょう</Title>
        <Subtitle>
          AI技術でスイングを詳細分析し、最適なクラブとシャフトの組み合わせを提案します。
          <br />
          まずはスイング動画を撮影してください。
        </Subtitle>
        <ActionButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartAnalysis}
        >
          📹 スイングを分析する
        </ActionButton>
      </WelcomeSection>

      <HistorySection>
        <SectionTitle>過去の分析結果</SectionTitle>
        {analysisHistory.length > 0 ? (
          <HistoryList>
            {analysisHistory.map((item, index) => (
              <HistoryItem
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleHistoryItemClick(item)}
              >
                <HistoryDate>{item.date}</HistoryDate>
                <HistoryDetails>
                  <HistoryDetail>
                    <strong>ヘッドスピード:</strong> {item.headSpeed} m/s
                  </HistoryDetail>
                  <HistoryDetail>
                    <strong>テンポ:</strong> {item.tempo}
                  </HistoryDetail>
                  <HistoryDetail>
                    <strong>スイング軌道:</strong> {item.swingPath}
                  </HistoryDetail>
                  <HistoryDetail>
                    <strong>推奨クラブ:</strong> {item.recommendedClub}
                  </HistoryDetail>
                </HistoryDetails>
              </HistoryItem>
            ))}
          </HistoryList>
        ) : (
          <EmptyState>
            まだ分析結果がありません。最初のスイング分析を始めましょう！
          </EmptyState>
        )}
      </HistorySection>
    </Container>
  );
}

export default HomePage;