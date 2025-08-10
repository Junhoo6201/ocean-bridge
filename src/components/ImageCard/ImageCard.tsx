import React from 'react';
import styled, { css } from 'styled-components';
import { Badge } from '../Badge/Badge';

export type ImageCardVariant = 'default' | 'overlay' | 'horizontal' | 'minimal' | 'bottom' | 'tagged';
export type ImageCardSize = 'small' | 'medium' | 'large';

interface ImageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ImageCardVariant;
  size?: ImageCardSize;
  image: string;
  alt?: string;
  title: string;
  description?: string;
  badge?: string;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  tags?: Array<{
    label: string;
    color?: string;
  }>;
  footer?: React.ReactNode;
  aspectRatio?: '1:1' | '4:3' | '16:9' | '21:9';
  hoverable?: boolean;
  clickable?: boolean;
  loading?: 'lazy' | 'eager';
  onImageError?: () => void;
}

const sizeStyles = {
  small: css`
    min-height: 200px;
  `,
  medium: css`
    min-height: 280px;
  `,
  large: css`
    min-height: 360px;
  `,
};

const aspectRatioStyles = {
  '1:1': css`
    aspect-ratio: 1 / 1;
  `,
  '4:3': css`
    aspect-ratio: 4 / 3;
  `,
  '16:9': css`
    aspect-ratio: 16 / 9;
  `,
  '21:9': css`
    aspect-ratio: 21 / 9;
  `,
};

const StyledImageCard = styled.div<{
  variant: ImageCardVariant;
  size: ImageCardSize;
  hoverable?: boolean;
  clickable?: boolean;
}>`
  position: relative;
  display: flex;
  flex-direction: ${({ variant }) => 
    variant === 'horizontal' ? 'row' : 
    variant === 'bottom' ? 'column-reverse' : 
    'column'};
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  
  ${({ size }) => sizeStyles[size]}
  
  ${({ hoverable, clickable }) =>
    (hoverable || clickable) &&
    css`
      &:hover {
        transform: translateY(-4px);
        box-shadow: ${({ theme }) => theme.shadows.xl};
        border-color: ${({ theme }) => theme.colors.border.strong};
        
        img {
          transform: scale(1.05);
        }
      }
    `}
  
  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;
      user-select: none;
      
      &:active {
        transform: translateY(-2px);
      }
    `}
`;

const ImageContainer = styled.div<{ 
  variant: ImageCardVariant;
  aspectRatio: string;
}>`
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.tertiary};
  
  ${({ variant }) =>
    variant === 'horizontal' 
      ? css`
          width: 40%;
          height: 100%;
        `
      : css<{ aspectRatio: string }>`
          width: 100%;
          ${({ aspectRatio }) => aspectRatioStyles[aspectRatio as keyof typeof aspectRatioStyles]}
        `
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${({ theme }) => theme.animation.duration.slow} ${({ theme }) => theme.animation.easing.easeOut};
`;

const ContentContainer = styled.div<{ 
  variant: ImageCardVariant;
  hasImage: boolean;
}>`
  padding: ${({ theme }) => theme.spacing[5]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  flex: 1;
  
  ${({ variant }) =>
    variant === 'horizontal' &&
    css`
      justify-content: center;
    `
  }
  
  ${({ variant }) =>
    variant === 'overlay' &&
    css`
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(8, 9, 10, 0.95) 0%, rgba(8, 9, 10, 0.7) 50%, transparent 100%);
      padding-top: ${({ theme }) => theme.spacing[12]};
    `
  }
  
  ${({ variant }) =>
    variant === 'minimal' &&
    css`
      padding: ${({ theme }) => theme.spacing[4]};
      gap: ${({ theme }) => theme.spacing[2]};
    `
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const TitleContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const Title = styled.h3<{ variant: ImageCardVariant }>`
  font-size: ${({ theme, variant }) => 
    variant === 'minimal' ? theme.typography.fontSize.base : theme.typography.fontSize.large};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme, variant }) => 
    variant === 'overlay' ? theme.colors.neutral.white : theme.colors.text.primary};
  line-height: ${({ theme }) => theme.typography.lineHeight.snug};
  margin: 0;
`;

const Description = styled.p<{ variant: ImageCardVariant }>`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme, variant }) => 
    variant === 'overlay' ? 'rgba(255, 255, 255, 0.9)' : theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing[3]};
  border-top: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.gradients[2]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const Tag = styled.span<{ color?: string }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  background: ${({ color, theme }) => color || theme.colors.background.tertiary};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.micro};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const TaggedImageOverlay = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  left: ${({ theme }) => theme.spacing[3]};
  right: ${({ theme }) => theme.spacing[3]};
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const ImageCard: React.FC<ImageCardProps> = ({
  variant = 'default',
  size = 'medium',
  image,
  alt,
  title,
  description,
  badge,
  badgeVariant = 'default',
  tags,
  footer,
  aspectRatio = '16:9',
  hoverable = false,
  clickable = false,
  loading = 'lazy',
  onImageError,
  ...props
}) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
    onImageError?.();
  };

  const showOverlayContent = variant === 'overlay';
  const showNormalContent = variant !== 'overlay';

  return (
    <StyledImageCard
      variant={variant}
      size={size}
      hoverable={hoverable}
      clickable={clickable}
      {...props}
    >
      {variant !== 'minimal' && (
        <ImageContainer variant={variant} aspectRatio={aspectRatio}>
          {imageError ? (
            <PlaceholderImage>🖼️</PlaceholderImage>
          ) : (
            <StyledImage
              src={image}
              alt={alt || title}
              loading={loading}
              onError={handleImageError}
            />
          )}
          {variant === 'tagged' && tags && tags.length > 0 && (
            <TaggedImageOverlay>
              {tags.map((tag, index) => (
                <Tag key={index} color={tag.color}>
                  {tag.label}
                </Tag>
              ))}
            </TaggedImageOverlay>
          )}
          {showOverlayContent && (
            <ContentContainer variant={variant} hasImage={true}>
              <Header>
                <TitleContainer>
                  <Title variant={variant}>{title}</Title>
                  {description && (
                    <Description variant={variant}>{description}</Description>
                  )}
                </TitleContainer>
                {badge && (
                  <Badge variant={badgeVariant} size="small">
                    {badge}
                  </Badge>
                )}
              </Header>
              {footer && <Footer>{footer}</Footer>}
            </ContentContainer>
          )}
        </ImageContainer>
      )}

      {showNormalContent && (
        <ContentContainer variant={variant} hasImage={variant !== 'minimal'}>
          <Header>
            <TitleContainer>
              <Title variant={variant}>{title}</Title>
              {description && (
                <Description variant={variant}>{description}</Description>
              )}
            </TitleContainer>
            {badge && (
              <Badge variant={badgeVariant} size="small">
                {badge}
              </Badge>
            )}
          </Header>
          {tags && tags.length > 0 && variant !== 'tagged' && (
            <TagsContainer>
              {tags.map((tag, index) => (
                <Tag key={index} color={tag.color}>
                  {tag.label}
                </Tag>
              ))}
            </TagsContainer>
          )}
          {footer && variant !== 'minimal' && <Footer>{footer}</Footer>}
        </ContentContainer>
      )}
    </StyledImageCard>
  );
};

export default ImageCard;