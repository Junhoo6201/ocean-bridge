import React from 'react';
import styled from 'styled-components';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  badge?: {
    text: string;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  };
  image?: string;
  backgroundImage?: string;
  backgroundOverlay?: boolean;
  variant?: 'default' | 'centered' | 'split' | 'gradient';
  size?: 'small' | 'medium' | 'large' | 'full';
}

const HeroContainer = styled.section<{ 
  variant: string; 
  size: string; 
  backgroundImage?: string;
  backgroundOverlay?: boolean;
}>`
  position: relative;
  width: 100%;
  min-height: ${({ size }) => 
    size === 'full' ? '100vh' : 
    size === 'large' ? '80vh' : 
    size === 'medium' ? '60vh' : 
    '40vh'};
  display: flex;
  align-items: center;
  overflow: hidden;
  background: ${({ variant, theme, backgroundImage }) => 
    backgroundImage
      ? `url(${backgroundImage}) center/cover no-repeat`
      : variant === 'gradient' 
      ? `linear-gradient(135deg, ${theme.colors.brand.primary}20 0%, ${theme.colors.brand.secondary}20 100%)`
      : theme.colors.background.primary};
  
  ${({ backgroundOverlay, theme }) => backgroundOverlay && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(180deg, 
        rgba(0, 0, 0, 0.6) 0%, 
        rgba(0, 0, 0, 0.3) 50%, 
        rgba(0, 0, 0, 0.5) 100%);
      z-index: 1;
    }
  `}
`;

const HeroWrapper = styled.div<{ variant: string; hasBackgroundImage?: boolean }>`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[16]} ${theme.spacing[6]}`};
  display: ${({ variant }) => variant === 'split' ? 'grid' : 'flex'};
  position: relative;
  z-index: 2;
  ${({ variant }) => variant === 'split' 
    ? `
      grid-template-columns: 1fr 1fr;
      gap: 64px;
      align-items: center;
    `
    : variant === 'centered'
    ? `
      flex-direction: column;
      align-items: center;
      text-align: center;
    `
    : `
      flex-direction: column;
      align-items: flex-start;
    `}

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: ${({ variant }) => variant === 'split' ? 'left' : variant === 'centered' ? 'center' : 'left'};
  }
`;

const HeroContent = styled.div<{ variant: string }>`
  max-width: ${({ variant }) => variant === 'centered' ? '800px' : '600px'};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const HeroBadge = styled.div`
  display: inline-flex;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const HeroTitle = styled.h1<{ size: string; hasBackgroundImage?: boolean }>`
  font-size: ${({ size, theme }) => 
    size === 'full' || size === 'large' 
      ? theme.typography.fontSize['5xl'] 
      : size === 'medium'
      ? theme.typography.fontSize['4xl']
      : theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme, hasBackgroundImage }) => 
    hasBackgroundImage ? theme.colors.neutral.white : theme.colors.text.primary};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  margin: 0;
  ${({ hasBackgroundImage }) => hasBackgroundImage && `
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  `}

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  }
`;

const HeroSubtitle = styled.h2<{ hasBackgroundImage?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme, hasBackgroundImage }) => 
    hasBackgroundImage ? theme.colors.neutral.white : theme.colors.brand.primary};
  margin: 0;
  ${({ hasBackgroundImage }) => hasBackgroundImage && `
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  `}
`;

const HeroDescription = styled.p<{ hasBackgroundImage?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.large};
  color: ${({ theme, hasBackgroundImage }) => 
    hasBackgroundImage ? 'rgba(255, 255, 255, 0.9)' : theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0;
  ${({ hasBackgroundImage }) => hasBackgroundImage && `
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  `}
`;

const HeroActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-wrap: wrap;
`;

const HeroImage = styled.div<{ image?: string }>`
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  overflow: hidden;
  background: ${({ image, theme }) => 
    image 
      ? `url(${image}) center/cover no-repeat`
      : theme.colors.gradients[0]};
  box-shadow: ${({ theme }) => theme.shadows['2xl']};

  @media (max-width: 768px) {
    height: 300px;
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.05;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 35px,
    currentColor 35px,
    currentColor 70px
  );
  pointer-events: none;
`;

const FloatingElement = styled.div<{ top?: string; left?: string; size?: string }>`
  position: absolute;
  top: ${({ top }) => top || '10%'};
  left: ${({ left }) => left || '10%'};
  width: ${({ size }) => size || '200px'};
  height: ${({ size }) => size || '200px'};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gradients[1]};
  opacity: 0.1;
  filter: blur(40px);
  animation: float 20s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    33% { transform: translateY(-20px) rotate(120deg); }
    66% { transform: translateY(20px) rotate(240deg); }
  }
`;

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  badge,
  image,
  backgroundImage,
  backgroundOverlay = true,
  variant = 'default',
  size = 'medium',
}) => {
  const hasBackgroundImage = !!backgroundImage;
  
  return (
    <HeroContainer 
      variant={variant} 
      size={size}
      backgroundImage={backgroundImage}
      backgroundOverlay={hasBackgroundImage && backgroundOverlay}
    >
      {variant === 'gradient' && !backgroundImage && (
        <>
          <BackgroundPattern />
          <FloatingElement top="10%" left="5%" size="300px" />
          <FloatingElement top="50%" left="70%" size="400px" />
          <FloatingElement top="70%" left="30%" size="250px" />
        </>
      )}
      <HeroWrapper variant={variant} hasBackgroundImage={hasBackgroundImage}>
        <HeroContent variant={variant}>
          {badge && (
            <HeroBadge>
              <Badge variant={badge.variant || 'primary'} size="medium">
                {badge.text}
              </Badge>
            </HeroBadge>
          )}
          {subtitle && <HeroSubtitle hasBackgroundImage={hasBackgroundImage}>{subtitle}</HeroSubtitle>}
          <HeroTitle size={size} hasBackgroundImage={hasBackgroundImage}>{title}</HeroTitle>
          {description && <HeroDescription hasBackgroundImage={hasBackgroundImage}>{description}</HeroDescription>}
          {(primaryAction || secondaryAction) && (
            <HeroActions>
              {primaryAction && (
                <Button 
                  variant="primary" 
                  size="large"
                  onClick={primaryAction.onClick}
                >
                  {primaryAction.label}
                </Button>
              )}
              {secondaryAction && (
                <Button 
                  variant={hasBackgroundImage ? 'secondary' : 'ghost'} 
                  size="large"
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.label}
                </Button>
              )}
            </HeroActions>
          )}
        </HeroContent>
        {variant === 'split' && !backgroundImage && (
          <HeroImage image={image} />
        )}
      </HeroWrapper>
    </HeroContainer>
  );
};

export default Hero;