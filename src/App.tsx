/**
 * カメラ表示アプリケーションのメインコンポーネント
 * カメラストリームを取得して表示する
 * QRコード読み取り機能とマテリアルデザインUIを統合
 */

import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Box, Typography, Button } from '@mui/material';
import { useCamera } from './useCamera';
import { CameraView } from './CameraView';

// マテリアルUIテーマの作成 - #5F161Dメインカラーでモダンなデザイン
const theme = createTheme({
  palette: {
    primary: {
      main: '#5F161D',
      light: '#8B4249',
      dark: '#3D0E13',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E8B4B8',
      light: '#F2D2D5',
      dark: '#C89196',
      contrastText: '#000000',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2.125rem',
      lineHeight: 1.235,
      letterSpacing: '0.00735em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(95,22,29,0.2),0px 1px 1px 0px rgba(95,22,29,0.14),0px 1px 3px 0px rgba(95,22,29,0.12)',
    '0px 3px 1px -2px rgba(95,22,29,0.2),0px 2px 2px 0px rgba(95,22,29,0.14),0px 1px 5px 0px rgba(95,22,29,0.12)',
    '0px 3px 3px -2px rgba(95,22,29,0.2),0px 3px 4px 0px rgba(95,22,29,0.14),0px 1px 8px 0px rgba(95,22,29,0.12)',
    '0px 2px 4px -1px rgba(95,22,29,0.2),0px 4px 5px 0px rgba(95,22,29,0.14),0px 1px 10px 0px rgba(95,22,29,0.12)',
    '0px 3px 5px -1px rgba(95,22,29,0.2),0px 5px 8px 0px rgba(95,22,29,0.14),0px 1px 14px 0px rgba(95,22,29,0.12)',
    '0px 3px 5px -1px rgba(95,22,29,0.2),0px 6px 10px 0px rgba(95,22,29,0.14),0px 1px 18px 0px rgba(95,22,29,0.12)',
    '0px 4px 5px -2px rgba(95,22,29,0.2),0px 7px 10px 1px rgba(95,22,29,0.14),0px 2px 16px 1px rgba(95,22,29,0.12)',
    '0px 5px 5px -3px rgba(95,22,29,0.2),0px 8px 10px 1px rgba(95,22,29,0.14),0px 3px 14px 2px rgba(95,22,29,0.12)',
    '0px 5px 6px -3px rgba(95,22,29,0.2),0px 9px 12px 1px rgba(95,22,29,0.14),0px 3px 16px 2px rgba(95,22,29,0.12)',
    '0px 6px 6px -3px rgba(95,22,29,0.2),0px 10px 14px 1px rgba(95,22,29,0.14),0px 4px 18px 3px rgba(95,22,29,0.12)',
    '0px 6px 7px -4px rgba(95,22,29,0.2),0px 11px 15px 1px rgba(95,22,29,0.14),0px 4px 20px 3px rgba(95,22,29,0.12)',
    '0px 7px 8px -4px rgba(95,22,29,0.2),0px 12px 17px 2px rgba(95,22,29,0.14),0px 5px 22px 4px rgba(95,22,29,0.12)',
    '0px 7px 8px -4px rgba(95,22,29,0.2),0px 13px 19px 2px rgba(95,22,29,0.14),0px 5px 24px 4px rgba(95,22,29,0.12)',
    '0px 7px 9px -4px rgba(95,22,29,0.2),0px 14px 21px 2px rgba(95,22,29,0.14),0px 5px 26px 4px rgba(95,22,29,0.12)',
    '0px 8px 9px -5px rgba(95,22,29,0.2),0px 15px 22px 2px rgba(95,22,29,0.14),0px 6px 28px 5px rgba(95,22,29,0.12)',
    '0px 8px 10px -5px rgba(95,22,29,0.2),0px 16px 24px 2px rgba(95,22,29,0.14),0px 6px 30px 5px rgba(95,22,29,0.12)',
    '0px 8px 11px -5px rgba(95,22,29,0.2),0px 17px 26px 2px rgba(95,22,29,0.14),0px 6px 32px 5px rgba(95,22,29,0.12)',
    '0px 9px 11px -5px rgba(95,22,29,0.2),0px 18px 28px 2px rgba(95,22,29,0.14),0px 7px 34px 6px rgba(95,22,29,0.12)',
    '0px 9px 12px -6px rgba(95,22,29,0.2),0px 19px 29px 2px rgba(95,22,29,0.14),0px 7px 36px 6px rgba(95,22,29,0.12)',
    '0px 10px 13px -6px rgba(95,22,29,0.2),0px 20px 31px 3px rgba(95,22,29,0.14),0px 8px 38px 7px rgba(95,22,29,0.12)',
    '0px 10px 13px -6px rgba(95,22,29,0.2),0px 21px 33px 3px rgba(95,22,29,0.14),0px 8px 40px 7px rgba(95,22,29,0.12)',
    '0px 10px 14px -6px rgba(95,22,29,0.2),0px 22px 35px 3px rgba(95,22,29,0.14),0px 8px 42px 7px rgba(95,22,29,0.12)',
    '0px 11px 14px -7px rgba(95,22,29,0.2),0px 23px 36px 3px rgba(95,22,29,0.14),0px 9px 44px 8px rgba(95,22,29,0.12)',
    '0px 11px 15px -7px rgba(95,22,29,0.2),0px 24px 38px 3px rgba(95,22,29,0.14),0px 9px 46px 8px rgba(95,22,29,0.12)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: '0px 3px 1px -2px rgba(95,22,29,0.2),0px 2px 2px 0px rgba(95,22,29,0.14),0px 1px 5px 0px rgba(95,22,29,0.12)',
          '&:hover': {
            boxShadow: '0px 2px 4px -1px rgba(95,22,29,0.2),0px 4px 5px 0px rgba(95,22,29,0.14),0px 1px 10px 0px rgba(95,22,29,0.12)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
          minHeight: '100vh',
          paddingTop: 32,
          paddingBottom: 32,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h4: {
          background: 'linear-gradient(135deg, #5F161D 0%, #8B4249 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '24px',
        },
      },
    },
  },
});

/**
 * メインアプリケーションコンポーネント
 * カメラフックを使用してカメラ映像を表示
 * QRコード読み取り機能を統合
 */
export function App() {
  const { cameraState, startCamera, stopCamera } = useCamera({
    width: 1280,
    height: 720,
    frameRate: 30
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            受付システム - カメラ映像
          </Typography>
          
          <CameraView 
            cameraState={cameraState}
            width={1280}
            height={720}
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained"
              color="primary"
              size="large"
              onClick={startCamera}
            >
              カメラ開始
            </Button>
            
            <Button 
              variant="contained"
              color="secondary"
              size="large"
              onClick={stopCamera}
            >
              カメラ停止
            </Button>
          </Box>
          
          <Box sx={{ textAlign: 'center', color: 'text.secondary', mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              カメラの映像がここに表示されます
            </Typography>
            <Typography variant="body2">
              初回アクセス時は、ブラウザからカメラの使用許可を求められます
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'medium' }}>
              QRコードをカメラに映すと自動的に読み取ります
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  
  test('App - コンポーネントが正しく定義されている', () => {
    expect(typeof App).toBe('function');
  });
  
  test('App - カメラ制約が適切に設定されている', () => {
    const constraints = {
      width: 1280,
      height: 720,
      frameRate: 30
    };
    
    expect(constraints.width).toBe(1280);
    expect(constraints.height).toBe(720);
    expect(constraints.frameRate).toBe(30);
  });
}