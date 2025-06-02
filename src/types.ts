/**
 * カメラアプリケーションのドメインモデル定義
 */

/**
 * カメラアクセスの結果を表す代数的データ型
 * 成功時はMediaStreamを、失敗時はエラー情報を含む
 */
export type CameraResult = {
  ok: true;
  stream: MediaStream;
} | {
  ok: false;
  error: CameraError;
}

/**
 * カメラアクセス時に発生するエラーの種類
 */
export type CameraError = 
  | { type: 'permission_denied'; message: string }
  | { type: 'device_not_found'; message: string }
  | { type: 'unknown_error'; message: string };

/**
 * カメラの状態を表す型
 * loading: カメラアクセス中
 * ready: カメラが使用可能
 * error: エラーが発生
 */
export type CameraState = 
  | { status: 'loading' }
  | { status: 'ready'; stream: MediaStream }
  | { status: 'error'; error: CameraError };

/**
 * カメラの制約設定
 * ビデオの解像度やフレームレートを制御
 */
export interface CameraConstraints {
  width?: number;
  height?: number;
  frameRate?: number;
}

/**
 * QRコード読み取り結果を表す代数的データ型
 * 成功時は来場者情報を、失敗時はエラー情報を含む
 */
export type QRScanResult = {
  ok: true;
  visitor: VisitorInfo;
  timestamp: Date;
} | {
  ok: false;
  error: string;
}

/**
 * 来場者情報
 * QRコードから抽出される [Name].[id] 形式のデータ
 */
export interface VisitorInfo {
  name: string;
  id: string;
}

/**
 * 画像保存結果を表す代数的データ型
 */
export type SaveImageResult = {
  ok: true;
  filePath: string;
} | {
  ok: false;
  error: string;
}

/**
 * データ保存結果を表す代数的データ型
 */
export type SaveDataResult = {
  ok: true;
  filePath: string;
} | {
  ok: false;
  error: string;
}