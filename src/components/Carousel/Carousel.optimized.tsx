import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import styled from 'styled-components';
import FocusTrap from 'focus-trap-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  infinite?: boolean;
  slideWidth?: string;
  gap?: string;
  slidesToShow?: number;
  slidesToScroll?: number;
  onSlideChange?: (index: number) => void;
  ariaLabel?: string;
  ariaRoleDescription?: string;
}

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[2]} 0;
`;

const CarouselTrack = styled.div<{ 
  $transform: number; 
  $gap?: string;
  $transition?: boolean;
}>`
  display: flex;
  gap: ${({ $gap, theme }) => $gap || theme.spacing[4]};
  transform: translateX(${({ $transform }) => $transform}px);
  transition: ${({ $transition, theme }) => 
    $transition ? `transform ${theme.animation.duration.slow} ${theme.animation.easing.easeOutExpo}` : 'none'};
  
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const CarouselSlide = styled.div<{ $width?: string; $slidesToShow?: number }>`
  flex: 0 0 ${({ $width, $slidesToShow }) => 
    $width || ($slidesToShow ? `calc((100% - ${($slidesToShow - 1) * 16}px) / ${$slidesToShow})` : '100%')};
  min-width: 0;
`;

const ArrowButton = styled.button<{ $position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $position }) => $position === 'left' ? 'left: -20px' : 'right: -20px'};
  z-index: 2;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  background: ${({ theme }) => theme.colors.background.elevated};
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  backdrop-filter: blur(8px);
  box-shadow: ${({ theme }) => theme.shadows.md};
  touch-action: manipulation;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.background.hover};
    border-color: ${({ theme }) => theme.colors.border.strong};
    transform: translateY(-50%) scale(1.05);
  }

  &:active:not(:disabled) {
    transform: translateY(-50%) scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: translateY(-50%);
    
    &:hover:not(:disabled) {
      transform: translateY(-50%);
    }
    
    &:active:not(:disabled) {
      transform: translateY(-50%);
    }
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const IndicatorContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[2]};
`;

const Indicator = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => $active ? '24px' : '8px'};
  height: 8px;
  min-width: 8px;
  min-height: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  background: ${({ $active, theme }) => 
    $active ? theme.colors.brand.primary : theme.colors.border.default};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  padding: 0;
  
  &:hover {
    background: ${({ $active, theme }) => 
      $active ? theme.colors.brand.secondary : theme.colors.border.strong};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const ArrowIcon = memo<{ direction: 'left' | 'right' }>(({ direction }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round" 
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {direction === 'left' ? (
      <polyline points="15 18 9 12 15 6" />
    ) : (
      <polyline points="9 18 15 12 9 6" />
    )}
  </svg>
));

ArrowIcon.displayName = 'ArrowIcon';

export const Carousel = memo<CarouselProps>(({
  children,
  autoPlay = false,
  autoPlayInterval = 5000,
  showIndicators = true,
  showArrows = true,
  infinite = false,
  slideWidth,
  gap,
  slidesToShow = 1,
  slidesToScroll = 1,
  onSlideChange,
  ariaLabel = 'Image carousel',
  ariaRoleDescription = 'carousel',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transform, setTransform] = useState(0);
  const [isTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [focusTrapActive, setFocusTrapActive] = useState(false);
  
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<HTMLDivElement[]>([]);
  const autoPlayRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = React.Children.count(children);
  const maxIndex = Math.max(0, totalSlides - slidesToShow);

  // Memoized values
  const slideInfo = useMemo(() => ({
    current: currentIndex + 1,
    total: totalSlides,
  }), [currentIndex, totalSlides]);

  // Calculate transform
  useEffect(() => {
    if (slideRefs.current[currentIndex]) {
      const slideWidth = slideRefs.current[0]?.offsetWidth || 0;
      const gapValue = gap ? parseInt(gap) : 16;
      const offset = -(currentIndex * (slideWidth + gapValue));
      setTransform(offset);
    }
  }, [currentIndex, slidesToShow, gap]);

  // Auto-play management
  useEffect(() => {
    if (autoPlay && !isPaused && totalSlides > 1) {
      autoPlayRef.current = setTimeout(() => {
        handleNext();
      }, autoPlayInterval);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, currentIndex, isPaused, totalSlides]);

  const handlePrevious = useCallback(() => {
    let newIndex = currentIndex - slidesToScroll;
    
    if (infinite && newIndex < 0) {
      newIndex = maxIndex;
    } else {
      newIndex = Math.max(0, newIndex);
    }
    
    setCurrentIndex(newIndex);
    onSlideChange?.(newIndex);
  }, [currentIndex, slidesToScroll, infinite, maxIndex, onSlideChange]);

  const handleNext = useCallback(() => {
    let newIndex = currentIndex + slidesToScroll;
    
    if (infinite && newIndex > maxIndex) {
      newIndex = 0;
    } else {
      newIndex = Math.min(maxIndex, newIndex);
    }
    
    setCurrentIndex(newIndex);
    onSlideChange?.(newIndex);
  }, [currentIndex, slidesToScroll, infinite, maxIndex, onSlideChange]);

  const handleIndicatorClick = useCallback((index: number) => {
    setCurrentIndex(index);
    onSlideChange?.(index);
  }, [onSlideChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        handlePrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleNext();
        break;
      case 'Home':
        e.preventDefault();
        setCurrentIndex(0);
        onSlideChange?.(0);
        break;
      case 'End':
        e.preventDefault();
        setCurrentIndex(maxIndex);
        onSlideChange?.(maxIndex);
        break;
      case ' ':
      case 'Enter':
        if (autoPlay) {
          e.preventDefault();
          setIsPaused(!isPaused);
        }
        break;
    }
  }, [handlePrevious, handleNext, autoPlay, isPaused, maxIndex, onSlideChange]);

  const handleMouseEnter = useCallback(() => {
    if (autoPlay) {
      setIsPaused(true);
    }
  }, [autoPlay]);

  const handleMouseLeave = useCallback(() => {
    if (autoPlay) {
      setIsPaused(false);
    }
  }, [autoPlay]);

  const handleFocus = useCallback(() => {
    setFocusTrapActive(true);
    setIsPaused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusTrapActive(false);
    if (autoPlay) {
      setIsPaused(false);
    }
  }, [autoPlay]);

  const slides = useMemo(() => 
    React.Children.map(children, (child, index) => (
      <CarouselSlide
        key={index}
        ref={(el) => {
          if (el) slideRefs.current[index] = el;
        }}
        $width={slideWidth}
        $slidesToShow={slidesToShow}
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${totalSlides}`}
        aria-hidden={index !== currentIndex}
      >
        {child}
      </CarouselSlide>
    )), [children, slideWidth, slidesToShow, totalSlides, currentIndex]
  );

  return (
    <FocusTrap active={focusTrapActive}>
      <CarouselContainer 
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        role="region"
        aria-roledescription={ariaRoleDescription}
        aria-label={ariaLabel}
        tabIndex={0}
      >
        <VisuallyHidden aria-live="polite" aria-atomic="true">
          Slide {slideInfo.current} of {slideInfo.total}
        </VisuallyHidden>
        
        <CarouselWrapper>
          {showArrows && totalSlides > slidesToShow && (
            <>
              <ArrowButton
                $position="left"
                onClick={handlePrevious}
                disabled={!infinite && currentIndex === 0}
                aria-label="Previous slide"
                tabIndex={focusTrapActive ? 0 : -1}
              >
                <ArrowIcon direction="left" />
              </ArrowButton>
              <ArrowButton
                $position="right"
                onClick={handleNext}
                disabled={!infinite && currentIndex >= maxIndex}
                aria-label="Next slide"
                tabIndex={focusTrapActive ? 0 : -1}
              >
                <ArrowIcon direction="right" />
              </ArrowButton>
            </>
          )}
          
          <CarouselTrack
            ref={trackRef}
            $transform={transform}
            $gap={gap}
            $transition={isTransitioning}
            aria-live="polite"
          >
            {slides}
          </CarouselTrack>
        </CarouselWrapper>

        {showIndicators && totalSlides > 1 && slidesToShow === 1 && (
          <IndicatorContainer role="tablist" aria-label="Slide indicators">
            {Array.from({ length: totalSlides }, (_, index) => (
              <Indicator
                key={index}
                role="tab"
                $active={index === currentIndex}
                onClick={() => handleIndicatorClick(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={index === currentIndex}
                aria-controls={`slide-${index}`}
                tabIndex={focusTrapActive ? 0 : -1}
              />
            ))}
          </IndicatorContainer>
        )}
        
        {autoPlay && (
          <VisuallyHidden aria-live="polite">
            Auto-play is {isPaused ? 'paused' : 'active'}
          </VisuallyHidden>
        )}
      </CarouselContainer>
    </FocusTrap>
  );
});

Carousel.displayName = 'Carousel';

export default Carousel;