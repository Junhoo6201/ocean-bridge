# Ocean - Ishigaki Connect

A modern travel booking platform for Ishigaki Island, Japan. Built with Next.js, TypeScript, and Ocean Design System.

## 🌊 Overview

Ishigaki Connect is a Korean-Japanese bilingual booking platform that connects Korean travelers with activities and tours in Ishigaki Island. The project features a custom Ocean Design System with beautiful, accessible components.

## 🚀 Features

- **Bilingual Support**: Full Korean and Japanese language support
- **Ocean Design System**: Custom component library with Ishigaki theme
- **Admin Dashboard**: Product management interface
- **Real-time Data**: Powered by Supabase
- **Responsive Design**: Mobile-first approach
- **Type-safe**: Built with TypeScript

## 🛠 Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Styled Components + Ocean Design System
- **Database**: Supabase (PostgreSQL)
- **i18n**: next-i18next
- **Package Manager**: npm

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ocean.git
cd ocean
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
ocean/
├── pages/                # Next.js pages
│   ├── admin/           # Admin dashboard pages
│   ├── products/        # Product pages
│   └── api/            # API routes
├── src/
│   ├── components/      # Ocean Design System components
│   │   ├── admin/      # Admin-specific components
│   │   └── ishigaki/   # Ishigaki theme components
│   ├── lib/            # Utilities and libraries
│   ├── styles/         # Global styles and themes
│   └── types/          # TypeScript type definitions
├── public/
│   └── locales/        # i18n translation files
└── supabase/           # Database migrations and scripts
```

## 🎨 Ocean Design System

The project includes a custom component library inspired by Linear's design system:

- **Components**: Button, Card, Badge, Hero, Footer, Navigation, and more
- **Ishigaki Theme**: Ocean-inspired colors and gradients
- **Accessibility**: WCAG compliant components
- **Performance**: Optimized for speed and efficiency

View the component showcase at [/components](http://localhost:3000/components)

## 🗄 Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the migration scripts in `supabase/migrations/`
3. Configure Row Level Security (RLS) policies

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

## 🚢 Deployment

The application can be deployed on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ocean)

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for Ishigaki Island travelers