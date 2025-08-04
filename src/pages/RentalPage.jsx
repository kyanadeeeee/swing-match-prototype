import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getClubs, getShafts } from '../services/mockApi';
import LoadingSpinner from '../components/LoadingSpinner';

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

const OrderSummary = styled.section`
  background: ${props => props.theme.colors.gradient.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const SummaryTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  color: ${props => props.theme.colors.primaryDark};
  margin-bottom: ${props => props.theme.spacing.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

const ProductDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ProductItem = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  text-align: left;
`;

const ProductLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const ProductValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`;

const PriceBreakdown = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const PriceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: ${props => props.total ? '2px solid ' + props.theme.colors.primary : '1px solid ' + props.theme.colors.accent};
  font-weight: ${props => props.total ? props.theme.typography.fontWeight.bold : props.theme.typography.fontWeight.normal};
  font-size: ${props => props.total ? props.theme.typography.fontSize.lg : props.theme.typography.fontSize.md};
  color: ${props => props.total ? props.theme.colors.primary : props.theme.colors.text.secondary};
`;

const FormSection = styled.section`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.accent};
`;

const FormTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  font-size: ${props => props.theme.typography.fontSize.md};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const FormInput = styled.input`
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

const FormSelect = styled.select`
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

const SubmitButton = styled(motion.button)`
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

const SuccessMessage = styled(motion.div)`
  background: ${props => props.theme.colors.gradient.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  color: ${props => props.theme.colors.primaryDark};
`;

const SuccessTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  margin-bottom: ${props => props.theme.spacing.md};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

const SuccessText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  line-height: 1.6;
`;

function RentalPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisData, setAnalysisData] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [shafts, setShafts] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedShaft, setSelectedShaft] = useState(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    rentalDays: '3',
    deliveryDate: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        if (location.state?.analysisData) {
          setAnalysisData(location.state.analysisData);
        } else {
          navigate('/');
          return;
        }

        const [clubData, shaftData] = await Promise.all([
          getClubs(),
          getShafts()
        ]);
        
        setClubs(clubData);
        setShafts(shaftData);

        // 選択されたクラブとシャフトを取得
        const selectedClubId = location.state?.selectedClub;
        const selectedShaftId = location.state?.selectedShaft;

        if (selectedClubId) {
          const club = clubData.flatMap(m => m.models).find(c => c.id === parseInt(selectedClubId));
          setSelectedClub(club);
        }

        if (selectedShaftId) {
          const shaft = shaftData.find(s => s.id === parseInt(selectedShaftId));
          setSelectedShaft(shaft);
        }

        // デフォルトの配送日（3日後）を設定
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 3);
        setFormData(prev => ({
          ...prev,
          deliveryDate: defaultDate.toISOString().split('T')[0]
        }));

      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [location, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // バリデーション
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert('必須項目をすべて入力してください。');
      return;
    }

    // 注文送信のシミュレーション
    setTimeout(() => {
      setOrderSubmitted(true);
    }, 1000);
  };

  const handleBack = () => {
    if (location.state?.selectedClub) {
      navigate('/virtual-hit', { state: { analysisData } });
    } else {
      navigate('/analysis', { state: { analysisData } });
    }
  };

  const handleNewAnalysis = () => {
    navigate('/');
  };

  if (loading) {
    return <LoadingSpinner message="レンタル情報を準備中..." />;
  }

  if (orderSubmitted) {
    return (
      <Container>
        <SuccessMessage
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SuccessTitle>🎉 レンタル申し込み完了！</SuccessTitle>
          <SuccessText>
            お申し込みありがとうございます。<br/>
            {formData.deliveryDate}に配送予定です。<br/>
            レンタル商品と一緒に返送用の伝票もお送りしますので、<br/>
            レンタル期間終了後はそちらをご利用ください。
          </SuccessText>
          <SubmitButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewAnalysis}
          >
            新しいスイング分析を始める
          </SubmitButton>
        </SuccessMessage>
      </Container>
    );
  }

  const calculatePrice = () => {
    const basePrice = selectedClub ? selectedClub.rentalPrice : 0;
    const days = parseInt(formData.rentalDays);
    const subtotal = basePrice * days;
    const shipping = 500;
    const tax = Math.floor(subtotal * 0.1);
    const total = subtotal + shipping + tax;

    return { basePrice, days, subtotal, shipping, tax, total };
  };

  const pricing = calculatePrice();

  return (
    <Container>
      <Header>
        <PageTitle>🚚 クラブレンタル申し込み</PageTitle>
        <BackButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBack}
        >
          ← 戻る
        </BackButton>
      </Header>

      <OrderSummary>
        <SummaryTitle>📋 ご注文内容</SummaryTitle>
        <ProductDetails>
          <ProductItem>
            <ProductLabel>推奨クラブ</ProductLabel>
            <ProductValue>
              {analysisData?.recommendedClub || 'クラブが選択されていません'}
            </ProductValue>
          </ProductItem>
          <ProductItem>
            <ProductLabel>推奨シャフト</ProductLabel>
            <ProductValue>
              {analysisData?.recommendedShaft || 'シャフトが選択されていません'}
            </ProductValue>
          </ProductItem>
          {selectedClub && (
            <ProductItem>
              <ProductLabel>選択したクラブ</ProductLabel>
              <ProductValue>{selectedClub.name}</ProductValue>
            </ProductItem>
          )}
          {selectedShaft && (
            <ProductItem>
              <ProductLabel>選択したシャフト</ProductLabel>
              <ProductValue>{selectedShaft.name} {selectedShaft.flex}-Flex</ProductValue>
            </ProductItem>
          )}
        </ProductDetails>

        <PriceBreakdown>
          <div>
            <PriceItem>
              <span>基本レンタル料（1日）</span>
              <span>¥{pricing.basePrice.toLocaleString()}</span>
            </PriceItem>
            <PriceItem>
              <span>レンタル期間（{pricing.days}日間）</span>
              <span>¥{pricing.subtotal.toLocaleString()}</span>
            </PriceItem>
            <PriceItem>
              <span>配送料</span>
              <span>¥{pricing.shipping.toLocaleString()}</span>
            </PriceItem>
            <PriceItem>
              <span>消費税</span>
              <span>¥{pricing.tax.toLocaleString()}</span>
            </PriceItem>
            <PriceItem total>
              <span>合計金額</span>
              <span>¥{pricing.total.toLocaleString()}</span>
            </PriceItem>
          </div>
        </PriceBreakdown>
      </OrderSummary>

      <FormSection>
        <FormTitle>📝 配送・お客様情報</FormTitle>
        <form onSubmit={handleSubmit}>
          <FormGrid>
            <FormGroup>
              <FormLabel>お名前 *</FormLabel>
              <FormInput
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="山田太郎"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>メールアドレス *</FormLabel>
              <FormInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>電話番号 *</FormLabel>
              <FormInput
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="090-1234-5678"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>レンタル期間</FormLabel>
              <FormSelect
                name="rentalDays"
                value={formData.rentalDays}
                onChange={handleInputChange}
              >
                <option value="1">1日間</option>
                <option value="3">3日間</option>
                <option value="7">7日間</option>
                <option value="14">14日間</option>
              </FormSelect>
            </FormGroup>
            
            <FormGroup>
              <FormLabel>配送希望日</FormLabel>
              <FormInput
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </FormGroup>
          </FormGrid>
          
          <FormGroup>
            <FormLabel>配送先住所 *</FormLabel>
            <FormInput
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="〒123-4567 東京都渋谷区..."
              required
            />
          </FormGroup>

          <SubmitButton
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            💳 レンタルを申し込む（¥{pricing.total.toLocaleString()}）
          </SubmitButton>
        </form>
      </FormSection>
    </Container>
  );
}

export default RentalPage;