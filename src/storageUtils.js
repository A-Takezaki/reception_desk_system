/**
 * ストレージユーティリティ関数
 * 画像ファイルとデータファイルの保存機能を提供
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
/**
 * カメラの映像から画像を撮影してBlobとして取得
 */
export function captureImageFromVideo(videoElement) {
    return new Promise(function (resolve) {
        try {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            if (!context) {
                resolve(null);
                return;
            }
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            context.drawImage(videoElement, 0, 0);
            canvas.toBlob(function (blob) {
                resolve(blob);
            }, 'image/jpeg', 0.8);
        }
        catch (error) {
            console.error('画像キャプチャエラー:', error);
            resolve(null);
        }
    });
}
/**
 * 画像をローカルに保存（ダウンロード）
 * ブラウザ環境では直接ファイルシステムに書き込めないため、ダウンロード機能として実装
 */
export function saveImageToLocal(imageBlob, filename) {
    try {
        var url = URL.createObjectURL(imageBlob);
        var link = document.createElement('a');
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
    }
    catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : '画像保存に失敗しました'
        };
    }
}
/**
 * 来場者データをJSONファイルとして保存（ダウンロード）
 */
export function saveVisitorDataToLocal(visitor, timestamp) {
    try {
        var data = {
            visitor: visitor,
            timestamp: timestamp.toISOString(),
            scannedAt: new Date().toISOString()
        };
        var jsonString = JSON.stringify(data, null, 2);
        var blob = new Blob([jsonString], { type: 'application/json' });
        var filename = "visitor_".concat(visitor.id, "_").concat(timestamp.getTime(), ".json");
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
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
    }
    catch (error) {
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
export function parseQRCodeData(qrText) {
    try {
        // [Name].[id] 形式のパターンをチェック
        var match = qrText.match(/^(.+)\.([^.]+)$/);
        if (!match) {
            return null;
        }
        var name_1 = match[1], id = match[2];
        if (!name_1.trim() || !id.trim()) {
            return null;
        }
        return {
            name: name_1.trim(),
            id: id.trim()
        };
    }
    catch (error) {
        console.error('QRコードデータ解析エラー:', error);
        return null;
    }
}
if (import.meta.vitest) {
    var _a = import.meta.vitest, test = _a.test, expect_1 = _a.expect;
    test('parseQRCodeData - 正しい形式のQRコードデータを解析', function () {
        var result = parseQRCodeData('田中太郎.12345');
        expect_1(result).toEqual({
            name: '田中太郎',
            id: '12345'
        });
    });
    test('parseQRCodeData - 英語名の場合', function () {
        var result = parseQRCodeData('John Smith.67890');
        expect_1(result).toEqual({
            name: 'John Smith',
            id: '67890'
        });
    });
    test('parseQRCodeData - 不正な形式の場合', function () {
        expect_1(parseQRCodeData('invalid')).toBe(null);
        expect_1(parseQRCodeData('name.')).toBe(null);
        expect_1(parseQRCodeData('.id')).toBe(null);
        expect_1(parseQRCodeData('')).toBe(null);
    });
    test('parseQRCodeData - 複数のドットが含まれる場合', function () {
        var result = parseQRCodeData('田中.太郎.12345');
        expect_1(result).toEqual({
            name: '田中.太郎',
            id: '12345'
        });
    });
    test('captureImageFromVideo - 無効な引数の場合', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockVideo, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockVideo = {};
                    return [4 /*yield*/, captureImageFromVideo(mockVideo)];
                case 1:
                    result = _a.sent();
                    expect_1(result).toBe(null);
                    return [2 /*return*/];
            }
        });
    }); });
}
