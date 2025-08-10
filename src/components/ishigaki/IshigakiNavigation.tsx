import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { ishigakiTheme } from '../../styles/ishigaki-theme';

interface IshigakiNavigationProps {
  logo?: string;
  logoText?: string;
  items: {
    label: string;
    href: string;
    active?: boolean;
  }[];
  onItemClick?: (href: string) => void;
}

const NavContainer = styled.nav<{ scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: ${({ scrolled }) => (scrolled ? '12px 0' : '20px 0')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  background: ${({ scrolled }) =>
    scrolled
      ? 'rgba(255, 255, 255, 0.98)'
      : 'rgba(255, 255, 255, 0.8)'};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${({ scrolled }) =>
    scrolled ? 'rgba(38, 208, 206, 0.15)' : 'transparent'};
  box-shadow: ${({ scrolled }) =>
    scrolled ? '0 2px 10px rgba(0, 0, 0, 0.08)' : 'none'};
`;

const NavWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
`;

const LogoText = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: ${ishigakiTheme.colors.brand.primary};
  letter-spacing: -0.5px;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.a<{ active?: boolean }>`
  position: relative;
  padding: 10px 20px;
  font-size: 15px;
  font-weight: 600;
  color: ${({ active }) =>
    active
      ? ishigakiTheme.colors.brand.accent
      : ishigakiTheme.colors.text.secondary};
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  /* Hover effect */
  &::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: 0;
    height: 2px;
    background: ${ishigakiTheme.colors.brand.primary};
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  &:hover {
    color: ${ishigakiTheme.colors.brand.accent};
    background: ${ishigakiTheme.colors.background.glass};
    
    &::before {
      width: 60%;
    }
  }
  
  ${({ active }) =>
    active &&
    `
    background: ${ishigakiTheme.colors.background.glass};
    color: ${ishigakiTheme.colors.brand.accent};
    
    &::before {
      width: 60%;
    }
  `}
`;

const CTAButton = styled.button`
  padding: 10px 24px;
  background: ${ishigakiTheme.colors.semantic.coral};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${ishigakiTheme.shadows.coral};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(255, 107, 107, 0.4);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MenuIcon = styled.div<{ open: boolean }>`
  width: 24px;
  height: 20px;
  position: relative;
  
  span {
    position: absolute;
    width: 100%;
    height: 2px;
    background: ${ishigakiTheme.colors.text.primary};
    transition: all 0.3s ease;
    border-radius: 2px;
    
    &:nth-of-type(1) {
      top: 0;
      transform: ${({ open }) =>
        open ? 'translateY(9px) rotate(45deg)' : 'none'};
    }
    
    &:nth-of-type(2) {
      top: 50%;
      transform: translateY(-50%);
      opacity: ${({ open }) => (open ? 0 : 1)};
    }
    
    &:nth-of-type(3) {
      bottom: 0;
      transform: ${({ open }) =>
        open ? 'translateY(-9px) rotate(-45deg)' : 'none'};
    }
  }
`;

const MobileMenu = styled.div<{ open: boolean }>`
  display: none;
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  padding: 20px;
  transform: ${({ open }) => (open ? 'translateY(0)' : 'translateY(-100%)')};
  opacity: ${({ open }) => (open ? 1 : 0)};
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(38, 208, 206, 0.15);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNavItem = styled.a<{ active?: boolean }>`
  display: block;
  padding: 16px 20px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ active }) =>
    active
      ? ishigakiTheme.colors.brand.accent
      : ishigakiTheme.colors.text.secondary};
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${ishigakiTheme.colors.background.glass};
    color: ${ishigakiTheme.colors.brand.accent};
  }
  
  ${({ active }) =>
    active &&
    `
    background: ${ishigakiTheme.colors.background.glass};
  `}
`;

const IshigakiNavigation: React.FC<IshigakiNavigationProps> = ({
  logo,
  logoText = 'ISHIGAKI',
  items,
  onItemClick,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleItemClick = (href: string) => {
    setMobileMenuOpen(false);
    if (onItemClick) {
      onItemClick(href);
    }
  };

  return (
    <>
      <NavContainer scrolled={scrolled}>
        <NavWrapper>
          <LogoContainer onClick={() => handleItemClick('/')}>
            {logo ? (
              <LogoImage src={logo} alt="Logo" />
            ) : (
              <LogoText>{logoText}</LogoText>
            )}
          </LogoContainer>

          <NavItems>
            {items.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                active={item.active}
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item.href);
                }}
              >
                {item.label}
              </NavItem>
            ))}
            <CTAButton onClick={() => handleItemClick('/booking')}>
              예약하기
            </CTAButton>
          </NavItems>

          <MobileMenuButton
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <MenuIcon open={mobileMenuOpen}>
              <span />
              <span />
              <span />
            </MenuIcon>
          </MobileMenuButton>
        </NavWrapper>
      </NavContainer>

      <MobileMenu open={mobileMenuOpen}>
        {items.map((item) => (
          <MobileNavItem
            key={item.href}
            href={item.href}
            active={item.active}
            onClick={(e) => {
              e.preventDefault();
              handleItemClick(item.href);
            }}
          >
            {item.label}
          </MobileNavItem>
        ))}
      </MobileMenu>
    </>
  );
};

export default IshigakiNavigation;