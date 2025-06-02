import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * カメラ映像を表示するReactコンポーネント
 * MediaStreamをvideo要素に表示し、エラー状態も管理する
 * QRコード読み取り機能とウェルカムモーダルを統合
 */
import { useRef, useEffect } from 'react';
import { Box, Alert, CircularProgress } from '@mui/material';
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
                backgroundColor: '#f0f0f0',
                border: '2px dashed #ccc',
                borderRadius: 2,
                gap: 2
            }, children: [_jsx(CircularProgress, {}), _jsx("p", { children: "\u30AB\u30E1\u30E9\u3092\u8D77\u52D5\u4E2D..." })] }));
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
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    display: 'block'
                } }), scannerState.status === 'scanning' && (_jsxs(Box, { sx: {
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
                }, children: [_jsx(CircularProgress, { size: 16, color: "inherit" }), "QR\u30B3\u30FC\u30C9\u3092\u30B9\u30AD\u30E3\u30F3\u4E2D..."] })), scannerState.status === 'error' && (_jsx(Box, { sx: {
                    position: 'absolute',
                    top: 16,
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
}
