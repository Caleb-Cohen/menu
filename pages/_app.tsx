// These styles apply to every route in the application
import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

let theme = createTheme();

function initializeTheme() {
  const rootElement = document.getElementById('__next');

  return createTheme({
    components: {
      MuiPopover: {
        defaultProps: {
          container: rootElement,
        },
      },
      MuiPopper: {
        defaultProps: {
          container: rootElement,
        },
      },
      MuiDialog: {
        defaultProps: {
          container: rootElement,
        },
      },
      MuiModal: {
        defaultProps: {
          container: rootElement,
        },
      },
    },
  });
}

if (typeof document !== 'undefined') {
  theme = initializeTheme();
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />;
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
