import React from 'react';
import styled from '@emotion/styled';
import { ishigakiTheme } from '../../styles/ishigaki-theme';

interface IshigakiButtonProps {
  variant?: 'ocean' | 'coral' | 'sunset' | 'tropical' | 'sand';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  glow?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const StyledButton = styled.button<IshigakiButtonProps>`
  position: relative;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  white-space: nowrap;
  
  /* Size variants */
  ${({ size }) => {
    switch (size) {
      case 'small':
        return `
          padding: 10px 20px;
          font-size: 14px;
        `;
      case 'large':
        return `
          padding: 18px 40px;
          font-size: 18px;
        `;
      default:
        return `
          padding: 14px 32px;
          font-size: 16px;
        `;
    }
  }}
  
  /* Width */
  ${({ fullWidth }) => fullWidth && `
    width: 100%;
  `}
  
  /* Color variants */
  ${({ variant }) => {
    switch (variant) {
      case 'coral':
        return `
          background: ${ishigakiTheme.colors.semantic.coral};
          color: white;
          box-shadow: ${ishigakiTheme.shadows.coral};
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(255, 135, 135, 0.35);
            background: #FF7A7A;
          }
        `;
      case 'sunset':
        return `
          background: ${ishigakiTheme.colors.semantic.sunset};
          color: white;
          box-shadow: 0 4px 16px rgba(255, 179, 71, 0.25);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(255, 179, 71, 0.35);
            background: #FFA733;
          }
        `;
      case 'tropical':
        return `
          background: ${ishigakiTheme.colors.semantic.tropical};
          color: white;
          box-shadow: 0 4px 16px rgba(78, 205, 196, 0.25);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(78, 205, 196, 0.35);
            background: #3FC1B8;
          }
        `;
      case 'sand':
        return `
          background: ${ishigakiTheme.colors.semantic.sand};
          color: ${ishigakiTheme.colors.text.primary};
          box-shadow: ${ishigakiTheme.shadows.sm};
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: ${ishigakiTheme.shadows.md};
            background: #FFEDD6;
          }
        `;
      default:
        return `
          background: ${ishigakiTheme.colors.brand.primary};
          color: white;
          box-shadow: ${ishigakiTheme.shadows.soft};
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(38, 208, 206, 0.25);
            background: #1FC0BE;
          }
        `;
    }
  }}
  
  /* Glow effect */
  ${({ glow, variant }) => glow && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      animation: shimmer 2s infinite;
    }
    
    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    
    box-shadow: ${variant === 'coral' 
      ? ishigakiTheme.shadows.coral
      : variant === 'sunset'
      ? '0 4px 30px rgba(255, 179, 71, 0.35)'
      : ishigakiTheme.shadows.soft
    };
  `}
  
  /* Active state */
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  /* Ripple effect */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  &:active::after {
    width: 300px;
    height: 300px;
  }
`;

const IshigakiButton: React.FC<IshigakiButtonProps> = ({
  variant = 'ocean',
  size = 'medium',
  fullWidth = false,
  glow = false,
  children,
  onClick,
  disabled = false,
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      glow={glow}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};

export default IshigakiButton;