# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 言語設定

**常に日本語で対応してください。すべての応答、説明、コメント、コミットメッセージは日本語で記述してください。**

## プロジェクト概要

株価チェッカー - Next.js 14、TypeScript、Tailwind CSSで構築された株価検索Webアプリケーション。Alpha Vantage APIからリアルタイムの株価データを取得します。ライトモード/ダークモード切り替え、日本語/英語の多言語対応に対応しています。

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
- **app/hooks/useTheme.ts** - ライト/ダークモード管理のカスタムフック
- **app/hooks/useLanguage.ts** - 日本語/英語切り替え管理のカスタムフック
- **app/i18n/translations.ts** - 多言語対応の翻訳データ
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

### 状態管理とカスタムフック

**メインページの状態** (app/page.tsx)：
- `symbol` - 銘柄コードのユーザー入力
- `apiKey` - ユーザーのAlpha Vantage APIキー
- `stockData` - 取得した株価情報
- `loading` - リクエストのローディング状態
- `error` - エラーメッセージ

**useThemeフック** (app/hooks/useTheme.ts)：
- ライト/ダークモードの切り替え機能を提供
- localStorageでテーマ設定を永続化
- システムの配色設定を初期値として検出
- `dark`クラスを`document.documentElement`に適用してTailwindのダークモードを制御

**useLanguageフック** (app/hooks/useLanguage.ts)：
- 日本語/英語の言語切り替え機能を提供
- localStorageで言語設定を永続化
- ブラウザの言語設定を初期値として検出
- 翻訳データ（app/i18n/translations.ts）と組み合わせて使用

### スタイリングと多言語対応

**Tailwind CSS設定**：
- ライト/ダークモード対応のグラデーション背景
- `dark:`プレフィックスでダークモード専用スタイルを定義
- レスポンシブグリッドレイアウト（モバイルは1カラム、デスクトップは2カラム）
- 価格変動の正負による条件付きスタイル（緑/赤）
- `transition-colors`で滑らかなテーマ切り替え

**多言語対応**：
- app/i18n/translations.tsに日本語と英語の翻訳を集約
- UIテキスト、エラーメッセージ、ラベルなどすべて翻訳対応
- useLanguageフックで現在の言語を取得し、`translations[language]`で翻訳データにアクセス

## TypeScript設定

- パスエイリアス `@/*` はルートディレクトリにマップ
- Strictモード有効
- Target: ES2017
- Module resolution: bundler（Next.js 14のデフォルト）

## 開発時の注意点

### カスタムフックのパターン
このアプリケーションでは、再利用可能なロジックをカスタムフックに抽出するパターンを採用：
- **useTheme** - テーマ切り替えとlocalStorage管理
- **useLanguage** - 言語切り替えとlocalStorage管理

新しいグローバル機能（例：ユーザー設定、お気に入り銘柄管理など）を追加する場合も、同様にapp/hooksディレクトリにカスタムフックとして実装することが推奨されます。

### APIキーの扱い
- APIキーは環境変数ではなく、**ユーザーがUIから入力する設計**
- セキュリティ上、APIキーはサーバー側に保存されず、リクエストごとにクライアントから送信される
- Alpha Vantage APIキーは https://www.alphavantage.co/support/#api-key から無料で取得可能

### エラーハンドリング
APIルート（app/api/stock/route.ts）は以下のエラーケースを処理：
- 無効な銘柄コード → 404エラー
- API制限超過 → 429エラー（1分あたり5リクエスト、1日100リクエストの制限）
- データ取得失敗 → 500エラー

### 多言語対応の拡張方法
新しい言語を追加する場合：
1. app/i18n/translations.tsに新しい言語のオブジェクトを追加
2. app/hooks/useLanguage.tsのLanguage型を更新
3. ブラウザの言語検出ロジック（navigator.language）を必要に応じて調整

### テスト用の銘柄コード
- AAPL (Apple)
- GOOGL (Google)
- MSFT (Microsoft)
- TSLA (Tesla)
