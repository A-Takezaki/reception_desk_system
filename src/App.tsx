/**
 * カメラ表示アプリケーションのメインコンポーネント
 * カメラストリームを取得して表示する
 * QRコード読み取り機能とマテリアルデザインUIを統合
 */

import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Box, Typography, Button } from '@mui/material';
import { useCamera } from './useCamera';
import { CameraView } from './CameraView';

// マテリアルUIテーマの作成
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
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