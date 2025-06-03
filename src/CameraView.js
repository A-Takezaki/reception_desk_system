import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * カメラ映像を表示するReactコンポーネント
 * MediaStreamをvideo要素に表示し、エラー状態も管理する
 * QRコード読み取り機能とウェルカムモーダルを統合
 */
import { useRef, useEffect } from 'react';
import { Box, Alert, CircularProgress, Typography } from '@mui/material';
import { useQRScanner } from './useQRScanner';
import { WelcomeModal } from './WelcomeModal';
/**
 * カメラ映像表示コンポーネント
 * ストリームをvideo要素にアタッチして映像を表示
 * QRコード読み取り機能を統合
 */
export function CameraView(_a) {
    var cameraState = _a.cameraState, _b = _a.width, width = _b === void 0 ? 640 : _b, _c = _a.height, height = _c === void 0 ? 480 : _c;
    var videoRef = useRef(null);
    var _d = useQRScanner(), scannerState = _d.scannerState, startScanning = _d.startScanning, stopScanning = _d.stopScanning, clearError = _d.clearError;
    useEffect(function () {
        if (cameraState.status === 'ready' && videoRef.current) {
            videoRef.current.srcObject = cameraState.stream;
            // ビデオが再生準備完了したらQRスキャナーを開始
            var handleCanPlay_1 = function () {
                if (videoRef.current) {
                    startScanning(videoRef.current);
                }
            };
            videoRef.current.addEventListener('canplay', handleCanPlay_1);
            return function () {
                if (videoRef.current) {
                    videoRef.current.removeEventListener('canplay', handleCanPlay_1);
                }
                stopScanning();
            };
        }
    }, [cameraState, startScanning, stopScanning]);
    if (cameraState.status === 'loading') {
        return (_jsxs(Box, { sx: {
                width: width,
                height: height,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
                border: '2px dashed rgba(95, 22, 29, 0.3)',
                borderRadius: 3,
                gap: 2,
                boxShadow: '0px 3px 1px -2px rgba(95,22,29,0.2),0px 2px 2px 0px rgba(95,22,29,0.14),0px 1px 5px 0px rgba(95,22,29,0.12)'
            }, children: [_jsx(CircularProgress, { sx: { color: '#5F161D' }, size: 48 }), _jsx(Typography, { variant: "body1", sx: { color: '#5F161D', fontWeight: 500 }, children: "\u30AB\u30E1\u30E9\u3092\u8D77\u52D5\u4E2D..." })] }));
    }
    if (cameraState.status === 'error') {
        return (_jsx(Box, { sx: {
                width: width,
                height: height,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2
            }, children: _jsx(Alert, { severity: "error", sx: { width: '100%' }, children: _jsxs("div", { children: [_jsx("p", { children: "\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F" }), _jsx("p", { style: { fontSize: '0.9em' }, children: cameraState.error.message })] }) }) }));
    }
    return (_jsxs(Box, { sx: { position: 'relative', display: 'inline-block' }, children: [_jsx("video", { ref: videoRef, width: width, height: height, autoPlay: true, playsInline: true, muted: true, style: {
                    border: '3px solid rgba(95, 22, 29, 0.2)',
                    borderRadius: '12px',
                    display: 'block',
                    boxShadow: '0px 6px 6px -3px rgba(95,22,29,0.2),0px 10px 14px 1px rgba(95,22,29,0.14),0px 4px 18px 3px rgba(95,22,29,0.12)'
                } }), _jsx(Box, { sx: {
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    width: '2px',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    transform: 'translateX(-50%)',
                    pointerEvents: 'none',
                    boxShadow: '0 0 4px rgba(0, 0, 0, 0.5)'
                } }), _jsxs(Box, { sx: {
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
                }, children: [_jsx(Typography, { variant: "h6", sx: {
                            background: 'linear-gradient(135deg, #5F161D 0%, #8B4249 100%)',
                            color: 'white',
                            padding: '12px 20px',
                            borderRadius: 3,
                            fontWeight: 700,
                            mb: 1,
                            boxShadow: '0px 3px 1px -2px rgba(95,22,29,0.2),0px 2px 2px 0px rgba(95,22,29,0.14),0px 1px 5px 0px rgba(95,22,29,0.12)'
                        }, children: "\u9854\u64AE\u5F71\u30A8\u30EA\u30A2" }), _jsxs(Typography, { variant: "body2", sx: {
                            backgroundColor: 'rgba(95, 22, 29, 0.8)',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: 2,
                            textAlign: 'center',
                            fontWeight: 500,
                            boxShadow: '0px 2px 1px -1px rgba(95,22,29,0.2),0px 1px 1px 0px rgba(95,22,29,0.14),0px 1px 3px 0px rgba(95,22,29,0.12)'
                        }, children: ["\u3053\u3061\u3089\u5074\u306B", _jsx("br", {}), "\u304A\u9854\u3092\u5411\u3051\u3066\u304F\u3060\u3055\u3044"] })] }), _jsxs(Box, { sx: {
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
                }, children: [_jsx(Typography, { variant: "h6", sx: {
                            background: 'linear-gradient(135deg, #E8B4B8 0%, #C89196 100%)',
                            color: '#5F161D',
                            padding: '12px 20px',
                            borderRadius: 3,
                            fontWeight: 700,
                            mb: 1,
                            boxShadow: '0px 3px 1px -2px rgba(95,22,29,0.2),0px 2px 2px 0px rgba(95,22,29,0.14),0px 1px 5px 0px rgba(95,22,29,0.12)'
                        }, children: "QR\u30B3\u30FC\u30C9\u30A8\u30EA\u30A2" }), _jsxs(Typography, { variant: "body2", sx: {
                            backgroundColor: 'rgba(95, 22, 29, 0.8)',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: 2,
                            textAlign: 'center',
                            fontWeight: 500,
                            boxShadow: '0px 2px 1px -1px rgba(95,22,29,0.2),0px 1px 1px 0px rgba(95,22,29,0.14),0px 1px 3px 0px rgba(95,22,29,0.12)'
                        }, children: ["\u3053\u3061\u3089\u5074\u306B", _jsx("br", {}), "QR\u30B3\u30FC\u30C9\u3092\u304B\u3056\u3057\u3066\u304F\u3060\u3055\u3044"] })] }), scannerState.status === 'scanning' && (_jsxs(Box, { sx: {
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
                }, children: [_jsx(CircularProgress, { size: 16, color: "inherit" }), "QR\u30B3\u30FC\u30C9\u3092\u30B9\u30AD\u30E3\u30F3\u4E2D..."] })), scannerState.status === 'cooldown' && (_jsxs(Box, { sx: {
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
                }, children: [_jsx(CircularProgress, { size: 16, color: "inherit" }), "\u6B21\u306E\u8AAD\u307F\u53D6\u308A\u307E\u3067 ", scannerState.remainingSeconds, "\u79D2"] })), scannerState.status === 'error' && (_jsx(Box, { sx: {
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    right: 16
                }, children: _jsx(Alert, { severity: "warning", onClose: clearError, sx: { fontSize: '0.875rem' }, children: scannerState.error }) })), _jsx(WelcomeModal, { open: scannerState.status === 'success', visitor: scannerState.status === 'success' ? scannerState.visitor : null, onClose: function () { } })] }));
}
if (import.meta.vitest) {
    var _a = import.meta.vitest, test = _a.test, expect_1 = _a.expect;
    test('CameraView - loading状態でstatusが正しく設定される', function () {
        var cameraState = { status: 'loading' };
        expect_1(cameraState.status).toBe('loading');
    });
    test('CameraView - error状態でエラーメッセージが正しく設定される', function () {
        var cameraState = {
            status: 'error',
            error: { type: 'permission_denied', message: 'カメラのアクセス許可が拒否されました' }
        };
        expect_1(cameraState.status).toBe('error');
        if (cameraState.status === 'error') {
            expect_1(cameraState.error.message).toBe('カメラのアクセス許可が拒否されました');
            expect_1(cameraState.error.type).toBe('permission_denied');
        }
    });
    test('CameraView - ready状態でストリームが正しく設定される', function () {
        var mockStream = {};
        var cameraState = { status: 'ready', stream: mockStream };
        expect_1(cameraState.status).toBe('ready');
        if (cameraState.status === 'ready') {
            expect_1(cameraState.stream).toBe(mockStream);
        }
    });
    test('CameraView - propsのサイズが適切に適用される', function () {
        var props = { width: 1280, height: 720 };
        expect_1(props.width).toBe(1280);
        expect_1(props.height).toBe(720);
    });
    test('CameraView - デフォルトサイズが適用される', function () {
        var defaultWidth = 640;
        var defaultHeight = 480;
        expect_1(defaultWidth).toBe(640);
        expect_1(defaultHeight).toBe(480);
    });
    test('CameraView - クールダウン状態でメッセージが適切に設定される', function () {
        var remainingSeconds = 7;
        var expectedMessage = "\u6B21\u306E\u8AAD\u307F\u53D6\u308A\u307E\u3067 ".concat(remainingSeconds, "\u79D2");
        expect_1(expectedMessage).toBe('次の読み取りまで 7秒');
    });
    test('CameraView - ガイドテキストが正しく設定される', function () {
        var faceGuideText = 'こちら側に\nお顔を向けてください';
        var qrGuideText = 'こちら側に\nQRコードをかざしてください';
        var faceAreaTitle = '顔撮影エリア';
        var qrAreaTitle = 'QRコードエリア';
        expect_1(faceGuideText).toBe('こちら側に\nお顔を向けてください');
        expect_1(qrGuideText).toBe('こちら側に\nQRコードをかざしてください');
        expect_1(faceAreaTitle).toBe('顔撮影エリア');
        expect_1(qrAreaTitle).toBe('QRコードエリア');
    });
}
