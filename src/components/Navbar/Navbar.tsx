import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Button } from '../Button/Button';

interface NavbarProps {
  logo?: React.ReactNode;
  title?: string;
  links?: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;
  actions?: React.ReactNode;
  variant?: 'default' | 'transparent' | 'blur';
  fixed?: boolean;
}

const NavContainer = styled.nav<{ variant: string; fixed?: boolean }>`
  position: ${({ fixed }) => fixed ? 'fixed' : 'relative'};
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${({ variant, theme }) => 
    variant === 'transparent' 
      ? 'transparent' 
      : variant === 'blur'
      ? 'rgba(8, 9, 10, 0.8)'
      : theme.colors.background.primary};
  backdrop-filter: ${({ variant }) => variant === 'blur' ? 'blur(12px)' : 'none'};
  border-bottom: 1px solid ${({ variant, theme }) => 
    variant === 'transparent' ? 'transparent' : theme.colors.border.subtle};
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
`;

const NavWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[6]}`};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[8]};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: transform ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};

  &:hover {
    transform: translateX(2px);
  }
`;

const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a<{ active?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  color: ${({ active, theme }) => 
    active ? theme.colors.brand.primary : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.background.hover};
  }

  ${({ active, theme }) => active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: ${theme.spacing[3]};
      right: ${theme.spacing[3]};
      height: 2px;
      background: ${theme.colors.brand.primary};
      border-radius: ${theme.borderRadius.full};
    }
  `}
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const MobileMenuButton = styled.button`
  display: none;
  width: 40px;
  height: 40px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;

  @media (max-width: 768px) {
    display: flex;
  }

  span {
    width: 24px;
    height: 2px;
    background: ${({ theme }) => theme.colors.text.primary};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  }

  &.open {
    span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
  }
`;

const MobileMenu = styled.div<{ open: boolean }>`
  display: none;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.background.elevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding: ${({ theme }) => theme.spacing[4]};
  transform: ${({ open }) => open ? 'translateY(0)' : 'translateY(-100%)'};
  opacity: ${({ open }) => open ? 1 : 0};
  visibility: ${({ open }) => open ? 'visible' : 'hidden'};
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const MobileNavLink = styled.a<{ active?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  color: ${({ active, theme }) => 
    active ? theme.colors.brand.primary : theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ active, theme }) => 
    active ? theme.colors.background.hover : 'transparent'};
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};

  &:hover {
    background: ${({ theme }) => theme.colors.background.hover};
  }
`;

export const Navbar: React.FC<NavbarProps> = ({
  logo,
  title = 'Ocean',
  links = [],
  actions,
  variant = 'default',
  fixed = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <>
      <NavContainer variant={variant} fixed={fixed}>
        <NavWrapper>
          <NavLeft>
            <Logo>
              {logo || '🌊'}
              {title}
            </Logo>
            <NavLinks>
              {links.map((link, index) => (
                <li key={index}>
                  <NavLink href={link.href} active={link.active}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </NavLinks>
          </NavLeft>
          <NavRight>
            {actions || (
              <>
                <Button variant="ghost" size="small">Sign In</Button>
                <Button variant="primary" size="small">Get Started</Button>
              </>
            )}
            <MobileMenuButton 
              onClick={toggleMobileMenu}
              className={mobileMenuOpen ? 'open' : ''}
              aria-label="Toggle mobile menu"
            >
              <span />
              <span />
              <span />
            </MobileMenuButton>
          </NavRight>
        </NavWrapper>
      </NavContainer>
      <MobileMenu open={mobileMenuOpen}>
        <MobileNavLinks>
          {links.map((link, index) => (
            <MobileNavLink key={index} href={link.href} active={link.active}>
              {link.label}
            </MobileNavLink>
          ))}
        </MobileNavLinks>
      </MobileMenu>
    </>
  );
};

export default Navbar;