/**
 * ストレージユーティリティ関数
 * 画像ファイルとデータファイルの保存機能を提供
 */

import type { SaveImageResult, SaveDataResult, VisitorInfo } from './types';

/**
 * カメラの映像から画像を撮影してBlobとして取得
 */
export function captureImageFromVideo(videoElement: HTMLVideoElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        resolve(null);
        return;
      }
      
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      context.drawImage(videoElement, 0, 0);
      
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.8);
      
    } catch (error) {
      console.error('画像キャプチャエラー:', error);
      resolve(null);
    }
  });
}

/**
 * 画像をローカルに保存（ダウンロード）
 * ブラウザ環境では直接ファイルシステムに書き込めないため、ダウンロード機能として実装
 */
export function saveImageToLocal(imageBlob: Blob, filename: string): SaveImageResult {
  try {
    const url = URL.createObjectURL(imageBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // 一時的にDOMに追加してクリック
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // URLオブジェクトをクリーンアップ
    URL.revokeObjectURL(url);
    
    return {
      ok: true,
      filePath: filename
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : '画像保存に失敗しました'
    };
  }
}

/**
 * 来場者データをJSONファイルとして保存（ダウンロード）
 */
export function saveVisitorDataToLocal(visitor: VisitorInfo, timestamp: Date): SaveDataResult {
  try {
    const data = {
      visitor,
      timestamp: timestamp.toISOString(),
      scannedAt: new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    const filename = `visitor_${visitor.id}_${timestamp.getTime()}.json`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    return {
      ok: true,
      filePath: filename
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'データ保存に失敗しました'
    };
  }
}

/**
 * QRコードの内容を解析して来場者情報を抽出
 * 想定フォーマット: [Name].[id]
 */
export function parseQRCodeData(qrText: string): VisitorInfo | null {
  try {
    // [Name].[id] 形式のパターンをチェック
    const match = qrText.match(/^(.+)\.([^.]+)$/);
    
    if (!match) {
      return null;
    }
    
    const [, name, id] = match;
    
    if (!name.trim() || !id.trim()) {
      return null;
    }
    
    return {
      name: name.trim(),
      id: id.trim()
    };
  } catch (error) {
    console.error('QRコードデータ解析エラー:', error);
    return null;
  }
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;

  test('parseQRCodeData - 正しい形式のQRコードデータを解析', () => {
    const result = parseQRCodeData('田中太郎.12345');
    expect(result).toEqual({
      name: '田中太郎',
      id: '12345'
    });
  });

  test('parseQRCodeData - 英語名の場合', () => {
    const result = parseQRCodeData('John Smith.67890');
    expect(result).toEqual({
      name: 'John Smith',
      id: '67890'
    });
  });

  test('parseQRCodeData - 不正な形式の場合', () => {
    expect(parseQRCodeData('invalid')).toBe(null);
    expect(parseQRCodeData('name.')).toBe(null);
    expect(parseQRCodeData('.id')).toBe(null);
    expect(parseQRCodeData('')).toBe(null);
  });

  test('parseQRCodeData - 複数のドットが含まれる場合', () => {
    const result = parseQRCodeData('田中.太郎.12345');
    expect(result).toEqual({
      name: '田中.太郎',
      id: '12345'
    });
  });

  test('captureImageFromVideo - 無効な引数の場合', async () => {
    // モックビデオ要素
    const mockVideo = {} as HTMLVideoElement;
    const result = await captureImageFromVideo(mockVideo);
    expect(result).toBe(null);
  });
}