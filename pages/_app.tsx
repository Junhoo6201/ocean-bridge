import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { theme } from '../src/theme/theme';
import { GlobalStyles } from '../src/theme/globalStyles';
import { useEffect } from 'react';
import { supabase } from '../src/lib/supabase/client';
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from '../next-i18next.config.js';
import '../src/styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  // Initialize Supabase auth listener (only if configured)
  useEffect(() => {
    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event: string) => {
          // Handle auth state changes
          console.log('Auth event:', event);
        }
      );

      return () => {
        authListener?.subscription.unsubscribe();
      };
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default appWithTranslation(App, nextI18NextConfig);