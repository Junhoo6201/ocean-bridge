import React, { useState } from 'react';
import styled from 'styled-components';
import { Card } from '../Card/Card';
import { Badge } from '../Badge/Badge';
import { Text } from '../Text/Text';
import { Button } from '../Button/Button';

interface DiveEntry {
  id: string;
  date: Date;
  site: string;
  depth: number;
  duration: number;
  visibility: number;
  temperature: number;
  species?: string[];
  coralHealth?: 'healthy' | 'bleached' | 'recovering';
  notes?: string;
  photos?: string[];
  buddy?: string;
  certification?: string;
}

interface DiveLogProps {
  entries?: DiveEntry[];
  onAddEntry?: (entry: DiveEntry) => void;
  variant?: 'list' | 'grid' | 'detailed';
  showStats?: boolean;
  editable?: boolean;
}

const LogContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const StatCard = styled(Card)`
  background: ${({ theme }) => theme.colors.gradients[1]};
  color: white;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  opacity: 0.9;
`;

const EntriesContainer = styled.div<{ variant: string }>`
  display: ${({ variant }) => variant === 'grid' ? 'grid' : 'flex'};
  ${({ variant }) => variant === 'grid' 
    ? `
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    `
    : `
      flex-direction: column;
      gap: 16px;
    `}
`;

const EntryCard = styled(Card)<{ variant: string }>`
  ${({ variant }) => variant === 'detailed' && `
    cursor: pointer;
    transition: all 300ms ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
  `}
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const EntryTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.large};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const EntryDate = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EntryDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const DetailIcon = styled.span`
  font-size: 16px;
`;

const DetailText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SpeciesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const CoralHealthIndicator = styled.div<{ health: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  background: ${({ theme, health }) => {
    if (health === 'healthy') return theme.colors.semantic.success + '20';
    if (health === 'bleached') return theme.colors.semantic.emergency + '20';
    return theme.colors.semantic.weather + '20';
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme, health }) => {
    if (health === 'healthy') return theme.colors.semantic.success;
    if (health === 'bleached') return theme.colors.semantic.emergency;
    return theme.colors.semantic.weather;
  }};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const Photo = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: transform ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};

  &:hover {
    transform: scale(1.05);
  }
`;

const AddEntryButton = styled(Button)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  width: 56px;
  height: 56px;
  font-size: 24px;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]};
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const getCoralHealthText = (health: string) => {
  switch (health) {
    case 'healthy': return '健康';
    case 'bleached': return '白化';
    case 'recovering': return '回復中';
    default: return '不明';
  }
};

const getCoralHealthIcon = (health: string) => {
  switch (health) {
    case 'healthy': return '🪸';
    case 'bleached': return '⚪';
    case 'recovering': return '🔄';
    default: return '❓';
  }
};

export const DiveLog: React.FC<DiveLogProps> = ({
  entries = [],
  onAddEntry,
  variant = 'list',
  showStats = true,
  editable = false,
}) => {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const totalDives = entries.length;
  const totalTime = entries.reduce((acc, entry) => acc + entry.duration, 0);
  const maxDepth = Math.max(...entries.map(e => e.depth), 0);
  const uniqueSites = new Set(entries.map(e => e.site)).size;
  const totalSpecies = new Set(entries.flatMap(e => e.species || [])).size;
  const healthyCorals = entries.filter(e => e.coralHealth === 'healthy').length;

  const handleEntryClick = (id: string) => {
    if (variant === 'detailed') {
      setExpandedEntry(expandedEntry === id ? null : id);
    }
  };

  if (entries.length === 0) {
    return (
      <LogContainer>
        <EmptyState>
          <EmptyIcon>🤿</EmptyIcon>
          <Text variant="h5">ダイブログがまだありません</Text>
          <Text variant="body" color="secondary" style={{ marginTop: '8px' }}>
            最初のダイビング記録を追加して、海の思い出を残しましょう
          </Text>
          {editable && (
            <Button variant="primary" style={{ marginTop: '24px' }}>
              ダイブログを追加
            </Button>
          )}
        </EmptyState>
      </LogContainer>
    );
  }

  return (
    <LogContainer>
      {showStats && (
        <StatsContainer>
          <StatCard variant="gradient">
            <StatValue>{totalDives}</StatValue>
            <StatLabel>総ダイブ数</StatLabel>
          </StatCard>
          <StatCard variant="gradient">
            <StatValue>{Math.floor(totalTime / 60)}h</StatValue>
            <StatLabel>総潜水時間</StatLabel>
          </StatCard>
          <StatCard variant="gradient">
            <StatValue>{maxDepth}m</StatValue>
            <StatLabel>最大深度</StatLabel>
          </StatCard>
          <StatCard variant="gradient">
            <StatValue>{uniqueSites}</StatValue>
            <StatLabel>訪問サイト</StatLabel>
          </StatCard>
          <StatCard variant="gradient">
            <StatValue>{totalSpecies}</StatValue>
            <StatLabel>観察種数</StatLabel>
          </StatCard>
          <StatCard variant="gradient">
            <StatValue>{Math.round((healthyCorals / totalDives) * 100)}%</StatValue>
            <StatLabel>健康な珊瑚</StatLabel>
          </StatCard>
        </StatsContainer>
      )}

      <EntriesContainer variant={variant}>
        {entries.map((entry) => (
          <EntryCard 
            key={entry.id} 
            variant={variant}
            onClick={() => handleEntryClick(entry.id)}
          >
            <EntryHeader>
              <div>
                <EntryTitle>{entry.site}</EntryTitle>
                <EntryDate>{entry.date.toLocaleDateString('ja-JP')}</EntryDate>
              </div>
              {entry.certification && (
                <Badge variant="primary" size="small">
                  {entry.certification}
                </Badge>
              )}
            </EntryHeader>

            <EntryDetails>
              <DetailItem>
                <DetailIcon>🏊</DetailIcon>
                <DetailText>{entry.depth}m</DetailText>
              </DetailItem>
              <DetailItem>
                <DetailIcon>⏱️</DetailIcon>
                <DetailText>{entry.duration}分</DetailText>
              </DetailItem>
              <DetailItem>
                <DetailIcon>👁️</DetailIcon>
                <DetailText>透明度 {entry.visibility}m</DetailText>
              </DetailItem>
              <DetailItem>
                <DetailIcon>🌡️</DetailIcon>
                <DetailText>{entry.temperature}°C</DetailText>
              </DetailItem>
            </EntryDetails>

            {(variant === 'detailed' || expandedEntry === entry.id) && (
              <>
                {entry.buddy && (
                  <DetailItem style={{ marginBottom: '12px' }}>
                    <DetailIcon>👥</DetailIcon>
                    <DetailText>バディ: {entry.buddy}</DetailText>
                  </DetailItem>
                )}

                {entry.species && entry.species.length > 0 && (
                  <div>
                    <Text variant="caption" color="secondary">観察した生物:</Text>
                    <SpeciesList>
                      {entry.species.map((species, index) => (
                        <Badge key={index} variant="info" size="small">
                          {species}
                        </Badge>
                      ))}
                    </SpeciesList>
                  </div>
                )}

                {entry.coralHealth && (
                  <CoralHealthIndicator health={entry.coralHealth}>
                    {getCoralHealthIcon(entry.coralHealth)}
                    珊瑚の状態: {getCoralHealthText(entry.coralHealth)}
                  </CoralHealthIndicator>
                )}

                {entry.notes && (
                  <Text variant="body" color="secondary" style={{ marginTop: '12px' }}>
                    {entry.notes}
                  </Text>
                )}

                {entry.photos && entry.photos.length > 0 && (
                  <PhotoGrid>
                    {entry.photos.slice(0, 3).map((photo, index) => (
                      <Photo key={index} src={photo} alt={`Dive photo ${index + 1}`} />
                    ))}
                  </PhotoGrid>
                )}
              </>
            )}
          </EntryCard>
        ))}
      </EntriesContainer>

      {editable && (
        <AddEntryButton variant="primary">
          +
        </AddEntryButton>
      )}
    </LogContainer>
  );
};

export default DiveLog;