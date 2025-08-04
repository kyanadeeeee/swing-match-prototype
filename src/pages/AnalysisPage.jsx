import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';
import ProgressIndicator from '../components/ProgressIndicator';
import Breadcrumb from '../components/Breadcrumb';
import FloatingActionButton from '../components/FloatingActionButton';
import usePageTitle from '../hooks/usePageTitle';
import { generateRecommendations } from '../services/mockApi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const Container = styled.div`
  max-width: 1000px;
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

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    width: 100%;
  }
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.primary ? props.theme.colors.gradient.primary : 'transparent'};
  color: ${props => props.primary ? 'white' : props.theme.colors.primary};
  border: ${props => props.primary ? 'none' : `2px solid ${props.theme.colors.primary}`};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  min-width: 140px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ResultCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.accent};
`;

const CardTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`;

const MetricValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xxl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primaryLight};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const MetricUnit = styled.span`
  font-size: ${props => props.theme.typography.fontSize.md};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: ${props => props.theme.typography.fontWeight.normal};
`;

const MetricDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  line-height: 1.6;
`;

const ChartContainer = styled.div`
  margin-top: ${props => props.theme.spacing.md};
  height: 200px;
`;

const RecommendationSection = styled.section`
  background: ${props => props.theme.colors.gradient.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const RecommendationTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  color: ${props => props.theme.colors.primaryDark};
  margin-bottom: ${props => props.theme.spacing.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  text-align: center;
`;

const RecommendationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const RecommendationCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const CardIcon = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xxl};
  margin-right: ${props => props.theme.spacing.md};
`;

const RecommendationCardTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin: 0;
`;

const CardSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  margin-top: ${props => props.theme.spacing.xs};
`;

const CardContent = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ProductInfo = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ProductName = styled.div`
  font-size: ${props => props.theme.typography.fontSize.md};
  color: ${props => props.theme.colors.primaryDark};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ProductDetails = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};

  &:before {
    content: "✓";
    color: ${props => props.theme.colors.primaryLight};
    font-weight: bold;
    margin-right: ${props => props.theme.spacing.sm};
  }
`;

const ExpectedImprovement = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
`;

const ImprovementTitle = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ImprovementValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.primaryLight};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

const SelectedBadge = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing.md};
  right: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: ${props => props.theme.borderRadius.full};
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

const ActionButtonContainer = styled.div`
  text-align: center;
  margin-top: ${props => props.theme.spacing.lg};
`;

function AnalysisPage() {
  usePageTitle('スイング分析結果');
  
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisData, setAnalysisData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  useEffect(() => {
    if (location.state?.analysisData) {
      const data = location.state.analysisData;
      setAnalysisData(data);
      
      // 複数の推奨を生成
      const recs = generateRecommendations(data);
      setRecommendations(recs);
      // デフォルトで最初の推奨を選択
      setSelectedRecommendation(recs[0]);
    } else {
      // IDから履歴データを取得する場合の処理
      navigate('/');
    }
  }, [location, navigate]);

  const handleVirtualHit = () => {
    navigate('/virtual-hit', { 
      state: { 
        analysisData,
        selectedClub: selectedRecommendation?.clubId,
        selectedShaft: selectedRecommendation?.shaftId
      } 
    });
  };

  const handleRental = () => {
    navigate('/rental', { 
      state: { 
        analysisData,
        selectedClub: selectedRecommendation?.clubId,
        selectedShaft: selectedRecommendation?.shaftId
      } 
    });
  };

  const handleRecommendationSelect = (recommendation) => {
    setSelectedRecommendation(recommendation);
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!analysisData) {
    return <div>データが見つかりません</div>;
  }

  // チャートデータの設定
  const swingPathData = {
    labels: analysisData.clubheadPath?.map((_, index) => index * 5) || [],
    datasets: [
      {
        label: 'スイング軌道',
        data: analysisData.clubheadPath?.map(point => point.y) || [],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const timingData = {
    labels: ['バックスイング', 'ダウンスイング', 'インパクト'],
    datasets: [
      {
        label: '時間 (秒)',
        data: [
          parseFloat(analysisData.timing?.backswing || 0),
          parseFloat(analysisData.timing?.downswing || 0),
          parseFloat(analysisData.timing?.impact || 0),
        ],
        backgroundColor: ['#81C784', '#4CAF50', '#2E7D32'],
      },
    ],
  };

  const radarData = {
    labels: ['ヘッドスピード', 'テンポ', '正確性', 'パワー', 'コントロール'],
    datasets: [
      {
        label: 'スイング評価',
        data: [
          (analysisData.headSpeed / 50) * 100,
          analysisData.tempo === 'ファスト' ? 90 : analysisData.tempo === 'ミディアム' ? 70 : 50,
          Math.random() * 30 + 60,
          (analysisData.headSpeed / 45) * 80,
          Math.random() * 20 + 70,
        ],
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderColor: '#4CAF50',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Container>
      <Breadcrumb currentPath="/analysis" />
      <ProgressIndicator currentStep={3} completedSteps={[1, 2]} />
      
      <Header>
        <PageTitle>🎯 スイング分析結果</PageTitle>
        <ActionButtons>
          <ActionButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBack}
          >
            ← 戻る
          </ActionButton>
          <ActionButton
            primary
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleVirtualHit}
          >
            🏌️ バーチャル試打
          </ActionButton>
        </ActionButtons>
      </Header>

      <ResultsGrid>
        <ResultCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CardTitle>ヘッドスピード</CardTitle>
          <MetricValue>
            {analysisData.headSpeed}
            <MetricUnit> m/s</MetricUnit>
          </MetricValue>
          <MetricDescription>
            平均的なアマチュアゴルファーの範囲は38-45 m/sです。
            あなたのスピードは{analysisData.headSpeed > 42 ? '平均より速い' : '平均的な'}レベルです。
          </MetricDescription>
        </ResultCard>

        <ResultCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CardTitle>スイングテンポ</CardTitle>
          <MetricValue>{analysisData.tempo}</MetricValue>
          <MetricDescription>
            スイングのリズムとタイミングを表します。
            {analysisData.tempo === 'ミディアム' ? '理想的なテンポです。' : 
             analysisData.tempo === 'ファスト' ? '少し速めのテンポです。' : 
             'ゆったりとしたテンポです。'}
          </MetricDescription>
        </ResultCard>

        <ResultCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CardTitle>スイング軌道</CardTitle>
          <MetricValue>{analysisData.swingPath}</MetricValue>
          <MetricDescription>
            クラブの軌道パターンです。スクエアな軌道が理想的で、
            ボールの飛び方向に大きく影響します。
          </MetricDescription>
          <ChartContainer>
            <Line data={swingPathData} options={chartOptions} />
          </ChartContainer>
        </ResultCard>

        <ResultCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CardTitle>タイミング分析</CardTitle>
          <MetricDescription>
            各フェーズの時間配分を分析しました。
            バランスの取れたタイミングが安定したスイングの基本です。
          </MetricDescription>
          <ChartContainer>
            <Bar data={timingData} options={chartOptions} />
          </ChartContainer>
        </ResultCard>

        <ResultCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <CardTitle>総合評価</CardTitle>
          <MetricDescription>
            5つの要素を総合的に評価しました。
            各項目を向上させることでスコアアップにつながります。
          </MetricDescription>
          <ChartContainer>
            <Radar data={radarData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { r: { beginAtZero: true, max: 100 } }
            }} />
          </ChartContainer>
        </ResultCard>

        <ResultCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <CardTitle>予想弾道</CardTitle>
          <MetricValue>
            {analysisData.ballFlight?.distance}
            <MetricUnit> ヤード</MetricUnit>
          </MetricValue>
          <MetricDescription>
            最大飛行高度: {analysisData.ballFlight?.height}m<br/>
            サイドスピン: {analysisData.ballFlight?.sidespin} rpm
          </MetricDescription>
        </ResultCard>
      </ResultsGrid>

      <RecommendationSection>
        <RecommendationTitle>🏆 あなたの目標に合わせたクラブ提案</RecommendationTitle>
        <RecommendationGrid>
          {recommendations.map((rec, index) => (
            <RecommendationCard
              key={rec.id}
              selected={selectedRecommendation?.id === rec.id}
              onClick={() => handleRecommendationSelect(rec)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {selectedRecommendation?.id === rec.id && (
                <SelectedBadge>✓</SelectedBadge>
              )}
              
              <CardHeader>
                <CardIcon>{rec.icon}</CardIcon>
                <div>
                  <RecommendationCardTitle>{rec.title}</RecommendationCardTitle>
                  <CardSubtitle>{rec.subtitle}</CardSubtitle>
                </div>
              </CardHeader>
              
              <CardContent>
                <ProductInfo>
                  <ProductName>{rec.club}</ProductName>
                  <ProductDetails>{rec.shaft}</ProductDetails>
                </ProductInfo>
                
                <BenefitsList>
                  {rec.benefits.map((benefit, idx) => (
                    <BenefitItem key={idx}>{benefit}</BenefitItem>
                  ))}
                </BenefitsList>
                
                <ExpectedImprovement>
                  <ImprovementTitle>{rec.expectedImprovement.title}</ImprovementTitle>
                  <ImprovementValue>{rec.expectedImprovement.value}</ImprovementValue>
                </ExpectedImprovement>
              </CardContent>
            </RecommendationCard>
          ))}
        </RecommendationGrid>
        
        {selectedRecommendation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ActionButtonContainer>
              <ActionButton
                primary
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRental}
                style={{ marginRight: '16px' }}
              >
                🚀 このクラブをレンタル
              </ActionButton>
              <ActionButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVirtualHit}
              >
                🏌️ バーチャル試打で確認
              </ActionButton>
            </ActionButtonContainer>
          </motion.div>
        )}
      </RecommendationSection>
      
      <FloatingActionButton currentPath="/analysis" />
    </Container>
  );
}

export default AnalysisPage;