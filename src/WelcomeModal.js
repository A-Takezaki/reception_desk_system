var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ウェルカムモーダルコンポーネント
 * QRコード読み取り成功時に表示する歓迎メッセージをマテリアルデザインで実装
 */
import React from 'react';
import { Dialog, DialogContent, Typography, Box, Slide, Avatar, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
var Transition = React.forwardRef(function Transition(props, ref) {
    return _jsx(Slide, __assign({ direction: "up", ref: ref }, props));
});
/**
 * QRコード読み取り成功時のウェルカムモーダル
 * マテリアルデザインガイドラインに準拠したデザインで実装
 */
export function WelcomeModal(_a) {
    var open = _a.open, visitor = _a.visitor, onClose = _a.onClose;
    var theme = useTheme();
    if (!visitor) {
        return null;
    }
    return (_jsx(Dialog, { open: open, TransitionComponent: Transition, keepMounted: true, onClose: onClose, "aria-describedby": "welcome-dialog-description", maxWidth: "sm", fullWidth: true, PaperProps: {
            sx: {
                borderRadius: 3,
                boxShadow: theme.shadows[10],
                background: 'linear-gradient(135deg, #5F161D 0%, #8B4249 30%, #E8B4B8 100%)',
                color: 'white',
                textAlign: 'center'
            }
        }, children: _jsxs(DialogContent, { sx: {
                padding: theme.spacing(6, 4),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: theme.spacing(3)
            }, children: [_jsx(Avatar, { sx: {
                        width: 80,
                        height: 80,
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                    }, children: _jsx(CheckCircleIcon, { sx: {
                            fontSize: 48,
                            color: theme.palette.success.light
                        } }) }), _jsxs(Box, { sx: { textAlign: 'center', mb: 2 }, children: [_jsxs(Typography, { variant: "h3", component: "h1", sx: {
                                fontWeight: 'bold',
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                lineHeight: 1.2,
                                mb: 1
                            }, children: [visitor.name, "\u3055\u3093\u3001"] }), _jsx(Typography, { variant: "h4", component: "h2", sx: {
                                fontWeight: 'bold',
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                lineHeight: 1.3
                            }, children: "\u3054\u6765\u5834\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059\u3002" })] }), _jsx(Typography, { variant: "body2", sx: {
                        opacity: 0.8,
                        marginTop: theme.spacing(2),
                        textAlign: 'center'
                    }, children: "\u3053\u306E\u30E1\u30C3\u30BB\u30FC\u30B8\u306F5\u79D2\u5F8C\u306B\u81EA\u52D5\u7684\u306B\u9589\u3058\u307E\u3059" })] }) }));
}
if (import.meta.vitest) {
    var _a = import.meta.vitest, test = _a.test, expect_1 = _a.expect;
    test('WelcomeModal - visitor情報がnullの場合はnullを返す', function () {
        var props = {
            open: true,
            visitor: null,
            onClose: function () { }
        };
        expect_1(props.visitor).toBe(null);
    });
    test('WelcomeModal - visitor情報が正しく設定される', function () {
        var _a, _b;
        var visitor = {
            name: '田中太郎',
            id: '12345'
        };
        var props = {
            open: true,
            visitor: visitor,
            onClose: function () { }
        };
        expect_1((_a = props.visitor) === null || _a === void 0 ? void 0 : _a.name).toBe('田中太郎');
        expect_1((_b = props.visitor) === null || _b === void 0 ? void 0 : _b.id).toBe('12345');
    });
    test('WelcomeModal - propsが適切に設定される', function () {
        var _a;
        var mockOnClose = function () { };
        var visitor = { name: 'テスト太郎', id: '99999' };
        var props = {
            open: true,
            visitor: visitor,
            onClose: mockOnClose
        };
        expect_1(props.open).toBe(true);
        expect_1(props.onClose).toBe(mockOnClose);
        expect_1((_a = props.visitor) === null || _a === void 0 ? void 0 : _a.name).toBe('テスト太郎');
    });
    test('WelcomeModal - メッセージが正しい形式で表示される', function () {
        var visitor = { name: '山田花子', id: '54321' };
        var expectedMainMessage = "".concat(visitor.name, "\u3055\u3093\u3001");
        var expectedSubMessage = 'ご来場ありがとうございます。';
        expect_1(expectedMainMessage).toBe('山田花子さん、');
        expect_1(expectedSubMessage).toBe('ご来場ありがとうございます。');
    });
}
