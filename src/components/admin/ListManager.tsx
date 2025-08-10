import React, { useState } from 'react';
import styled from 'styled-components';
import { ishigakiTheme } from '@/styles/ishigaki-theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid ${ishigakiTheme.colors.border.light};
  border-radius: 8px;
  font-size: 14px;
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
`;

const AddButton = styled.button`
  padding: 12px 24px;
  background: ${ishigakiTheme.colors.brand.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  
  &:hover {
    background: ${ishigakiTheme.colors.brand.accent};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: ${ishigakiTheme.colors.background.secondary};
  border-radius: 12px;
  padding: 16px;
  min-height: 60px;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border: 1px solid ${ishigakiTheme.colors.border.light};
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${ishigakiTheme.colors.brand.primary};
    box-shadow: ${ishigakiTheme.shadows.sm};
    transform: translateX(4px);
  }
`;

const ItemBullet = styled.span`
  color: ${ishigakiTheme.colors.brand.primary};
  font-size: 20px;
  line-height: 1;
`;

const ItemText = styled.span`
  flex: 1;
  color: ${ishigakiTheme.colors.text.primary};
  font-size: 14px;
  line-height: 1.5;
`;

const RemoveButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: ${ishigakiTheme.colors.semantic.coral};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 16px;
  
  &:hover {
    background: ${ishigakiTheme.colors.semantic.sunset};
    transform: scale(1.05);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 20px;
  color: ${ishigakiTheme.colors.text.tertiary};
  font-size: 14px;
`;

const ItemCount = styled.div`
  text-align: right;
  font-size: 12px;
  color: ${ishigakiTheme.colors.text.tertiary};
  margin-top: 8px;
`;

interface ListManagerProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  buttonText?: string;
  emptyText?: string;
  maxItems?: number;
}

export default function ListManager({
  items,
  onChange,
  placeholder = '항목을 입력하세요',
  buttonText = '추가',
  emptyText = '아직 추가된 항목이 없습니다',
  maxItems = 20
}: ListManagerProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim() && items.length < maxItems) {
      onChange([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Container>
      <InputWrapper>
        <StyledInput
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
        />
        <AddButton
          type="button"
          onClick={handleAdd}
          disabled={!inputValue.trim() || items.length >= maxItems}
        >
          {buttonText}
        </AddButton>
      </InputWrapper>

      <ListContainer>
        {items.length === 0 ? (
          <EmptyState>{emptyText}</EmptyState>
        ) : (
          <>
            {items.map((item, index) => (
              <ListItem key={index}>
                <ItemBullet>•</ItemBullet>
                <ItemText>{item}</ItemText>
                <RemoveButton
                  type="button"
                  onClick={() => handleRemove(index)}
                  title="삭제"
                >
                  ✕
                </RemoveButton>
              </ListItem>
            ))}
            <ItemCount>
              {items.length}개 / 최대 {maxItems}개
            </ItemCount>
          </>
        )}
      </ListContainer>
    </Container>
  );
}