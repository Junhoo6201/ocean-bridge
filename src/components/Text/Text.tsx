import React from 'react';
import styled, { css } from 'styled-components';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'overline';
export type TextColor = 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'inverse' | 'brand' | 'error' | 'success' | 'warning' | 'info';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  color?: TextColor;
  align?: TextAlign;
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  truncate?: boolean;
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

const variantStyles = {
  h1: css`
    font-size: ${({ theme }) => theme.typography.fontSize['6xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tighter};
  `,
  h2: css`
    font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tighter};
  `,
  h3: css`
    font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    line-height: ${({ theme }) => theme.typography.lineHeight.snug};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  `,
  h4: css`
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    line-height: ${({ theme }) => theme.typography.lineHeight.snug};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
  `,
  h5: css`
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.normal};
  `,
  h6: css`
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.normal};
  `,
  body: css`
    font-size: ${({ theme }) => theme.typography.fontSize.regular};
    font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.normal};
  `,
  caption: css`
    font-size: ${({ theme }) => theme.typography.fontSize.small};
    font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  `,
  overline: css`
    font-size: ${({ theme }) => theme.typography.fontSize.micro};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
    text-transform: uppercase;
  `,
};

const colorStyles = {
  primary: css`
    color: ${({ theme }) => theme.colors.text.primary};
  `,
  secondary: css`
    color: ${({ theme }) => theme.colors.text.secondary};
  `,
  tertiary: css`
    color: ${({ theme }) => theme.colors.text.tertiary};
  `,
  disabled: css`
    color: ${({ theme }) => theme.colors.text.disabled};
  `,
  inverse: css`
    color: ${({ theme }) => theme.colors.text.inverse};
  `,
  brand: css`
    color: ${({ theme }) => theme.colors.brand.primary};
  `,
  error: css`
    color: ${({ theme }) => theme.colors.semantic.error};
  `,
  success: css`
    color: ${({ theme }) => theme.colors.semantic.success};
  `,
  warning: css`
    color: ${({ theme }) => theme.colors.semantic.warning};
  `,
  info: css`
    color: ${({ theme }) => theme.colors.semantic.info};
  `,
};

const StyledText = styled.span<TextProps>`
  margin: 0;
  padding: 0;
  
  ${({ variant = 'body' }) => variantStyles[variant]}
  ${({ color = 'primary' }) => colorStyles[color]}
  
  ${({ align }) =>
    align &&
    css`
      text-align: ${align};
    `}
  
  ${({ weight, theme }) =>
    weight &&
    css`
      font-weight: ${theme.typography.fontWeight[weight]};
    `}
  
  ${({ truncate }) =>
    truncate &&
    css`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `}
`;

const defaultTags = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  caption: 'span',
  overline: 'span',
};

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  as,
  children,
  ...props
}) => {
  const Component = as || defaultTags[variant] || 'span';
  
  return (
    <StyledText as={Component} variant={variant} {...props}>
      {children}
    </StyledText>
  );
};

export default Text;