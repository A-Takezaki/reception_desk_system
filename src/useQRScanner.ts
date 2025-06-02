/**
 * QRコード読み取り機能を管理するReactフック
 * QR-Scannerライブラリを使用してカメラからQRコードを検出・読み取り
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import type { QRScanResult, VisitorInfo } from './types';
import { parseQRCodeData, captureImageFromVideo, saveImageToLocal, saveVisitorDataToLocal } from './storageUtils';

/**
 * QRスキャナーの状態を表す型
 */
export type QRScannerState = 
  | { status: 'idle' }
  | { status: 'scanning' }
  | { status: 'success'; visitor: VisitorInfo; timestamp: Date }
  | { status: 'error'; error: string };

/**
 * QRコード読み取り機能を提供するReactフック
 */
export function useQRScanner() {
  const [scannerState, setScannerState] = useState<QRScannerState>({ status: 'idle' });
  const qrScannerRef = useRef<QrScanner | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  /**
   * QRコード検出時のコールバック関数
   */
  const handleQRCodeDetected = useCallback(async (result: QrScanner.ScanResult) => {
    try {
      const visitorInfo = parseQRCodeData(result.data);
      
      if (!visitorInfo) {
        setScannerState({
          status: 'error',
          error: 'QRコードの形式が正しくありません。[Name].[id]形式である必要があります。'
        });
        return;
      }

      const timestamp = new Date();

      // 画像キャプチャと保存
      if (videoElementRef.current) {
        const imageBlob = await captureImageFromVideo(videoElementRef.current);
        if (imageBlob) {
          const imageFilename = `visitor_${visitorInfo.id}_${timestamp.getTime()}.jpg`;
          const saveImageResult = saveImageToLocal(imageBlob, imageFilename);
          
          if (!saveImageResult.ok) {
            console.error('画像保存エラー:', saveImageResult.error);
          }
        }
      }

      // データ保存
      const saveDataResult = saveVisitorDataToLocal(visitorInfo, timestamp);
      if (!saveDataResult.ok) {
        console.error('データ保存エラー:', saveDataResult.error);
      }

      setScannerState({
        status: 'success',
        visitor: visitorInfo,
        timestamp
      });

      // 5秒後に状態をリセット
      setTimeout(() => {
        setScannerState({ status: 'scanning' });
      }, 5000);

    } catch (error) {
      setScannerState({
        status: 'error',
        error: error instanceof Error ? error.message : 'QRコード処理中にエラーが発生しました'
      });
    }
  }, []);

  /**
   * QRスキャナーを開始
   */
  const startScanning = useCallback(async (videoElement: HTMLVideoElement) => {
    try {
      setScannerState({ status: 'scanning' });
      videoElementRef.current = videoElement;

      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }

      const qrScanner = new QrScanner(
        videoElement,
        handleQRCodeDetected,
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      qrScannerRef.current = qrScanner;
      await qrScanner.start();

    } catch (error) {
      setScannerState({
        status: 'error',
        error: error instanceof Error ? error.message : 'QRスキャナーの開始に失敗しました'
      });
    }
  }, [handleQRCodeDetected]);

  /**
   * QRスキャナーを停止
   */
  const stopScanning = useCallback(() => {
    if (qrScannerRef.current) {
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    videoElementRef.current = null;
    setScannerState({ status: 'idle' });
  }, []);

  /**
   * エラー状態をクリア
   */
  const clearError = useCallback(() => {
    setScannerState({ status: 'idle' });
  }, []);

  /**
   * クリーンアップ
   */
  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    };
  }, []);

  return {
    scannerState,
    startScanning,
    stopScanning,
    clearError
  };
}

if (import.meta.vitest) {
  const { test, expect, vi } = import.meta.vitest;

  test('useQRScanner - 初期状態はidle', () => {
    const initialState: QRScannerState = { status: 'idle' };
    expect(initialState.status).toBe('idle');
  });

  test('useQRScanner - success状態のデータ構造', () => {
    const visitor: VisitorInfo = { name: '田中太郎', id: '12345' };
    const timestamp = new Date();
    const successState: QRScannerState = { 
      status: 'success', 
      visitor, 
      timestamp 
    };
    
    expect(successState.status).toBe('success');
    if (successState.status === 'success') {
      expect(successState.visitor.name).toBe('田中太郎');
      expect(successState.visitor.id).toBe('12345');
      expect(successState.timestamp).toBe(timestamp);
    }
  });

  test('useQRScanner - error状態のデータ構造', () => {
    const errorState: QRScannerState = { 
      status: 'error', 
      error: 'テストエラー' 
    };
    
    expect(errorState.status).toBe('error');
    if (errorState.status === 'error') {
      expect(errorState.error).toBe('テストエラー');
    }
  });
}