# 📘 Phase 4: Payment & Operations (Week 8-9)

## 개요
결제 시스템 통합, 바우처 발행, 기상/페리 취소 운영, 자동 리마인드 시스템을 구축하여 운영 자동화를 실현합니다.

## 🎯 목표
- ✅ PG 결제 시스템 통합 (토스페이먼츠/카카오페이)
- ✅ 바우처 생성 및 발송 시스템
- ✅ 기상/페리 취소 표준 운영
- ✅ 자동 리마인드 알림 시스템
- ✅ 환불 처리 프로세스
- ✅ 정산 관리 기능

## 📋 Task Breakdown

### Week 8: Payment System Integration

#### Day 1-2: Payment Gateway Setup
```typescript
// lib/payment/toss.ts
import axios from 'axios'

export class TossPaymentClient {
  private clientKey: string
  private secretKey: string
  private baseUrl: string
  
  constructor() {
    this.clientKey = process.env.TOSS_CLIENT_KEY!
    this.secretKey = process.env.TOSS_SECRET_KEY!
    this.baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://api.tosspayments.com'
      : 'https://api.tosspayments.com/sandbox'
  }
  
  // 결제 요청 생성
  async createPaymentRequest(data: {
    requestId: string
    amount: number
    orderName: string
    customerName: string
    customerPhone: string
  }) {
    const orderId = `ISK_${data.requestId}_${Date.now()}`
    
    // 결제 URL 생성
    const paymentData = {
      amount: data.amount,
      orderId,
      orderName: data.orderName,
      customerName: data.customerName,
      customerMobilePhone: data.customerPhone,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      failUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/fail`,
      windowType: 'IFRAME',
      currency: 'KRW'
    }
    
    // DB에 결제 요청 저장
    await supabase.from('payment_requests').insert({
      request_id: data.requestId,
      order_id: orderId,
      amount: data.amount,
      status: 'pending',
      pg_provider: 'toss',
      payment_data: paymentData
    })
    
    return {
      orderId,
      clientKey: this.clientKey,
      amount: data.amount
    }
  }
  
  // 결제 승인
  async confirmPayment(paymentKey: string, orderId: string, amount: number) {
    const response = await axios.post(
      `${this.baseUrl}/v1/payments/confirm`,
      {
        paymentKey,
        orderId,
        amount
      },
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(this.secretKey + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    return response.data
  }
  
  // 결제 취소/환불
  async cancelPayment(paymentKey: string, cancelReason: string, cancelAmount?: number) {
    const response = await axios.post(
      `${this.baseUrl}/v1/payments/${paymentKey}/cancel`,
      {
        cancelReason,
        cancelAmount // 부분 환불 가능
      },
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(this.secretKey + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    return response.data
  }
}
```

```typescript
// app/(public)/payment/[requestId]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { loadTossPayments } from '@tosspayments/payment-sdk'
import { Card, Text, Button, Alert } from '@/components/ocean'

export default function PaymentPage({ 
  params 
}: { 
  params: { requestId: string } 
}) {
  const [paymentData, setPaymentData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    initializePayment()
  }, [])
  
  const initializePayment = async () => {
    // 결제 정보 조회
    const { data } = await fetch(`/api/payment/request/${params.requestId}`).then(r => r.json())
    setPaymentData(data)
    setIsLoading(false)
    
    // Toss Payments SDK 초기화
    const tossPayments = await loadTossPayments(data.clientKey)
    const payment = tossPayments.payment({ customerKey: data.customerKey })
    
    // 결제창 렌더링
    await payment.requestPayment({
      method: 'CARD', // 카드, 계좌이체, 가상계좌, 휴대폰
      amount: data.amount,
      orderId: data.orderId,
      orderName: data.orderName,
      successUrl: `${window.location.origin}/payment/success`,
      failUrl: `${window.location.origin}/payment/fail`,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      customerMobilePhone: data.customerPhone,
      // 카드 할부 옵션
      card: {
        installments: [0, 2, 3, 4, 5, 6] // 할부 개월 수
      }
    })
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <div className="p-8">
          <Text variant="h4" className="mb-4">
            예약금 결제
          </Text>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              <Text className="mt-4">결제 준비 중...</Text>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <Text>상품명</Text>
                  <Text className="font-semibold">{paymentData.orderName}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>결제 금액</Text>
                  <Text className="font-semibold text-xl">
                    ₩{paymentData.amount.toLocaleString()}
                  </Text>
                </div>
              </div>
              
              <Alert variant="info" className="mb-6">
                <Text className="text-sm">
                  • 예약금은 총 금액의 30%입니다
                  • 잔금은 현지에서 결제해주세요
                  • 취소 정책에 따라 환불 가능합니다
                </Text>
              </Alert>
              
              <div id="payment-widget" />
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
```

#### Day 3-4: Voucher System
```typescript
// lib/voucher/generator.ts
import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'
import { uploadFile } from '@/lib/storage'

export class VoucherGenerator {
  // 바우처 PDF 생성
  async generateVoucher(booking: Booking): Promise<string> {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    })
    
    // 헤더
    doc.fontSize(24)
       .text('Ishigaki Connect', { align: 'center' })
    doc.fontSize(16)
       .text('예약 확인서 / Booking Confirmation', { align: 'center' })
    
    doc.moveDown()
    
    // 바우처 번호 & QR코드
    const voucherNumber = `ISK${booking.id.slice(0, 8).toUpperCase()}`
    const qrData = await QRCode.toDataURL(voucherNumber)
    doc.image(qrData, 450, 100, { width: 100 })
    
    doc.fontSize(12)
       .text(`바우처 번호: ${voucherNumber}`, 50, 100)
    
    // 예약 정보
    doc.moveDown(2)
    doc.fontSize(14).text('예약 정보', { underline: true })
    doc.fontSize(12)
    
    const info = [
      ['고객명', booking.user_name],
      ['상품명', booking.product.title_ko],
      ['날짜', formatDate(booking.date)],
      ['시간', booking.meeting_time],
      ['인원', `성인 ${booking.adult_count}명, 어린이 ${booking.child_count}명`],
      ['집합 장소', booking.product.meeting_point_ko],
      ['샵 연락처', booking.shop.phone]
    ]
    
    info.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`)
    })
    
    // 포함/불포함 사항
    doc.moveDown()
    doc.fontSize(14).text('포함 사항', { underline: true })
    doc.fontSize(11)
    booking.product.includes_ko?.forEach(item => {
      doc.text(`• ${item}`)
    })
    
    doc.moveDown()
    doc.fontSize(14).text('불포함 사항', { underline: true })
    doc.fontSize(11)
    booking.product.excludes_ko?.forEach(item => {
      doc.text(`• ${item}`)
    })
    
    // 준비물
    if (booking.product.preparation_ko?.length > 0) {
      doc.moveDown()
      doc.fontSize(14).text('준비물', { underline: true })
      doc.fontSize(11)
      booking.product.preparation_ko.forEach(item => {
        doc.text(`• ${item}`)
      })
    }
    
    // 취소 정책
    doc.moveDown()
    doc.fontSize(14).text('취소 정책', { underline: true })
    doc.fontSize(11)
    doc.text(booking.product.cancel_policy.content_ko)
    
    // 지도
    if (booking.product.meeting_map_url) {
      doc.moveDown()
      doc.fontSize(14).text('집합 장소 지도', { underline: true })
      // 지도 이미지 삽입
      // doc.image(mapImage, { width: 500 })
    }
    
    // 푸터
    doc.fontSize(10)
       .text('문의: support@ishigaki-connect.com | 카카오톡: @ishigaki', 
             50, 750, { align: 'center' })
    
    // PDF 저장
    const pdfBuffer = await streamToBuffer(doc)
    const fileName = `voucher_${voucherNumber}.pdf`
    const url = await uploadFile(pdfBuffer, fileName, 'vouchers')
    
    return url
  }
  
  // 바우처 이메일 발송
  async sendVoucherEmail(booking: Booking, voucherUrl: string) {
    const emailContent = {
      to: booking.user_email,
      subject: `[이시가키 커넥트] ${booking.product.title_ko} 예약 확정`,
      html: `
        <div style="font-family: 'Noto Sans KR', sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #26D0CE;">예약이 확정되었습니다!</h1>
          
          <div style="background: #F8FFFE; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>${booking.product.title_ko}</h2>
            <p><strong>날짜:</strong> ${formatDate(booking.date)}</p>
            <p><strong>시간:</strong> ${booking.meeting_time}</p>
            <p><strong>인원:</strong> 성인 ${booking.adult_count}명, 어린이 ${booking.child_count}명</p>
          </div>
          
          <p>첨부된 바우처를 인쇄하시거나 모바일로 제시해주세요.</p>
          
          <a href="${voucherUrl}" 
             style="display: inline-block; background: #26D0CE; color: white; 
                    padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            바우처 다운로드
          </a>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #E0E0E0;">
          
          <h3>중요 안내사항</h3>
          <ul>
            <li>집합 시간 10분 전까지 도착해주세요</li>
            <li>기상 악화 시 일정이 변경될 수 있습니다</li>
            <li>취소는 3일 전까지 무료입니다</li>
          </ul>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            문의사항이 있으시면 카카오톡 @ishigaki로 연락주세요.
          </p>
        </div>
      `,
      attachments: [{
        filename: `voucher_${booking.id}.pdf`,
        path: voucherUrl
      }]
    }
    
    await sendEmail(emailContent)
  }
}
```

#### Day 5: Refund Processing
```typescript
// services/refund.ts
export class RefundService {
  private tossClient: TossPaymentClient
  
  constructor() {
    this.tossClient = new TossPaymentClient()
  }
  
  // 환불 정책 계산
  calculateRefundAmount(booking: Booking, reason: 'weather' | 'customer' | 'shop'): number {
    const { amount, date, created_at } = booking
    const now = new Date()
    const bookingDate = new Date(date)
    const daysUntil = Math.floor((bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    switch(reason) {
      case 'weather':
        // 기상 취소는 전액 환불
        return amount
        
      case 'shop':
        // 샵 사정은 전액 환불
        return amount
        
      case 'customer':
        // 고객 취소는 정책에 따라
        if (daysUntil >= 3) {
          return amount // 3일 전: 전액
        } else if (daysUntil >= 1) {
          return amount * 0.5 // 1-2일 전: 50%
        } else {
          return 0 // 당일: 환불 불가
        }
        
      default:
        return 0
    }
  }
  
  // 환불 처리
  async processRefund(bookingId: string, reason: string, customAmount?: number) {
    const booking = await getBooking(bookingId)
    const refundAmount = customAmount || this.calculateRefundAmount(booking, reason)
    
    if (refundAmount === 0) {
      throw new Error('환불 가능 금액이 없습니다')
    }
    
    try {
      // PG사 환불 요청
      const refundResult = await this.tossClient.cancelPayment(
        booking.payment_key,
        reason,
        refundAmount
      )
      
      // 환불 기록 저장
      await supabase.from('refunds').insert({
        booking_id: bookingId,
        amount: refundAmount,
        reason,
        pg_response: refundResult,
        status: 'completed',
        processed_at: new Date()
      })
      
      // 예약 상태 업데이트
      await updateBookingStatus(bookingId, 'refunded')
      
      // 고객 알림
      await sendRefundNotification(booking, refundAmount, reason)
      
      return refundResult
      
    } catch (error) {
      // 환불 실패 기록
      await supabase.from('refunds').insert({
        booking_id: bookingId,
        amount: refundAmount,
        reason,
        status: 'failed',
        error_message: error.message
      })
      
      throw error
    }
  }
}
```

### Week 9: Operations Automation

#### Day 6-7: Weather Alert System
```typescript
// services/weather.ts
import { WeatherAPI } from '@/lib/weather/api'
import { supabase } from '@/lib/supabase/client'

export class WeatherAlertService {
  private weatherAPI: WeatherAPI
  
  constructor() {
    this.weatherAPI = new WeatherAPI()
  }
  
  // 기상 상태 체크 (크론잡으로 실행)
  async checkWeatherConditions() {
    // 이시가키 기상 정보 조회
    const weather = await this.weatherAPI.getIshigakiWeather()
    
    // 위험 조건 체크
    const alerts = []
    
    if (weather.windSpeed > 15) {
      alerts.push({
        type: 'HIGH_WIND',
        level: weather.windSpeed > 20 ? 'severe' : 'moderate',
        affectedCategories: ['diving', 'snorkel', 'sup', 'kayak']
      })
    }
    
    if (weather.waveHeight > 2.5) {
      alerts.push({
        type: 'HIGH_WAVES',
        level: weather.waveHeight > 3 ? 'severe' : 'moderate',
        affectedCategories: ['diving', 'snorkel', 'glassboat']
      })
    }
    
    if (weather.visibility < 5) {
      alerts.push({
        type: 'LOW_VISIBILITY',
        level: weather.visibility < 3 ? 'severe' : 'moderate',
        affectedCategories: ['diving']
      })
    }
    
    // 페리 운항 상태 체크
    const ferryStatus = await this.checkFerryStatus()
    if (!ferryStatus.uehara.operating) {
      alerts.push({
        type: 'UEHARA_FERRY_CANCELLED',
        level: 'severe',
        affectedCategories: ['iriomote']
      })
    }
    
    // 알림 발송
    if (alerts.length > 0) {
      await this.processAlerts(alerts)
    }
    
    return alerts
  }
  
  // 페리 운항 상태 체크
  async checkFerryStatus() {
    // 야에야마 관광 페리 API 또는 스크래핑
    return {
      uehara: { operating: true, nextDeparture: '09:00' },
      ohara: { operating: true, nextDeparture: '08:30' }
    }
  }
  
  // 알림 처리
  async processAlerts(alerts: any[]) {
    for (const alert of alerts) {
      // 영향받는 예약 조회
      const affectedBookings = await supabase
        .from('bookings')
        .select('*, products!inner(*)')
        .in('products.category', alert.affectedCategories)
        .eq('status', 'confirmed')
        .gte('date', new Date().toISOString())
        .lte('date', new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString())
      
      // 각 예약에 알림 발송
      for (const booking of affectedBookings.data || []) {
        await this.sendWeatherAlert(booking, alert)
      }
      
      // 관리자 대시보드 알림
      await this.notifyAdmin(alert, affectedBookings.data?.length || 0)
    }
  }
  
  // 기상 알림 발송
  async sendWeatherAlert(booking: any, alert: any) {
    const templates = {
      'HIGH_WIND': {
        ko: '강풍 주의보가 발령되었습니다. 투어 진행 여부를 확인 중입니다.',
        ja: '強風注意報が発令されました。ツアー実施を確認中です。'
      },
      'HIGH_WAVES': {
        ko: '높은 파도로 인해 일부 투어가 취소될 수 있습니다.',
        ja: '高波のため一部ツアーが中止になる可能性があります。'
      },
      'UEHARA_FERRY_CANCELLED': {
        ko: '우에하라항 페리가 취소되었습니다. 오하라항으로 변경 또는 일정 변경이 필요합니다.',
        ja: '上原港フェリーが欠航となりました。大原港への変更または日程変更が必要です。'
      }
    }
    
    // 카카오톡 알림
    await sendKakaoAlert(booking.user_kakao_id, {
      template: 'weather_alert',
      alert_type: alert.type,
      message: templates[alert.type].ko,
      booking_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/${booking.id}`,
      options: [
        { label: '일정 변경', action: 'reschedule' },
        { label: '환불 요청', action: 'refund' },
        { label: '대기', action: 'wait' }
      ]
    })
    
    // 샵에 LINE 알림
    await sendLineAlert(booking.shop.line_id, {
      alert_type: alert.type,
      message: templates[alert.type].ja,
      affected_bookings: [booking.id]
    })
  }
}
```

#### Day 8-9: Reminder System
```typescript
// supabase/functions/send-reminders/index.ts
import { createClient } from '@supabase/supabase-js'
import { KakaoClient } from '../shared/kakao.ts'

// 매일 18:00 KST에 실행되는 크론잡
Deno.cron("send daily reminders", "0 9 * * *", async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_KEY')!
  )
  
  const kakao = new KakaoClient()
  
  // 내일 예약 조회
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  
  const dayAfter = new Date(tomorrow)
  dayAfter.setDate(dayAfter.getDate() + 1)
  
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      products (
        title_ko,
        meeting_point_ko,
        meeting_time,
        preparation_ko,
        meeting_place_id
      ),
      shops (
        name_ko,
        phone
      ),
      places (
        name_ko,
        address_ja,
        map_link_google
      )
    `)
    .gte('date', tomorrow.toISOString())
    .lt('date', dayAfter.toISOString())
    .eq('status', 'confirmed')
  
  // 각 예약에 리마인더 발송
  for (const booking of bookings || []) {
    await sendReminder(booking, kakao)
  }
  
  console.log(`Sent ${bookings?.length || 0} reminders`)
})

async function sendReminder(booking: any, kakao: KakaoClient) {
  const reminderData = {
    user_name: booking.user_name,
    product_name: booking.products.title_ko,
    date: formatDate(booking.date),
    meeting_time: booking.products.meeting_time || '시간 확인 필요',
    meeting_point: booking.products.meeting_point_ko,
    map_url: booking.places?.map_link_google || '',
    preparation: booking.products.preparation_ko?.join(', ') || '특별한 준비물 없음',
    shop_phone: booking.shops.phone,
    voucher_url: booking.voucher_url,
    weather_info: await getWeatherInfo(booking.date)
  }
  
  // 카카오톡 리마인더 발송
  await kakao.sendChannelMessage(
    booking.user_kakao_id,
    'booking_reminder',
    reminderData
  )
  
  // 리마인더 발송 기록
  await supabase.from('reminders').insert({
    booking_id: booking.id,
    type: 'day_before',
    sent_at: new Date(),
    channel: 'kakao'
  })
}
```

#### Day 10: Settlement Management
```typescript
// components/admin/SettlementDashboard.tsx
import { useState, useEffect } from 'react'
import { Card, Table, Button, DatePicker, Select } from '@/components/ocean'
import { generateSettlementReport } from '@/services/settlement'

export function SettlementDashboard() {
  const [period, setPeriod] = useState<[Date, Date]>([
    new Date(new Date().setDate(1)), // 월초
    new Date() // 오늘
  ])
  const [settlements, setSettlements] = useState<any[]>([])
  
  useEffect(() => {
    loadSettlements()
  }, [period])
  
  const loadSettlements = async () => {
    const data = await getSettlements(period[0], period[1])
    setSettlements(data)
  }
  
  const calculateTotals = () => {
    return settlements.reduce((acc, s) => ({
      totalBookings: acc.totalBookings + s.booking_count,
      totalRevenue: acc.totalRevenue + s.total_amount,
      totalCommission: acc.totalCommission + s.commission_amount,
      totalPayout: acc.totalPayout + s.payout_amount
    }), {
      totalBookings: 0,
      totalRevenue: 0,
      totalCommission: 0,
      totalPayout: 0
    })
  }
  
  const handleGenerateReport = async () => {
    const report = await generateSettlementReport(period[0], period[1])
    // 다운로드 처리
    downloadFile(report.url, `settlement_${formatDate(period[0])}_${formatDate(period[1])}.xlsx`)
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">정산 관리</h2>
          
          <div className="flex gap-4 mb-6">
            <DatePicker
              label="시작일"
              value={period[0]}
              onChange={(date) => setPeriod([date, period[1]])}
            />
            <DatePicker
              label="종료일"
              value={period[1]}
              onChange={(date) => setPeriod([period[0], date])}
            />
            <Button
              onClick={handleGenerateReport}
              style={{
                background: theme.colors.brand.primary,
                color: 'white'
              }}
            >
              정산 리포트 생성
            </Button>
          </div>
          
          <Table>
            <thead>
              <tr>
                <th>샵</th>
                <th>예약 건수</th>
                <th>총 매출</th>
                <th>수수료 (20%)</th>
                <th>정산 금액</th>
                <th>상태</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map((settlement) => (
                <tr key={settlement.shop_id}>
                  <td>{settlement.shop_name}</td>
                  <td>{settlement.booking_count}</td>
                  <td>₩{settlement.total_amount.toLocaleString()}</td>
                  <td>₩{settlement.commission_amount.toLocaleString()}</td>
                  <td className="font-semibold">
                    ₩{settlement.payout_amount.toLocaleString()}
                  </td>
                  <td>
                    <Badge variant={
                      settlement.status === 'paid' ? 'success' :
                      settlement.status === 'pending' ? 'warning' : 'default'
                    }>
                      {settlement.status}
                    </Badge>
                  </td>
                  <td>
                    <Button size="sm" variant="outline">
                      상세
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold">
                <td>합계</td>
                <td>{calculateTotals().totalBookings}</td>
                <td>₩{calculateTotals().totalRevenue.toLocaleString()}</td>
                <td>₩{calculateTotals().totalCommission.toLocaleString()}</td>
                <td>₩{calculateTotals().totalPayout.toLocaleString()}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </Card>
    </div>
  )
}
```

## 🔧 Database Updates

```sql
-- Payment tables
create table payment_requests (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references requests(id),
  order_id text unique not null,
  amount integer not null,
  currency text default 'KRW',
  pg_provider text check (pg_provider in ('toss','kakaopay')),
  payment_key text,
  status text check (status in ('pending','paid','failed','cancelled','refunded')),
  payment_data jsonb,
  paid_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references requests(id),
  payment_request_id uuid references payment_requests(id),
  agency_ref text,
  deposit_amount integer,
  total_amount integer,
  currency text default 'KRW',
  voucher_number text unique,
  voucher_url text,
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  status text check (status in ('pending','confirmed','cancelled','refunded','completed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table refunds (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  amount integer not null,
  reason text,
  pg_response jsonb,
  status text check (status in ('pending','processing','completed','failed')),
  processed_at timestamptz,
  created_at timestamptz default now()
);

create table alerts (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  type text check (type in ('weather','ferry','system')),
  severity text check (severity in ('info','moderate','severe')),
  title_ko text,
  title_ja text,
  body_ko text,
  body_ja text,
  affected_categories text[],
  active boolean default false,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table reminders (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  type text check (type in ('day_before','hour_before','custom')),
  channel text check (channel in ('kakao','email','sms')),
  sent_at timestamptz,
  delivered boolean default true,
  created_at timestamptz default now()
);

create table settlements (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id),
  period_start date,
  period_end date,
  booking_count integer,
  total_amount integer,
  commission_rate numeric(3,2) default 0.20,
  commission_amount integer,
  payout_amount integer,
  status text check (status in ('pending','processing','paid')),
  paid_at timestamptz,
  invoice_url text,
  created_at timestamptz default now()
);

-- Indexes
create index idx_payment_requests_status on payment_requests(status);
create index idx_bookings_status on bookings(status);
create index idx_bookings_date on bookings(created_at);
create index idx_alerts_active on alerts(active, expires_at);
create index idx_settlements_period on settlements(period_start, period_end);
```

## ✅ Deliverables Checklist

### Payment System
- [ ] Toss Payments integration
- [ ] KakaoPay integration
- [ ] Payment confirmation flow
- [ ] Refund processing
- [ ] Payment status tracking

### Operations
- [ ] Voucher generation
- [ ] Weather alert system
- [ ] Ferry status monitoring
- [ ] Reminder system
- [ ] Settlement management

### Admin Features
- [ ] Payment dashboard
- [ ] Refund management
- [ ] Alert configuration
- [ ] Settlement reports
- [ ] Revenue analytics

## 🧪 Testing Requirements

### Payment Tests
- [ ] Payment flow E2E
- [ ] Refund calculations
- [ ] Payment webhook handling
- [ ] Error recovery

### Operations Tests
- [ ] Voucher generation
- [ ] Alert triggering
- [ ] Reminder scheduling
- [ ] Settlement calculations

## 📝 Key Considerations

### Security
- PCI compliance
- Secure payment data handling
- Webhook signature verification
- Audit logging

### Reliability
- Payment retry logic
- Webhook idempotency
- Transaction integrity
- Backup payment methods

### Performance
- Async payment processing
- Batch reminder sending
- Cached weather data
- Optimized PDF generation

## 🔄 Next Steps (Phase 5 Preview)
- Places Lite implementation
- Diving log system
- Review system
- Advanced analytics

## 📚 Resources
- [Toss Payments Docs](https://docs.tosspayments.com/)
- [KakaoPay API](https://developers.kakaopay.com/)
- [PDFKit](https://pdfkit.org/)

---

**Status**: Ready to implement
**Duration**: 2 weeks
**Dependencies**: Phase 3 completion
**Next Phase**: [Phase 5 - Places & Citizen Science](./05-phase5-places.md)