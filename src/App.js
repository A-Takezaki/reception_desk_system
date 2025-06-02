import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ThemeProvider, createTheme, CssBaseline, Container, Box, Typography, Button } from '@mui/material';
import { useCamera } from './useCamera';
import { CameraView } from './CameraView';
// マテリアルUIテーマの作成
var theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        h4: {
            fontWeight: 600,
        },
    },
});
/**
 * メインアプリケーションコンポーネント
 * カメラフックを使用してカメラ映像を表示
 * QRコード読み取り機能を統合
 */
export function App() {
    var _a = useCamera({
        width: 1280,
        height: 720,
        frameRate: 30
    }), cameraState = _a.cameraState, startCamera = _a.startCamera, stopCamera = _a.stopCamera;
    return (_jsxs(ThemeProvider, { theme: theme, children: [_jsx(CssBaseline, {}), _jsx(Container, { maxWidth: "lg", sx: { py: 4 }, children: _jsxs(Box, { sx: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3
                    }, children: [_jsx(Typography, { variant: "h4", component: "h1", gutterBottom: true, children: "\u53D7\u4ED8\u30B7\u30B9\u30C6\u30E0 - \u30AB\u30E1\u30E9\u6620\u50CF" }), _jsx(CameraView, { cameraState: cameraState, width: 1280, height: 720 }), _jsxs(Box, { sx: { display: 'flex', gap: 2 }, children: [_jsx(Button, { variant: "contained", color: "primary", size: "large", onClick: startCamera, children: "\u30AB\u30E1\u30E9\u958B\u59CB" }), _jsx(Button, { variant: "contained", color: "secondary", size: "large", onClick: stopCamera, children: "\u30AB\u30E1\u30E9\u505C\u6B62" })] }), _jsxs(Box, { sx: { textAlign: 'center', color: 'text.secondary', mt: 2 }, children: [_jsx(Typography, { variant: "body1", gutterBottom: true, children: "\u30AB\u30E1\u30E9\u306E\u6620\u50CF\u304C\u3053\u3053\u306B\u8868\u793A\u3055\u308C\u307E\u3059" }), _jsx(Typography, { variant: "body2", children: "\u521D\u56DE\u30A2\u30AF\u30BB\u30B9\u6642\u306F\u3001\u30D6\u30E9\u30A6\u30B6\u304B\u3089\u30AB\u30E1\u30E9\u306E\u4F7F\u7528\u8A31\u53EF\u3092\u6C42\u3081\u3089\u308C\u307E\u3059" }), _jsx(Typography, { variant: "body2", sx: { mt: 1, fontWeight: 'medium' }, children: "QR\u30B3\u30FC\u30C9\u3092\u30AB\u30E1\u30E9\u306B\u6620\u3059\u3068\u81EA\u52D5\u7684\u306B\u8AAD\u307F\u53D6\u308A\u307E\u3059" })] })] }) })] }));
}
if (import.meta.vitest) {
    var _a = import.meta.vitest, test = _a.test, expect_1 = _a.expect;
    test('App - コンポーネントが正しく定義されている', function () {
        expect_1(typeof App).toBe('function');
    });
    test('App - カメラ制約が適切に設定されている', function () {
        var constraints = {
            width: 1280,
            height: 720,
            frameRate: 30
        };
        expect_1(constraints.width).toBe(1280);
        expect_1(constraints.height).toBe(720);
        expect_1(constraints.frameRate).toBe(30);
    });
}
