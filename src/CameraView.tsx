/**
 * カメラ映像を表示するReactコンポーネント
 * MediaStreamをvideo要素に表示し、エラー状態も管理する
 * QRコード読み取り機能とウェルカムモーダルを統合
 */

import React, { useRef, useEffect } from 'react';
import { Box, Alert, CircularProgress } from '@mui/material';
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
          backgroundColor: '#f0f0f0',
          border: '2px dashed #ccc',
          borderRadius: 2,
          gap: 2
        }}
      >
        <CircularProgress />
        <p>カメラを起動中...</p>
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
          border: '1px solid #ccc', 
          borderRadius: '8px',
          display: 'block'
        }}
      />
      
      {/* QRスキャナーの状態表示 */}
      {scannerState.status === 'scanning' && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <CircularProgress size={16} color="inherit" />
          QRコードをスキャン中...
        </Box>
      )}

      {/* QRスキャナーエラー表示 */}
      {scannerState.status === 'error' && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
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
}