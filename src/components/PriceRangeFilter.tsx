import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { ishigakiTheme } from '../styles/ishigaki-theme';

interface PriceRangeFilterProps {
  min?: number;
  max?: number;
  defaultMin?: number;
  defaultMax?: number;
  currency?: string;
  step?: number;
  onChange?: (min: number, max: number) => void;
}

const Container = styled.div`
  padding: 16px 0;
`;

const SliderContainer = styled.div`
  position: relative;
  height: 40px;
  margin: 20px 0;
`;

const SliderTrack = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 4px;
  background: ${ishigakiTheme.colors.background.secondary};
  border-radius: 2px;
`;

const SliderRange = styled.div<{ left: number; right: number }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${props => props.left}%;
  right: ${props => props.right}%;
  height: 4px;
  background: ${ishigakiTheme.colors.brand.primary};
  border-radius: 2px;
`;

const SliderThumb = styled.input`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: transparent;
  outline: none;
  pointer-events: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${ishigakiTheme.colors.brand.primary};
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    pointer-events: all;
    transition: all 0.2s;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(38, 208, 206, 0.4);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${ishigakiTheme.colors.brand.primary};
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    pointer-events: all;
    transition: all 0.2s;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(38, 208, 206, 0.4);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 24px;
`;

const InputWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const CurrencyLabel = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${ishigakiTheme.colors.text.tertiary};
  font-size: 14px;
  font-weight: 500;
`;

const PriceInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 28px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${ishigakiTheme.colors.text.primary};
  background: white;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${ishigakiTheme.colors.brand.primary};
    box-shadow: 0 0 0 3px rgba(38, 208, 206, 0.1);
  }
  
  &::placeholder {
    color: ${ishigakiTheme.colors.text.tertiary};
  }
  
  /* Remove number input arrows */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const Separator = styled.span`
  color: ${ishigakiTheme.colors.text.tertiary};
  font-weight: 500;
  padding: 0 4px;
`;

const QuickSelectContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const QuickSelectButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid ${props => props.active ? ishigakiTheme.colors.brand.primary : ishigakiTheme.colors.border.light};
  background: ${props => props.active ? ishigakiTheme.colors.brand.primary : 'white'};
  color: ${props => props.active ? 'white' : ishigakiTheme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${ishigakiTheme.colors.brand.primary};
    transform: translateY(-1px);
  }
`;

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  min = 0,
  max = 500000,
  defaultMin = 0,
  defaultMax = 500000,
  currency = '₩',
  step = 5000,
  onChange
}) => {
  const [minValue, setMinValue] = useState(defaultMin);
  const [maxValue, setMaxValue] = useState(defaultMax);

  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  useEffect(() => {
    if (onChange) {
      const timer = setTimeout(() => {
        onChange(minValue, maxValue);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [minValue, maxValue, onChange]);

  const handleMinChange = (value: number) => {
    const newValue = Math.min(value, maxValue - step);
    setMinValue(newValue);
  };

  const handleMaxChange = (value: number) => {
    const newValue = Math.max(value, minValue + step);
    setMaxValue(newValue);
  };

  const quickSelects = [
    { label: '전체', min: 0, max: 500000 },
    { label: '~5만원', min: 0, max: 50000 },
    { label: '5~10만원', min: 50000, max: 100000 },
    { label: '10만원~', min: 100000, max: 500000 },
  ];

  const isQuickSelectActive = (select: typeof quickSelects[0]) => {
    return minValue === select.min && maxValue === select.max;
  };

  return (
    <Container>
      <SliderContainer>
        <SliderTrack />
        <SliderRange left={minPercent} right={100 - maxPercent} />
        
        <SliderThumb
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          style={{ zIndex: minValue > max - 100 ? 5 : 3 }}
        />
        
        <SliderThumb
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          style={{ zIndex: 4 }}
        />
      </SliderContainer>

      <InputContainer>
        <InputWrapper>
          <CurrencyLabel>{currency}</CurrencyLabel>
          <PriceInput
            type="number"
            value={minValue}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
          />
        </InputWrapper>
        
        <Separator>~</Separator>
        
        <InputWrapper>
          <CurrencyLabel>{currency}</CurrencyLabel>
          <PriceInput
            type="number"
            value={maxValue}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
          />
        </InputWrapper>
      </InputContainer>

      <QuickSelectContainer>
        {quickSelects.map((select) => (
          <QuickSelectButton
            key={select.label}
            active={isQuickSelectActive(select)}
            onClick={() => {
              setMinValue(select.min);
              setMaxValue(select.max);
            }}
          >
            {select.label}
          </QuickSelectButton>
        ))}
      </QuickSelectContainer>
    </Container>
  );
};

export default PriceRangeFilter;