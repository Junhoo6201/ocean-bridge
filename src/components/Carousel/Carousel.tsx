import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

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
`;

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[12]}`};
`;

const CarouselViewport = styled.div`
  width: 100%;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const CarouselTrack = styled.div<{ 
  transform: number; 
  gap?: string;
  transition?: boolean;
}>`
  display: flex;
  gap: ${({ gap, theme }) => gap || theme.spacing[4]};
  transform: translateX(${({ transform }) => transform}px);
  transition: ${({ transition, theme }) => 
    transition ? `transform ${theme.animation.duration.slow} ${theme.animation.easing.easeOutExpo}` : 'none'};
`;

const CarouselSlide = styled.div<{ width?: string; slidesToShow?: number; gap?: string }>`
  flex: 0 0 ${({ width, slidesToShow, gap }) => {
    if (width) return width;
    const gapValue = gap ? parseInt(gap) : 16;
    return slidesToShow ? `calc((100% - ${(slidesToShow - 1) * gapValue}px) / ${slidesToShow})` : '100%';
  }};
  min-width: 0;
`;

const ArrowButton = styled.button<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ position }) => position === 'left' ? 'left: 0' : 'right: 0'};
  z-index: 2;
  width: 44px;
  height: 44px;
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
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
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
`;

const Indicator = styled.button<{ active: boolean }>`
  width: ${({ active }) => active ? '24px' : '8px'};
  height: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  background: ${({ active, theme }) => 
    active ? theme.colors.brand.primary : theme.colors.border.default};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  
  &:hover {
    background: ${({ active, theme }) => 
      active ? theme.colors.brand.secondary : theme.colors.border.strong};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`;

const ArrowIcon: React.FC<{ direction: 'left' | 'right' }> = ({ direction }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {direction === 'left' ? (
      <polyline points="15 18 9 12 15 6" />
    ) : (
      <polyline points="9 18 15 12 9 6" />
    )}
  </svg>
);

export const Carousel: React.FC<CarouselProps> = ({
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
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transform, setTransform] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<HTMLDivElement[]>([]);
  const autoPlayRef = useRef<NodeJS.Timeout>();
  const viewportRef = useRef<HTMLDivElement>(null);

  const totalSlides = React.Children.count(children);
  const maxIndex = Math.max(0, totalSlides - slidesToShow);

  const calculateTransform = useCallback(() => {
    if (!viewportRef.current || !slideRefs.current.length) return;
    
    const viewport = viewportRef.current;
    const viewportWidth = viewport.offsetWidth;
    const gapValue = gap ? parseInt(gap) : 16;
    const slideWidth = (viewportWidth - (gapValue * (slidesToShow - 1))) / slidesToShow;
    const offset = -(currentIndex * (slideWidth + gapValue));
    setTransform(offset);
  }, [currentIndex, slidesToShow, gap]);

  useEffect(() => {
    calculateTransform();
    // Add resize listener
    const handleResize = () => calculateTransform();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateTransform]);

  useEffect(() => {
    if (autoPlay && totalSlides > 1) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [autoPlay, autoPlayInterval, currentIndex, totalSlides]);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setTimeout(() => {
      handleNext();
    }, autoPlayInterval);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
    }
  };

  const handlePrevious = () => {
    stopAutoPlay();
    let newIndex = currentIndex - slidesToScroll;
    
    if (infinite && newIndex < 0) {
      newIndex = maxIndex;
    } else {
      newIndex = Math.max(0, newIndex);
    }
    
    setCurrentIndex(newIndex);
    onSlideChange?.(newIndex);
  };

  const handleNext = () => {
    stopAutoPlay();
    let newIndex = currentIndex + slidesToScroll;
    
    if (infinite && newIndex > maxIndex) {
      newIndex = 0;
    } else {
      newIndex = Math.min(maxIndex, newIndex);
    }
    
    setCurrentIndex(newIndex);
    onSlideChange?.(newIndex);
  };

  const handleIndicatorClick = (index: number) => {
    stopAutoPlay();
    setCurrentIndex(index);
    onSlideChange?.(index);
  };

  const handleMouseEnter = () => {
    if (autoPlay) {
      stopAutoPlay();
    }
  };

  const handleMouseLeave = () => {
    if (autoPlay) {
      startAutoPlay();
    }
  };

  return (
    <CarouselContainer 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CarouselWrapper>
        {showArrows && totalSlides > slidesToShow && (
          <>
            <ArrowButton
              position="left"
              onClick={handlePrevious}
              disabled={!infinite && currentIndex === 0}
              aria-label="Previous slide"
            >
              <ArrowIcon direction="left" />
            </ArrowButton>
            <ArrowButton
              position="right"
              onClick={handleNext}
              disabled={!infinite && currentIndex >= maxIndex}
              aria-label="Next slide"
            >
              <ArrowIcon direction="right" />
            </ArrowButton>
          </>
        )}
        
        <CarouselViewport ref={viewportRef}>
          <CarouselTrack
            ref={trackRef}
            transform={transform}
            gap={gap}
            transition={true}
          >
            {React.Children.map(children, (child, index) => (
              <CarouselSlide
                key={index}
                ref={(el) => {
                  if (el) slideRefs.current[index] = el;
                }}
                width={slideWidth}
                slidesToShow={slidesToShow}
                gap={gap}
              >
                {child}
              </CarouselSlide>
            ))}
          </CarouselTrack>
        </CarouselViewport>
      </CarouselWrapper>

      {showIndicators && totalSlides > 1 && slidesToShow === 1 && (
        <IndicatorContainer>
          {Array.from({ length: totalSlides }, (_, index) => (
            <Indicator
              key={index}
              active={index === currentIndex}
              onClick={() => handleIndicatorClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </IndicatorContainer>
      )}
    </CarouselContainer>
  );
};

export default Carousel;