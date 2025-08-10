# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ocean is a bilingual (Korean-Japanese) travel booking platform for Ishigaki Island, built with Next.js 15 and a custom design system. The platform connects Korean travelers with tour operators and activities in Ishigaki Island, Japan.

## Essential Commands

```bash
# Development
npm run dev              # Start Next.js dev server (port 3000)
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run typecheck       # Run TypeScript type checking (tsc --noEmit)

# Testing
npm test                # Run tests (currently not configured)
```

## Architecture & Key Patterns

### Dual Architecture Pattern
The project uses both Next.js pages directory and React SPA patterns:
- `/pages/` - Next.js routing with server-side capabilities
- `/src/` - Client-side React components and business logic
- Components often have optimized variants (e.g., `Button.optimized.tsx`)

### Ocean Design System
Custom design system with dual theming:
- **Linear Theme** (`theme.ts`): Dark professional theme for admin interfaces
- **Ishigaki Theme** (`ishigaki-theme.ts`): Tropical light theme for user-facing pages

Key design components: Button, Card, Badge, Input, Text, Carousel - all in `/src/components/OceanDesignSystem/`

### Database Architecture (Supabase)
- **Row Level Security** enabled on all tables
- **PostGIS** for geospatial features (meeting points, nearby places)
- **Multilingual Fields**: Content stored with `_ko` and `_ja` suffixes
- **Key Tables**: shops, products, places, bookings, policies

### Internationalization Strategy
- **Default locale**: Korean (`ko`)
- **Secondary**: Japanese (`ja`)
- **Implementation**: next-i18next with locale files in `/public/locales/`
- **Database**: Separate fields for each language (e.g., `name_ko`, `name_ja`)

### TypeScript Configuration
- **Strict mode** enabled
- **Path aliases**: 
  - `@/*` → `src/*`
  - `@components/*` → `src/components/*`
  - `@lib/*` → `src/lib/*`

### Component Development Patterns
1. Always check for existing Ocean Design System components before creating new ones
2. Components should support both theme variants
3. Use TypeScript interfaces for all props
4. Implement bilingual support using `useTranslation` hook
5. Consider creating optimized variants for performance-critical components

### Database Operations
- Use type-safe Supabase client from `/src/lib/supabase.ts`
- All database types are generated in `/src/types/database.types.ts`
- Service layer pattern in `/src/services/` for data access
- Remember RLS is enabled - handle authentication appropriately

### Booking System Flow
1. Product selection → 2. Meeting point selection → 3. Participant details → 4. Contact info → 5. Confirmation
- Booking data includes participants array with Korean names and ages
- Meeting places are linked via geospatial relationships

### Admin Dashboard
Located at `/admin` routes with product management capabilities:
- Product CRUD operations
- Image upload to Supabase storage
- Policy management
- Shop management

## Critical Considerations

### Performance
- Components have optimized variants for critical rendering paths
- Next.js Image component configured for Unsplash domain
- CSS optimization experimental features enabled

### Geospatial Features
- Database uses PostGIS for location-based queries
- `nearby_places` function calculates distances using Haversine formula
- Meeting points and places have latitude/longitude fields

### Content Management
- All user-facing content must support Korean and Japanese
- Admin interfaces primarily in Korean
- Product descriptions, policies, and place names require both language versions

### State Management
- React hooks for local state
- Supabase real-time subscriptions for live updates
- No global state management library - use prop drilling or context when needed