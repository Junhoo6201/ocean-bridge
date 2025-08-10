import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { ishigakiTheme } from '@/styles/ishigaki-theme';
import type { Product } from '@/types/database';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t, i18n } = useTranslation('common');
  const isKorean = i18n.language === 'ko';
  
  return (
    <Link href={`/products/${product.id}`}>
      <div
        className="group cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02]"
        style={{
          background: ishigakiTheme.colors.background.elevated,
          boxShadow: ishigakiTheme.shadows.sm,
          border: `1px solid ${ishigakiTheme.colors.border.light}`,
        }}
      >
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={isKorean ? product.title_ko : product.title_ja}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div 
              className="h-full w-full flex items-center justify-center"
              style={{ background: ishigakiTheme.colors.background.secondary }}
            >
              <span className="text-6xl">🌊</span>
            </div>
          )}
          
          {/* Category Badge */}
          {product.category && (
            <div
              className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: ishigakiTheme.colors.semantic.coral,
                color: 'white',
              }}
            >
              {product.category === 'snorkel' ? t('products.snorkel') :
               product.category === 'diving' ? t('products.diving') :
               product.category === 'kayak' ? t('products.kayak') :
               product.category === 'sup' ? t('products.sup') :
               product.category === 'glassboat' ? t('products.glassboat') :
               product.category === 'stargazing' ? t('products.stargazing') :
               product.category === 'iriomote' ? t('products.iriomote') :
               product.category}
            </div>
          )}
          
          {/* Popular Badge */}
          {product.is_popular && (
            <div
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: ishigakiTheme.colors.brand.primary,
                color: 'white',
              }}
            >
              {t('products.popular')}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 
            className="text-lg font-semibold mb-2 line-clamp-1"
            style={{ color: ishigakiTheme.colors.text.primary }}
          >
            {isKorean ? product.title_ko : product.title_ja}
          </h3>
          
          {/* Tags */}
          <div className="flex gap-2 mb-3">
            {/* Duration */}
            <span 
              className="px-2 py-1 rounded text-xs"
              style={{
                background: ishigakiTheme.colors.background.secondary,
                color: ishigakiTheme.colors.text.secondary,
              }}
            >
              {Math.floor((product.duration_minutes || 0) / 60) > 0 
                ? `${Math.floor((product.duration_minutes || 0) / 60)}${t('common.hours')}` 
                : `${product.duration_minutes}${t('common.minutes')}`}
            </span>
            
            {/* Difficulty */}
            {product.difficulty && (
              <span 
                className="px-2 py-1 rounded text-xs"
                style={{
                  background: ishigakiTheme.colors.semantic.sand,
                  color: ishigakiTheme.colors.text.primary,
                }}
              >
                {product.difficulty === 'beginner' ? t('products.difficulty.beginner') :
                 product.difficulty === 'intermediate' ? t('products.difficulty.intermediate') :
                 product.difficulty === 'advanced' ? t('products.difficulty.advanced') :
                 product.difficulty === 'all' ? t('products.difficulty.all') :
                 product.difficulty}
              </span>
            )}
          </div>
          
          {/* Description */}
          <p 
            className="text-sm mb-4 line-clamp-2"
            style={{ color: ishigakiTheme.colors.text.secondary }}
          >
            {isKorean ? product.description_ko : product.description_ja}
          </p>
          
          {/* Price & Action */}
          <div className="flex justify-between items-center">
            <div>
              <p 
                className="text-xs"
                style={{ color: ishigakiTheme.colors.text.tertiary }}
              >
                {t('products.priceFrom')}
              </p>
              <p 
                className="text-xl font-bold"
                style={{ color: ishigakiTheme.colors.brand.primary }}
              >
                ₩{product.price_adult_krw?.toLocaleString()}
              </p>
              <p 
                className="text-xs"
                style={{ color: ishigakiTheme.colors.text.tertiary }}
              >
                {t('products.perPerson')}
              </p>
            </div>
            
            <button
              className="px-4 py-2 rounded-lg font-medium text-sm transition-all hover:scale-105"
              style={{
                background: ishigakiTheme.colors.brand.primary,
                color: 'white',
              }}
              onClick={(e) => {
                e.preventDefault();
                // Navigate handled by Link wrapper
              }}
            >
              {t('common.viewDetails')}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}