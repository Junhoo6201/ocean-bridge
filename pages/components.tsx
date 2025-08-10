import React, { useState, useCallback, useMemo } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Head from 'next/head';
import { theme } from '../src/theme/theme';
import { GlobalStyles } from '../src/theme/globalStyles';
import { Button, Card, Input, Badge, Text, Carousel, ImageCard, Navbar, Footer, Hero } from '../src/components';

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.primary};
`;

const ContentContainer = styled.div`
  padding: ${({ theme }) => theme.spacing[8]};
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
  display: block;
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
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: transform ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const FeatureCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  
  ul {
    margin: ${({ theme }) => theme.spacing[3]} 0;
    padding-left: ${({ theme }) => theme.spacing[5]};
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.small};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
    
    li {
      margin-bottom: ${({ theme }) => theme.spacing[2]};
    }
  }
`;

export default function ComponentsPage() {
  const [inputValue, setInputValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value);
  }, []);

  // Memoized carousel slides
  const carouselSlides = useMemo(() => [
    <Card key="1" variant="gradient">
      <Text variant="h4">Slide 1 - Accessible</Text>
      <Text variant="body" color="secondary">
        Full keyboard navigation with arrow keys, Home/End, and Space to pause auto-play.
      </Text>
    </Card>,
    <Card key="2" variant="gradient">
      <Text variant="h4">Slide 2 - Screen Reader Ready</Text>
      <Text variant="body" color="secondary">
        ARIA labels, live regions, and proper role descriptions for accessibility.
      </Text>
    </Card>,
    <Card key="3" variant="gradient">
      <Text variant="h4">Slide 3 - Performance Optimized</Text>
      <Text variant="body" color="secondary">
        React.memo, useCallback, and useMemo prevent unnecessary re-renders.
      </Text>
    </Card>,
  ], []);

  const multiItemCards = useMemo(() => {
    const unsplashImages = [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop'
    ];
    
    return unsplashImages.map((image, index) => (
      <ImageCard
        key={index + 1}
        variant="default"
        size="small"
        title={`Project ${index + 1}`}
        description="Multi-item carousel with optimized rendering"
        image={image}
        badge={`#${index + 1}`}
        badgeVariant="primary"
        hoverable
      />
    ));
  }, []);

  const galleryImages = useMemo(() => [
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1682687221038-404cb8830901?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1682687218904-de46ed992b58?w=1200&h=800&fit=crop',
  ], []);

  const navLinks = [
    { label: 'Home', href: '/', active: false },
    { label: 'Components', href: '/components', active: true },
    { label: 'Documentation', href: '#' },
    { label: 'Resources', href: '#' },
  ];

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Roadmap', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'Guides', href: '#' },
        { label: 'API Reference', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
        { label: 'License', href: '#' },
      ],
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Head>
        <title>Ocean - Linear Design System Components</title>
        <meta name="description" content="Accessible, performant, and beautiful React components" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <PageContainer>
        <Navbar 
          title="Ocean"
          links={navLinks}
          variant="blur"
          fixed
        />
        
        <Hero
          badge={{ text: '✨ New Components Added', variant: 'success' }}
          subtitle="Linear Design System"
          title="Build Beautiful, Accessible Interfaces"
          description="A comprehensive React component library with WCAG 2.1 AA compliance, performance optimizations, and modern design patterns."
          primaryAction={{ label: 'Get Started', onClick: () => {} }}
          secondaryAction={{ label: 'View on GitHub', onClick: () => {} }}
          backgroundImage="https://images.unsplash.com/photo-1557821552-17105176677c?w=1920&h=1080&fit=crop"
          backgroundOverlay={true}
          variant="centered"
          size="large"
        />

        <ContentContainer>
        <Header>
          <Text variant="h1">Linear Design System</Text>
          <Text variant="body" color="secondary">
            Complete component library with WCAG 2.1 AA compliance, full keyboard navigation, 
            screen reader support, and React performance optimizations.
          </Text>
        </Header>

        {/* Hero Sections */}
        <Section>
          <SectionTitle>Hero Sections - Multiple Styles</SectionTitle>
          
          <SpacedSection>
            <DemoLabel>Default Hero - Simple and Clean</DemoLabel>
            <Hero
              title="Welcome to Our Platform"
              description="A simple hero section with clean design, perfect for straightforward messaging."
              primaryAction={{ label: 'Get Started', onClick: () => {} }}
              variant="default"
              size="small"
            />
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Centered Hero with Background Image</DemoLabel>
            <Hero
              badge={{ text: 'New Release', variant: 'success' }}
              subtitle="Introducing v2.0"
              title="The Future is Here"
              description="Experience the next generation of our platform with powerful features and beautiful design."
              primaryAction={{ label: 'Try Now', onClick: () => {} }}
              secondaryAction={{ label: 'Learn More', onClick: () => {} }}
              backgroundImage="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop"
              backgroundOverlay={true}
              variant="centered"
              size="medium"
            />
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Split Hero with Side Image</DemoLabel>
            <Hero
              badge={{ text: 'Limited Offer', variant: 'warning' }}
              subtitle="Premium Features"
              title="Upgrade Your Experience"
              description="Unlock advanced features and take your productivity to the next level with our premium plan."
              primaryAction={{ label: 'Upgrade Now', onClick: () => {} }}
              secondaryAction={{ label: 'See Features', onClick: () => {} }}
              image="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop"
              variant="split"
              size="medium"
            />
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Gradient Hero with Floating Elements</DemoLabel>
            <Hero
              badge={{ text: 'Beta', variant: 'info' }}
              subtitle="Next Generation"
              title="AI-Powered Design System"
              description="Build faster with intelligent components that adapt to your needs."
              primaryAction={{ label: 'Start Building', onClick: () => {} }}
              secondaryAction={{ label: 'Watch Demo', onClick: () => {} }}
              variant="gradient"
              size="medium"
            />
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Full Height Hero with Video Background Feel</DemoLabel>
            <Hero
              badge={{ text: '🚀 Launch Week', variant: 'primary' }}
              subtitle="Transform Your Workflow"
              title="Everything You Need to Succeed"
              description="Join thousands of teams already using our platform to achieve their goals."
              primaryAction={{ label: 'Start Free Trial', onClick: () => {} }}
              secondaryAction={{ label: 'Book a Demo', onClick: () => {} }}
              backgroundImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop"
              backgroundOverlay={true}
              variant="centered"
              size="full"
            />
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Minimal Hero - Text Only</DemoLabel>
            <Hero
              title="Simple is Beautiful"
              description="Sometimes less is more. A minimal hero for when you want the message to be the focus."
              primaryAction={{ label: 'Explore', onClick: () => {} }}
              variant="default"
              size="small"
            />
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Product Launch Hero</DemoLabel>
            <Hero
              badge={{ text: 'New Product', variant: 'success' }}
              subtitle="Introducing Ocean Pro"
              title="Professional Tools for Professional Developers"
              description="Advanced features, enterprise security, and priority support. Everything you need to build at scale."
              primaryAction={{ label: 'Get Ocean Pro', onClick: () => {} }}
              secondaryAction={{ label: 'Compare Plans', onClick: () => {} }}
              backgroundImage="https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1920&h=1080&fit=crop"
              backgroundOverlay={true}
              variant="centered"
              size="large"
            />
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Event Hero with Countdown Feel</DemoLabel>
            <Hero
              badge={{ text: '🎉 Special Event', variant: 'primary' }}
              subtitle="December 25-27, 2024"
              title="Annual Developer Conference"
              description="Three days of learning, networking, and building the future together."
              primaryAction={{ label: 'Register Now', onClick: () => {} }}
              secondaryAction={{ label: 'View Schedule', onClick: () => {} }}
              image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop"
              variant="split"
              size="medium"
            />
          </SpacedSection>
        </Section>

        {/* Typography Section */}
        <Section>
          <SectionTitle>Typography</SectionTitle>
          <FlexColumn>
            <Text variant="h1">Heading 1 - Bold & Impactful</Text>
            <Text variant="h2">Heading 2 - Clear Hierarchy</Text>
            <Text variant="h3">Heading 3 - Section Headers</Text>
            <Text variant="h4">Heading 4 - Subsections</Text>
            <Text variant="h5">Heading 5 - Component Titles</Text>
            <Text variant="h6">Heading 6 - Small Headers</Text>
            <Text variant="body">Body text - Optimized for readability with proper line height and letter spacing.</Text>
            <Text variant="caption" color="secondary">Caption text - Perfect for supporting information and metadata</Text>
            <Text variant="overline" color="tertiary">OVERLINE TEXT - GREAT FOR LABELS</Text>
          </FlexColumn>
        </Section>

        {/* Buttons Section */}
        <Section>
          <SectionTitle>Buttons</SectionTitle>
          
          <SpacedSection>
            <DemoLabel>Variants with ARIA Support</DemoLabel>
            <FlexRow>
              <Button variant="primary" ariaLabel="Save document">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger" ariaLabel="Delete item">Danger</Button>
              <Button variant="success">Success</Button>
            </FlexRow>
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Sizes (Min 44px touch target)</DemoLabel>
            <FlexRow>
              <Button size="small">Small</Button>
              <Button size="medium">Medium</Button>
              <Button size="large">Large</Button>
            </FlexRow>
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>States & Loading</DemoLabel>
            <FlexRow>
              <Button loading ariaLabel="Processing request">Loading</Button>
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
                Clean and minimal design with subtle border. Perfect for content organization.
              </Text>
            </Card>

            <Card variant="elevated">
              <Text variant="h5">Elevated Card</Text>
              <Text variant="body" color="secondary">
                Raised appearance with shadow for visual hierarchy and depth.
              </Text>
            </Card>

            <Card variant="outlined">
              <Text variant="h5">Outlined Card</Text>
              <Text variant="body" color="secondary">
                Transparent background with strong border for subtle emphasis.
              </Text>
            </Card>

            <Card variant="gradient">
              <Text variant="h5">Gradient Card</Text>
              <Text variant="body" color="secondary">
                Beautiful gradient background with glassmorphism effect.
              </Text>
            </Card>

            <Card hoverable clickable>
              <Text variant="h5">Interactive Card</Text>
              <Text variant="body" color="secondary">
                Hover and click effects for interactive experiences. Smooth transitions included.
              </Text>
            </Card>

            <Card variant="elevated">
              <Text variant="h5">Card with Actions</Text>
              <Text variant="body" color="secondary">
                Cards can contain any content including buttons and other components.
              </Text>
              <FlexRow style={{ marginTop: '16px' }}>
                <Button size="small" variant="primary">Action</Button>
                <Button size="small" variant="ghost">Cancel</Button>
              </FlexRow>
            </Card>
          </ComponentGrid>
        </Section>

        {/* Inputs Section */}
        <Section>
          <SectionTitle>Form Inputs</SectionTitle>
          
          <ComponentGrid>
            <ComponentDemo>
              <Input
                variant="default"
                label="Username"
                placeholder="Enter username..."
                value={inputValue}
                onChange={handleInputChange}
                helperText="3-20 characters, alphanumeric only"
                fullWidth
              />

              <Input
                variant="filled"
                label="Filled Input"
                placeholder="Filled background style"
                icon={<span>🔍</span>}
                fullWidth
              />

              <Input
                variant="ghost"
                label="Ghost Input"
                placeholder="Minimal style input"
                fullWidth
              />
            </ComponentDemo>

            <ComponentDemo>
              <Input
                size="small"
                label="Small Input"
                placeholder="Compact size"
                fullWidth
              />

              <Input
                size="medium"
                label="Medium Input"
                placeholder="Default size"
                fullWidth
              />

              <Input
                size="large"
                label="Large Input"
                placeholder="Large size"
                fullWidth
              />
            </ComponentDemo>

            <ComponentDemo>
              <Input
                type="email"
                label="Email Address"
                placeholder="email@example.com"
                value={emailValue}
                onChange={handleEmailChange}
                icon={<span>✉️</span>}
                required
                fullWidth
              />

              <Input
                type="password"
                label="Password"
                placeholder="Enter secure password"
                value={passwordValue}
                onChange={handlePasswordChange}
                icon={<span>🔒</span>}
                iconPosition="right"
                fullWidth
              />

              <Input
                error
                label="Error State"
                placeholder="This field has an error"
                errorMessage="Please correct this field"
                fullWidth
              />

              <Input
                disabled
                label="Disabled Input"
                placeholder="Cannot be edited"
                fullWidth
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
            <DemoLabel>With Status Dot</DemoLabel>
            <FlexRow>
              <Badge variant="primary" dot>Active</Badge>
              <Badge variant="success" dot>Online</Badge>
              <Badge variant="warning" dot>Away</Badge>
              <Badge variant="error" dot>Busy</Badge>
              <Badge variant="info" dot>In Meeting</Badge>
            </FlexRow>
          </SpacedSection>
        </Section>

        {/* Image Cards Section */}
        <Section>
          <SectionTitle>Image Cards</SectionTitle>
          
          <ComponentGrid>
            <ImageCard
              variant="default"
              title="Beautiful Landscapes"
              description="Stunning mountain views and natural wonders captured in high resolution."
              image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
              badge="Featured"
              badgeVariant="primary"
              hoverable
              clickable
              footer={
                <FlexRow>
                  <Text variant="caption" color="secondary">2 hours ago</Text>
                  <Button size="small" variant="ghost">View</Button>
                </FlexRow>
              }
            />

            <ImageCard
              variant="overlay"
              title="Overlay Style Card"
              description="Content beautifully overlaid on the image with gradient for readability."
              image="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop"
              badge="New"
              badgeVariant="success"
              hoverable
              footer={
                <FlexRow>
                  <Text variant="caption" color="secondary">5 min read</Text>
                  <Badge variant="info" size="small">Tech</Badge>
                </FlexRow>
              }
            />

            <ImageCard
              variant="horizontal"
              size="small"
              title="Horizontal Layout"
              description="Perfect for lists and compact displays with side-by-side layout."
              image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop"
              badge="Popular"
              badgeVariant="warning"
              hoverable
            />

            <ImageCard
              variant="minimal"
              title="Minimal Design"
              description="Clean and simple with focus on content."
              image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop"
              badge="Code"
              hoverable
            />
          </ComponentGrid>

          <SpacedSection>
            <DemoLabel>Bottom Image Layout</DemoLabel>
            <ComponentGrid>
              <ImageCard
                variant="bottom"
                title="Bottom Image Card"
                description="Perfect for blog posts and articles where content comes first."
                image="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop"
                badge="Article"
                badgeVariant="info"
                hoverable
                footer={
                  <FlexRow>
                    <Text variant="caption" color="secondary">5 min read</Text>
                    <Text variant="caption" color="secondary">Dec 15, 2024</Text>
                  </FlexRow>
                }
              />

              <ImageCard
                variant="bottom"
                title="News Update"
                description="Stay informed with the latest technology trends and industry news."
                image="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=400&fit=crop"
                badge="Breaking"
                badgeVariant="error"
                hoverable
              />

              <ImageCard
                variant="bottom"
                title="Tutorial Guide"
                description="Step-by-step instructions to master new techniques."
                image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"
                badge="Tutorial"
                badgeVariant="success"
                hoverable
              />
            </ComponentGrid>
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Tagged Image Cards</DemoLabel>
            <ComponentGrid>
              <ImageCard
                variant="tagged"
                title="Photography Workshop"
                description="Master the art of landscape photography with expert guidance."
                image="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop"
                tags={[
                  { label: 'Photography', color: theme.colors.semantic.info + '20' },
                  { label: 'Workshop', color: theme.colors.semantic.success + '20' },
                  { label: 'Outdoor', color: theme.colors.semantic.warning + '20' },
                ]}
                hoverable
                clickable
              />

              <ImageCard
                variant="default"
                title="Tech Conference 2024"
                description="Join industry leaders for three days of innovation and networking."
                image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop"
                badge="Event"
                badgeVariant="primary"
                tags={[
                  { label: 'Technology' },
                  { label: 'AI/ML' },
                  { label: 'Cloud Computing' },
                  { label: 'Web3' },
                ]}
                hoverable
              />

              <ImageCard
                variant="overlay"
                title="Design System Workshop"
                description="Build scalable and maintainable design systems from scratch."
                image="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop"
                tags={[
                  { label: 'Design', color: theme.colors.brand.primary + '30' },
                  { label: 'UI/UX', color: theme.colors.brand.secondary + '30' },
                  { label: 'Figma', color: theme.colors.semantic.orange + '30' },
                ]}
                hoverable
                footer={
                  <FlexRow>
                    <Text variant="caption">Advanced Level</Text>
                    <Badge variant="warning" size="small">$299</Badge>
                  </FlexRow>
                }
              />
            </ComponentGrid>
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Mixed Layout Examples</DemoLabel>
            <ComponentGrid>
              <ImageCard
                variant="horizontal"
                size="small"
                title="Podcast Episode"
                description="Deep dive into modern web development practices."
                image="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop"
                tags={[
                  { label: 'Audio' },
                  { label: '45 min' },
                ]}
                hoverable
              />

              <ImageCard
                variant="bottom"
                size="small"
                title="Recipe of the Day"
                description="Delicious and healthy meal prep ideas."
                image="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"
                tags={[
                  { label: 'Healthy' },
                  { label: 'Quick' },
                  { label: 'Vegetarian' },
                ]}
                badge="New"
                badgeVariant="success"
                hoverable
              />

              <ImageCard
                variant="tagged"
                size="small"
                title="Travel Destination"
                description="Explore hidden gems around the world."
                image="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop"
                tags={[
                  { label: 'Adventure', color: theme.colors.semantic.error + '20' },
                  { label: 'Budget', color: theme.colors.semantic.success + '20' },
                ]}
                hoverable
              />
            </ComponentGrid>
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Aspect Ratio Options</DemoLabel>
            <ComponentGrid>
              <ImageCard
                variant="default"
                aspectRatio="1:1"
                title="Square Ratio"
                description="Perfect for avatars and thumbnails"
                image="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=800&h=800&fit=crop"
                hoverable
              />
              
              <ImageCard
                variant="default"
                aspectRatio="4:3"
                title="Classic Ratio"
                description="Traditional photo aspect ratio"
                image="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop"
                hoverable
              />
              
              <ImageCard
                variant="default"
                aspectRatio="21:9"
                title="Cinematic Ratio"
                description="Ultra-wide for dramatic effect"
                image="https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=1200&h=514&fit=crop"
                hoverable
              />
            </ComponentGrid>
          </SpacedSection>
        </Section>

        {/* Carousel Section */}
        <Section>
          <SectionTitle>Carousel</SectionTitle>
          
          <SpacedSection>
            <DemoLabel>Auto-playing Single Item Carousel</DemoLabel>
            <Carousel
              autoPlay
              autoPlayInterval={3000}
              infinite
              showIndicators
              showArrows
              ariaLabel="Feature carousel"
              ariaRoleDescription="carousel"
            >
              {carouselSlides}
            </Carousel>
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Small Cards Carousel (4 items visible)</DemoLabel>
            <Carousel
              slidesToShow={4}
              slidesToScroll={2}
              showArrows
              gap="16px"
              ariaLabel="Small cards showcase"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <Card key={num} variant="elevated">
                  <Text variant="h6">Card {num}</Text>
                  <Text variant="caption" color="secondary">
                    Compact card layout
                  </Text>
                  <Badge variant="primary" size="small">New</Badge>
                </Card>
              ))}
            </Carousel>
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Medium Cards Carousel (3 items visible)</DemoLabel>
            <Carousel
              slidesToShow={3}
              slidesToScroll={1}
              showArrows
              gap="24px"
              ariaLabel="Project showcase"
            >
              {multiItemCards}
            </Carousel>
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Large Cards Carousel (2 items visible)</DemoLabel>
            <Carousel
              slidesToShow={2}
              slidesToScroll={1}
              showArrows
              showIndicators
              gap="32px"
              ariaLabel="Large cards showcase"
            >
              {[
                {
                  title: 'Modern Architecture',
                  image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
                  description: 'Stunning architectural design with clean lines and modern aesthetics for contemporary spaces.'
                },
                {
                  title: 'Digital Innovation',
                  image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
                  description: 'Cutting-edge technology solutions that transform business processes and user experiences.'
                },
                {
                  title: 'Creative Studio',
                  image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
                  description: 'Professional creative workspace designed for collaboration and innovative thinking.'
                },
                {
                  title: 'Tech Conference',
                  image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop',
                  description: 'Industry-leading conference bringing together experts and innovators from around the world.'
                },
                {
                  title: 'Data Analytics',
                  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
                  description: 'Advanced data visualization and analytics platform for informed decision making.'
                },
                {
                  title: 'Cloud Infrastructure',
                  image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop',
                  description: 'Scalable cloud solutions with enterprise-grade security and performance optimization.'
                }
              ].map((project, index) => (
                <ImageCard
                  key={index}
                  variant="overlay"
                  size="large"
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  badge="Premium"
                  badgeVariant="warning"
                  hoverable
                  footer={
                    <FlexRow>
                      <Text variant="caption" color="secondary">By Ocean Team</Text>
                      <Button size="small" variant="primary">Explore</Button>
                    </FlexRow>
                  }
                />
              ))}
            </Carousel>
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Testimonial Carousel</DemoLabel>
            <Carousel
              slidesToShow={1}
              showIndicators
              autoPlay
              autoPlayInterval={5000}
              infinite
              ariaLabel="Testimonials"
            >
              {[
                { name: 'Sarah Chen', role: 'Frontend Developer', company: 'TechCorp' },
                { name: 'Mike Johnson', role: 'Design Lead', company: 'StartupXYZ' },
                { name: 'Emma Wilson', role: 'Product Manager', company: 'InnovateCo' },
              ].map((testimonial, index) => (
                <Card key={index} variant="gradient" style={{ padding: '48px' }}>
                  <Text variant="h4" style={{ marginBottom: '24px' }}>
                    "Ocean's design system has transformed how we build interfaces. The accessibility features and performance optimizations are world-class."
                  </Text>
                  <FlexRow style={{ gap: '16px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      borderRadius: '50%', 
                      background: theme.colors.gradients[index % 3],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <Text variant="h6">{testimonial.name}</Text>
                      <Text variant="caption" color="secondary">
                        {testimonial.role} at {testimonial.company}
                      </Text>
                    </div>
                  </FlexRow>
                </Card>
              ))}
            </Carousel>
          </SpacedSection>

          <SpacedSection>
            <DemoLabel>Image Gallery</DemoLabel>
            <Carousel
              slidesToShow={1}
              showIndicators
              showArrows
              infinite
              ariaLabel="Image gallery"
            >
              {galleryImages.map((image, index) => (
                <div key={index} style={{ 
                  width: '100%', 
                  height: '400px',
                  borderRadius: theme.borderRadius.xl,
                  overflow: 'hidden'
                }}>
                  <img 
                    src={image} 
                    alt={`Gallery image ${index + 1}`}
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

        {/* Accessibility Features */}
        <Section>
          <SectionTitle>Accessibility & Performance Features</SectionTitle>
          <ComponentGrid>
            <FeatureCard variant="elevated">
              <Text variant="h5">✅ WCAG 2.1 AA</Text>
              <ul>
                <li>Proper ARIA labels and roles</li>
                <li>3px focus indicators</li>
                <li>44x44px minimum touch targets</li>
                <li>Color contrast compliance</li>
              </ul>
            </FeatureCard>

            <FeatureCard variant="elevated">
              <Text variant="h5">⌨️ Keyboard Support</Text>
              <ul>
                <li>Tab navigation everywhere</li>
                <li>Arrow keys in carousels</li>
                <li>Space/Enter activation</li>
                <li>Escape key support</li>
              </ul>
            </FeatureCard>

            <FeatureCard variant="elevated">
              <Text variant="h5">🎯 React Optimized</Text>
              <ul>
                <li>React.memo components</li>
                <li>useCallback hooks</li>
                <li>useMemo for computations</li>
                <li>Code splitting</li>
              </ul>
            </FeatureCard>

            <FeatureCard variant="elevated">
              <Text variant="h5">🚀 Next.js Ready</Text>
              <ul>
                <li>Server-side rendering</li>
                <li>Styled-components SSR</li>
                <li>Image optimization</li>
                <li>Bundle optimization</li>
              </ul>
            </FeatureCard>

            <FeatureCard variant="elevated">
              <Text variant="h5">📱 Responsive</Text>
              <ul>
                <li>Mobile-first design</li>
                <li>Touch-friendly</li>
                <li>Reduced motion support</li>
                <li>High contrast ready</li>
              </ul>
            </FeatureCard>

            <FeatureCard variant="elevated">
              <Text variant="h5">🔐 Supabase</Text>
              <ul>
                <li>Auth integration ready</li>
                <li>Real-time support</li>
                <li>Type-safe queries</li>
                <li>Row-level security</li>
              </ul>
            </FeatureCard>
          </ComponentGrid>
        </Section>

        {/* Color Palette */}
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
        </ContentContainer>

        <Footer
          sections={footerSections}
          description="Ocean Design System - Building the future of web interfaces with accessibility and performance at its core."
        />
      </PageContainer>
    </ThemeProvider>
  );
}