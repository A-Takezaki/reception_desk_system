/**
 * カメラアクセスを管理するReactフック
 * getUserMediaを使用してカメラストリームを取得し、状態を管理する
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
import { useState, useEffect, useCallback } from 'react';
/**
 * getUserMediaを使用してカメラストリームを取得する関数
 */
export function getCameraStream(constraints) {
    if (constraints === void 0) { constraints = {}; }
    return new Promise(function (resolve) {
        var _a;
        if (!((_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia)) {
            resolve({
                ok: false,
                error: { type: 'device_not_found', message: 'カメラAPIがサポートされていません' }
            });
            return;
        }
        var mediaConstraints = {
            video: {
                width: constraints.width || 640,
                height: constraints.height || 480,
                frameRate: constraints.frameRate || 30
            },
            audio: false
        };
        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(function (stream) {
            resolve({ ok: true, stream: stream });
        })
            .catch(function (error) {
            var cameraError;
            if (error.name === 'NotAllowedError') {
                cameraError = { type: 'permission_denied', message: 'カメラのアクセス許可が拒否されました' };
            }
            else if (error.name === 'NotFoundError') {
                cameraError = { type: 'device_not_found', message: 'カメラデバイスが見つかりません' };
            }
            else {
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
export function useCamera(constraints) {
    var _this = this;
    var _a = useState({ status: 'loading' }), cameraState = _a[0], setCameraState = _a[1];
    var startCamera = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setCameraState({ status: 'loading' });
                    return [4 /*yield*/, getCameraStream(constraints)];
                case 1:
                    result = _a.sent();
                    if (result.ok) {
                        setCameraState({ status: 'ready', stream: result.stream });
                    }
                    else {
                        setCameraState({ status: 'error', error: result.error });
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [constraints]);
    var stopCamera = useCallback(function () {
        if (cameraState.status === 'ready') {
            cameraState.stream.getTracks().forEach(function (track) { return track.stop(); });
        }
        setCameraState({ status: 'loading' });
    }, [cameraState]);
    useEffect(function () {
        startCamera();
        return function () {
            if (cameraState.status === 'ready') {
                cameraState.stream.getTracks().forEach(function (track) { return track.stop(); });
            }
        };
    }, []);
    return {
        cameraState: cameraState,
        startCamera: startCamera,
        stopCamera: stopCamera
    };
}
if (import.meta.vitest) {
    var _a = import.meta.vitest, test = _a.test, expect_1 = _a.expect, vi_1 = _a.vi;
    test('getCameraStream - 成功時にストリームを返す', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockStream, mockGetUserMedia, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockStream = {};
                    mockGetUserMedia = vi_1.fn().mockResolvedValue(mockStream);
                    Object.defineProperty(navigator, 'mediaDevices', {
                        value: { getUserMedia: mockGetUserMedia },
                        writable: true
                    });
                    return [4 /*yield*/, getCameraStream({ width: 1280, height: 720 })];
                case 1:
                    result = _a.sent();
                    expect_1(result.ok).toBe(true);
                    if (result.ok) {
                        expect_1(result.stream).toBe(mockStream);
                    }
                    expect_1(mockGetUserMedia).toHaveBeenCalledWith({
                        video: { width: 1280, height: 720, frameRate: 30 },
                        audio: false
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('getCameraStream - 許可拒否エラーを適切に処理', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockError, mockGetUserMedia, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockError = new Error('Permission denied');
                    mockError.name = 'NotAllowedError';
                    mockGetUserMedia = vi_1.fn().mockRejectedValue(mockError);
                    Object.defineProperty(navigator, 'mediaDevices', {
                        value: { getUserMedia: mockGetUserMedia },
                        writable: true
                    });
                    return [4 /*yield*/, getCameraStream()];
                case 1:
                    result = _a.sent();
                    expect_1(result.ok).toBe(false);
                    if (!result.ok) {
                        expect_1(result.error.type).toBe('permission_denied');
                        expect_1(result.error.message).toBe('カメラのアクセス許可が拒否されました');
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    test('getCameraStream - デバイス未検出エラーを適切に処理', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockError, mockGetUserMedia, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockError = new Error('Device not found');
                    mockError.name = 'NotFoundError';
                    mockGetUserMedia = vi_1.fn().mockRejectedValue(mockError);
                    Object.defineProperty(navigator, 'mediaDevices', {
                        value: { getUserMedia: mockGetUserMedia },
                        writable: true
                    });
                    return [4 /*yield*/, getCameraStream()];
                case 1:
                    result = _a.sent();
                    expect_1(result.ok).toBe(false);
                    if (!result.ok) {
                        expect_1(result.error.type).toBe('device_not_found');
                        expect_1(result.error.message).toBe('カメラデバイスが見つかりません');
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    test('getCameraStream - APIサポート外の場合のエラー処理', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Object.defineProperty(navigator, 'mediaDevices', {
                        value: undefined,
                        writable: true
                    });
                    return [4 /*yield*/, getCameraStream()];
                case 1:
                    result = _a.sent();
                    expect_1(result.ok).toBe(false);
                    if (!result.ok) {
                        expect_1(result.error.type).toBe('device_not_found');
                        expect_1(result.error.message).toBe('カメラAPIがサポートされていません');
                    }
                    return [2 /*return*/];
            }
        });
    }); });
}
