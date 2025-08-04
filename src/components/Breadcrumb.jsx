import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BreadcrumbContainer = styled.nav`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.accent};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.sm};
    flex-wrap: wrap;
  }
`;

const BreadcrumbItem = styled(motion.span)`
  display: flex;
  align-items: center;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.text.secondary};
  font-weight: ${props => props.isActive ? props.theme.typography.fontWeight.semibold : props.theme.typography.fontWeight.normal};
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: ${props => props.theme.transitions.normal};
  
  &:hover {
    color: ${props => props.clickable ? props.theme.colors.primary : 'inherit'};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.typography.fontSize.xs};
  }
`;

const Separator = styled.span`
  margin: 0 ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.light};
  font-size: ${props => props.theme.typography.fontSize.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin: 0 ${props => props.theme.spacing.xs};
    font-size: ${props => props.theme.typography.fontSize.xs};
  }
`;

const breadcrumbData = {
  '/': { label: '🏠 ホーム', path: '/' },
  '/camera': { label: '📹 動画撮影', path: '/camera' },
  '/analysis': { label: '🎯 分析結果', path: '/analysis' },
  '/virtual-hit': { label: '🏌️ バーチャル試打', path: '/virtual-hit' },
  '/rental': { label: '🚚 レンタル申し込み', path: '/rental' }
};

const getPathHierarchy = (currentPath) => {
  const paths = [];
  
  // Always start with home
  paths.push('/');
  
  // Add intermediate paths based on current location
  switch (currentPath) {
    case '/camera':
      break; // Just home + camera
    case '/analysis':
      paths.push('/camera');
      break;
    case '/virtual-hit':
      paths.push('/camera');
      paths.push('/analysis');
      break;
    case '/rental':
      paths.push('/camera');
      paths.push('/analysis');
      paths.push('/virtual-hit');
      break;
    default:
      break;
  }
  
  // Add current path if it's not home
  if (currentPath !== '/') {
    paths.push(currentPath);
  }
  
  return paths;
};

const Breadcrumb = ({ currentPath = '/' }) => {
  const navigate = useNavigate();
  const hierarchy = getPathHierarchy(currentPath);

  const handleNavigation = (path) => {
    if (path !== currentPath) {
      navigate(path);
    }
  };

  return (
    <BreadcrumbContainer>
      {hierarchy.map((path, index) => (
        <React.Fragment key={path}>
          <BreadcrumbItem
            isActive={path === currentPath}
            clickable={path !== currentPath}
            onClick={() => handleNavigation(path)}
            whileHover={path !== currentPath ? { scale: 1.05 } : {}}
            whileTap={path !== currentPath ? { scale: 0.95 } : {}}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {breadcrumbData[path]?.label || path}
          </BreadcrumbItem>
          {index < hierarchy.length - 1 && (
            <Separator>›</Separator>
          )}
        </React.Fragment>
      ))}
    </BreadcrumbContainer>
  );
};

export default Breadcrumb;