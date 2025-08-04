import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FABContainer = styled(motion.div)`
  position: fixed;
  bottom: ${props => props.theme.spacing.xl};
  right: ${props => props.theme.spacing.xl};
  z-index: 1000;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    bottom: ${props => props.theme.spacing.lg};
    right: ${props => props.theme.spacing.lg};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    bottom: ${props => props.theme.spacing.md};
    right: ${props => props.theme.spacing.md};
  }
`;

const FABButton = styled(motion.button)`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${props => props.theme.colors.gradient.primary};
  border: none;
  color: white;
  font-size: ${props => props.theme.typography.fontSize.xl};
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${props => props.theme.transitions.normal};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.xl};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 56px;
    height: 56px;
    font-size: ${props => props.theme.typography.fontSize.lg};
  }
`;

const FABLabel = styled(motion.div)`
  position: absolute;
  right: 72px;
  background: ${props => props.theme.colors.primaryDark};
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  white-space: nowrap;
  box-shadow: ${props => props.theme.shadows.md};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    right: 64px;
    font-size: ${props => props.theme.typography.fontSize.xs};
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  }
`;

const PulsingIndicator = styled(motion.div)`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  background: ${props => props.theme.colors.status.warning};
  border: 2px solid white;
  border-radius: 50%;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 16px;
    height: 16px;
    top: -1px;
    right: -1px;
  }
`;

const actionData = {
  '/': {
    icon: '🚀',
    label: 'スイング分析を始める',
    action: 'start',
    destination: '/camera'
  },
  '/camera': {
    icon: '🧪',
    label: 'テスト分析を実行',
    action: 'test',
    destination: null
  },
  '/analysis': {
    icon: '🏌️',
    label: 'バーチャル試打',
    action: 'navigate',
    destination: '/virtual-hit'
  },
  '/virtual-hit': {
    icon: '🛒',
    label: 'レンタル申し込み',
    action: 'navigate',
    destination: '/rental'
  },
  '/rental': {
    icon: '✅',
    label: '申し込み完了',
    action: 'complete',
    destination: '/'
  }
};

const FloatingActionButton = ({ currentPath = '/', onTestAction }) => {
  const navigate = useNavigate();
  const [showLabel, setShowLabel] = React.useState(false);
  const action = actionData[currentPath];

  if (!action) return null;

  const handleClick = () => {
    switch (action.action) {
      case 'start':
      case 'navigate':
        if (action.destination) {
          navigate(action.destination);
        }
        break;
      case 'test':
        if (onTestAction) {
          onTestAction();
        }
        break;
      case 'complete':
        // Could trigger completion actions here
        if (action.destination) {
          navigate(action.destination);
        }
        break;
      default:
        break;
    }
  };

  return (
    <FABContainer
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
    >
      <AnimatePresence>
        {showLabel && (
          <FABLabel
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {action.label}
          </FABLabel>
        )}
      </AnimatePresence>
      
      <FABButton
        onClick={handleClick}
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 8px 16px rgba(0,0,0,0.2)',
            '0 12px 24px rgba(0,0,0,0.3)',
            '0 8px 16px rgba(0,0,0,0.2)'
          ]
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }}
      >
        {action.icon}
        
        {(currentPath === '/' || currentPath === '/camera') && (
          <PulsingIndicator
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </FABButton>
    </FABContainer>
  );
};

export default FloatingActionButton;