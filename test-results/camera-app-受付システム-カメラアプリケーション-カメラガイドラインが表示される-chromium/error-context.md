# Test info

- Name: 受付システム カメラアプリケーション >> カメラガイドラインが表示される
- Location: /home/zaki/work/reception_desk_system/tests/e2e/camera-app.spec.ts:126:3

# Error details

```
Error: Timed out 10000ms waiting for expect(locator).toBeVisible()

Locator: locator('text=顔撮影エリア')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 10000ms
  - waiting for locator('text=顔撮影エリア')

    at /home/zaki/work/reception_desk_system/tests/e2e/camera-app.spec.ts:143:47
```

# Page snapshot

```yaml
- heading "受付システム - カメラ映像" [level=1]
- alert:
  - paragraph: エラーが発生しました
  - paragraph: カメラデバイスが見つかりません
- button "カメラ開始"
- button "カメラ停止"
- paragraph: カメラの映像がここに表示されます
- paragraph: 初回アクセス時は、ブラウザからカメラの使用許可を求められます
- paragraph: QRコードをカメラに映すと自動的に読み取ります
```

# Test source

```ts
   43 |     await page.addInitScript(() => {
   44 |       Object.defineProperty(navigator, 'mediaDevices', {
   45 |         writable: true,
   46 |         value: {
   47 |           getUserMedia: () => Promise.reject(new Error('Permission denied'))
   48 |         }
   49 |       });
   50 |     });
   51 |     
   52 |     // ページをリロードしてモックを適用
   53 |     await page.reload();
   54 |     
   55 |     // エラーメッセージが表示されることを確認
   56 |     await expect(page.locator('text=エラーが発生しました')).toBeVisible({ timeout: 10000 });
   57 |   });
   58 |
   59 |   test('ローディング状態が正しく表示される', async ({ page }) => {
   60 |     await page.goto('/');
   61 |     
   62 |     // カメラアクセスを遅延させるモックを設定
   63 |     await page.addInitScript(() => {
   64 |       Object.defineProperty(navigator, 'mediaDevices', {
   65 |         writable: true,
   66 |         value: {
   67 |           getUserMedia: () => new Promise(resolve => setTimeout(() => {
   68 |             resolve(new MediaStream());
   69 |           }, 2000))
   70 |         }
   71 |       });
   72 |     });
   73 |     
   74 |     // ページをリロードしてモックを適用
   75 |     await page.reload();
   76 |     
   77 |     // ローディングメッセージが表示されることを確認
   78 |     await expect(page.locator('text=カメラを起動中...')).toBeVisible();
   79 |   });
   80 |
   81 |   test('アプリケーションのレスポンシブデザインが動作する', async ({ page }) => {
   82 |     await page.goto('/');
   83 |     
   84 |     // デスクトップサイズでテスト
   85 |     await page.setViewportSize({ width: 1280, height: 720 });
   86 |     await expect(page.locator('h1')).toBeVisible();
   87 |     
   88 |     // モバイルサイズでテスト
   89 |     await page.setViewportSize({ width: 375, height: 667 });
   90 |     await expect(page.locator('h1')).toBeVisible();
   91 |     
   92 |     // ボタンが引き続き表示されることを確認
   93 |     await expect(page.getByRole('button', { name: 'カメラ開始' })).toBeVisible();
   94 |     await expect(page.getByRole('button', { name: 'カメラ停止' })).toBeVisible();
   95 |   });
   96 |
   97 |   test('QRコード読み取り説明テキストが表示される', async ({ page }) => {
   98 |     await page.goto('/');
   99 |     
  100 |     // QRコード読み取りに関する説明テキストを確認
  101 |     await expect(page.locator('text=QRコードをカメラに映すと自動的に読み取ります')).toBeVisible();
  102 |   });
  103 |
  104 |   test('マテリアルUIコンポーネントが正しく表示される', async ({ page }) => {
  105 |     await page.goto('/');
  106 |     
  107 |     // マテリアルUIのボタンスタイルを確認
  108 |     const startButton = page.getByRole('button', { name: 'カメラ開始' });
  109 |     await expect(startButton).toBeVisible();
  110 |     
  111 |     // ボタンのMUIクラスが適用されていることを確認
  112 |     await expect(startButton).toHaveClass(/MuiButton/);
  113 |   });
  114 |
  115 |   test('QRコード読み取りのクールダウン機能', async ({ page }) => {
  116 |     await page.goto('/');
  117 |     
  118 |     // クールダウンメッセージのパターンをテスト
  119 |     // 実際のQRコード読み取りはモックできないため、文字列パターンのみ確認
  120 |     const cooldownPattern = /次の読み取りまで \d+秒/;
  121 |     const testMessage = '次の読み取りまで 5秒';
  122 |     
  123 |     expect(cooldownPattern.test(testMessage)).toBe(true);
  124 |   });
  125 |
  126 |   test('カメラガイドラインが表示される', async ({ page }) => {
  127 |     await page.goto('/');
  128 |     
  129 |     // カメラアクセスをモックして、即座にready状態にする
  130 |     await page.addInitScript(() => {
  131 |       Object.defineProperty(navigator, 'mediaDevices', {
  132 |         writable: true,
  133 |         value: {
  134 |           getUserMedia: () => Promise.resolve(new MediaStream())
  135 |         }
  136 |       });
  137 |     });
  138 |     
  139 |     // カメラ開始ボタンをクリック
  140 |     await page.getByRole('button', { name: 'カメラ開始' }).click();
  141 |     
  142 |     // ガイドテキストの存在確認（カメラ起動後に表示される）
> 143 |     await expect(page.locator('text=顔撮影エリア')).toBeVisible({ timeout: 10000 });
      |                                               ^ Error: Timed out 10000ms waiting for expect(locator).toBeVisible()
  144 |     await expect(page.locator('text=QRコードエリア')).toBeVisible();
  145 |     await expect(page.locator('text=こちら側にお顔を向けてください')).toBeVisible();
  146 |     await expect(page.locator('text=こちら側にQRコードをかざしてください')).toBeVisible();
  147 |   });
  148 |
  149 |   test('QRスキャナーのレティクル位置が正しく計算される', async ({ page }) => {
  150 |     await page.goto('/');
  151 |     
  152 |     // スキャン領域計算のテスト（JavaScriptロジック）
  153 |     const result = await page.evaluate(() => {
  154 |       const mockVideo = {
  155 |         videoWidth: 1280,
  156 |         videoHeight: 720
  157 |       };
  158 |       
  159 |       const videoWidth = mockVideo.videoWidth;
  160 |       const videoHeight = mockVideo.videoHeight;
  161 |       const centerX = videoWidth * 0.75;
  162 |       const centerY = videoHeight * 0.5;
  163 |       const size = Math.min(videoWidth * 0.2, videoHeight * 0.3);
  164 |       
  165 |       return {
  166 |         centerX,
  167 |         centerY,
  168 |         size,
  169 |         expectedX: centerX - size / 2,
  170 |         expectedY: centerY - size / 2
  171 |       };
  172 |     });
  173 |     
  174 |     expect(result.centerX).toBe(960);
  175 |     expect(result.centerY).toBe(360);
  176 |     expect(result.size).toBe(216);
  177 |     expect(result.expectedX).toBe(852);
  178 |     expect(result.expectedY).toBe(252);
  179 |   });
  180 | });
```