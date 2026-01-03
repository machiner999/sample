# 株価チェッカー

React + Next.js + TypeScriptで作成された株価検索Webアプリケーションです。

## 機能

- 銘柄コード（例: AAPL, GOOGL, MSFT）で株価を検索
- リアルタイムの株価情報を表示
- 価格変動、高値、安値、出来高などの詳細情報を表示
- レスポンシブデザイン（モバイル対応）

## セットアップ

1. 依存関係のインストール（既にインストール済み）:
```bash
npm install
```

2. 開発サーバーの起動:
```bash
npm run dev
```

3. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## 使い方

1. [Alpha Vantage](https://www.alphavantage.co/support/#api-key)から無料のAPIキーを取得
2. アプリケーションの「Alpha Vantage APIキー」欄にAPIキーを入力
3. 銘柄コード（例: AAPL, GOOGL, MSFT）を入力
4. 「検索」ボタンをクリック

## 技術スタック

- **Next.js 14** - Reactフレームワーク
- **TypeScript** - 型安全な開発
- **Tailwind CSS** - スタイリング
- **Alpha Vantage API** - 株価データの取得

## APIについて

このアプリケーションはAlpha Vantage APIを使用しています。無料プランでは以下の制限があります:
- 1分あたり5リクエスト
- 1日あたり100リクエスト

## ビルド

本番環境用のビルド:
```bash
npm run build
npm start
```

## ライセンス

MIT
