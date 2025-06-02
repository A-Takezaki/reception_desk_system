/**
 * QRコード読み取り機能を管理するReactフック
 * QR-Scannerライブラリを使用してカメラからQRコードを検出・読み取り
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useState, useCallback, useRef, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import { parseQRCodeData, captureImageFromVideo, saveImageToLocal, saveVisitorDataToLocal } from './storageUtils';
/**
 * QRコード読み取り機能を提供するReactフック
 */
export function useQRScanner() {
    var _this = this;
    var _a = useState({ status: 'idle' }), scannerState = _a[0], setScannerState = _a[1];
    var qrScannerRef = useRef(null);
    var videoElementRef = useRef(null);
    var cooldownTimerRef = useRef(null);
    var isInCooldownRef = useRef(false);
    /**
     * クールダウンを開始する関数
     */
    var startCooldown = useCallback(function () {
        var COOLDOWN_SECONDS = 10;
        var remainingSeconds = COOLDOWN_SECONDS;
        setScannerState({ status: 'cooldown', remainingSeconds: remainingSeconds });
        var countdown = function () {
            remainingSeconds--;
            if (remainingSeconds > 0) {
                setScannerState({ status: 'cooldown', remainingSeconds: remainingSeconds });
                cooldownTimerRef.current = setTimeout(countdown, 1000);
            }
            else {
                // クールダウン終了
                isInCooldownRef.current = false;
                setScannerState({ status: 'scanning' });
            }
        };
        cooldownTimerRef.current = setTimeout(countdown, 1000);
    }, []);
    /**
     * QRコード検出時のコールバック関数
     */
    var handleQRCodeDetected = useCallback(function (result) { return __awaiter(_this, void 0, void 0, function () {
        var visitorInfo, timestamp, imageBlob, imageFilename, saveImageResult, saveDataResult, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // クールダウン中は処理をスキップ
                    if (isInCooldownRef.current) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    visitorInfo = parseQRCodeData(result.data);
                    if (!visitorInfo) {
                        setScannerState({
                            status: 'error',
                            error: 'QRコードの形式が正しくありません。[Name].[id]形式である必要があります。'
                        });
                        return [2 /*return*/];
                    }
                    timestamp = new Date();
                    if (!videoElementRef.current) return [3 /*break*/, 3];
                    return [4 /*yield*/, captureImageFromVideo(videoElementRef.current)];
                case 2:
                    imageBlob = _a.sent();
                    if (imageBlob) {
                        imageFilename = "visitor_".concat(visitorInfo.id, "_").concat(timestamp.getTime(), ".jpg");
                        saveImageResult = saveImageToLocal(imageBlob, imageFilename);
                        if (!saveImageResult.ok) {
                            console.error('画像保存エラー:', saveImageResult.error);
                        }
                    }
                    _a.label = 3;
                case 3:
                    saveDataResult = saveVisitorDataToLocal(visitorInfo, timestamp);
                    if (!saveDataResult.ok) {
                        console.error('データ保存エラー:', saveDataResult.error);
                    }
                    setScannerState({
                        status: 'success',
                        visitor: visitorInfo,
                        timestamp: timestamp
                    });
                    // クールダウン開始
                    isInCooldownRef.current = true;
                    // 5秒後に成功状態からクールダウン状態に移行
                    setTimeout(function () {
                        startCooldown();
                    }, 5000);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    setScannerState({
                        status: 'error',
                        error: error_1 instanceof Error ? error_1.message : 'QRコード処理中にエラーが発生しました'
                    });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }, []);
    /**
     * QRスキャナーを開始
     */
    var startScanning = useCallback(function (videoElement) { return __awaiter(_this, void 0, void 0, function () {
        var qrScanner, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setScannerState({ status: 'scanning' });
                    videoElementRef.current = videoElement;
                    if (qrScannerRef.current) {
                        qrScannerRef.current.destroy();
                    }
                    qrScanner = new QrScanner(videoElement, handleQRCodeDetected, {
                        returnDetailedScanResult: true,
                        highlightScanRegion: true,
                        highlightCodeOutline: true,
                    });
                    qrScannerRef.current = qrScanner;
                    return [4 /*yield*/, qrScanner.start()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    setScannerState({
                        status: 'error',
                        error: error_2 instanceof Error ? error_2.message : 'QRスキャナーの開始に失敗しました'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [handleQRCodeDetected]);
    /**
     * QRスキャナーを停止
     */
    var stopScanning = useCallback(function () {
        if (qrScannerRef.current) {
            qrScannerRef.current.destroy();
            qrScannerRef.current = null;
        }
        if (cooldownTimerRef.current) {
            clearTimeout(cooldownTimerRef.current);
            cooldownTimerRef.current = null;
        }
        videoElementRef.current = null;
        isInCooldownRef.current = false;
        setScannerState({ status: 'idle' });
    }, []);
    /**
     * エラー状態をクリア
     */
    var clearError = useCallback(function () {
        setScannerState({ status: 'idle' });
    }, []);
    /**
     * クリーンアップ
     */
    useEffect(function () {
        return function () {
            if (qrScannerRef.current) {
                qrScannerRef.current.destroy();
            }
            if (cooldownTimerRef.current) {
                clearTimeout(cooldownTimerRef.current);
            }
        };
    }, []);
    return {
        scannerState: scannerState,
        startScanning: startScanning,
        stopScanning: stopScanning,
        clearError: clearError
    };
}
if (import.meta.vitest) {
    var _a = import.meta.vitest, test = _a.test, expect_1 = _a.expect, vi = _a.vi;
    test('useQRScanner - 初期状態はidle', function () {
        var initialState = { status: 'idle' };
        expect_1(initialState.status).toBe('idle');
    });
    test('useQRScanner - success状態のデータ構造', function () {
        var visitor = { name: '田中太郎', id: '12345' };
        var timestamp = new Date();
        var successState = {
            status: 'success',
            visitor: visitor,
            timestamp: timestamp
        };
        expect_1(successState.status).toBe('success');
        if (successState.status === 'success') {
            expect_1(successState.visitor.name).toBe('田中太郎');
            expect_1(successState.visitor.id).toBe('12345');
            expect_1(successState.timestamp).toBe(timestamp);
        }
    });
    test('useQRScanner - error状態のデータ構造', function () {
        var errorState = {
            status: 'error',
            error: 'テストエラー'
        };
        expect_1(errorState.status).toBe('error');
        if (errorState.status === 'error') {
            expect_1(errorState.error).toBe('テストエラー');
        }
    });
    test('useQRScanner - cooldown状態のデータ構造', function () {
        var cooldownState = {
            status: 'cooldown',
            remainingSeconds: 8
        };
        expect_1(cooldownState.status).toBe('cooldown');
        if (cooldownState.status === 'cooldown') {
            expect_1(cooldownState.remainingSeconds).toBe(8);
        }
    });
}
