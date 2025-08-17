import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { ishigakiTheme } from '@/styles/ishigaki-theme';
import { createBookingRequest } from '@/services/booking';
import type { Product } from '@/types/database';

interface BookingFormData {
  date: string;
  adultCount: number;
  childCount: number;
  name: string;
  phone: string;
  email?: string;
  kakaoId?: string;
  specialRequests?: string;
  pickupLocation?: string;
}

interface BookingFormProps {
  product: Product;
}

export function BookingForm({ product }: BookingFormProps) {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const isKorean = i18n.language === 'ko';
  
  const [formData, setFormData] = useState<BookingFormData>({
    date: '',
    adultCount: 1,
    childCount: 0,
    name: '',
    phone: '',
    email: '',
    kakaoId: '',
    specialRequests: '',
    pickupLocation: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalAmount = 
    (product.price_adult_krw * formData.adultCount) + 
    ((product.price_child_krw || product.price_adult_krw) * formData.childCount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const request = await createBookingRequest({
        product_id: product.id,
        user_name: formData.name,
        user_phone: formData.phone,
        user_email: formData.email,
        user_kakao_id: formData.kakaoId,
        date: formData.date,
        adult_count: formData.adultCount,
        child_count: formData.childCount,
        special_requests: formData.specialRequests,
        pickup_location: formData.pickupLocation,
      });
      
      // Redirect to confirmation page
      router.push(`/booking/confirm/${request.id}`);
    } catch (error) {
      console.error('Booking request failed:', error);
      setError(isKorean ? '예약 요청 중 오류가 발생했습니다.' : '予約リクエスト中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get maximum date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div 
      className="p-6"
      style={{
        background: ishigakiTheme.colors.background.elevated,
      }}
    >
      <h2 
        className="text-xl font-bold mb-6"
        style={{ color: ishigakiTheme.colors.text.primary }}
      >
        {t('booking.requestBooking')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date Selection */}
        <div>
          <label 
            className="block text-sm font-medium mb-2"
            style={{ color: ishigakiTheme.colors.text.secondary }}
          >
            {t('booking.selectDate')} *
          </label>
          <input
            type="date"
            required
            min={minDate}
            max={maxDateStr}
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="w-full px-4 py-2 rounded-lg"
            style={{
              background: ishigakiTheme.colors.background.secondary,
              border: `1px solid ${ishigakiTheme.colors.border.light}`,
              color: ishigakiTheme.colors.text.primary,
            }}
          />
        </div>

        {/* Participant Count */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: ishigakiTheme.colors.text.secondary }}
            >
              {t('common.adult')} *
            </label>
            <select
              required
              value={formData.adultCount}
              onChange={(e) => handleInputChange('adultCount', parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg"
              style={{
                background: ishigakiTheme.colors.background.secondary,
                border: `1px solid ${ishigakiTheme.colors.border.light}`,
                color: ishigakiTheme.colors.text.primary,
              }}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}명</option>
              ))}
            </select>
          </div>
          
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: ishigakiTheme.colors.text.secondary }}
            >
              {t('common.child')}
            </label>
            <select
              value={formData.childCount}
              onChange={(e) => handleInputChange('childCount', parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg"
              style={{
                background: ishigakiTheme.colors.background.secondary,
                border: `1px solid ${ishigakiTheme.colors.border.light}`,
                color: ishigakiTheme.colors.text.primary,
              }}
            >
              {[...Array(11)].map((_, i) => (
                <option key={i} value={i}>{i}명</option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <label 
            className="block text-sm font-medium mb-2"
            style={{ color: ishigakiTheme.colors.text.secondary }}
          >
            {t('booking.name')} *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-2 rounded-lg"
            style={{
              background: ishigakiTheme.colors.background.secondary,
              border: `1px solid ${ishigakiTheme.colors.border.light}`,
              color: ishigakiTheme.colors.text.primary,
            }}
          />
        </div>

        <div>
          <label 
            className="block text-sm font-medium mb-2"
            style={{ color: ishigakiTheme.colors.text.secondary }}
          >
            {t('booking.phone')} *
          </label>
          <input
            type="tel"
            required
            placeholder="010-1234-5678"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-2 rounded-lg"
            style={{
              background: ishigakiTheme.colors.background.secondary,
              border: `1px solid ${ishigakiTheme.colors.border.light}`,
              color: ishigakiTheme.colors.text.primary,
            }}
          />
        </div>

        <div>
          <label 
            className="block text-sm font-medium mb-2"
            style={{ color: ishigakiTheme.colors.text.secondary }}
          >
            {t('booking.email')}
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-2 rounded-lg"
            style={{
              background: ishigakiTheme.colors.background.secondary,
              border: `1px solid ${ishigakiTheme.colors.border.light}`,
              color: ishigakiTheme.colors.text.primary,
            }}
          />
        </div>

        <div>
          <label 
            className="block text-sm font-medium mb-2"
            style={{ color: ishigakiTheme.colors.text.secondary }}
          >
            {t('booking.kakaoId')}
          </label>
          <input
            type="text"
            placeholder="kakao_id"
            value={formData.kakaoId}
            onChange={(e) => handleInputChange('kakaoId', e.target.value)}
            className="w-full px-4 py-2 rounded-lg"
            style={{
              background: ishigakiTheme.colors.background.secondary,
              border: `1px solid ${ishigakiTheme.colors.border.light}`,
              color: ishigakiTheme.colors.text.primary,
            }}
          />
        </div>

        {/* Special Requests */}
        <div>
          <label 
            className="block text-sm font-medium mb-2"
            style={{ color: ishigakiTheme.colors.text.secondary }}
          >
            {t('booking.specialRequests')}
          </label>
          <textarea
            rows={3}
            placeholder={isKorean ? '픽업 장소, 알레르기, 특별한 요구사항 등' : 'ピックアップ場所、アレルギー、特別なご要望など'}
            value={formData.specialRequests}
            onChange={(e) => handleInputChange('specialRequests', e.target.value)}
            className="w-full px-4 py-2 rounded-lg resize-none"
            style={{
              background: ishigakiTheme.colors.background.secondary,
              border: `1px solid ${ishigakiTheme.colors.border.light}`,
              color: ishigakiTheme.colors.text.primary,
            }}
          />
        </div>

        {/* Total Amount */}
        <div 
          className="p-4 rounded-lg"
          style={{
            background: ishigakiTheme.colors.semantic.sand,
            border: `1px solid ${ishigakiTheme.colors.border.light}`,
          }}
        >
          <div className="flex justify-between items-center">
            <span style={{ color: ishigakiTheme.colors.text.primary }}>
              예상 금액
            </span>
            <span 
              className="text-xl font-bold"
              style={{ color: ishigakiTheme.colors.brand.primary }}
            >
              ₩{totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            className="p-3 rounded-lg text-sm"
            style={{
              background: `${ishigakiTheme.colors.status.error}20`,
              color: ishigakiTheme.colors.status.error,
              border: `1px solid ${ishigakiTheme.colors.status.error}`,
            }}
          >
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-lg font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: ishigakiTheme.colors.brand.primary,
            color: 'white',
            boxShadow: ishigakiTheme.shadows.soft,
          }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⚡</span>
              {t('common.loading')}
            </span>
          ) : (
            t('booking.requestBooking')
          )}
        </button>

        {/* Notice */}
        <p 
          className="text-xs text-center"
          style={{ color: ishigakiTheme.colors.text.tertiary }}
        >
          * 예약 요청 후 카카오톡으로 상세 안내를 보내드립니다
        </p>
      </form>
    </div>
  );
}