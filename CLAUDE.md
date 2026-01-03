# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

株価チェッカー - Next.js 14、TypeScript、Tailwind CSSで構築された株価検索Webアプリケーション。Alpha Vantage APIからリアルタイムの株価データを取得します。

## 開発コマンド

```bash
# 開発サーバーを起動 (localhost:3000)
npm run dev

# 本番環境用にビルド
npm run build

# 本番サーバーを起動
npm start

# ESLintを実行
npm run lint
```

## アーキテクチャ

### アプリケーション構成

Next.js 14 App Routerアプリケーションで、以下の構成になっています：

- **app/page.tsx** - 株価検索UIと状態管理を含むメインのクライアントコンポーネント
- **app/layout.tsx** - 日本語ロケールとメタデータを持つルートレイアウト
- **app/api/stock/route.ts** - Alpha Vantage APIへのリクエストをプロキシするAPIルートハンドラ
- **app/globals.css** - グローバルなTailwind CSSスタイル

### データフロー

1. ユーザーがクライアントUI（app/page.tsx）で銘柄コードとAPIキーを入力
2. クライアントが `/api/stock?symbol=XXX&apiKey=YYY` にGETリクエストを送信
3. APIルート（app/api/stock/route.ts）がAlpha Vantage APIからデータを取得
4. APIルートがAlpha VantageのレスポンスをシンプルなStockDataインターフェースに変換
5. クライアントがフォーマットされた株価データを受信して表示

### 主要なインターフェース

**StockData** (app/page.tsx:5-14):
```typescript
interface StockData {
  symbol: string;        // 銘柄コード
  price: number;         // 現在価格
  change: number;        // 変動額
  changePercent: number; // 変動率
  high: number;          // 高値
  low: number;           // 安値
  volume: number;        // 出来高
  timestamp: string;     // タイムスタンプ
}
```

### API連携

アプリはAlpha VantageのGLOBAL_QUOTE関数を使用。APIルートは以下を処理：
- 無効な銘柄コードエラー
- レート制限（無料プランは1分あたり5リクエスト、1日あたり100リクエスト）
- 空のレスポンスの検証
- Alpha Vantageのネストされた構造からフラットなStockDataへのデータ変換

### 状態管理

メインページコンポーネントでシンプルなReact useStateフックを使用：
- `symbol` - 銘柄コードのユーザー入力
- `apiKey` - ユーザーのAlpha Vantage APIキー
- `stockData` - 取得した株価情報
- `loading` - リクエストのローディング状態
- `error` - エラーメッセージ

### スタイリング

- Tailwind CSSでカスタムグラデーション背景（blue-50からindigo-100）
- レスポンシブグリッドレイアウト（モバイルは1カラム、デスクトップは2カラム）
- 価格変動の正負による条件付きスタイル（緑/赤）
- 日本語UIとローカライズされたエラーメッセージ

## TypeScript設定

- パスエイリアス `@/*` はルートディレクトリにマップ
- Strictモード有効
- Target: ES2017
- Module resolution: bundler（Next.js 14のデフォルト）

## 開発時の注意点

### APIキーの扱い
- APIキーは環境変数ではなく、**ユーザーがUIから入力する設計**
- セキュリティ上、APIキーはサーバー側に保存されず、リクエストごとにクライアントから送信される
- Alpha Vantage APIキーは https://www.alphavantage.co/support/#api-key から無料で取得可能

### エラーハンドリング
APIルート（app/api/stock/route.ts）は以下のエラーケースを処理：
- 無効な銘柄コード → 404エラー
- API制限超過 → 429エラー（1分あたり5リクエスト、1日100リクエストの制限）
- データ取得失敗 → 500エラー

### テスト用の銘柄コード
- AAPL (Apple)
- GOOGL (Google)
- MSFT (Microsoft)
- TSLA (Tesla)
