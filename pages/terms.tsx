import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import IshigakiButton from '@/components/ishigaki/IshigakiButton';
import { ishigakiTheme } from '@/styles/ishigaki-theme';

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${ishigakiTheme.colors.background.secondary};
`;

const Header = styled.header`
  background: ${ishigakiTheme.colors.background.primary};
  border-bottom: 1px solid ${ishigakiTheme.colors.border.light};
  padding: 24px;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 24px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${ishigakiTheme.colors.text.primary};
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: ${ishigakiTheme.colors.background.secondary};
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${ishigakiTheme.colors.text.primary};
  margin: 0;
`;

const Content = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const LastUpdated = styled.p`
  color: ${ishigakiTheme.colors.text.muted};
  font-size: 14px;
  margin-bottom: 32px;
`;

const Section = styled.section`
  margin-bottom: 48px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${ishigakiTheme.colors.text.primary};
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid ${ishigakiTheme.colors.brand.primary};
`;

const Paragraph = styled.p`
  color: ${ishigakiTheme.colors.text.secondary};
  line-height: 1.8;
  margin-bottom: 16px;
`;

const List = styled.ul`
  margin: 16px 0;
  padding-left: 24px;
`;

const ListItem = styled.li`
  color: ${ishigakiTheme.colors.text.secondary};
  line-height: 1.8;
  margin-bottom: 8px;
`;

const SubSection = styled.div`
  margin: 24px 0;
`;

const SubTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${ishigakiTheme.colors.text.primary};
  margin-bottom: 12px;
`;

const ContactInfo = styled.div`
  background: ${ishigakiTheme.colors.background.tertiary};
  border-radius: 12px;
  padding: 24px;
  margin-top: 32px;
`;

export default function TermsPage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>이용약관 - Ocean Bridge</title>
        <meta name="description" content="Ocean Bridge 서비스 이용약관" />
      </Head>

      <PageContainer>
        <Header>
          <HeaderContent>
            <BackButton onClick={() => router.back()}>
              ←
            </BackButton>
            <Title>이용약관</Title>
          </HeaderContent>
        </Header>

        <Content>
          <LastUpdated>최종 수정일: 2025년 1월 13일</LastUpdated>

          <Section>
            <SectionTitle>제1조 (목적)</SectionTitle>
            <Paragraph>
              본 약관은 Ocean Bridge(이하 "회사")가 제공하는 이시가키 여행 예약 플랫폼 서비스(이하 "서비스")의 
              이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>제2조 (정의)</SectionTitle>
            <List>
              <ListItem>"서비스"란 회사가 제공하는 이시가키 여행 상품 예약, 정보 제공 등의 모든 서비스를 의미합니다.</ListItem>
              <ListItem>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</ListItem>
              <ListItem>"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</ListItem>
              <ListItem>"파트너"란 회사와 제휴하여 여행 상품을 제공하는 현지 업체를 말합니다.</ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>제3조 (약관의 효력 및 변경)</SectionTitle>
            <Paragraph>
              ① 본 약관은 서비스 화면이나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.
            </Paragraph>
            <Paragraph>
              ② 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 
              변경된 약관은 제1항과 같은 방법으로 공지함으로써 효력을 발생합니다.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>제4조 (서비스의 제공 및 변경)</SectionTitle>
            <Paragraph>
              ① 회사는 다음과 같은 서비스를 제공합니다:
            </Paragraph>
            <List>
              <ListItem>이시가키 현지 투어 및 액티비티 예약 서비스</ListItem>
              <ListItem>여행 정보 제공 서비스</ListItem>
              <ListItem>예약 관리 및 고객 지원 서비스</ListItem>
              <ListItem>한국어-일본어 통번역 지원 서비스</ListItem>
              <ListItem>기타 회사가 정하는 서비스</ListItem>
            </List>
            <Paragraph>
              ② 회사는 서비스의 내용을 변경할 경우에는 변경 사유 및 내용을 이용자에게 공지합니다.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>제5조 (회원가입)</SectionTitle>
            <Paragraph>
              ① 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.
            </Paragraph>
            <Paragraph>
              ② 회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다:
            </Paragraph>
            <List>
              <ListItem>가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</ListItem>
              <ListItem>실명이 아니거나 타인의 명의를 이용한 경우</ListItem>
              <ListItem>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</ListItem>
              <ListItem>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>제6조 (예약 및 결제)</SectionTitle>
            <Paragraph>
              ① 이용자는 서비스를 통해 파트너가 제공하는 여행 상품을 예약할 수 있습니다.
            </Paragraph>
            <Paragraph>
              ② 예약은 이용자가 신청하고 회사가 이를 승인함으로써 성립합니다.
            </Paragraph>
            <Paragraph>
              ③ 결제는 회사가 제공하는 결제 수단을 통해 이루어지며, 결제 완료 시 예약이 확정됩니다.
            </Paragraph>
            <Paragraph>
              ④ 회사는 이용자와 파트너 간의 거래를 중개하는 플랫폼 제공자로서, 파트너가 제공하는 서비스의 품질에 대한 직접적인 책임은 파트너에게 있습니다.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>제7조 (예약 취소 및 환불)</SectionTitle>
            <Paragraph>
              ① 예약 취소 및 환불은 각 상품별로 파트너가 정한 취소 정책에 따릅니다.
            </Paragraph>
            <Paragraph>
              ② 일반적인 취소 정책은 다음과 같습니다:
            </Paragraph>
            <List>
              <ListItem>이용일 3일 전까지: 전액 환불</ListItem>
              <ListItem>이용일 2일 전: 50% 환불</ListItem>
              <ListItem>이용일 1일 전: 30% 환불</ListItem>
              <ListItem>이용일 당일: 환불 불가</ListItem>
            </List>
            <Paragraph>
              ③ 천재지변, 기상악화 등 불가항력적인 사유로 서비스 제공이 불가능한 경우 전액 환불됩니다.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>제8조 (개인정보보호)</SectionTitle>
            <Paragraph>
              ① 회사는 이용자의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 관해서는 별도의 개인정보처리방침이 적용됩니다.
            </Paragraph>
            <Paragraph>
              ② 회사는 이용자의 개인정보를 본인의 동의 없이 타인에게 공개하지 않습니다. 단, 법령의 규정에 의한 경우는 예외로 합니다.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>제9조 (이용자의 의무)</SectionTitle>
            <Paragraph>
              이용자는 다음 행위를 하여서는 안 됩니다:
            </Paragraph>
            <List>
              <ListItem>신청 또는 변경 시 허위 내용의 등록</ListItem>
              <ListItem>타인의 정보 도용</ListItem>
              <ListItem>회사가 게시한 정보의 변경</ListItem>
              <ListItem>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</ListItem>
              <ListItem>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</ListItem>
              <ListItem>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>제10조 (면책조항)</SectionTitle>
            <Paragraph>
              ① 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
            </Paragraph>
            <Paragraph>
              ② 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
            </Paragraph>
            <Paragraph>
              ③ 회사는 이용자가 서비스와 관련하여 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 책임을 지지 않습니다.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>제11조 (분쟁해결)</SectionTitle>
            <Paragraph>
              ① 회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.
            </Paragraph>
            <Paragraph>
              ② 회사와 이용자 간에 발생한 전자상거래 분쟁과 관련하여 이용자의 피해구제신청이 있는 경우에는 
              공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>제12조 (재판권 및 준거법)</SectionTitle>
            <Paragraph>
              ① 회사와 이용자 간에 발생한 분쟁에 관한 소송은 제소 당시 이용자의 주소에 의하고, 
              주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다.
            </Paragraph>
            <Paragraph>
              ② 회사와 이용자 간에 제기된 소송에는 대한민국 법을 적용합니다.
            </Paragraph>
          </Section>

          <ContactInfo>
            <SubTitle>고객센터</SubTitle>
            <Paragraph style={{ margin: '8px 0' }}>
              이메일: support@oceanbridge.kr<br />
              카카오톡: @oceanbridge<br />
              운영시간: 평일 09:00 - 18:00 (한국 시간 기준)
            </Paragraph>
          </ContactInfo>

          <Section>
            <Paragraph style={{ fontSize: '14px', color: ishigakiTheme.colors.text.muted }}>
              본 약관은 2025년 1월 13일부터 시행됩니다.
            </Paragraph>
          </Section>
        </Content>
      </PageContainer>
    </>
  );
}