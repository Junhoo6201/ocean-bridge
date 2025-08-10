import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { ishigakiTheme } from '@/styles/ishigaki-theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const UploadArea = styled.div`
  position: relative;
  border: 2px dashed ${ishigakiTheme.colors.border.light};
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  background: ${ishigakiTheme.colors.background.secondary};
  transition: all 0.2s;
  cursor: pointer;
  
  &:hover {
    border-color: ${ishigakiTheme.colors.brand.primary};
    background: ${ishigakiTheme.colors.background.tertiary};
  }
  
  &.dragging {
    border-color: ${ishigakiTheme.colors.brand.primary};
    background: rgba(38, 208, 206, 0.05);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const UploadTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: ${ishigakiTheme.colors.text.primary};
  margin-bottom: 8px;
`;

const UploadSubtitle = styled.p`
  font-size: 14px;
  color: ${ishigakiTheme.colors.text.secondary};
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
`;

const ImageItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${ishigakiTheme.colors.border.light};
  background: ${ishigakiTheme.colors.background.secondary};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid ${ishigakiTheme.colors.border.light};
  color: ${ishigakiTheme.colors.semantic.coral};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${ishigakiTheme.shadows.sm};
  
  &:hover {
    background: ${ishigakiTheme.colors.semantic.coral};
    color: white;
    transform: scale(1.1);
  }
`;

const ImageNumber = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
`;

const UrlInputWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const UrlInput = styled.input`
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

const AddUrlButton = styled.button`
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

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ images, onChange, maxImages = 10 }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 실제 파일 업로드 로직이 필요하면 여기에 구현
    // 현재는 URL만 지원
    alert('파일 업로드 기능은 준비 중입니다. URL을 입력해주세요.');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // 드래그 앤 드롭 파일 처리
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      alert('파일 업로드 기능은 준비 중입니다. URL을 입력해주세요.');
    }
  };

  const handleAddUrl = () => {
    if (urlInput.trim() && images.length < maxImages) {
      onChange([...images, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddUrl();
    }
  };

  return (
    <Container>
      <UrlInputWrapper>
        <UrlInput
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="이미지 URL을 입력하세요 (예: https://example.com/image.jpg)"
        />
        <AddUrlButton 
          type="button" 
          onClick={handleAddUrl}
          disabled={!urlInput.trim() || images.length >= maxImages}
        >
          URL 추가
        </AddUrlButton>
      </UrlInputWrapper>

      <UploadArea
        className={isDragging ? 'dragging' : ''}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
        />
        <UploadIcon>📸</UploadIcon>
        <UploadTitle>이미지 업로드</UploadTitle>
        <UploadSubtitle>
          클릭하거나 이미지를 드래그하세요 (최대 {maxImages}개)
        </UploadSubtitle>
        <UploadSubtitle style={{ fontSize: '12px', marginTop: '8px' }}>
          현재는 URL 입력만 지원됩니다
        </UploadSubtitle>
      </UploadArea>

      {images.length > 0 && (
        <ImageGrid>
          {images.map((url, index) => (
            <ImageItem key={index}>
              <img src={url} alt={`이미지 ${index + 1}`} />
              <ImageNumber>{index + 1}</ImageNumber>
              <RemoveButton
                type="button"
                onClick={() => handleRemoveImage(index)}
                title="이미지 삭제"
              >
                ✕
              </RemoveButton>
            </ImageItem>
          ))}
        </ImageGrid>
      )}
    </Container>
  );
}