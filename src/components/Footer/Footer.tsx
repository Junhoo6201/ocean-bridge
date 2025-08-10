import React from 'react';
import styled from 'styled-components';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  sections?: FooterSection[];
  logo?: React.ReactNode;
  title?: string;
  description?: string;
  copyright?: string;
  variant?: 'default' | 'minimal' | 'centered';
}

const FooterContainer = styled.footer<{ variant: string }>`
  background: ${({ theme }) => theme.colors.background.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.border.subtle};
  margin-top: auto;
`;

const FooterWrapper = styled.div<{ variant: string }>`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme, variant }) => 
    variant === 'minimal' 
      ? `${theme.spacing[8]} ${theme.spacing[6]}`
      : `${theme.spacing[12]} ${theme.spacing[6]}`};
`;

const FooterTop = styled.div<{ variant: string }>`
  display: ${({ variant }) => variant === 'centered' ? 'flex' : 'grid'};
  ${({ variant }) => variant === 'centered' 
    ? `
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 48px;
    `
    : `
      grid-template-columns: 3fr 1fr 1fr 1fr;
      gap: 48px;
    `}
  margin-bottom: ${({ theme }) => theme.spacing[12]};

  @media (max-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 32px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[8]};
  }
`;

const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  padding-right: ${({ theme }) => theme.spacing[8]};
  
  @media (max-width: 768px) {
    padding-right: 0;
  }
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FooterDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0;
  margin-top: ${({ theme }) => theme.spacing[2]};
  max-width: 480px;
  
  @media (max-width: 1024px) {
    max-width: 100%;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FooterSectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin: 0;
`;

const FooterLinks = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  text-decoration: none;
  transition: color ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const FooterBottom = styled.div<{ variant: string }>`
  display: flex;
  flex-direction: ${({ variant }) => variant === 'centered' ? 'column' : 'row'};
  align-items: center;
  justify-content: ${({ variant }) => variant === 'centered' ? 'center' : 'space-between'};
  gap: ${({ theme }) => theme.spacing[6]};
  padding-top: ${({ theme }) => theme.spacing[8]};
  border-top: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const FooterCopyright = styled.p`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  margin: 0;
`;

const MinimalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const MinimalLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
  flex-wrap: wrap;
`;

export const Footer: React.FC<FooterProps> = ({
  sections = [],
  logo,
  title = 'Ocean',
  description = 'A modern design system built with React, TypeScript, and styled-components.',
  copyright = `© ${new Date().getFullYear()} Ocean. All rights reserved.`,
  variant = 'default',
}) => {
  if (variant === 'minimal') {
    return (
      <FooterContainer variant={variant}>
        <FooterWrapper variant={variant}>
          <MinimalFooter>
            <FooterCopyright>{copyright}</FooterCopyright>
            <MinimalLinks>
              {sections.flatMap(section => section.links).map((link, index) => (
                <FooterLink key={index} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </MinimalLinks>
          </MinimalFooter>
        </FooterWrapper>
      </FooterContainer>
    );
  }

  return (
    <FooterContainer variant={variant}>
      <FooterWrapper variant={variant}>
        {(sections.length > 0 || description) && (
          <FooterTop variant={variant}>
            <FooterBrand>
              <FooterLogo>
                {logo || '🌊'}
                {title}
              </FooterLogo>
              {description && <FooterDescription>{description}</FooterDescription>}
            </FooterBrand>
            {variant !== 'centered' && sections.map((section, index) => (
              <FooterSection key={index}>
                <FooterSectionTitle>{section.title}</FooterSectionTitle>
                <FooterLinks>
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <FooterLink href={link.href}>{link.label}</FooterLink>
                    </li>
                  ))}
                </FooterLinks>
              </FooterSection>
            ))}
          </FooterTop>
        )}
        <FooterBottom variant={variant}>
          <FooterCopyright>{copyright}</FooterCopyright>
        </FooterBottom>
      </FooterWrapper>
    </FooterContainer>
  );
};

export default Footer;