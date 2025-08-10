import React, { memo, forwardRef, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children?: React.ReactNode;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaPressed?: boolean;
}

const sizeStyles = {
  small: css`
    padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.small};
    min-height: 32px;
  `,
  medium: css`
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.regular};
    min-height: 40px;
  `,
  large: css`
    padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[5]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    min-height: 48px;
  `,
};

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.neutral.white};
    border: 2px solid ${({ theme }) => theme.colors.brand.primary};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.brand.secondary};
      border-color: ${({ theme }) => theme.colors.brand.secondary};
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }

    @media (prefers-reduced-motion: reduce) {
      transform: none;
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.background.elevated};
    color: ${({ theme }) => theme.colors.text.primary};
    border: 2px solid ${({ theme }) => theme.colors.border.default};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.background.hover};
      border-color: ${({ theme }) => theme.colors.border.strong};
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text.primary};
    border: 2px solid transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.background.hover};
    }

    &:active:not(:disabled) {
      background: ${({ theme }) => theme.colors.background.active};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.semantic.error};
    color: ${({ theme }) => theme.colors.neutral.white};
    border: 2px solid ${({ theme }) => theme.colors.semantic.error};

    &:hover:not(:disabled) {
      background: #d14444;
      border-color: #d14444;
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  `,
  success: css`
    background: ${({ theme }) => theme.colors.semantic.success};
    color: ${({ theme }) => theme.colors.neutral.white};
    border: 2px solid ${({ theme }) => theme.colors.semantic.success};

    &:hover:not(:disabled) {
      background: #3ea572;
      border-color: #3ea572;
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  `,
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-family: inherit;
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  touch-action: manipulation;
  user-select: none;
  
  ${({ size = 'medium' }) => sizeStyles[size]}
  ${({ variant = 'primary' }) => variantStyles[variant]}
  
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  ${({ loading }) =>
    loading &&
    css`
      pointer-events: none;
      opacity: 0.7;
    `}
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 1em;
    height: 1em;
  }
`;

const LoadingSpinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 1.5s;
  }
`;

export const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    icon,
    iconPosition = 'left',
    loading = false,
    variant = 'primary',
    size = 'medium',
    ariaLabel,
    ariaDescribedBy,
    ariaPressed,
    disabled,
    onClick,
    ...props
  }, ref) => {
    // Prevent click when loading
    const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    }, [loading, onClick]);

    // Determine aria-label
    const computedAriaLabel = ariaLabel || (loading ? 'Loading' : undefined);

    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        loading={loading}
        disabled={disabled || loading}
        onClick={handleClick}
        aria-label={computedAriaLabel}
        aria-describedby={ariaDescribedBy}
        aria-pressed={ariaPressed}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        role="button"
        tabIndex={disabled ? -1 : 0}
        {...props}
      >
        {loading && (
          <>
            <LoadingSpinner aria-hidden="true" />
            <VisuallyHidden>Loading</VisuallyHidden>
          </>
        )}
        {!loading && icon && iconPosition === 'left' && (
          <IconWrapper aria-hidden="true">{icon}</IconWrapper>
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && (
          <IconWrapper aria-hidden="true">{icon}</IconWrapper>
        )}
      </StyledButton>
    );
  }
));

Button.displayName = 'Button';

export default Button;