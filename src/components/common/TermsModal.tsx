import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ishigakiTheme } from '@/styles/ishigaki-theme';
import IshigakiButton from '@/components/ishigaki/IshigakiButton';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ModalContent = styled.div`
  background: ${ishigakiTheme.colors.background.primary};
  border-radius: 24px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: ${ishigakiTheme.shadows.xl};
`;

const ModalHeader = styled.div`
  padding: 24px 24px 16px;
  border-bottom: 1px solid ${ishigakiTheme.colors.border.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${ishigakiTheme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${ishigakiTheme.colors.text.secondary};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${ishigakiTheme.colors.background.secondary};
    color: ${ishigakiTheme.colors.text.primary};
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${ishigakiTheme.colors.border.light};
  display: flex;
  justify-content: flex-end;
`;

const ContentSection = styled.section`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${ishigakiTheme.colors.text.primary};
  margin-bottom: 12px;
`;

const Paragraph = styled.p`
  color: ${ishigakiTheme.colors.text.secondary};
  line-height: 1.6;
  margin-bottom: 12px;
  font-size: 14px;
`;

const List = styled.ul`
  margin: 12px 0;
  padding-left: 20px;
`;

const ListItem = styled.li`
  color: ${ishigakiTheme.colors.text.secondary};
  line-height: 1.6;
  margin-bottom: 8px;
  font-size: 14px;
`;

const termsContent = {
  terms: {
    title: '이용약관',
    sections: [
      {
        title: '제1조 (목적)',
        content: `본 약관은 Ocean Bridge(이하 "회사")가 제공하는 이시가키 여행 예약 플랫폼 서비스의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.`
      },
      {
        title: '제2조 (서비스 제공)',
        content: `회사는 다음과 같은 서비스를 제공합니다:`,
        list: [
          '이시가키 현지 투어 및 액티비티 예약 서비스',
          '여행 정보 제공 서비스',
          '예약 관리 및 고객 지원 서비스',
          '한국어-일본어 통번역 지원 서비스'
        ]
      },
      {
        title: '제3조 (회원가입)',
        content: `이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.`
      },
      {
        title: '제4조 (예약 및 결제)',
        content: `예약은 이용자가 신청하고 회사가 이를 승인함으로써 성립합니다. 결제는 회사가 제공하는 결제 수단을 통해 이루어지며, 결제 완료 시 예약이 확정됩니다.`
      },
      {
        title: '제5조 (예약 취소 및 환불)',
        content: `예약 취소 및 환불 정책:`,
        list: [
          '이용일 3일 전까지: 전액 환불',
          '이용일 2일 전: 50% 환불',
          '이용일 1일 전: 30% 환불',
          '이용일 당일: 환불 불가'
        ]
      },
      {
        title: '제6조 (개인정보보호)',
        content: `회사는 이용자의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 관해서는 별도의 개인정보처리방침이 적용됩니다.`
      },
      {
        title: '제7조 (면책조항)',
        content: `회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.`
      }
    ]
  },
  privacy: {
    title: '개인정보처리방침',
    sections: [
      {
        title: '1. 개인정보의 수집 및 이용목적',
        content: `회사는 다음의 목적을 위하여 개인정보를 처리합니다:`,
        list: [
          '회원제 서비스 제공에 따른 본인 식별·인증',
          '여행 상품 예약 및 결제 서비스 제공',
          '맞춤형 여행 정보 제공',
          '이벤트 및 광고성 정보 제공 (동의한 경우)'
        ]
      },
      {
        title: '2. 수집하는 개인정보 항목',
        content: `회원가입 시 수집 항목:`,
        list: [
          '필수항목: 이메일, 비밀번호, 이름, 휴대전화번호',
          '선택항목: 생년월일, 성별, 카카오톡 ID',
          '자동수집항목: IP주소, 쿠키, 서비스 이용기록'
        ]
      },
      {
        title: '3. 개인정보의 보유 및 이용기간',
        content: `회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.`,
        list: [
          '회원 정보: 회원 탈퇴 시까지',
          '계약 및 청약철회 기록: 5년',
          '대금결제 및 재화 공급 기록: 5년',
          '소비자 불만 또는 분쟁처리 기록: 3년'
        ]
      },
      {
        title: '4. 개인정보의 제3자 제공',
        content: `회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:`,
        list: [
          '이용자가 사전에 동의한 경우',
          '법령의 규정에 의거하는 경우',
          '서비스 제공을 위해 파트너사에 필요 최소한의 정보를 제공하는 경우'
        ]
      },
      {
        title: '5. 개인정보의 파기',
        content: `회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.`
      },
      {
        title: '6. 정보주체의 권리',
        content: `이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다:`,
        list: [
          '개인정보 열람요구',
          '오류 등이 있을 경우 정정 요구',
          '삭제요구',
          '처리정지 요구'
        ]
      },
      {
        title: '7. 개인정보보호책임자',
        content: `개인정보 관련 문의사항은 아래 연락처로 문의하실 수 있습니다:\n이메일: privacy@oceanbridge.kr`
      }
    ]
  }
};

export default function TermsModal({ isOpen, onClose, type }: TermsModalProps) {
  const [content] = useState(termsContent[type]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{content.title}</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          {content.sections.map((section, index) => (
            <ContentSection key={index}>
              <SectionTitle>{section.title}</SectionTitle>
              <Paragraph>{section.content}</Paragraph>
              {section.list && (
                <List>
                  {section.list.map((item, idx) => (
                    <ListItem key={idx}>{item}</ListItem>
                  ))}
                </List>
              )}
            </ContentSection>
          ))}
        </ModalBody>

        <ModalFooter>
          <IshigakiButton 
            variant="ocean" 
            size="medium"
            onClick={onClose}
          >
            닫기
          </IshigakiButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}