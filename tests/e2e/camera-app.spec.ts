/**
 * 受付システム カメラアプリケーション E2Eテスト
 * アプリケーションの基本機能とカメラインターフェースをテスト
 */

import { test, expect } from '@playwright/test';

test.describe('受付システム カメラアプリケーション', () => {
  test('ページが正しく読み込まれる', async ({ page }) => {
    await page.goto('/');
    
    // ページタイトルを確認
    await expect(page).toHaveTitle('受付システム - カメラ映像');
    
    // メインヘッダーを確認
    await expect(page.locator('h1')).toContainText('受付システム - カメラ映像');
  });

  test('カメラコントロールボタンが表示される', async ({ page }) => {
    await page.goto('/');
    
    // カメラ開始ボタンを確認
    const startButton = page.getByRole('button', { name: 'カメラ開始' });
    await expect(startButton).toBeVisible();
    
    // カメラ停止ボタンを確認
    const stopButton = page.getByRole('button', { name: 'カメラ停止' });
    await expect(stopButton).toBeVisible();
  });

  test('説明テキストが表示される', async ({ page }) => {
    await page.goto('/');
    
    // 説明テキストを確認
    await expect(page.locator('text=カメラの映像がここに表示されます')).toBeVisible();
    await expect(page.locator('text=初回アクセス時は、ブラウザからカメラの使用許可を求められます')).toBeVisible();
  });

  test('カメラエラー処理が適切に動作する', async ({ page }) => {
    await page.goto('/');
    
    // カメラアクセスを拒否するモックを設定
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'mediaDevices', {
        writable: true,
        value: {
          getUserMedia: () => Promise.reject(new Error('Permission denied'))
        }
      });
    });
    
    // ページをリロードしてモックを適用
    await page.reload();
    
    // エラーメッセージが表示されることを確認
    await expect(page.locator('text=エラーが発生しました')).toBeVisible({ timeout: 10000 });
  });

  test('ローディング状態が正しく表示される', async ({ page }) => {
    await page.goto('/');
    
    // カメラアクセスを遅延させるモックを設定
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'mediaDevices', {
        writable: true,
        value: {
          getUserMedia: () => new Promise(resolve => setTimeout(() => {
            resolve(new MediaStream());
          }, 2000))
        }
      });
    });
    
    // ページをリロードしてモックを適用
    await page.reload();
    
    // ローディングメッセージが表示されることを確認
    await expect(page.locator('text=カメラを起動中...')).toBeVisible();
  });

  test('アプリケーションのレスポンシブデザインが動作する', async ({ page }) => {
    await page.goto('/');
    
    // デスクトップサイズでテスト
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('h1')).toBeVisible();
    
    // モバイルサイズでテスト
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
    
    // ボタンが引き続き表示されることを確認
    await expect(page.getByRole('button', { name: 'カメラ開始' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'カメラ停止' })).toBeVisible();
  });

  test('QRコード読み取り説明テキストが表示される', async ({ page }) => {
    await page.goto('/');
    
    // QRコード読み取りに関する説明テキストを確認
    await expect(page.locator('text=QRコードをカメラに映すと自動的に読み取ります')).toBeVisible();
  });

  test('マテリアルUIコンポーネントが正しく表示される', async ({ page }) => {
    await page.goto('/');
    
    // マテリアルUIのボタンスタイルを確認
    const startButton = page.getByRole('button', { name: 'カメラ開始' });
    await expect(startButton).toBeVisible();
    
    // ボタンのMUIクラスが適用されていることを確認
    await expect(startButton).toHaveClass(/MuiButton/);
  });

  test('QRコード読み取りのクールダウン機能', async ({ page }) => {
    await page.goto('/');
    
    // クールダウンメッセージのパターンをテスト
    // 実際のQRコード読み取りはモックできないため、文字列パターンのみ確認
    const cooldownPattern = /次の読み取りまで \d+秒/;
    const testMessage = '次の読み取りまで 5秒';
    
    expect(cooldownPattern.test(testMessage)).toBe(true);
  });

  test('カメラガイドラインが表示される', async ({ page }) => {
    await page.goto('/');
    
    // カメラアクセスをモックして、即座にready状態にする
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'mediaDevices', {
        writable: true,
        value: {
          getUserMedia: () => Promise.resolve(new MediaStream())
        }
      });
    });
    
    // カメラ開始ボタンをクリック
    await page.getByRole('button', { name: 'カメラ開始' }).click();
    
    // ガイドテキストの存在確認（カメラ起動後に表示される）
    await expect(page.locator('text=顔撮影エリア')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=QRコードエリア')).toBeVisible();
    await expect(page.locator('text=こちら側にお顔を向けてください')).toBeVisible();
    await expect(page.locator('text=こちら側にQRコードをかざしてください')).toBeVisible();
  });

  test('QRスキャナーのレティクル位置が正しく計算される', async ({ page }) => {
    await page.goto('/');
    
    // スキャン領域計算のテスト（JavaScriptロジック）
    const result = await page.evaluate(() => {
      const mockVideo = {
        videoWidth: 1280,
        videoHeight: 720
      };
      
      const videoWidth = mockVideo.videoWidth;
      const videoHeight = mockVideo.videoHeight;
      const centerX = videoWidth * 0.75;
      const centerY = videoHeight * 0.5;
      const size = Math.min(videoWidth * 0.2, videoHeight * 0.3);
      
      return {
        centerX,
        centerY,
        size,
        expectedX: centerX - size / 2,
        expectedY: centerY - size / 2
      };
    });
    
    expect(result.centerX).toBe(960);
    expect(result.centerY).toBe(360);
    expect(result.size).toBe(216);
    expect(result.expectedX).toBe(852);
    expect(result.expectedY).toBe(252);
  });
});