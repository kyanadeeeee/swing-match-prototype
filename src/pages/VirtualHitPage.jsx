import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { getClubs, getShafts, simulateVirtualHit } from '../services/mockApi';
import LoadingSpinner from '../components/LoadingSpinner';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.md};
  }
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.xxl};
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin: 0;
`;

const BackButton = styled(motion.button)`
  background: transparent;
  color: ${props => props.theme.colors.text.secondary};
  border: 2px solid ${props => props.theme.colors.text.light};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSize.md};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const SelectionPanel = styled.section`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.accent};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`;

const SelectGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SelectLabel = styled.label`
  display: block;
  font-size: ${props => props.theme.typography.fontSize.md};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.accent};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.md};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text.primary};
  transition: ${props => props.theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SimulateButton = styled(motion.button)`
  width: 100%;
  background: ${props => props.theme.colors.gradient.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.md};
  transition: ${props => props.theme.transitions.normal};
  margin-top: ${props => props.theme.spacing.lg};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }

  &:disabled {
    background: ${props => props.theme.colors.text.light};
    cursor: not-allowed;
    transform: none;
  }
`;

const SimulationPanel = styled.section`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.accent};
  min-height: 400px;
  display: flex;
  flex-direction: column;
`;

const TrajectoryContainer = styled.div`
  flex: 1;
  background: linear-gradient(180deg, #87CEEB 0%, #98FB98 100%);
  border-radius: ${props => props.theme.borderRadius.md};
  position: relative;
  min-height: 300px;
  margin-bottom: ${props => props.theme.spacing.lg};
  overflow: hidden;
`;

const Ball = styled(motion.div)`
  position: absolute;
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  border: 2px solid #333;
  z-index: 10;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`;

const ResultItem = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const ResultValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ResultLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const ComparisonSection = styled.div`
  margin-top: ${props => props.theme.spacing.xl};
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.gradient.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const ComparisonTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.primaryDark};
  margin-bottom: ${props => props.theme.spacing.md};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  text-align: center;
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: ${props => props.theme.spacing.md};
  align-items: center;
`;

const ComparisonItem = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const VsDivider = styled.div`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
`;

function VirtualHitPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisData, setAnalysisData] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [shafts, setShafts] = useState([]);
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedShaft, setSelectedShaft] = useState('');
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (location.state?.analysisData) {
      setAnalysisData(location.state.analysisData);
    } else {
      navigate('/');
      return;
    }

    const loadData = async () => {
      try {
        const [clubData, shaftData] = await Promise.all([
          getClubs(),
          getShafts()
        ]);
        setClubs(clubData);
        setShafts(shaftData);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      }
    };

    loadData();
  }, [location, navigate]);

  const handleSimulate = async () => {
    if (!selectedClub || !selectedShaft || !analysisData) return;

    setSimulating(true);
    try {
      const result = await simulateVirtualHit(
        parseInt(selectedClub),
        parseInt(selectedShaft),
        analysisData
      );
      setSimulationResult(result);
      animateBallFlight(result.trajectory);
    } catch (error) {
      console.error('シミュレーションエラー:', error);
    } finally {
      setSimulating(false);
    }
  };

  const animateBallFlight = (trajectory) => {
    if (!trajectory || trajectory.length === 0) return;

    trajectory.forEach((point, index) => {
      setTimeout(() => {
        setBallPosition({
          x: (point.x / trajectory[trajectory.length - 1].x) * 90, // パーセンテージに変換
          y: 90 - (point.y / 50) * 90 // Y軸を反転してパーセンテージに変換
        });
      }, index * 50);
    });
  };

  const handleBack = () => {
    navigate('/analysis', { state: { analysisData } });
  };

  const handleRental = () => {
    navigate('/rental', { 
      state: { 
        analysisData, 
        selectedClub: selectedClub,
        selectedShaft: selectedShaft
      } 
    });
  };

  if (!analysisData) {
    return <LoadingSpinner message="データを読み込み中..." />;
  }

  const allClubs = clubs.flatMap(manufacturer => 
    manufacturer.models.map(model => ({
      ...model,
      manufacturerName: manufacturer.name
    }))
  );

  return (
    <Container>
      <Header>
        <PageTitle>🏌️ バーチャル試打シミュレーション</PageTitle>
        <BackButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBack}
        >
          ← 分析結果に戻る
        </BackButton>
      </Header>

      <ContentGrid>
        <SelectionPanel>
          <SectionTitle>クラブとシャフトを選択</SectionTitle>
          
          <SelectGroup>
            <SelectLabel>クラブ</SelectLabel>
            <Select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
            >
              <option value="">クラブを選択してください</option>
              {allClubs.map(club => (
                <option key={club.id} value={club.id}>
                  {club.manufacturerName} {club.name} (¥{club.rentalPrice}/日)
                </option>
              ))}
            </Select>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel>シャフト</SelectLabel>
            <Select
              value={selectedShaft}
              onChange={(e) => setSelectedShaft(e.target.value)}
            >
              <option value="">シャフトを選択してください</option>
              {shafts.map(shaft => (
                <option key={shaft.id} value={shaft.id}>
                  {shaft.name} {shaft.flex}-Flex ({shaft.weight})
                </option>
              ))}
            </Select>
          </SelectGroup>

          <SimulateButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSimulate}
            disabled={!selectedClub || !selectedShaft || simulating}
          >
            {simulating ? '🔄 シミュレーション中...' : '🚀 シミュレーション開始'}
          </SimulateButton>

          {simulationResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ResultsGrid>
                <ResultItem>
                  <ResultValue>{simulationResult.distance}</ResultValue>
                  <ResultLabel>飛距離 (yd)</ResultLabel>
                </ResultItem>
                <ResultItem>
                  <ResultValue>{simulationResult.accuracy}%</ResultValue>
                  <ResultLabel>精度</ResultLabel>
                </ResultItem>
                <ResultItem>
                  <ResultValue>{simulationResult.ballSpeed}</ResultValue>
                  <ResultLabel>ボール初速 (mph)</ResultLabel>
                </ResultItem>
                <ResultItem>
                  <ResultValue>{simulationResult.launchAngle}°</ResultValue>
                  <ResultLabel>打ち出し角</ResultLabel>
                </ResultItem>
                <ResultItem>
                  <ResultValue>{simulationResult.spinRate}</ResultValue>
                  <ResultLabel>スピン量 (rpm)</ResultLabel>
                </ResultItem>
                <ResultItem>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRental}
                    style={{
                      background: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    レンタル申込
                  </motion.button>
                </ResultItem>
              </ResultsGrid>
            </motion.div>
          )}
        </SelectionPanel>

        <SimulationPanel>
          <SectionTitle>弾道シミュレーション</SectionTitle>
          
          <TrajectoryContainer>
            <AnimatePresence>
              {simulationResult && (
                <Ball
                  initial={{ x: '5%', y: '90%' }}
                  animate={{ 
                    x: `${ballPosition.x}%`, 
                    y: `${ballPosition.y}%` 
                  }}
                  transition={{ duration: 0.05, ease: "linear" }}
                />
              )}
            </AnimatePresence>
          </TrajectoryContainer>

          {simulationResult && analysisData.ballFlight && (
            <ComparisonSection>
              <ComparisonTitle>現在のクラブとの比較</ComparisonTitle>
              <ComparisonGrid>
                <ComparisonItem>
                  <ResultValue>現在のクラブ</ResultValue>
                  <ResultLabel>{analysisData.ballFlight.distance} yd</ResultLabel>
                </ComparisonItem>
                <VsDivider>VS</VsDivider>
                <ComparisonItem>
                  <ResultValue>選択したクラブ</ResultValue>
                  <ResultLabel>{simulationResult.distance} yd</ResultLabel>
                </ComparisonItem>
              </ComparisonGrid>
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <strong>
                  {simulationResult.distance - analysisData.ballFlight.distance > 0 ? '+' : ''}
                  {simulationResult.distance - analysisData.ballFlight.distance} yd の差
                </strong>
              </div>
            </ComparisonSection>
          )}
        </SimulationPanel>
      </ContentGrid>
    </Container>
  );
}

export default VirtualHitPage;