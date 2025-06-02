/**
 * カメラアクセスを管理するReactフック
 * getUserMediaを使用してカメラストリームを取得し、状態を管理する
 */

import { useState, useEffect, useCallback } from 'react';
import type { CameraState, CameraConstraints, CameraResult, CameraError } from './types';

/**
 * getUserMediaを使用してカメラストリームを取得する関数
 */
export function getCameraStream(constraints: CameraConstraints = {}): Promise<CameraResult> {
  return new Promise((resolve) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      resolve({
        ok: false,
        error: { type: 'device_not_found', message: 'カメラAPIがサポートされていません' }
      });
      return;
    }

    const mediaConstraints: MediaStreamConstraints = {
      video: {
        width: constraints.width || 640,
        height: constraints.height || 480,
        frameRate: constraints.frameRate || 30
      },
      audio: false
    };

    navigator.mediaDevices.getUserMedia(mediaConstraints)
      .then((stream) => {
        resolve({ ok: true, stream });
      })
      .catch((error) => {
        let cameraError: CameraError;
        if (error.name === 'NotAllowedError') {
          cameraError = { type: 'permission_denied', message: 'カメラのアクセス許可が拒否されました' };
        } else if (error.name === 'NotFoundError') {
          cameraError = { type: 'device_not_found', message: 'カメラデバイスが見つかりません' };
        } else {
          cameraError = { type: 'unknown_error', message: error.message || '不明なエラーが発生しました' };
        }
        resolve({ ok: false, error: cameraError });
      });
  });
}

/**
 * カメラアクセスを管理するReactフック
 * カメラの状態を管理し、ストリームの開始・停止機能を提供する
 */
export function useCamera(constraints?: CameraConstraints) {
  const [cameraState, setCameraState] = useState<CameraState>({ status: 'loading' });

  const startCamera = useCallback(async () => {
    setCameraState({ status: 'loading' });
    const result = await getCameraStream(constraints);
    
    if (result.ok) {
      setCameraState({ status: 'ready', stream: result.stream });
    } else {
      setCameraState({ status: 'error', error: result.error });
    }
  }, [constraints]);

  const stopCamera = useCallback(() => {
    if (cameraState.status === 'ready') {
      cameraState.stream.getTracks().forEach(track => track.stop());
    }
    setCameraState({ status: 'loading' });
  }, [cameraState]);

  useEffect(() => {
    startCamera();
    return () => {
      if (cameraState.status === 'ready') {
        cameraState.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    cameraState,
    startCamera,
    stopCamera
  };
}

if (import.meta.vitest) {
  const { test, expect, vi } = import.meta.vitest;

  test('getCameraStream - 成功時にストリームを返す', async () => {
    const mockStream = {} as MediaStream;
    const mockGetUserMedia = vi.fn().mockResolvedValue(mockStream);
    
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: mockGetUserMedia },
      writable: true
    });

    const result = await getCameraStream({ width: 1280, height: 720 });
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.stream).toBe(mockStream);
    }
    expect(mockGetUserMedia).toHaveBeenCalledWith({
      video: { width: 1280, height: 720, frameRate: 30 },
      audio: false
    });
  });

  test('getCameraStream - 許可拒否エラーを適切に処理', async () => {
    const mockError = new Error('Permission denied');
    mockError.name = 'NotAllowedError';
    const mockGetUserMedia = vi.fn().mockRejectedValue(mockError);
    
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: mockGetUserMedia },
      writable: true
    });

    const result = await getCameraStream();
    
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('permission_denied');
      expect(result.error.message).toBe('カメラのアクセス許可が拒否されました');
    }
  });

  test('getCameraStream - デバイス未検出エラーを適切に処理', async () => {
    const mockError = new Error('Device not found');
    mockError.name = 'NotFoundError';
    const mockGetUserMedia = vi.fn().mockRejectedValue(mockError);
    
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: mockGetUserMedia },
      writable: true
    });

    const result = await getCameraStream();
    
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('device_not_found');
      expect(result.error.message).toBe('カメラデバイスが見つかりません');
    }
  });

  test('getCameraStream - APIサポート外の場合のエラー処理', async () => {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: undefined,
      writable: true
    });

    const result = await getCameraStream();
    
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('device_not_found');
      expect(result.error.message).toBe('カメラAPIがサポートされていません');
    }
  });
}