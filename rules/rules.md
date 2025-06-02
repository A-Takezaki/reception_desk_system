## TDDの実施
TDD を実施する。コードを生成するときは、それに対応するユニットテストを常に生成する。
コードを追加で修正したとき、`npm test` がパスすることを常に確認する。

```ts
function add(a: number, b: number) { return a + b }
test("1+2=3", () => {
  expect(add(1, 2)).toBe(3);
});
```
## コメントの記述
各ファイルの冒頭にはコメントで仕様を記述する。

### 出力例
```ts
/**
 * 2点間のユークリッド距離を計算する
**/
type Point = { x: number; y: number; };
export function distance(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
```
## テストの記述
vitest で実装と同じファイルにユニットテストを書く。
### 出力例
```ts
export function distance(a: Point, b: Point): number {...}
if (import.meta.vitest) {
  const {test, expect} = import.meta.vitest;
  test("ユークリッド距離を計算する", () => {
    const result = distance({x: 0, y: 0}, {x: 3, y: 4});
    expect(distance(result)).toBe(5)
  });
}
```
## ドメインモデル
src/types.ts にアプリケーション内のドメインモデルを集約する。
その型がどのように使われるかを jsdoc スタイルのコメントで記述する。
```ts
/**
 * キャッシュのインターフェース抽象
 */
export type AsyncCache<T> = {
  get(): Promise<T | void>;
  has(): Promise<boolean>;
  set(value: T): Promise<void>;
}
```
## 実装方法
TypeScript で関数型ドメインモデリングを行う。class を使わず関数による実装を優先する。
代数的データでドメインをモデリングする。
### 出力例
```ts
type FetchResult<T, E> = {
  ok: true;
  data: T
} | {
  ok: false;
  error: E
}
```
## 配置規則
以下のモノレポの配置規則に従う。

script/
  <task-name>.ts    # タスク
packages/
  <mod-name>/
    examples/
      *.ts          # ユースケース例
    src/
      index.ts      # エントリポイント
      index.test.ts # ファイルに対応するユニットテスト
      types.ts      # 型定義
    test/
      *.test.ts     # インテグレーションテスト