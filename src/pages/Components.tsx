import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from '../theme/theme';
import { GlobalStyles } from '../theme/globalStyles';
import { Button, Card, Input, Badge, Text, Carousel, ImageCard } from '../components';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing[8]};
  background: ${({ theme }) => theme.colors.background.primary};
`;

const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing[12]};
  padding-bottom: ${({ theme }) => theme.spacing[8]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing[16]};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const ComponentDemo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const DemoLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const FlexRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
  flex-wrap: wrap;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const SpacedSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const Components: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <PageContainer>
        <Header>
          <Text variant="h1">Linear Design System</Text>
          <Text variant="body" color="secondary">
            컴포넌트 라이브러리 데모 페이지
          </Text>
        </Header>

        {/* Typography Section */}
        <Section>
          <SectionTitle>Typography</SectionTitle>
          <FlexColumn>
            <Text variant="h1">Heading 1</Text>
            <Text variant="h2">Heading 2</Text>
            <Text variant="h3">Heading 3</Text>
            <Text variant="h4">Heading 4</Text>
            <Text variant="h5">Heading 5</Text>
            <Text variant="h6">Heading 6</Text>
            <Text variant="body">Body text - 기본 본문 텍스트입니다.</Text>
            <Text variant="caption" color="secondary">Caption text - 작은 설명 텍스트</Text>
            <Text variant="overline" color="tertiary">Overline Text</Text>
          </FlexColumn>
        </Section>

        {/* Buttons Section */}
        <Section>
          <SectionTitle>Buttons</SectionTitle>
          
          <SpacedSection>
            <DemoLabel>Variants</DemoLabel>
            <FlexRow>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="success">Success</Button>
            </FlexRow>
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Sizes</DemoLabel>
            <FlexRow>
              <Button size="small">Small</Button>
              <Button size="medium">Medium</Button>
              <Button size="large">Large</Button>
            </FlexRow>
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>States</DemoLabel>
            <FlexRow>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button fullWidth>Full Width</Button>
            </FlexRow>
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>With Icons</DemoLabel>
            <FlexRow>
              <Button icon={<span>🚀</span>}>Launch</Button>
              <Button icon={<span>⚙️</span>} iconPosition="right">Settings</Button>
              <Button variant="ghost" icon={<span>✨</span>}>Magic</Button>
            </FlexRow>
          </SpacedSection>
        </Section>

        {/* Cards Section */}
        <Section>
          <SectionTitle>Cards</SectionTitle>
          <ComponentGrid>
            <Card variant="default">
              <Text variant="h5">Default Card</Text>
              <Text variant="body" color="secondary">
                기본 카드 컴포넌트입니다. 콘텐츠를 담기 위한 컨테이너로 사용됩니다.
              </Text>
            </Card>

            <Card variant="elevated">
              <Text variant="h5">Elevated Card</Text>
              <Text variant="body" color="secondary">
                그림자가 있는 카드입니다. 다른 요소들보다 떠있는 느낌을 줍니다.
              </Text>
            </Card>

            <Card variant="outlined">
              <Text variant="h5">Outlined Card</Text>
              <Text variant="body" color="secondary">
                테두리만 있는 투명한 카드입니다.
              </Text>
            </Card>

            <Card variant="gradient">
              <Text variant="h5">Gradient Card</Text>
              <Text variant="body" color="secondary">
                그라디언트 배경을 가진 특별한 카드입니다.
              </Text>
            </Card>

            <Card hoverable clickable>
              <Text variant="h5">Interactive Card</Text>
              <Text variant="body" color="secondary">
                호버와 클릭 효과가 있는 인터랙티브 카드입니다.
              </Text>
            </Card>
          </ComponentGrid>
        </Section>

        {/* Inputs Section */}
        <Section>
          <SectionTitle>Inputs</SectionTitle>
          
          <ComponentGrid>
            <ComponentDemo>
              <Input
                variant="default"
                label="Default Input"
                placeholder="Enter text..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                helperText="This is a helper text"
              />

              <Input
                variant="filled"
                label="Filled Input"
                placeholder="Filled variant"
                icon={<span>🔍</span>}
              />

              <Input
                variant="ghost"
                label="Ghost Input"
                placeholder="Ghost variant"
              />
            </ComponentDemo>

            <ComponentDemo>
              <Input
                size="small"
                label="Small Input"
                placeholder="Small size"
              />

              <Input
                size="medium"
                label="Medium Input"
                placeholder="Medium size"
              />

              <Input
                size="large"
                label="Large Input"
                placeholder="Large size"
              />
            </ComponentDemo>

            <ComponentDemo>
              <Input
                type="email"
                label="Email"
                placeholder="email@example.com"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                icon={<span>✉️</span>}
              />

              <Input
                type="password"
                label="Password"
                placeholder="Enter password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                icon={<span>🔒</span>}
                iconPosition="right"
              />

              <Input
                error
                label="Error Input"
                placeholder="Error state"
                errorMessage="This field has an error"
              />

              <Input
                disabled
                label="Disabled Input"
                placeholder="Disabled state"
              />
            </ComponentDemo>
          </ComponentGrid>
        </Section>

        {/* Badges Section */}
        <Section>
          <SectionTitle>Badges</SectionTitle>
          
          <SpacedSection>
            <DemoLabel>Variants</DemoLabel>
            <FlexRow>
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
            </FlexRow>
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Sizes</DemoLabel>
            <FlexRow>
              <Badge size="small">Small</Badge>
              <Badge size="medium">Medium</Badge>
              <Badge size="large">Large</Badge>
            </FlexRow>
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>With Dot</DemoLabel>
            <FlexRow>
              <Badge variant="primary" dot>Active</Badge>
              <Badge variant="success" dot>Online</Badge>
              <Badge variant="warning" dot>Away</Badge>
              <Badge variant="error" dot>Busy</Badge>
            </FlexRow>
          </SpacedSection>
        </Section>

        {/* Image Cards Section */}
        <Section>
          <SectionTitle>Image Cards</SectionTitle>
          
          <ComponentGrid>
            <ImageCard
              variant="default"
              title="Default Image Card"
              description="Beautiful landscape photography showcasing nature's wonders. This card displays content below the image."
              image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
              badge="Featured"
              badgeVariant="primary"
              hoverable
              clickable
              footer={
                <FlexRow>
                  <Text variant="caption" color="secondary">2 hours ago</Text>
                  <Button size="small" variant="ghost">View More</Button>
                </FlexRow>
              }
            />

            <ImageCard
              variant="overlay"
              title="Overlay Image Card"
              description="Content overlays on the image with a gradient background for better readability."
              image="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800"
              badge="New"
              badgeVariant="success"
              hoverable
              footer={
                <FlexRow>
                  <Text variant="caption" color="secondary">5 min read</Text>
                  <Badge variant="info" size="small">Technology</Badge>
                </FlexRow>
              }
            />

            <ImageCard
              variant="horizontal"
              size="small"
              title="Horizontal Layout"
              description="Image on the left, content on the right. Perfect for list views."
              image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"
              badge="Popular"
              badgeVariant="warning"
              hoverable
            />

            <ImageCard
              variant="minimal"
              title="Minimal Card"
              description="Simple and clean design with minimal padding."
              image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800"
              badge="Code"
              hoverable
            />
          </ComponentGrid>

          <SpacedSection>
            <DemoLabel>Different Aspect Ratios</DemoLabel>
            <ComponentGrid>
              <ImageCard
                variant="default"
                aspectRatio="1:1"
                title="Square (1:1)"
                description="Perfect for profile pictures or thumbnails"
                image="https://images.unsplash.com/photo-1517180102446-f3746b9a7137?w=800"
                hoverable
              />
              
              <ImageCard
                variant="default"
                aspectRatio="4:3"
                title="Standard (4:3)"
                description="Classic aspect ratio for photos"
                image="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800"
                hoverable
              />
              
              <ImageCard
                variant="default"
                aspectRatio="21:9"
                title="Ultrawide (21:9)"
                description="Cinematic aspect ratio"
                image="https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800"
                hoverable
              />
            </ComponentGrid>
          </SpacedSection>
        </Section>

        {/* Carousel Section */}
        <Section>
          <SectionTitle>Carousel</SectionTitle>
          
          <SpacedSection>
            <DemoLabel>Single Item Carousel with Auto-play</DemoLabel>
            <Carousel
              autoPlay
              autoPlayInterval={3000}
              infinite
              showIndicators
              showArrows
            >
              <Card variant="gradient">
                <Text variant="h4">Slide 1</Text>
                <Text variant="body" color="secondary">
                  Carousel with automatic playback, infinite loop, and smooth transitions.
                </Text>
              </Card>
              <Card variant="gradient">
                <Text variant="h4">Slide 2</Text>
                <Text variant="body" color="secondary">
                  Navigate using arrows or indicators. Auto-play pauses on hover.
                </Text>
              </Card>
              <Card variant="gradient">
                <Text variant="h4">Slide 3</Text>
                <Text variant="body" color="secondary">
                  Fully responsive and touch-friendly carousel component.
                </Text>
              </Card>
            </Carousel>
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Multi-item Carousel</DemoLabel>
            <Carousel
              slidesToShow={3}
              slidesToScroll={1}
              showArrows
              gap="24px"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <ImageCard
                  key={num}
                  variant="default"
                  size="small"
                  title={`Project ${num}`}
                  description="Multi-item carousel showing multiple cards at once"
                  image={`https://images.unsplash.com/photo-${1550000000000 + num * 1000000}?w=400`}
                  badge={`#${num}`}
                  badgeVariant="primary"
                  hoverable
                />
              ))}
            </Carousel>
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Image Gallery Carousel</DemoLabel>
            <Carousel
              slidesToShow={1}
              showIndicators
              showArrows
              infinite
            >
              {[
                'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200',
                'https://images.unsplash.com/photo-1682687221038-404cb8830901?w=1200',
                'https://images.unsplash.com/photo-1682687218904-de46ed992b58?w=1200',
              ].map((image, index) => (
                <div key={index} style={{ 
                  width: '100%', 
                  height: '400px',
                  borderRadius: theme.borderRadius.xl,
                  overflow: 'hidden'
                }}>
                  <img 
                    src={image} 
                    alt={`Gallery ${index + 1}`}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                </div>
              ))}
            </Carousel>
          </SpacedSection>
        </Section>

        {/* Color Palette Section */}
        <Section>
          <SectionTitle>Color Palette</SectionTitle>
          
          <SpacedSection>
            <DemoLabel>Brand Colors</DemoLabel>
            <FlexRow>
              <ColorBox color={theme.colors.brand.primary}>Primary</ColorBox>
              <ColorBox color={theme.colors.brand.secondary}>Secondary</ColorBox>
              <ColorBox color={theme.colors.brand.plan}>Plan</ColorBox>
              <ColorBox color={theme.colors.brand.build}>Build</ColorBox>
              <ColorBox color={theme.colors.brand.security}>Security</ColorBox>
            </FlexRow>
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Semantic Colors</DemoLabel>
            <FlexRow>
              <ColorBox color={theme.colors.semantic.success}>Success</ColorBox>
              <ColorBox color={theme.colors.semantic.error}>Error</ColorBox>
              <ColorBox color={theme.colors.semantic.warning}>Warning</ColorBox>
              <ColorBox color={theme.colors.semantic.info}>Info</ColorBox>
              <ColorBox color={theme.colors.semantic.orange}>Orange</ColorBox>
            </FlexRow>
          </SpacedSection>
        </Section>
      </PageContainer>
    </ThemeProvider>
  );
};

const ColorBox = styled.div<{ color: string }>`
  width: 100px;
  height: 100px;
  background: ${({ color }) => color};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: flex-end;
  padding: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.neutral.white};
  font-size: ${({ theme }) => theme.typography.fontSize.micro};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;