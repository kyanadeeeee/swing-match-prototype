import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { analyzeSwing } from '../services/mockApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressIndicator from '../components/ProgressIndicator';
import usePageTitle from '../hooks/usePageTitle';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.xxl};
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`;

const InstructionSection = styled.section`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.accent};
`;

const InstructionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`;

const InstructionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InstructionItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.md};
  
  &:before {
    content: "✓";
    color: ${props => props.theme.colors.primaryLight};
    font-weight: bold;
    margin-right: ${props => props.theme.spacing.sm};
    margin-top: 2px;
  }
`;

const CameraSection = styled.section`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const VideoContainer = styled.div`
  position: relative;
  background: ${props => props.theme.colors.primaryDark};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.lg};
  aspect-ratio: 16/9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderVideo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, ${props => props.theme.colors.primaryDark}, ${props => props.theme.colors.primary});
  color: white;
  font-size: ${props => props.theme.typography.fontSize.lg};
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  background: ${props => props.theme.colors.gradient.secondary};
  color: ${props => props.theme.colors.primaryDark};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.sm};
  transition: ${props => props.theme.transitions.normal};
  margin: ${props => props.theme.spacing.sm};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.theme.colors.gradient.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.md};
  transition: ${props => props.theme.transitions.normal};
  margin: ${props => props.theme.spacing.sm};
  min-width: 160px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.lg};
  }

  &:disabled {
    background: ${props => props.theme.colors.text.light};
    cursor: not-allowed;
    transform: none;
  }
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
  margin-bottom: ${props => props.theme.spacing.xl};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

function CameraPage() {
  usePageTitle('スイング動画撮影');
  
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedVideo(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedVideo) return;

    setAnalyzing(true);
    try {
      // モックAPIでスイング分析を実行
      const analysisResult = await analyzeSwing(selectedVideo);
      
      // 分析結果ページに遷移
      navigate('/analysis', { 
        state: { 
          analysisData: analysisResult,
          isNewAnalysis: true 
        } 
      });
    } catch (error) {
      console.error('分析エラー:', error);
      alert('分析中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTestAnalyze = async () => {
    setAnalyzing(true);
    try {
      // テスト用のダミー動画データで分析を実行
      const dummyVideoData = {
        name: 'test-swing-video.mp4',
        size: 1024 * 1024 * 5, // 5MB
        type: 'video/mp4'
      };
      
      const analysisResult = await analyzeSwing(dummyVideoData);
      
      // 分析結果ページに遷移
      navigate('/analysis', { 
        state: { 
          analysisData: analysisResult,
          isNewAnalysis: true 
        } 
      });
    } catch (error) {
      console.error('テスト分析エラー:', error);
      alert('テスト分析中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (analyzing) {
    return <LoadingSpinner message="AIがスイングを分析中です..." />;
  }

  return (
    <Container>
      <ProgressIndicator currentStep={2} completedSteps={[1]} />
      
      <BackButton
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBack}
      >
        ← トップページに戻る
      </BackButton>

      <Title>スイング動画の撮影・アップロード</Title>

      <InstructionSection>
        <InstructionTitle>📋 撮影のポイント</InstructionTitle>
        <InstructionList>
          <InstructionItem>横向き（側面）からの撮影を推奨します</InstructionItem>
          <InstructionItem>スイング全体（アドレスからフィニッシュ）が映るようにしてください</InstructionItem>
          <InstructionItem>スマートフォンを横向きに固定して撮影してください</InstructionItem>
          <InstructionItem>明るい場所で撮影し、背景はシンプルにしてください</InstructionItem>
          <InstructionItem>動画は10秒以内で十分です</InstructionItem>
        </InstructionList>
      </InstructionSection>

      <CameraSection>
        <VideoContainer>
          {videoPreview ? (
            <VideoElement src={videoPreview} controls />
          ) : (
            <PlaceholderVideo>
              📹 スイング動画をアップロードしてください
            </PlaceholderVideo>
          )}
        </VideoContainer>

        <div>
          <FileInput
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            id="video-upload"
          />
          <FileInputLabel htmlFor="video-upload">
            📁 動画ファイルを選択
          </FileInputLabel>
          
          <ActionButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            disabled={!selectedVideo}
          >
            🔍 分析を開始
          </ActionButton>
          
          <ActionButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTestAnalyze}
            style={{
              background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
              marginTop: '16px'
            }}
          >
            🧪 テスト用サンプルで分析
          </ActionButton>
        </div>
      </CameraSection>
    </Container>
  );
}

export default CameraPage;