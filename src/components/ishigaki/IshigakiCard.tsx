import React from 'react';
import styled from '@emotion/styled';
import { ishigakiTheme } from '../../styles/ishigaki-theme';

interface IshigakiCardProps {
  variant?: 'default' | 'coral' | 'premium' | 'eco' | 'gradient';
  image?: string;
  title?: string;
  description?: string;
  price?: string;
  badge?: string;
  popular?: boolean;
  onClick?: () => void;
  hoverable?: boolean;
  clickable?: boolean;
  children?: React.ReactNode;
}

const CardContainer = styled.div<{ variant: string; popular?: boolean }>`
  position: relative;
  background: ${ishigakiTheme.colors.background.elevated};
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.06);
  
  /* Variant styles */
  ${({ variant }) => {
    switch (variant) {
      case 'coral':
        return `
          border: 2px solid ${ishigakiTheme.colors.semantic.coral};
          box-shadow: ${ishigakiTheme.shadows.coral};
        `;
      case 'premium':
        return `
          background: ${ishigakiTheme.colors.background.elevated};
          border: 2px solid ${ishigakiTheme.colors.semantic.sunset};
          box-shadow: 0 4px 16px rgba(255, 179, 71, 0.15);
        `;
      case 'eco':
        return `
          border: 2px solid ${ishigakiTheme.colors.semantic.tropical};
          background: ${ishigakiTheme.colors.background.elevated};
          box-shadow: 0 4px 16px rgba(78, 205, 196, 0.15);
        `;
      case 'gradient':
        return `
          background: linear-gradient(135deg, ${ishigakiTheme.colors.background.tertiary} 0%, ${ishigakiTheme.colors.background.secondary} 100%);
          box-shadow: ${ishigakiTheme.shadows.md};
        `;
      default:
        return `
          box-shadow: ${ishigakiTheme.shadows.md};
        `;
    }
  }}
  
  /* Popular card glow */
  ${({ popular }) => popular && `
    border: 2px solid ${ishigakiTheme.colors.brand.primary};
    box-shadow: 0 4px 20px rgba(38, 208, 206, 0.2);
  `}
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: ${ishigakiTheme.shadows.lg};
    
    img {
      transform: scale(1.1);
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: ${ishigakiTheme.colors.brand.accent};
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

const Badge = styled.div<{ variant: string }>`
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
  z-index: 1;
  
  ${({ variant }) => {
    switch (variant) {
      case 'coral':
        return `
          background: ${ishigakiTheme.colors.semantic.coral};
          color: white;
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
        `;
      case 'premium':
        return `
          background: ${ishigakiTheme.colors.semantic.sunset};
          color: white;
          box-shadow: 0 4px 12px rgba(255, 179, 71, 0.4);
        `;
      case 'eco':
        return `
          background: ${ishigakiTheme.colors.semantic.tropical};
          color: ${ishigakiTheme.colors.background.primary};
          box-shadow: 0 4px 12px rgba(6, 255, 165, 0.3);
        `;
      default:
        return `
          background: ${ishigakiTheme.colors.brand.primary};
          color: white;
        `;
    }
  }}
`;

const PopularBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 8px 12px;
  background: ${ishigakiTheme.colors.semantic.coral};
  color: white;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  animation: float 3s ease-in-out infinite;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.5);
  z-index: 1;
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
`;

const Content = styled.div`
  padding: 24px;
`;

const Title = styled.h3`
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 700;
  color: ${ishigakiTheme.colors.text.primary};
  line-height: 1.4;
`;

const Description = styled.p`
  margin: 0 0 20px 0;
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.tertiary};
  line-height: 1.6;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const Price = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: ${ishigakiTheme.colors.brand.primary};
`;

const PriceUnit = styled.span`
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.muted};
  font-weight: 500;
`;

const IshigakiCard: React.FC<IshigakiCardProps> = ({
  variant = 'default',
  image,
  title,
  description,
  price,
  badge,
  popular = false,
  onClick,
  hoverable,
  clickable,
  children,
}) => {
  // If children is provided, render custom content
  if (children) {
    return (
      <CardContainer variant={variant} popular={popular} onClick={onClick}>
        {children}
      </CardContainer>
    );
  }

  // Otherwise render default card layout
  return (
    <CardContainer variant={variant} popular={popular} onClick={onClick}>
      {image && (
        <ImageContainer>
          <CardImage src={image} alt={title} />
          {badge && <Badge variant={variant}>{badge}</Badge>}
          {popular && <PopularBadge>인기</PopularBadge>}
        </ImageContainer>
      )}
      <Content>
        {title && <Title>{title}</Title>}
        {description && <Description>{description}</Description>}
        {price && (
          <PriceContainer>
            <Price>₩{price}</Price>
            <PriceUnit>/ 1인</PriceUnit>
          </PriceContainer>
        )}
      </Content>
    </CardContainer>
  );
};

export default IshigakiCard;