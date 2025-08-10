import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';
import { Text } from '../Text/Text';

interface BookingStep {
  id: string;
  title: string;
  titleJa?: string;
  description?: string;
  icon?: string;
}

interface BookingDetails {
  activity: string;
  date: Date;
  participants: number;
  pickupLocation?: string;
  specialRequests?: string;
  price?: string;
}

interface BookingFlowProps {
  steps?: BookingStep[];
  currentStep?: number;
  bookingDetails?: Partial<BookingDetails>;
  onStepChange?: (step: number) => void;
  onBookingSubmit?: (details: BookingDetails) => void;
  variant?: 'default' | 'compact' | 'timeline';
  showProgress?: boolean;
}

const FlowContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const ProgressBar = styled.div`
  position: relative;
  height: 4px;
  background: ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: ${({ theme }) => theme.colors.brand.primary};
  transition: width ${({ theme }) => theme.animation.duration.slow} ${({ theme }) => theme.animation.easing.easeOut};
`;

const StepsContainer = styled.div<{ variant: string }>`
  display: ${({ variant }) => variant === 'timeline' ? 'block' : 'flex'};
  ${({ variant }) => variant !== 'timeline' && `
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
  `}
`;

const Step = styled.div<{ active: boolean; completed: boolean; variant: string }>`
  display: flex;
  align-items: ${({ variant }) => variant === 'timeline' ? 'flex-start' : 'center'};
  gap: ${({ theme }) => theme.spacing[3]};
  ${({ variant }) => variant === 'timeline' && `
    margin-bottom: 24px;
    position: relative;
    padding-left: 48px;
  `}
  opacity: ${({ active, completed }) => active || completed ? 1 : 0.5};
  cursor: ${({ completed }) => completed ? 'pointer' : 'default'};
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};

  &:hover {
    ${({ completed }) => completed && 'opacity: 0.8;'}
  }
`;

const StepIndicator = styled.div<{ active: boolean; completed: boolean; variant: string }>`
  ${({ variant }) => variant === 'timeline' && `
    position: absolute;
    left: 0;
  `}
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  background: ${({ theme, active, completed }) => 
    completed ? theme.colors.semantic.success :
    active ? theme.colors.brand.primary :
    theme.colors.background.secondary};
  border: 2px solid ${({ theme, active, completed }) => 
    completed ? theme.colors.semantic.success :
    active ? theme.colors.brand.primary :
    theme.colors.border.default};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme, active, completed }) => 
    active || completed ? theme.colors.neutral.white : theme.colors.text.secondary};
  flex-shrink: 0;
`;

const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const StepTitle = styled.span<{ active: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme, active }) => 
    active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.regular};
  color: ${({ theme, active }) => 
    active ? theme.colors.text.primary : theme.colors.text.secondary};
`;

const StepDescription = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const TimelineLine = styled.div`
  position: absolute;
  left: 16px;
  top: 40px;
  bottom: -24px;
  width: 2px;
  background: ${({ theme }) => theme.colors.border.subtle};
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
  margin-top: ${({ theme }) => theme.spacing[8]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background: ${({ theme }) => theme.colors.background.primary};
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.brand.primary}20;
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background: ${({ theme }) => theme.colors.background.primary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.brand.primary}20;
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  background: ${({ theme }) => theme.colors.background.primary};
  min-height: 100px;
  resize: vertical;
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.brand.primary}20;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[6]};
`;

const SummaryCard = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[6]};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]} 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  }
`;

const SummaryLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SummaryValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const defaultSteps: BookingStep[] = [
  { id: 'select', title: 'アクティビティ選択', titleJa: 'Select Activity', icon: '🎯' },
  { id: 'details', title: '詳細入力', titleJa: 'Enter Details', icon: '📝' },
  { id: 'confirm', title: '確認', titleJa: 'Confirm', icon: '✅' },
  { id: 'payment', title: '支払い', titleJa: 'Payment', icon: '💳' },
];

export const BookingFlow: React.FC<BookingFlowProps> = ({
  steps = defaultSteps,
  currentStep = 0,
  bookingDetails = {},
  onStepChange,
  onBookingSubmit,
  variant = 'default',
  showProgress = true,
}) => {
  const [formData, setFormData] = useState<Partial<BookingDetails>>(bookingDetails);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleStepClick = (index: number) => {
    if (index < currentStep) {
      onStepChange?.(index);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      onStepChange?.(currentStep + 1);
    } else {
      onBookingSubmit?.(formData as BookingDetails);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange?.(currentStep - 1);
    }
  };

  const renderFormContent = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case 'select':
        return (
          <FormSection>
            <FormGroup>
              <Label>アクティビティを選択</Label>
              <Select 
                value={formData.activity || ''}
                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
              >
                <option value="">選択してください</option>
                <option value="diving">ダイビング</option>
                <option value="snorkeling">スノーケリング</option>
                <option value="kayak">カヤック</option>
                <option value="trekking">トレッキング</option>
              </Select>
            </FormGroup>
          </FormSection>
        );
      
      case 'details':
        return (
          <FormSection>
            <FormGroup>
              <Label>希望日</Label>
              <Input 
                type="date" 
                value={formData.date ? formData.date.toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
              />
            </FormGroup>
            <FormGroup>
              <Label>参加人数</Label>
              <Select 
                value={formData.participants || 1}
                onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) })}
              >
                {[1,2,3,4,5,6,7,8].map(n => (
                  <option key={n} value={n}>{n}名</option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>ピックアップ場所</Label>
              <Input 
                type="text" 
                placeholder="ホテル名など"
                value={formData.pickupLocation || ''}
                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label>特別なリクエスト（任意）</Label>
              <TextArea 
                placeholder="アレルギー、初心者など"
                value={formData.specialRequests || ''}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              />
            </FormGroup>
          </FormSection>
        );
      
      case 'confirm':
        return (
          <SummaryCard>
            <Text variant="h6" style={{ marginBottom: '16px' }}>予約内容の確認</Text>
            <SummaryRow>
              <SummaryLabel>アクティビティ</SummaryLabel>
              <SummaryValue>{formData.activity}</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>日付</SummaryLabel>
              <SummaryValue>{formData.date?.toLocaleDateString('ja-JP')}</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>人数</SummaryLabel>
              <SummaryValue>{formData.participants}名</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>ピックアップ</SummaryLabel>
              <SummaryValue>{formData.pickupLocation || '指定なし'}</SummaryValue>
            </SummaryRow>
            {formData.specialRequests && (
              <SummaryRow>
                <SummaryLabel>リクエスト</SummaryLabel>
                <SummaryValue>{formData.specialRequests}</SummaryValue>
              </SummaryRow>
            )}
            <SummaryRow>
              <SummaryLabel>料金</SummaryLabel>
              <SummaryValue style={{ fontSize: '20px', color: '#00B8D4' }}>
                ¥{((formData.participants || 1) * 12000).toLocaleString()}
              </SummaryValue>
            </SummaryRow>
          </SummaryCard>
        );
      
      case 'payment':
        return (
          <FormSection>
            <Badge variant="success" size="large">
              カカオトークでお支払いリンクをお送りします
            </Badge>
            <Text variant="body" color="secondary">
              予約確定後、カカオトークで決済リンクをお送りします。
              クレジットカードまたはPayPayでお支払いいただけます。
            </Text>
          </FormSection>
        );
      
      default:
        return null;
    }
  };

  return (
    <FlowContainer>
      {showProgress && (
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
      )}

      <StepsContainer variant={variant}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {variant === 'timeline' && index > 0 && <TimelineLine />}
            <Step 
              active={index === currentStep}
              completed={index < currentStep}
              variant={variant}
              onClick={() => handleStepClick(index)}
            >
              <StepIndicator 
                active={index === currentStep}
                completed={index < currentStep}
                variant={variant}
              >
                {index < currentStep ? '✓' : step.icon || (index + 1)}
              </StepIndicator>
              <StepContent>
                <StepTitle active={index === currentStep}>
                  {step.title}
                </StepTitle>
                {step.description && (
                  <StepDescription>{step.description}</StepDescription>
                )}
              </StepContent>
            </Step>
          </React.Fragment>
        ))}
      </StepsContainer>

      {renderFormContent()}

      <ButtonGroup>
        {currentStep > 0 && (
          <Button variant="outline" onClick={handlePrevious}>
            戻る
          </Button>
        )}
        <Button variant="primary" onClick={handleNext} style={{ marginLeft: 'auto' }}>
          {currentStep === steps.length - 1 ? '予約を確定' : '次へ'}
        </Button>
      </ButtonGroup>
    </FlowContainer>
  );
};

export default BookingFlow;