import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { useRouter } from 'next/router';
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
`;

const TableHeader = styled.th`
  background: ${ishigakiTheme.colors.background.tertiary};
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: ${ishigakiTheme.colors.text.primary};
  border: 1px solid ${ishigakiTheme.colors.border.light};
`;

const TableCell = styled.td`
  padding: 12px;
  color: ${ishigakiTheme.colors.text.secondary};
  border: 1px solid ${ishigakiTheme.colors.border.light};
`;

const ContactInfo = styled.div`
  background: ${ishigakiTheme.colors.background.tertiary};
  border-radius: 12px;
  padding: 24px;
  margin-top: 32px;
`;

const ImportantBox = styled.div`
  background: rgba(38, 208, 206, 0.1);
  border: 1px solid ${ishigakiTheme.colors.brand.primary};
  border-radius: 12px;
  padding: 20px;
  margin: 24px 0;
`;

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>개인정보처리방침 - Ocean Bridge</title>
        <meta name="description" content="Ocean Bridge 개인정보처리방침" />
      </Head>

      <PageContainer>
        <Header>
          <HeaderContent>
            <BackButton onClick={() => router.back()}>
              ←
            </BackButton>
            <Title>개인정보처리방침</Title>
          </HeaderContent>
        </Header>

        <Content>
          <LastUpdated>최종 수정일: 2025년 1월 13일</LastUpdated>

          <ImportantBox>
            <Paragraph style={{ margin: 0, fontWeight: 600 }}>
              Ocean Bridge는 이용자의 개인정보를 매우 중요하게 생각하며, 
              개인정보보호법 및 정보통신망법 등 관련 법령을 준수하고 있습니다.
            </Paragraph>
          </ImportantBox>

          <Section>
            <SectionTitle>1. 개인정보의 수집 및 이용목적</SectionTitle>
            <Paragraph>
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 
              다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 
              별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </Paragraph>

            <SubSection>
              <SubTitle>가. 회원 가입 및 관리</SubTitle>
              <List>
                <ListItem>회원제 서비스 제공에 따른 본인 식별·인증</ListItem>
                <ListItem>회원자격 유지·관리</ListItem>
                <ListItem>서비스 부정이용 방지</ListItem>
                <ListItem>각종 고지·통지</ListItem>
                <ListItem>고충처리</ListItem>
              </List>
            </SubSection>

            <SubSection>
              <SubTitle>나. 서비스 제공</SubTitle>
              <List>
                <ListItem>여행 상품 예약 및 결제 서비스 제공</ListItem>
                <ListItem>예약 확인 및 취소 처리</ListItem>
                <ListItem>맞춤형 여행 정보 제공</ListItem>
                <ListItem>콘텐츠 제공 및 추천</ListItem>
              </List>
            </SubSection>

            <SubSection>
              <SubTitle>다. 마케팅 및 광고 활용</SubTitle>
              <List>
                <ListItem>이벤트 및 광고성 정보 제공 (동의한 경우에 한함)</ListItem>
                <ListItem>서비스 이용 통계 및 분석</ListItem>
                <ListItem>신규 서비스 개발 및 맞춤 서비스 제공</ListItem>
              </List>
            </SubSection>
          </Section>

          <Section>
            <SectionTitle>2. 수집하는 개인정보 항목</SectionTitle>
            
            <SubSection>
              <SubTitle>가. 회원가입 시</SubTitle>
              <List>
                <ListItem>필수항목: 이메일, 비밀번호, 이름, 휴대전화번호</ListItem>
                <ListItem>선택항목: 생년월일, 성별, 카카오톡 ID</ListItem>
                <ListItem>자동수집항목: IP주소, 쿠키, 서비스 이용기록, 방문기록</ListItem>
              </List>
            </SubSection>

            <SubSection>
              <SubTitle>나. 예약 및 결제 시</SubTitle>
              <List>
                <ListItem>필수항목: 예약자 정보(이름, 연락처), 참가자 정보(이름, 나이)</ListItem>
                <ListItem>선택항목: 픽업 장소, 특별 요청사항</ListItem>
                <ListItem>결제정보: 결제수단, 결제금액, 결제일시</ListItem>
              </List>
            </SubSection>

            <SubSection>
              <SubTitle>다. SNS 간편로그인 시</SubTitle>
              <List>
                <ListItem>카카오: 프로필 정보(닉네임, 프로필 사진), 카카오 계정(이메일)</ListItem>
                <ListItem>구글: 이메일, 이름, 프로필 사진</ListItem>
              </List>
            </SubSection>
          </Section>

          <Section>
            <SectionTitle>3. 개인정보의 보유 및 이용기간</SectionTitle>
            <Paragraph>
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 
              동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </Paragraph>

            <Table>
              <thead>
                <tr>
                  <TableHeader>구분</TableHeader>
                  <TableHeader>보유기간</TableHeader>
                  <TableHeader>법적 근거</TableHeader>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableCell>회원 정보</TableCell>
                  <TableCell>회원 탈퇴 시까지</TableCell>
                  <TableCell>정보주체의 동의</TableCell>
                </tr>
                <tr>
                  <TableCell>계약 및 청약철회 기록</TableCell>
                  <TableCell>5년</TableCell>
                  <TableCell>전자상거래법</TableCell>
                </tr>
                <tr>
                  <TableCell>대금결제 및 재화 공급 기록</TableCell>
                  <TableCell>5년</TableCell>
                  <TableCell>전자상거래법</TableCell>
                </tr>
                <tr>
                  <TableCell>소비자 불만 또는 분쟁처리 기록</TableCell>
                  <TableCell>3년</TableCell>
                  <TableCell>전자상거래법</TableCell>
                </tr>
                <tr>
                  <TableCell>웹사이트 방문기록</TableCell>
                  <TableCell>3개월</TableCell>
                  <TableCell>통신비밀보호법</TableCell>
                </tr>
              </tbody>
            </Table>
          </Section>

          <Section>
            <SectionTitle>4. 개인정보의 제3자 제공</SectionTitle>
            <Paragraph>
              회사는 원칙적으로 이용자의 개인정보를 제1조에서 명시한 목적 범위 내에서 처리하며, 
              이용자의 사전 동의 없이 본래의 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다. 
              다만, 다음의 경우에는 예외로 합니다.
            </Paragraph>
            <List>
              <ListItem>이용자가 사전에 동의한 경우</ListItem>
              <ListItem>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</ListItem>
            </List>

            <SubSection>
              <SubTitle>파트너사 제공 현황</SubTitle>
              <Table>
                <thead>
                  <tr>
                    <TableHeader>제공받는 자</TableHeader>
                    <TableHeader>제공 항목</TableHeader>
                    <TableHeader>제공 목적</TableHeader>
                    <TableHeader>보유기간</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <TableCell>예약 파트너사</TableCell>
                    <TableCell>예약자명, 연락처, 참가자 정보</TableCell>
                    <TableCell>예약 확인 및 서비스 제공</TableCell>
                    <TableCell>서비스 제공 완료 후 1년</TableCell>
                  </tr>
                  <tr>
                    <TableCell>결제대행사</TableCell>
                    <TableCell>결제정보</TableCell>
                    <TableCell>결제 처리</TableCell>
                    <TableCell>거래 완료 후 5년</TableCell>
                  </tr>
                </tbody>
              </Table>
            </SubSection>
          </Section>

          <Section>
            <SectionTitle>5. 개인정보의 파기</SectionTitle>
            <Paragraph>
              ① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
              지체없이 해당 개인정보를 파기합니다.
            </Paragraph>
            <Paragraph>
              ② 파기방법
            </Paragraph>
            <List>
              <ListItem>전자적 파일 형태: 복구 불가능한 방법으로 영구 삭제</ListItem>
              <ListItem>종이 문서: 분쇄기로 분쇄하거나 소각</ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>6. 정보주체의 권리·의무 및 행사방법</SectionTitle>
            <Paragraph>
              이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
            </Paragraph>
            <List>
              <ListItem>개인정보 열람요구</ListItem>
              <ListItem>오류 등이 있을 경우 정정 요구</ListItem>
              <ListItem>삭제요구</ListItem>
              <ListItem>처리정지 요구</ListItem>
            </List>
            <Paragraph>
              권리 행사는 서면, 이메일, 팩스 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체없이 조치하겠습니다.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>7. 개인정보의 안전성 확보조치</SectionTitle>
            <Paragraph>
              회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
            </Paragraph>
            <List>
              <ListItem>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육</ListItem>
              <ListItem>기술적 조치: 개인정보처리시스템 접근권한 관리, 접근통제시스템 설치, 암호화</ListItem>
              <ListItem>물리적 조치: 전산실, 자료보관실 등의 접근통제</ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>8. 쿠키(Cookie)의 운영</SectionTitle>
            <Paragraph>
              ① 회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 쿠키를 사용합니다.
            </Paragraph>
            <Paragraph>
              ② 쿠키는 웹사이트를 운영하는데 이용되는 서버가 이용자의 컴퓨터 브라우저에게 보내는 
              소량의 정보이며, 이용자의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.
            </Paragraph>
            <Paragraph>
              ③ 이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 웹브라우저 옵션을 설정함으로써 
              모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>9. 개인정보보호책임자</SectionTitle>
            <Paragraph>
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 
              정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다.
            </Paragraph>
            
            <ContactInfo>
              <SubTitle>개인정보보호책임자</SubTitle>
              <Paragraph style={{ margin: '8px 0' }}>
                성명: 홍길동<br />
                직책: 개인정보보호 담당자<br />
                이메일: privacy@oceanbridge.kr<br />
                전화: 02-1234-5678
              </Paragraph>
            </ContactInfo>

            <Paragraph style={{ marginTop: '24px' }}>
              정보주체께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 
              불만처리, 피해구제 등에 관한 사항을 개인정보보호책임자에게 문의하실 수 있습니다.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>10. 개인정보 처리방침의 변경</SectionTitle>
            <Paragraph>
              이 개인정보처리방침은 2025년 1월 13일부터 적용되며, 법령 및 방침에 따른 변경내용의 
              추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>11. 권익침해 구제방법</SectionTitle>
            <Paragraph>
              정보주체는 개인정보침해로 인한 구제를 받기 위하여 아래 기관에 분쟁해결이나 상담 등을 신청할 수 있습니다.
            </Paragraph>
            <List>
              <ListItem>개인정보보호위원회: (국번없이) 118</ListItem>
              <ListItem>개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)</ListItem>
              <ListItem>대검찰청: (국번없이) 1301 (www.spo.go.kr)</ListItem>
              <ListItem>경찰청: (국번없이) 182 (ecrm.cyber.go.kr)</ListItem>
            </List>
          </Section>

          <Section>
            <Paragraph style={{ fontSize: '14px', color: ishigakiTheme.colors.text.muted }}>
              본 개인정보처리방침은 2025년 1월 13일부터 시행됩니다.
            </Paragraph>
          </Section>
        </Content>
      </PageContainer>
    </>
  );
}