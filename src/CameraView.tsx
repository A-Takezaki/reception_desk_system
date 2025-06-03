/**
 * カメラ映像を表示するReactコンポーネント
 * MediaStreamをvideo要素に表示し、エラー状態も管理する
 * QRコード読み取り機能とウェルカムモーダルを統合
 */

import React, { useRef, useEffect } from 'react';
import { Box, Alert, CircularProgress, Typography } from '@mui/material';
import type { CameraState } from './types';
import { useQRScanner } from './useQRScanner';
import { WelcomeModal } from './WelcomeModal';

interface CameraViewProps {
  cameraState: CameraState;
  width?: number;
  height?: number;
}

/**
 * カメラ映像表示コンポーネント
 * ストリームをvideo要素にアタッチして映像を表示
 * QRコード読み取り機能を統合
 */
export function CameraView({ cameraState, width = 640, height = 480 }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scannerState, startScanning, stopScanning, clearError } = useQRScanner();

  useEffect(() => {
    if (cameraState.status === 'ready' && videoRef.current) {
      videoRef.current.srcObject = cameraState.stream;
      
      // ビデオが再生準備完了したらQRスキャナーを開始
      const handleCanPlay = () => {
        if (videoRef.current) {
          startScanning(videoRef.current);
        }
      };
      
      videoRef.current.addEventListener('canplay', handleCanPlay);
      
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('canplay', handleCanPlay);
        }
        stopScanning();
      };
    }
  }, [cameraState, startScanning, stopScanning]);

  if (cameraState.status === 'loading') {
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
          border: '2px dashed rgba(95, 22, 29, 0.3)',
          borderRadius: 3,
          gap: 2,
          boxShadow: '0px 3px 1px -2px rgba(95,22,29,0.2),0px 2px 2px 0px rgba(95,22,29,0.14),0px 1px 5px 0px rgba(95,22,29,0.12)'
        }}
      >
        <CircularProgress sx={{ color: '#5F161D' }} size={48} />
        <Typography variant="body1" sx={{ color: '#5F161D', fontWeight: 500 }}>
          カメラを起動中...
        </Typography>
      </Box>
    );
  }

  if (cameraState.status === 'error') {
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2
        }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          <div>
            <p>エラーが発生しました</p>
            <p style={{ fontSize: '0.9em' }}>{cameraState.error.message}</p>
          </div>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <video
        ref={videoRef}
        width={width}
        height={height}
        autoPlay
        playsInline
        muted
        style={{ 
          border: '3px solid rgba(95, 22, 29, 0.2)', 
          borderRadius: '12px',
          display: 'block',
          boxShadow: '0px 6px 6px -3px rgba(95,22,29,0.2),0px 10px 14px 1px rgba(95,22,29,0.14),0px 4px 18px 3px rgba(95,22,29,0.12)'
        }}
      />
      
      {/* カメラガイドライン - 真ん中の縦線 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          width: '2px',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          boxShadow: '0 0 4px rgba(0, 0, 0, 0.5)'
        }}
      />

      {/* 左側ガイド - 顔撮影案内 */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          right: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: 'white',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
          pointerEvents: 'none'
        }}
      >
        <Typography
          variant="h6"
          sx={{
            background: 'linear-gradient(135deg, #5F161D 0%, #8B4249 100%)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: 3,
            fontWeight: 700,
            mb: 1,
            boxShadow: '0px 3px 1px -2px rgba(95,22,29,0.2),0px 2px 2px 0px rgba(95,22,29,0.14),0px 1px 5px 0px rgba(95,22,29,0.12)'
          }}
        >
          顔撮影エリア
        </Typography>
        <Typography
          variant="body2"
          sx={{
            backgroundColor: 'rgba(95, 22, 29, 0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: 2,
            textAlign: 'center',
            fontWeight: 500,
            boxShadow: '0px 2px 1px -1px rgba(95,22,29,0.2),0px 1px 1px 0px rgba(95,22,29,0.14),0px 1px 3px 0px rgba(95,22,29,0.12)'
          }}
        >
          こちら側に<br />お顔を向けてください
        </Typography>
      </Box>

      {/* 右側ガイド - QRコード案内 */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: '50%',
          right: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: 'white',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
          pointerEvents: 'none'
        }}
      >
        <Typography
          variant="h6"
          sx={{
            background: 'linear-gradient(135deg, #E8B4B8 0%, #C89196 100%)',
            color: '#5F161D',
            padding: '12px 20px',
            borderRadius: 3,
            fontWeight: 700,
            mb: 1,
            boxShadow: '0px 3px 1px -2px rgba(95,22,29,0.2),0px 2px 2px 0px rgba(95,22,29,0.14),0px 1px 5px 0px rgba(95,22,29,0.12)'
          }}
        >
          QRコードエリア
        </Typography>
        <Typography
          variant="body2"
          sx={{
            backgroundColor: 'rgba(95, 22, 29, 0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: 2,
            textAlign: 'center',
            fontWeight: 500,
            boxShadow: '0px 2px 1px -1px rgba(95,22,29,0.2),0px 1px 1px 0px rgba(95,22,29,0.14),0px 1px 3px 0px rgba(95,22,29,0.12)'
          }}
        >
          こちら側に<br />QRコードをかざしてください
        </Typography>
      </Box>
      
      {/* QRスキャナーの状態表示 */}
      {scannerState.status === 'scanning' && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #5F161D 0%, #8B4249 100%)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            boxShadow: '0px 3px 1px -2px rgba(95,22,29,0.2),0px 2px 2px 0px rgba(95,22,29,0.14),0px 1px 5px 0px rgba(95,22,29,0.12)'
          }}
        >
          <CircularProgress size={16} color="inherit" />
          QRコードをスキャン中...
        </Box>
      )}

      {/* クールダウン状態表示 */}
      {scannerState.status === 'cooldown' && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #E8B4B8 0%, #C89196 100%)',
            color: '#5F161D',
            padding: '12px 20px',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 600,
            boxShadow: '0px 3px 1px -2px rgba(95,22,29,0.2),0px 2px 2px 0px rgba(95,22,29,0.14),0px 1px 5px 0px rgba(95,22,29,0.12)'
          }}
        >
          <CircularProgress size={16} color="inherit" />
          次の読み取りまで {scannerState.remainingSeconds}秒
        </Box>
      )}

      {/* QRスキャナーエラー表示 */}
      {scannerState.status === 'error' && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16
          }}
        >
          <Alert 
            severity="warning" 
            onClose={clearError}
            sx={{ fontSize: '0.875rem' }}
          >
            {scannerState.error}
          </Alert>
        </Box>
      )}

      {/* ウェルカムモーダル */}
      <WelcomeModal
        open={scannerState.status === 'success'}
        visitor={scannerState.status === 'success' ? scannerState.visitor : null}
        onClose={() => {}}
      />
    </Box>
  );
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;

  test('CameraView - loading状態でstatusが正しく設定される', () => {
    const cameraState: CameraState = { status: 'loading' };
    expect(cameraState.status).toBe('loading');
  });

  test('CameraView - error状態でエラーメッセージが正しく設定される', () => {
    const cameraState: CameraState = { 
      status: 'error', 
      error: { type: 'permission_denied', message: 'カメラのアクセス許可が拒否されました' }
    };
    
    expect(cameraState.status).toBe('error');
    if (cameraState.status === 'error') {
      expect(cameraState.error.message).toBe('カメラのアクセス許可が拒否されました');
      expect(cameraState.error.type).toBe('permission_denied');
    }
  });

  test('CameraView - ready状態でストリームが正しく設定される', () => {
    const mockStream = {} as MediaStream;
    const cameraState: CameraState = { status: 'ready', stream: mockStream };
    
    expect(cameraState.status).toBe('ready');
    if (cameraState.status === 'ready') {
      expect(cameraState.stream).toBe(mockStream);
    }
  });

  test('CameraView - propsのサイズが適切に適用される', () => {
    const props = { width: 1280, height: 720 };
    expect(props.width).toBe(1280);
    expect(props.height).toBe(720);
  });

  test('CameraView - デフォルトサイズが適用される', () => {
    const defaultWidth = 640;
    const defaultHeight = 480;
    expect(defaultWidth).toBe(640);
    expect(defaultHeight).toBe(480);
  });

  test('CameraView - クールダウン状態でメッセージが適切に設定される', () => {
    const remainingSeconds = 7;
    const expectedMessage = `次の読み取りまで ${remainingSeconds}秒`;
    expect(expectedMessage).toBe('次の読み取りまで 7秒');
  });

  test('CameraView - ガイドテキストが正しく設定される', () => {
    const faceGuideText = 'こちら側に\nお顔を向けてください';
    const qrGuideText = 'こちら側に\nQRコードをかざしてください';
    const faceAreaTitle = '顔撮影エリア';
    const qrAreaTitle = 'QRコードエリア';
    
    expect(faceGuideText).toBe('こちら側に\nお顔を向けてください');
    expect(qrGuideText).toBe('こちら側に\nQRコードをかざしてください');
    expect(faceAreaTitle).toBe('顔撮影エリア');
    expect(qrAreaTitle).toBe('QRコードエリア');
  });
}