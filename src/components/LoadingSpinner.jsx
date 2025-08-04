import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: ${props => props.theme.spacing.xl};
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid ${props => props.theme.colors.accent};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Message = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.md};
  text-align: center;
  margin: 0;
`;

const LoadingSpinner = ({ message = "読み込み中..." }) => {
  return (
    <Container>
      <Spinner />
      <Message>{message}</Message>
    </Container>
  );
};

export default LoadingSpinner;