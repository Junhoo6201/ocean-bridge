# 📘 Phase 3: Messaging Bridge (Week 6-7)

## 개요
카카오톡과 LINE을 연결하는 양방향 메시징 브릿지를 구축하여 한국 고객과 일본 현지 샵 간의 실시간 커뮤니케이션을 가능하게 합니다.

## 🎯 목표
- ✅ Kakao Channel API 통합
- ✅ LINE Messaging API 통합
- ✅ 양방향 메시지 브릿지 구현
- ✅ 템플릿 시스템 구축
- ✅ 자동 번역 파이프라인
- ✅ 메시지 로깅 및 추적

## 📋 Task Breakdown

### Week 6: Kakao & LINE Setup

#### Day 1-2: Kakao Channel Setup
```typescript
// lib/kakao/client.ts
import axios from 'axios'

export class KakaoClient {
  private restApiKey: string
  private adminKey: string
  private channelId: string
  
  constructor() {
    this.restApiKey = process.env.KAKAO_REST_API_KEY!
    this.adminKey = process.env.KAKAO_ADMIN_KEY!
    this.channelId = process.env.KAKAO_CHANNEL_ID!
  }
  
  // 카카오톡 채널 메시지 발송
  async sendChannelMessage(userId: string, templateId: string, args: any) {
    const url = 'https://kapi.kakao.com/v1/api/talk/channels/message/send'
    
    const response = await axios.post(url, {
      receiver_id: userId,
      template_id: templateId,
      template_args: JSON.stringify(args)
    }, {
      headers: {
        'Authorization': `KakaoAK ${this.adminKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    
    return response.data
  }
  
  // 채널 친구 추가 상태 확인
  async checkChannelRelation(userId: string) {
    const url = `https://kapi.kakao.com/v1/api/talk/channels/${this.channelId}/relations`
    
    const response = await axios.get(url, {
      params: { user_ids: JSON.stringify([userId]) },
      headers: {
        'Authorization': `KakaoAK ${this.adminKey}`
      }
    })
    
    return response.data
  }
}
```

```typescript
// Kakao 메시지 템플릿 등록 (Kakao Developers Console에서 설정)
const kakaoTemplates = {
  // 예약 요청 접수 템플릿
  'booking_received': {
    object_type: 'text',
    text: '안녕하세요 #{user_name}님!\n\n#{product_name} 예약 요청이 접수되었습니다.\n\n📅 날짜: #{date}\n👥 인원: #{pax}명\n\n현지 샵에 확인 중이며, 곧 연락드리겠습니다.',
    link: {
      web_url: '#{booking_url}',
      mobile_web_url: '#{booking_url}'
    },
    button_title: '예약 상태 확인'
  },
  
  // 예약 가능 응답 템플릿
  'booking_available': {
    object_type: 'text',
    text: '#{user_name}님, 좋은 소식입니다! ✨\n\n#{product_name} 예약이 가능합니다.\n\n💰 금액: #{amount}원\n📍 집합: #{meeting_point}\n⏰ 시간: #{meeting_time}\n\n아래 버튼을 눌러 예약금을 결제해주세요.',
    buttons: [
      {
        title: '예약금 결제하기',
        link: {
          web_url: '#{payment_url}',
          mobile_web_url: '#{payment_url}'
        }
      }
    ]
  },
  
  // 기상 취소 알림 템플릿
  'weather_cancellation': {
    object_type: 'list',
    header_title: '⚠️ 기상 악화 안내',
    header_link: {
      web_url: '#{info_url}',
      mobile_web_url: '#{info_url}'
    },
    contents: [
      {
        title: '#{product_name}',
        description: '#{date} 투어가 기상 악화로 취소될 예정입니다.',
        image_url: '#{image_url}',
        link: {
          web_url: '#{booking_url}',
          mobile_web_url: '#{booking_url}'
        }
      }
    ],
    buttons: [
      {
        title: '날짜 변경',
        link: {
          web_url: '#{reschedule_url}',
          mobile_web_url: '#{reschedule_url}'
        }
      },
      {
        title: '환불 요청',
        link: {
          web_url: '#{refund_url}',
          mobile_web_url: '#{refund_url}'
        }
      }
    ]
  }
}
```

#### Day 3-4: LINE Messaging API Setup
```typescript
// lib/line/client.ts
import { Client, WebhookEvent, TextMessage, TemplateMessage } from '@line/bot-sdk'

export class LineClient {
  private client: Client
  
  constructor() {
    this.client = new Client({
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
      channelSecret: process.env.LINE_CHANNEL_SECRET!
    })
  }
  
  // LINE 메시지 발송
  async sendMessage(userId: string, messages: any[]) {
    return await this.client.pushMessage(userId, messages)
  }
  
  // 템플릿 메시지 생성
  createTemplateMessage(type: string, data: any): TemplateMessage {
    switch(type) {
      case 'booking_inquiry':
        return {
          type: 'template',
          altText: '予約確認依頼',
          template: {
            type: 'buttons',
            title: '予約確認依頼',
            text: `${data.date} ${data.product_name}\n${data.pax}名様\n可否をご確認ください`,
            actions: [
              {
                type: 'postback',
                label: '予約可能',
                data: `action=available&request_id=${data.request_id}`,
                displayText: '予約可能です'
              },
              {
                type: 'postback',
                label: '予約不可',
                data: `action=unavailable&request_id=${data.request_id}`,
                displayText: '予約不可です'
              },
              {
                type: 'postback',
                label: '代替案提示',
                data: `action=alternative&request_id=${data.request_id}`,
                displayText: '代替案があります'
              }
            ]
          }
        }
      
      case 'weather_alert':
        return {
          type: 'template',
          altText: '気象情報',
          template: {
            type: 'confirm',
            text: `⚠️ ${data.alert_type}\n\n${data.message}\n\n影響を受ける予約: ${data.affected_count}件`,
            actions: [
              {
                type: 'message',
                label: '確認',
                text: '気象情報を確認しました'
              },
              {
                type: 'uri',
                label: '詳細を見る',
                uri: data.detail_url
              }
            ]
          }
        }
        
      default:
        throw new Error(`Unknown template type: ${type}`)
    }
  }
  
  // Webhook イベント処理
  async handleWebhook(event: WebhookEvent) {
    if (event.type === 'message' && event.message.type === 'text') {
      // テキストメッセージ処理
      await this.processTextMessage(event)
    } else if (event.type === 'postback') {
      // ボタンアクション処理
      await this.processPostback(event)
    }
  }
  
  private async processPostback(event: any) {
    const data = new URLSearchParams(event.postback.data)
    const action = data.get('action')
    const requestId = data.get('request_id')
    
    // Bridge to Kakao
    await this.bridgeToKakao(requestId, action, event.source.userId)
  }
}
```

#### Day 5: Translation Pipeline
```typescript
// lib/translation/service.ts
import axios from 'axios'

export class TranslationService {
  private deeplApiKey: string
  private glossary: Map<string, string>
  
  constructor() {
    this.deeplApiKey = process.env.DEEPL_API_KEY!
    this.glossary = this.loadGlossary()
  }
  
  // 용어집 로드
  private loadGlossary(): Map<string, string> {
    return new Map([
      // 관광 용어
      ['다이빙', 'ダイビング'],
      ['스노클링', 'シュノーケリング'],
      ['픽업', 'ピックアップ'],
      ['집합 장소', '集合場所'],
      ['예약금', '予約金'],
      ['취소', 'キャンセル'],
      
      // 이시가키 특화 용어
      ['카비라만', '川平湾'],
      ['만타', 'マンタ'],
      ['산호초', 'サンゴ礁'],
      ['우에하라 항', '上原港'],
      ['오하라 항', '大原港'],
      ['이리오모테', '西表島'],
      
      // 안전/보험 용어
      ['보험', '保険'],
      ['안전 브리핑', '安全説明'],
      ['응급처치', '応急処置'],
      ['구명조끼', 'ライフジャケット'],
    ])
  }
  
  // 번역 실행
  async translate(
    text: string, 
    sourceLang: 'KO' | 'JA', 
    targetLang: 'KO' | 'JA'
  ): Promise<string> {
    // 용어집 적용
    let processedText = text
    if (sourceLang === 'KO') {
      this.glossary.forEach((ja, ko) => {
        processedText = processedText.replace(new RegExp(ko, 'g'), `[${ja}]`)
      })
    }
    
    // DeepL API 호출
    const response = await axios.post('https://api-free.deepl.com/v2/translate', {
      text: [processedText],
      source_lang: sourceLang,
      target_lang: targetLang,
      preserve_formatting: true
    }, {
      headers: {
        'Authorization': `DeepL-Auth-Key ${this.deeplApiKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    let translatedText = response.data.translations[0].text
    
    // 용어집 마커 제거
    translatedText = translatedText.replace(/\[([^\]]+)\]/g, '$1')
    
    return translatedText
  }
  
  // 위험/안전 문구 검증
  validateSafetyTerms(text: string): boolean {
    const safetyTerms = [
      '안전', '위험', '주의', '보험', '책임', '사고',
      '安全', '危険', '注意', '保険', '責任', '事故'
    ]
    
    return safetyTerms.some(term => text.includes(term))
  }
}
```

### Week 7: Bridge Implementation

#### Day 6-7: Message Bridge Core
```typescript
// supabase/functions/message-bridge/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { KakaoClient } from './kakao.ts'
import { LineClient } from './line.ts'
import { TranslationService } from './translation.ts'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_KEY')!
)

serve(async (req) => {
  const { action, data } = await req.json()
  
  const kakao = new KakaoClient()
  const line = new LineClient()
  const translator = new TranslationService()
  
  switch(action) {
    case 'inquiry_to_shop':
      // 고객 → 샵 (KO → JA)
      await handleInquiryToShop(data)
      break
      
    case 'response_to_customer':
      // 샵 → 고객 (JA → KO)
      await handleResponseToCustomer(data)
      break
      
    case 'broadcast_alert':
      // 시스템 → 전체 (양방향)
      await handleBroadcastAlert(data)
      break
  }
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})

async function handleInquiryToShop(data: any) {
  const { request_id, shop_line_id, message_ko } = data
  
  // 1. 번역
  const message_ja = await translator.translate(message_ko, 'KO', 'JA')
  
  // 2. LINE 템플릿 메시지 생성
  const lineMessage = line.createTemplateMessage('booking_inquiry', {
    request_id,
    date: data.date,
    product_name: data.product_name_ja,
    pax: data.pax,
    notes: message_ja
  })
  
  // 3. LINE 발송
  await line.sendMessage(shop_line_id, [lineMessage])
  
  // 4. 메시지 로그 저장
  await supabase.from('messages').insert({
    request_id,
    channel: 'line',
    sender: 'system',
    recipient: shop_line_id,
    text_content: message_ja,
    original_text: message_ko,
    lang: 'ja',
    meta: { template_type: 'booking_inquiry' }
  })
}

async function handleResponseToCustomer(data: any) {
  const { request_id, kakao_user_id, message_ja, action_type } = data
  
  // 1. 번역
  const message_ko = await translator.translate(message_ja, 'JA', 'KO')
  
  // 2. 액션 타입에 따른 카카오 템플릿 선택
  let templateId: string
  let templateArgs: any = {
    user_name: data.user_name,
    product_name: data.product_name_ko,
    date: data.date
  }
  
  switch(action_type) {
    case 'available':
      templateId = 'booking_available'
      templateArgs.amount = data.amount
      templateArgs.meeting_point = data.meeting_point_ko
      templateArgs.meeting_time = data.meeting_time
      templateArgs.payment_url = `${process.env.NEXT_PUBLIC_APP_URL}/payment/${request_id}`
      break
      
    case 'unavailable':
      templateId = 'booking_unavailable'
      templateArgs.reason = message_ko
      break
      
    case 'alternative':
      templateId = 'booking_alternative'
      templateArgs.alternatives = data.alternatives
      break
  }
  
  // 3. 카카오 발송
  await kakao.sendChannelMessage(kakao_user_id, templateId, templateArgs)
  
  // 4. 메시지 로그 저장
  await supabase.from('messages').insert({
    request_id,
    channel: 'kakao',
    sender: 'system',
    recipient: kakao_user_id,
    text_content: message_ko,
    original_text: message_ja,
    lang: 'ko',
    meta: { template_id, action_type }
  })
  
  // 5. 요청 상태 업데이트
  await updateRequestStatus(request_id, action_type)
}
```

#### Day 8-9: Webhook Handlers
```typescript
// app/api/webhook/kakao/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyKakaoWebhook } from '@/lib/kakao/verify'
import { processKakaoMessage } from '@/services/messaging'

export async function POST(req: NextRequest) {
  // 서명 검증
  const signature = req.headers.get('X-Kakao-Signature')
  const body = await req.text()
  
  if (!verifyKakaoWebhook(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  
  const data = JSON.parse(body)
  
  // 메시지 처리
  try {
    await processKakaoMessage(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Kakao webhook error:', error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}

// app/api/webhook/line/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { middleware, WebhookEvent } from '@line/bot-sdk'
import { processLineEvent } from '@/services/messaging'

const lineMiddleware = middleware({
  channelSecret: process.env.LINE_CHANNEL_SECRET!
})

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('X-Line-Signature')
  
  // 서명 검증
  try {
    lineMiddleware(body, signature)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  
  const events: WebhookEvent[] = JSON.parse(body).events
  
  // 이벤트 처리
  try {
    await Promise.all(events.map(processLineEvent))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('LINE webhook error:', error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
```

#### Day 10: Admin Messaging Interface
```typescript
// components/admin/MessageThread.tsx
import { useState, useEffect } from 'react'
import { Message } from '@/types/database'
import { Card, Input, Button, Avatar } from '@/components/ocean'
import { sendManualMessage } from '@/services/messaging'

export function MessageThread({ requestId }: { requestId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // 실시간 메시지 구독
  useEffect(() => {
    const subscription = supabase
      .channel(`messages:${requestId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `request_id=eq.${requestId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()
      
    return () => {
      subscription.unsubscribe()
    }
  }, [requestId])
  
  const handleSend = async () => {
    setIsLoading(true)
    try {
      await sendManualMessage(requestId, newMessage)
      setNewMessage('')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Card className="h-[600px] flex flex-col">
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === 'customer' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div className={`max-w-[70%] ${
              msg.sender === 'customer' 
                ? 'bg-gray-100' 
                : 'bg-blue-100'
            } rounded-lg p-3`}>
              <div className="text-xs text-gray-500 mb-1">
                {msg.channel} • {msg.lang} • {new Date(msg.created_at).toLocaleString()}
              </div>
              <div className="text-sm">{msg.text_content}</div>
              {msg.original_text && msg.original_text !== msg.text_content && (
                <div className="text-xs text-gray-400 mt-2 italic">
                  원문: {msg.original_text}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Input Area */}
      <div className="border-t p-4 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지 입력..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button
          onClick={handleSend}
          loading={isLoading}
          style={{
            background: theme.colors.brand.primary,
            color: 'white'
          }}
        >
          전송
        </Button>
      </div>
    </Card>
  )
}
```

## 🔧 Database Updates

```sql
-- Messages table
create table messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references requests(id),
  channel text check (channel in ('kakao','line','email','manual')),
  sender text not null, -- 'customer', 'shop', 'system', 'admin'
  recipient text,
  text_content text not null,
  original_text text, -- 번역 전 원문
  lang text check (lang in ('ko','ja','en')),
  meta jsonb, -- 템플릿 ID, 액션 타입 등
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Message templates
create table message_templates (
  id uuid primary key default gen_random_uuid(),
  platform text check (platform in ('kakao','line')),
  template_key text unique not null,
  template_name_ko text,
  template_name_ja text,
  content_ko text,
  content_ja text,
  variables text[], -- 필요한 변수 목록
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Translation glossary
create table translation_glossary (
  id uuid primary key default gen_random_uuid(),
  term_ko text not null,
  term_ja text not null,
  category text, -- 'tourism', 'safety', 'location', etc
  notes text,
  created_at timestamptz default now()
);

-- Indexes
create index idx_messages_request on messages(request_id);
create index idx_messages_created on messages(created_at desc);
create index idx_messages_channel on messages(channel);
```

## ✅ Deliverables Checklist

### API Integrations
- [ ] Kakao Channel API client
- [ ] LINE Messaging API client
- [ ] DeepL translation service
- [ ] Webhook endpoints

### Messaging Features
- [ ] Template message system
- [ ] Bidirectional bridge
- [ ] Auto-translation
- [ ] Message logging
- [ ] Real-time updates

### Admin Features
- [ ] Message thread viewer
- [ ] Manual message sending
- [ ] Template management
- [ ] Translation glossary

## 🧪 Testing Requirements

### Unit Tests
- [ ] Translation accuracy
- [ ] Template rendering
- [ ] Webhook verification
- [ ] Message routing

### Integration Tests  
- [ ] End-to-end message flow
- [ ] Translation pipeline
- [ ] Error handling
- [ ] Retry logic

### Manual Tests
- [ ] Kakao message delivery
- [ ] LINE button responses
- [ ] Real-time updates
- [ ] Admin interface

## 📝 Key Considerations

### Reliability
- Implement retry logic
- Queue failed messages
- Monitor delivery rates
- Handle API limits

### Security
- Verify webhook signatures
- Sanitize user input
- Encrypt sensitive data
- Log security events

### Performance
- Cache translations
- Batch message sending
- Optimize webhook processing
- Use connection pooling

## 🔄 Next Steps (Phase 4 Preview)
- Payment gateway integration
- Voucher generation
- Weather alert system
- Reminder notifications

## 📚 Resources
- [Kakao Developers](https://developers.kakao.com/docs/latest/ko/message/rest-api)
- [LINE Messaging API](https://developers.line.biz/en/docs/messaging-api/)
- [DeepL API](https://www.deepl.com/docs-api)

---

**Status**: Ready to implement
**Duration**: 2 weeks
**Dependencies**: Phase 2 completion
**Next Phase**: [Phase 4 - Payment & Operations](./04-phase4-payment.md)