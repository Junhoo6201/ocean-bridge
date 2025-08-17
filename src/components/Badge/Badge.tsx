import React from 'react';
import styled, { css } from 'styled-components';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children?: React.ReactNode;
}

interface StyledBadgeProps {
  $variant?: BadgeVariant;
  $size?: BadgeSize;
}

const sizeStyles = {
  small: css`
    padding: ${({ theme }) => `${theme.spacing[0]} ${theme.spacing[2]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.micro};
    height: 20px;
  `,
  medium: css`
    padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.mini};
    height: 24px;
  `,
  large: css`
    padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[4]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.small};
    height: 28px;
  `,
};

const variantStyles = {
  default: css`
    background: ${({ theme }) => theme.colors.background.elevated};
    color: ${({ theme }) => theme.colors.text.secondary};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
  `,
  primary: css`
    background: ${({ theme }) => `${theme.colors.brand.primary}20`};
    color: ${({ theme }) => theme.colors.brand.primary};
    border: 1px solid ${({ theme }) => `${theme.colors.brand.primary}40`};
  `,
  success: css`
    background: ${({ theme }) => `${theme.colors.semantic.success}20`};
    color: ${({ theme }) => theme.colors.semantic.success};
    border: 1px solid ${({ theme }) => `${theme.colors.semantic.success}40`};
  `,
  warning: css`
    background: ${({ theme }) => `${theme.colors.semantic.warning}20`};
    color: ${({ theme }) => theme.colors.semantic.warning};
    border: 1px solid ${({ theme }) => `${theme.colors.semantic.warning}40`};
  `,
  error: css`
    background: ${({ theme }) => `${theme.colors.semantic.error}20`};
    color: ${({ theme }) => theme.colors.semantic.error};
    border: 1px solid ${({ theme }) => `${theme.colors.semantic.error}40`};
  `,
  info: css`
    background: ${({ theme }) => `${theme.colors.semantic.info}20`};
    color: ${({ theme }) => theme.colors.semantic.info};
    border: 1px solid ${({ theme }) => `${theme.colors.semantic.info}40`};
  `,
};

const StyledBadge = styled.span<StyledBadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  white-space: nowrap;
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  
  ${({ $size = 'medium' }) => sizeStyles[$size]}
  ${({ $variant = 'default' }) => variantStyles[$variant]}
`;

const Dot = styled.span<{ variant: BadgeVariant }>`
  width: 6px;
  height: 6px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  background: currentColor;
`;

export const Badge: React.FC<BadgeProps> = ({
  children,
  dot = false,
  variant = 'default',
  size = 'medium',
  ...props
}) => {
  return (
    <StyledBadge $variant={variant} $size={size} {...props}>
      {dot && <Dot variant={variant} />}
      {children}
    </StyledBadge>
  );
};

export default Badge;