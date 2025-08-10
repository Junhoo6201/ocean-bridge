import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { ishigakiTheme } from '@/styles/ishigaki-theme';

export interface FilterState {
  category: string[];
  difficulty: string[];
  priceRange: [number, number];
  duration: string;
}

interface ProductFilterProps {
  onFilter: (filters: FilterState) => void;
  onReset?: () => void;
}

const CATEGORIES = [
  { value: 'diving', icon: '🤿' },
  { value: 'snorkel', icon: '🏊' },
  { value: 'sup', icon: '🏄' },
  { value: 'kayak', icon: '🚣' },
  { value: 'stargazing', icon: '⭐' },
  { value: 'glassboat', icon: '🚢' },
  { value: 'iriomote', icon: '🏝️' },
];

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'all'];

const DURATIONS = [
  { value: 'all', label: '전체' },
  { value: '60', label: '1시간 이내' },
  { value: '120', label: '2시간 이내' },
  { value: '240', label: '4시간 이내' },
  { value: '480', label: '종일' },
];

export function ProductFilter({ onFilter, onReset }: ProductFilterProps) {
  const { t } = useTranslation('common');
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    difficulty: [],
    priceRange: [0, 500000],
    duration: 'all',
  });

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter(c => c !== category)
      : [...filters.category, category];
    
    const newFilters = { ...filters, category: newCategories };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleDifficultyToggle = (difficulty: string) => {
    const newDifficulties = filters.difficulty.includes(difficulty)
      ? filters.difficulty.filter(d => d !== difficulty)
      : [...filters.difficulty, difficulty];
    
    const newFilters = { ...filters, difficulty: newDifficulties };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handlePriceChange = (value: number, index: number) => {
    const newRange: [number, number] = [...filters.priceRange] as [number, number];
    newRange[index] = value;
    
    const newFilters = { ...filters, priceRange: newRange };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleDurationChange = (duration: string) => {
    const newFilters = { ...filters, duration };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      category: [],
      difficulty: [],
      priceRange: [0, 500000],
      duration: 'all',
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
    onReset?.();
  };

  return (
    <div 
      className="p-6 rounded-xl"
      style={{
        background: ishigakiTheme.colors.background.elevated,
        boxShadow: ishigakiTheme.shadows.sm,
        border: `1px solid ${ishigakiTheme.colors.border.light}`,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 
          className="text-lg font-semibold"
          style={{ color: ishigakiTheme.colors.text.primary }}
        >
          {t('common.filter')}
        </h3>
        <button
          onClick={handleReset}
          className="text-sm px-3 py-1 rounded-lg transition-colors"
          style={{
            color: ishigakiTheme.colors.brand.primary,
            background: ishigakiTheme.colors.background.secondary,
          }}
        >
          초기화
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 
          className="text-sm font-medium mb-3"
          style={{ color: ishigakiTheme.colors.text.secondary }}
        >
          카테고리
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map(({ value, icon }) => (
            <button
              key={value}
              onClick={() => handleCategoryToggle(value)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm"
              style={{
                background: filters.category.includes(value) 
                  ? ishigakiTheme.colors.brand.primary 
                  : ishigakiTheme.colors.background.secondary,
                color: filters.category.includes(value) 
                  ? 'white' 
                  : ishigakiTheme.colors.text.primary,
                border: `1px solid ${filters.category.includes(value) 
                  ? ishigakiTheme.colors.brand.primary 
                  : ishigakiTheme.colors.border.light}`,
              }}
            >
              <span>{icon}</span>
              <span>{t(`products.${value}`)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="mb-6">
        <h4 
          className="text-sm font-medium mb-3"
          style={{ color: ishigakiTheme.colors.text.secondary }}
        >
          난이도
        </h4>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map(difficulty => (
            <button
              key={difficulty}
              onClick={() => handleDifficultyToggle(difficulty)}
              className="px-3 py-1 rounded-full text-sm transition-all"
              style={{
                background: filters.difficulty.includes(difficulty) 
                  ? ishigakiTheme.colors.semantic.tropical 
                  : ishigakiTheme.colors.background.secondary,
                color: filters.difficulty.includes(difficulty) 
                  ? 'white' 
                  : ishigakiTheme.colors.text.primary,
                border: `1px solid ${filters.difficulty.includes(difficulty) 
                  ? ishigakiTheme.colors.semantic.tropical 
                  : ishigakiTheme.colors.border.light}`,
              }}
            >
              {t(`products.difficulty.${difficulty}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 
          className="text-sm font-medium mb-3"
          style={{ color: ishigakiTheme.colors.text.secondary }}
        >
          가격대
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between text-sm" style={{ color: ishigakiTheme.colors.text.tertiary }}>
            <span>₩{filters.priceRange[0].toLocaleString()}</span>
            <span>₩{filters.priceRange[1].toLocaleString()}</span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="500000"
              step="10000"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange(parseInt(e.target.value), 0)}
              className="w-full"
              style={{
                accentColor: ishigakiTheme.colors.brand.primary,
              }}
            />
            <input
              type="range"
              min="0"
              max="500000"
              step="10000"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(parseInt(e.target.value), 1)}
              className="w-full"
              style={{
                accentColor: ishigakiTheme.colors.brand.primary,
              }}
            />
          </div>
        </div>
      </div>

      {/* Duration */}
      <div className="mb-6">
        <h4 
          className="text-sm font-medium mb-3"
          style={{ color: ishigakiTheme.colors.text.secondary }}
        >
          소요시간
        </h4>
        <select
          value={filters.duration}
          onChange={(e) => handleDurationChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm"
          style={{
            background: ishigakiTheme.colors.background.secondary,
            color: ishigakiTheme.colors.text.primary,
            border: `1px solid ${ishigakiTheme.colors.border.light}`,
          }}
        >
          {DURATIONS.map(duration => (
            <option key={duration.value} value={duration.value}>
              {duration.label}
            </option>
          ))}
        </select>
      </div>

      {/* Apply Button */}
      <button
        onClick={() => onFilter(filters)}
        className="w-full py-3 rounded-lg font-medium transition-all hover:scale-[1.02]"
        style={{
          background: ishigakiTheme.colors.brand.primary,
          color: 'white',
          boxShadow: ishigakiTheme.shadows.md,
        }}
      >
        필터 적용
      </button>
    </div>
  );
}