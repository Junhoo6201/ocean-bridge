import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import { GlobalStyles } from './theme/globalStyles';
import { Components } from './pages/Components';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Components />
    </ThemeProvider>
  );
}

export default App;