import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  type: 'confirmation' | 'cancellation' | 'modification_request' | 'status_update'
  bookingId: string
  userEmail?: string
  userName: string
  productName: string
  bookingDate?: string
  totalAmount?: number
  status?: string
  modificationRequest?: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { type, bookingId, userEmail, userName, productName, bookingDate, totalAmount, status, modificationRequest } = await req.json() as EmailRequest

    // 이메일 템플릿 생성
    let subject = ''
    let htmlContent = ''

    switch (type) {
      case 'confirmation':
        subject = `[Ocean Bridge] ${productName} 예약이 접수되었습니다`
        htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #26D0CE 0%, #1A5490 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .booking-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
              .info-row:last-child { border-bottom: none; }
              .label { color: #666; }
              .value { font-weight: bold; color: #333; }
              .button { display: inline-block; background: #26D0CE; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin-top: 20px; }
              .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>예약이 접수되었습니다! 🌴</h1>
                <p>예약 번호: ${bookingId.slice(0, 8).toUpperCase()}</p>
              </div>
              <div class="content">
                <p>안녕하세요 ${userName}님,</p>
                <p>${productName} 예약이 성공적으로 접수되었습니다.</p>
                
                <div class="booking-info">
                  <div class="info-row">
                    <span class="label">투어명</span>
                    <span class="value">${productName}</span>
                  </div>
                  ${bookingDate ? `
                  <div class="info-row">
                    <span class="label">예약일</span>
                    <span class="value">${new Date(bookingDate).toLocaleDateString('ko-KR')}</span>
                  </div>
                  ` : ''}
                  ${totalAmount ? `
                  <div class="info-row">
                    <span class="label">예상 금액</span>
                    <span class="value">₩${totalAmount.toLocaleString()}</span>
                  </div>
                  ` : ''}
                </div>
                
                <p><strong>다음 단계:</strong></p>
                <ul>
                  <li>영업시간 내 30분 이내에 카카오톡으로 예약 가능 여부를 안내해드립니다</li>
                  <li>카카오톡 채널 '@oceanbridge'를 추가해주세요</li>
                  <li>예약 확정 후 결제 안내를 보내드립니다</li>
                </ul>
                
                <center>
                  <a href="${Deno.env.get('NEXT_PUBLIC_APP_URL')}/booking/confirm/${bookingId}" class="button">예약 확인하기</a>
                </center>
              </div>
              <div class="footer">
                <p>Ocean Bridge - 이시가키 여행의 모든 것</p>
                <p>문의: support@oceanbridge.kr | 카카오톡: @oceanbridge</p>
              </div>
            </div>
          </body>
          </html>
        `
        break

      case 'cancellation':
        subject = `[Ocean Bridge] ${productName} 예약이 취소되었습니다`
        htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #f44336; color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>예약이 취소되었습니다</h1>
                <p>예약 번호: ${bookingId.slice(0, 8).toUpperCase()}</p>
              </div>
              <div class="content">
                <p>안녕하세요 ${userName}님,</p>
                <p>${productName} 예약이 취소되었습니다.</p>
                <p>취소 정책에 따라 환불이 진행될 예정입니다. 영업일 기준 3-5일 내에 환불 처리가 완료됩니다.</p>
                <p>궁금한 사항이 있으시면 카카오톡 채널로 문의해주세요.</p>
              </div>
              <div class="footer">
                <p>Ocean Bridge - 이시가키 여행의 모든 것</p>
                <p>문의: support@oceanbridge.kr | 카카오톡: @oceanbridge</p>
              </div>
            </div>
          </body>
          </html>
        `
        break

      case 'modification_request':
        subject = `[Ocean Bridge] 예약 변경 요청이 접수되었습니다`
        htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #FF9800; color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .request-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF9800; }
              .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>예약 변경 요청 접수</h1>
                <p>예약 번호: ${bookingId.slice(0, 8).toUpperCase()}</p>
              </div>
              <div class="content">
                <p>안녕하세요 ${userName}님,</p>
                <p>${productName} 예약 변경 요청이 접수되었습니다.</p>
                
                <div class="request-box">
                  <h3>변경 요청 내용:</h3>
                  <p>${modificationRequest}</p>
                </div>
                
                <p>담당자가 요청사항을 확인 후 영업시간 내 30분 이내에 카카오톡으로 연락드리겠습니다.</p>
              </div>
              <div class="footer">
                <p>Ocean Bridge - 이시가키 여행의 모든 것</p>
                <p>문의: support@oceanbridge.kr | 카카오톡: @oceanbridge</p>
              </div>
            </div>
          </body>
          </html>
        `
        break

      case 'status_update':
        const statusText = status === 'confirmed' ? '확정되었습니다' : 
                          status === 'paid' ? '결제가 완료되었습니다' :
                          status === 'pending_payment' ? '결제 대기 중입니다' : '업데이트되었습니다'
        
        subject = `[Ocean Bridge] ${productName} 예약이 ${statusText}`
        htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #26D0CE 0%, #1A5490 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .status-badge { display: inline-block; background: #4CAF50; color: white; padding: 8px 20px; border-radius: 20px; font-weight: bold; }
              .button { display: inline-block; background: #26D0CE; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin-top: 20px; }
              .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>예약 상태 업데이트</h1>
                <p>예약 번호: ${bookingId.slice(0, 8).toUpperCase()}</p>
              </div>
              <div class="content">
                <p>안녕하세요 ${userName}님,</p>
                <p>${productName} 예약이 <span class="status-badge">${statusText}</span></p>
                
                ${status === 'confirmed' ? `
                  <p><strong>축하합니다! 예약이 확정되었습니다.</strong></p>
                  <p>투어 당일 지정된 시간과 장소에서 만나뵙겠습니다.</p>
                ` : status === 'pending_payment' ? `
                  <p>예약이 가확정되었습니다. 아래 버튼을 클릭하여 결제를 완료해주세요.</p>
                ` : ''}
                
                <center>
                  <a href="${Deno.env.get('NEXT_PUBLIC_APP_URL')}/booking/confirm/${bookingId}" class="button">예약 상세 보기</a>
                </center>
              </div>
              <div class="footer">
                <p>Ocean Bridge - 이시가키 여행의 모든 것</p>
                <p>문의: support@oceanbridge.kr | 카카오톡: @oceanbridge</p>
              </div>
            </div>
          </body>
          </html>
        `
        break
    }

    // 실제 이메일 발송 (여기서는 로그만 출력)
    // 실제 구현시 SendGrid, AWS SES, Resend 등의 이메일 서비스 사용
    console.log('Sending email:', {
      to: userEmail || 'noemail@provided.com',
      subject,
      html: htmlContent.substring(0, 200) + '...' // 로그용 일부만 출력
    })

    // 이메일 로그 저장
    const { error: logError } = await supabaseClient
      .from('email_logs')
      .insert({
        booking_id: bookingId,
        recipient: userEmail || 'noemail@provided.com',
        subject,
        type,
        sent_at: new Date().toISOString(),
        status: 'sent'
      })

    if (logError) {
      console.error('Error logging email:', logError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email queued for sending',
        emailType: type,
        recipient: userEmail || 'noemail@provided.com'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})