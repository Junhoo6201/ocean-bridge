import React from 'react';
import { useRequireAuth } from '@/hooks/useAuth';
import styled from 'styled-components';
import { ishigakiTheme } from '@/styles/ishigaki-theme';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${ishigakiTheme.colors.background.primary};
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${ishigakiTheme.colors.border.light};
  border-top: 4px solid ${ishigakiTheme.colors.brand.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { loading } = useRequireAuth(requireAdmin);

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return <>{children}</>;
}