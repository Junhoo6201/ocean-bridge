import React from 'react';
import styled from 'styled-components';

interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  windSpeed: number;
  windDirection: string;
  waveHeight: number;
  visibility: number;
  uvIndex: number;
  humidity: number;
}

interface FerryStatus {
  route: string;
  status: 'operating' | 'cancelled' | 'delayed';
  message?: string;
}

interface WeatherWidgetProps {
  weatherData: WeatherData;
  ferryStatus?: FerryStatus[];
  variant?: 'compact' | 'detailed' | 'marine';
  showAlerts?: boolean;
  location?: string;
}

const WidgetContainer = styled.div<{ variant: string }>`
  background: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme, variant }) => 
    variant === 'compact' ? theme.spacing[4] : theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Location = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.large};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CurrentTime = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MainWeather = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const WeatherIcon = styled.div<{ condition: string }>`
  font-size: 64px;
  line-height: 1;
`;

const Temperature = styled.div`
  display: flex;
  flex-direction: column;
`;

const TempValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TempCondition = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: capitalize;
`;

const DetailsGrid = styled.div<{ variant: string }>`
  display: grid;
  grid-template-columns: ${({ variant }) => 
    variant === 'compact' ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(120px, 1fr))'};
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const DetailLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const DetailValue = styled.span<{ severity?: 'low' | 'medium' | 'high' }>`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme, severity }) => {
    if (severity === 'high') return theme.colors.semantic.emergency;
    if (severity === 'medium') return theme.colors.semantic.weather;
    return theme.colors.text.primary;
  }};
`;

const MarineConditions = styled.div`
  background: ${({ theme }) => theme.colors.brand.primary}10;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const MarineTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.brand.primary};
  margin: 0 0 ${({ theme }) => theme.spacing[3]} 0;
`;

const FerryStatusContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const FerryRoute = styled.div<{ status: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]} 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  }
`;

const RouteName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const RouteStatus = styled.span<{ status: string }>`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme, status }) => {
    if (status === 'operating') return theme.colors.semantic.success;
    if (status === 'delayed') return theme.colors.semantic.weather;
    return theme.colors.semantic.emergency;
  }};
`;

const Alert = styled.div<{ severity: 'info' | 'warning' | 'danger' }>`
  background: ${({ theme, severity }) => {
    if (severity === 'danger') return theme.colors.semantic.emergency + '20';
    if (severity === 'warning') return theme.colors.semantic.weather + '20';
    return theme.colors.brand.primary + '20';
  }};
  border-left: 4px solid ${({ theme, severity }) => {
    if (severity === 'danger') return theme.colors.semantic.emergency;
    if (severity === 'warning') return theme.colors.semantic.weather;
    return theme.colors.brand.primary;
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const AlertText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case 'sunny': return '☀️';
    case 'cloudy': return '☁️';
    case 'rainy': return '🌧️';
    case 'stormy': return '⛈️';
    default: return '🌤️';
  }
};

const getWaveSeverity = (height: number): 'low' | 'medium' | 'high' => {
  if (height >= 3) return 'high';
  if (height >= 2) return 'medium';
  return 'low';
};

const getWindSeverity = (speed: number): 'low' | 'medium' | 'high' => {
  if (speed >= 20) return 'high';
  if (speed >= 15) return 'medium';
  return 'low';
};

const getUVSeverity = (index: number): 'low' | 'medium' | 'high' => {
  if (index >= 8) return 'high';
  if (index >= 6) return 'medium';
  return 'low';
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  weatherData,
  ferryStatus = [],
  variant = 'detailed',
  showAlerts = true,
  location = 'Ishigaki',
}) => {
  const currentTime = new Date().toLocaleTimeString('ja-JP', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const shouldShowAlert = weatherData.waveHeight >= 2 || weatherData.windSpeed >= 15;
  const alertSeverity = weatherData.waveHeight >= 3 || weatherData.windSpeed >= 20 ? 'danger' : 'warning';

  return (
    <WidgetContainer variant={variant}>
      {showAlerts && shouldShowAlert && (
        <Alert severity={alertSeverity}>
          <AlertText>
            ⚠️ 海上条件注意: 波高 {weatherData.waveHeight}m, 風速 {weatherData.windSpeed}m/s
            {alertSeverity === 'danger' && ' - アクティビティ中止の可能性があります'}
          </AlertText>
        </Alert>
      )}

      <Header>
        <Location>{location}</Location>
        <CurrentTime>{currentTime}</CurrentTime>
      </Header>

      {variant !== 'compact' && (
        <MainWeather>
          <WeatherIcon condition={weatherData.condition}>
            {getWeatherIcon(weatherData.condition)}
          </WeatherIcon>
          <Temperature>
            <TempValue>{weatherData.temperature}°C</TempValue>
            <TempCondition>{weatherData.condition}</TempCondition>
          </Temperature>
        </MainWeather>
      )}

      <DetailsGrid variant={variant}>
        <DetailItem>
          <DetailLabel>風速</DetailLabel>
          <DetailValue severity={getWindSeverity(weatherData.windSpeed)}>
            {weatherData.windSpeed} m/s {weatherData.windDirection}
          </DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>波高</DetailLabel>
          <DetailValue severity={getWaveSeverity(weatherData.waveHeight)}>
            {weatherData.waveHeight} m
          </DetailValue>
        </DetailItem>
        {variant !== 'compact' && (
          <>
            <DetailItem>
              <DetailLabel>視界</DetailLabel>
              <DetailValue>{weatherData.visibility} km</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>UV指数</DetailLabel>
              <DetailValue severity={getUVSeverity(weatherData.uvIndex)}>
                {weatherData.uvIndex}
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>湿度</DetailLabel>
              <DetailValue>{weatherData.humidity}%</DetailValue>
            </DetailItem>
          </>
        )}
      </DetailsGrid>

      {variant === 'marine' && (
        <MarineConditions>
          <MarineTitle>🌊 海況情報</MarineTitle>
          <DetailsGrid variant="detailed">
            <DetailItem>
              <DetailLabel>透明度</DetailLabel>
              <DetailValue>15-20m</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>水温</DetailLabel>
              <DetailValue>26°C</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>潮流</DetailLabel>
              <DetailValue>弱</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>満潮</DetailLabel>
              <DetailValue>14:30</DetailValue>
            </DetailItem>
          </DetailsGrid>
        </MarineConditions>
      )}

      {ferryStatus.length > 0 && (
        <FerryStatusContainer>
          <MarineTitle>⛴️ フェリー運航状況</MarineTitle>
          {ferryStatus.map((ferry, index) => (
            <FerryRoute key={index} status={ferry.status}>
              <RouteName>{ferry.route}</RouteName>
              <RouteStatus status={ferry.status}>
                {ferry.status === 'operating' && '運航中'}
                {ferry.status === 'cancelled' && '欠航'}
                {ferry.status === 'delayed' && '遅延'}
              </RouteStatus>
            </FerryRoute>
          ))}
        </FerryStatusContainer>
      )}
    </WidgetContainer>
  );
};

export default WeatherWidget;