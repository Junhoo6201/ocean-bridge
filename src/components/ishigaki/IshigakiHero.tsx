import React from 'react';
import styled from '@emotion/styled';
import { ishigakiTheme } from '../../styles/ishigaki-theme';
import IshigakiButton from './IshigakiButton';

interface IshigakiHeroProps {
  title: string;
  subtitle: string;
  description?: string;
  backgroundImage?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

const HeroContainer = styled.section<{ backgroundImage?: string }>`
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(180deg, #E3FDFD 0%, #CBF1F5 100%);
  
  /* Background image with overlay */
  ${({ backgroundImage }) => backgroundImage && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url(${backgroundImage});
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0.4;
      z-index: 0;
    }
  `}
  
  /* Light overlay */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.4) 50%,
      rgba(255, 255, 255, 0.6) 100%
    );
    z-index: 1;
  }
`;

const WaveBackground = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%2326D0CE' fill-opacity='0.3' d='M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E") no-repeat bottom;
  background-size: cover;
  z-index: 2;
  animation: wave 20s linear infinite;
  
  @keyframes wave {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 3;
  text-align: center;
  padding: 40px 20px;
  max-width: 900px;
  margin: 0 auto;
`;

const Subtitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: ${ishigakiTheme.colors.brand.accent};
  margin-bottom: 16px;
  letter-spacing: 2px;
  text-transform: uppercase;
  animation: fadeInUp 0.8s ease-out;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h1`
  font-size: clamp(48px, 8vw, 80px);
  font-weight: 800;
  margin: 0 0 24px 0;
  line-height: 1.1;
  letter-spacing: -1px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
  color: ${ishigakiTheme.colors.text.primary};
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Description = styled.p`
  font-size: 20px;
  color: ${ishigakiTheme.colors.text.secondary};
  line-height: 1.6;
  margin: 0 0 48px 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInUp 0.8s ease-out 0.4s both;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease-out 0.6s both;
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
    
    button {
      width: 280px;
    }
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 2;
  
  /* Floating bubbles */
  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(
      circle at 30% 30%,
      rgba(38, 208, 206, 0.2),
      transparent
    );
    animation: float 15s infinite ease-in-out;
  }
  
  &::before {
    width: 100px;
    height: 100px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &::after {
    width: 150px;
    height: 150px;
    bottom: 20%;
    right: 10%;
    animation-delay: 5s;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0) translateX(0) scale(1);
    }
    33% {
      transform: translateY(-30px) translateX(20px) scale(1.1);
    }
    66% {
      transform: translateY(20px) translateX(-20px) scale(0.9);
    }
  }
`;

const IshigakiHero: React.FC<IshigakiHeroProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  onPrimaryClick,
  onSecondaryClick,
  primaryButtonText = '지금 예약하기',
  secondaryButtonText = '투어 둘러보기',
}) => {
  return (
    <HeroContainer backgroundImage={backgroundImage}>
      <FloatingElements />
      <WaveBackground />
      <ContentWrapper>
        <Subtitle>{subtitle}</Subtitle>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        <ButtonGroup>
          <IshigakiButton
            variant="coral"
            size="large"
            glow
            onClick={onPrimaryClick}
          >
            {primaryButtonText}
          </IshigakiButton>
          <IshigakiButton
            variant="ocean"
            size="large"
            onClick={onSecondaryClick}
          >
            {secondaryButtonText}
          </IshigakiButton>
        </ButtonGroup>
      </ContentWrapper>
    </HeroContainer>
  );
};

export default IshigakiHero;