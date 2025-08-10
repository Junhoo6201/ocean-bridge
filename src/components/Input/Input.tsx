import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

export type InputVariant = 'default' | 'filled' | 'ghost';
export type InputSize = 'small' | 'medium' | 'large';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const sizeStyles = {
  small: css`
    height: 32px;
    padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.small};
  `,
  medium: css`
    height: 40px;
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.regular};
  `,
  large: css`
    height: 48px;
    padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  `,
};

const variantStyles = {
  default: css`
    background: ${({ theme }) => theme.colors.background.elevated};
    border: 1px solid ${({ theme }) => theme.colors.border.default};

    &:hover:not(:disabled) {
      border-color: ${({ theme }) => theme.colors.border.strong};
    }

    &:focus {
      border-color: ${({ theme }) => theme.colors.border.focus};
      background: ${({ theme }) => theme.colors.background.tertiary};
    }
  `,
  filled: css`
    background: ${({ theme }) => theme.colors.background.tertiary};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.background.elevated};
    }

    &:focus {
      background: ${({ theme }) => theme.colors.background.elevated};
      border-color: ${({ theme }) => theme.colors.border.focus};
    }
  `,
  ghost: css`
    background: transparent;
    border: 1px solid transparent;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: 0;

    &:hover:not(:disabled) {
      border-bottom-color: ${({ theme }) => theme.colors.border.strong};
    }

    &:focus {
      border-bottom-color: ${({ theme }) => theme.colors.border.focus};
    }
  `,
};

const InputWrapper = styled.div<{ fullWidth?: boolean }>`
  display: inline-flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  ${({ fullWidth }) => fullWidth && css`width: 100%;`}
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input<InputProps & { hasIcon?: boolean; iconPos?: 'left' | 'right' }>`
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  outline: none;
  
  ${({ size = 'medium' }) => sizeStyles[size]}
  ${({ variant = 'default' }) => variantStyles[variant]}
  
  ${({ hasIcon, iconPos }) =>
    hasIcon &&
    css`
      padding-${iconPos}: ${({ theme }) => theme.spacing[10]};
    `}

  ${({ error, theme }) =>
    error &&
    css`
      border-color: ${theme.colors.semantic.error} !important;
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`;

const IconWrapper = styled.span<{ position: 'left' | 'right' }>`
  position: absolute;
  ${({ position }) => position}: ${({ theme }) => theme.spacing[3]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.tertiary};
  pointer-events: none;
`;

const HelperText = styled.span<{ error?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.micro};
  color: ${({ error, theme }) =>
    error ? theme.colors.semantic.error : theme.colors.text.tertiary};
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'medium',
      error = false,
      errorMessage,
      label,
      helperText,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    return (
      <InputWrapper fullWidth={fullWidth}>
        {label && <Label>{label}</Label>}
        <InputContainer>
          {icon && <IconWrapper position={iconPosition}>{icon}</IconWrapper>}
          <StyledInput
            ref={ref}
            variant={variant}
            size={size}
            error={error}
            hasIcon={!!icon}
            iconPos={iconPosition}
            {...props}
          />
        </InputContainer>
        {(helperText || errorMessage) && (
          <HelperText error={error}>{error ? errorMessage : helperText}</HelperText>
        )}
      </InputWrapper>
    );
  }
);

Input.displayName = 'Input';

export default Input;