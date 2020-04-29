import '../styles/main.scss';
import '../styles/tailwind.min.css';

import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

const defaultTheme = createMuiTheme();

const theme = createMuiTheme({
    palette: {
        primary: {
            50: '#e8f3fb',
            100: '#c6e0f6',
            200: '#a1ccf0',
            300: '#7bb8ea',
            400: '#5ea8e6',
            500: '#4299e1',
            600: '#3c91dd',
            700: '#3386d9',
            800: '#2b7cd5',
            900: '#1d6bcd',
            A100: '#ffffff',
            A200: '#d0e3ff',
            A400: '#9dc5ff',
            A700: '#84b6ff',
            'contrastDefaultColor': 'light',
        }
    },    
    typography: {
      fontFamily: [
        'Nunito',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
    overrides: {
      MuiTableCell: {
        head: {
          fontWeight: 700
        }
      },
      MuiTab: {
        root: {
          color: '#aaa',
          textTransform: 'none',
        },
        wrapper: {
          [defaultTheme.breakpoints.up('md')]: {
            paddingLeft: 30,
            paddingRight: 30,
            fontSize: 16,
          },
        },
      },
      MuiSelect: {
        select: {
          '&:focus': {
            backgroundColor: 'white',
            borderRadius: 'inherit!important'
          }
        },
        outlined: {
          textAlign: 'left',
          paddingTop: '15px!important',
          paddingBottom: '15px!important',
        }
      },
      MuiOutlinedInput: {
        root: {
          borderWidth: 1,
          borderRadius: '0.25rem',
          width: '100%',
          fontSize: 26,
          height: 62,
          backgroundColor: 'white',
          paddingTop: '0!important',
          paddingLeft: '0!important',
          paddingBottom: '0!important',
          border: 'none!important',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.23)!important'
          },
          '&.select-sm': {
            height: 40,
            fontSize: 16,
            border: '1px solid rgb(226, 232, 240)!important',
          },
          '&.select-sm .MuiOutlinedInput-input': {
            paddingLeft: '13px!important'
          }
        },
        input: {
          padding: '.5rem 1.5rem!important',
          lineHeight: '1.25!important',
          color: '#4a5568!important',
          '&::placeholder': {
            opacity: '1!important',
            color: '#a0aec0!important'
          }
        },
        notchedOutline: {
          borderWidth: '0!important'
        }
      }
    }
});

class EnhancedApp extends App {
  static async getInitialProps({ Component, ctx }) {

    return {
        pageProps: Component.getInitialProps
            ? await Component.getInitialProps(ctx)
            : {}
    };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
    <ThemeProvider theme={theme}>
        <Component {...pageProps} />
    </ThemeProvider>
    );
  }
}

export default EnhancedApp;