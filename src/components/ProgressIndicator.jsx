import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ProgressContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.accent};
`;

const ProgressTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-bottom: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const ProgressLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 3px;
  background: ${props => props.theme.colors.accent};
  z-index: 1;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const ProgressLineFilled = styled(motion.div)`
  height: 100%;
  background: ${props => props.theme.colors.gradient.primary};
  border-radius: 2px;
`;

const Step = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  min-width: 100px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    min-width: auto;
  }
`;

const StepCircle = styled(motion.div)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing.sm};
  border: 3px solid;
  background: ${props => {
    if (props.completed) return props.theme.colors.primaryLight;
    if (props.current) return props.theme.colors.surface;
    return props.theme.colors.surface;
  }};
  border-color: ${props => {
    if (props.completed) return props.theme.colors.primaryLight;
    if (props.current) return props.theme.colors.primary;
    return props.theme.colors.accent;
  }};
  color: ${props => {
    if (props.completed) return 'white';
    if (props.current) return props.theme.colors.primary;
    return props.theme.colors.text.light;
  }};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-bottom: 0;
    margin-right: ${props => props.theme.spacing.md};
  }
`;

const StepLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  text-align: center;
  color: ${props => {
    if (props.completed) return props.theme.colors.primary;
    if (props.current) return props.theme.colors.primary;
    return props.theme.colors.text.light;
  }};
  font-weight: ${props => {
    if (props.completed || props.current) return props.theme.typography.fontWeight.semibold;
    return props.theme.typography.fontWeight.normal;
  }};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    text-align: left;
  }
`;

const StepDescription = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
  margin-top: ${props => props.theme.spacing.xs};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    text-align: left;
    margin-top: 0;
    margin-left: ${props => props.theme.spacing.xs};
  }
`;

const steps = [
  {
    id: 1,
    label: 'スタート',
    description: 'ホーム画面',
    path: '/',
    icon: '🏠'
  },
  {
    id: 2,
    label: '撮影',
    description: '動画アップロード',
    path: '/camera',
    icon: '📹'
  },
  {
    id: 3,
    label: '分析',
    description: 'AI解析結果',
    path: '/analysis',
    icon: '🎯'
  },
  {
    id: 4,
    label: '試打',
    description: 'バーチャル体験',
    path: '/virtual-hit',
    icon: '🏌️'
  },
  {
    id: 5,
    label: 'レンタル',
    description: '申し込み完了',
    path: '/rental',
    icon: '🚚'
  }
];

const ProgressIndicator = ({ currentStep = 1, completedSteps = [] }) => {
  const progressPercentage = ((Math.max(...completedSteps, currentStep) - 1) / (steps.length - 1)) * 100;

  return (
    <ProgressContainer>
      <ProgressTitle>🎯 Swing Match フロー</ProgressTitle>
      
      <StepsContainer>
        <ProgressLine>
          <ProgressLineFilled
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </ProgressLine>
        
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          
          return (
            <Step
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StepCircle
                completed={isCompleted}
                current={isCurrent}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCompleted ? '✓' : step.icon}
              </StepCircle>
              <div>
                <StepLabel completed={isCompleted} current={isCurrent}>
                  {step.label}
                </StepLabel>
                <StepDescription>
                  {step.description}
                </StepDescription>
              </div>
            </Step>
          );
        })}
      </StepsContainer>
    </ProgressContainer>
  );
};

export default ProgressIndicator;