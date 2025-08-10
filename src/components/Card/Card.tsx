import React from 'react';
import styled, { css } from 'styled-components';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'gradient';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: string;
  hoverable?: boolean;
  clickable?: boolean;
  children?: React.ReactNode;
}

const variantStyles = {
  default: css`
    background: ${({ theme }) => theme.colors.background.elevated};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
  `,
  elevated: css`
    background: ${({ theme }) => theme.colors.background.elevated};
    border: 1px solid ${({ theme }) => theme.colors.border.subtle};
    box-shadow: ${({ theme }) => theme.shadows.md};
  `,
  outlined: css`
    background: transparent;
    border: 1px solid ${({ theme }) => theme.colors.border.strong};
  `,
  gradient: css`
    background: ${({ theme }) => theme.colors.gradients[2]};
    border: 1px solid ${({ theme }) => theme.colors.border.subtle};
    backdrop-filter: blur(12px);
  `,
};

const StyledCard = styled.div<CardProps>`
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ padding, theme }) => padding || theme.spacing[6]};
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  position: relative;
  overflow: hidden;
  
  ${({ variant = 'default' }) => variantStyles[variant]}
  
  ${({ hoverable, clickable }) =>
    (hoverable || clickable) &&
    css`
      &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.lg};
        border-color: ${({ theme }) => theme.colors.border.strong};
      }
    `}
  
  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;
      user-select: none;
      
      &:active {
        transform: translateY(0);
      }
    `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.colors.gradients[0]};
    opacity: 0.3;
  }
`;

export const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return <StyledCard {...props}>{children}</StyledCard>;
};

export default Card;