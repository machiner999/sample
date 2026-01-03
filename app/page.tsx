"use client";

import { useState } from "react";

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  timestamp: string;
}

export default function Home() {
  const [symbol, setSymbol] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchStock = async () => {
    if (!symbol.trim()) {
      setError("銘柄コードを入力してください");
      return;
    }

    if (!apiKey.trim()) {
      setError("APIキーを入力してください");
      return;
    }

    setLoading(true);
    setError("");
    setStockData(null);

    try {
      const response = await fetch(
        `/api/stock?symbol=${encodeURIComponent(symbol.toUpperCase())}&apiKey=${encodeURIComponent(apiKey)}`
      );

      if (!response.ok) {
        throw new Error("株価データの取得に失敗しました");
      }

      const data = await response.json();
      setStockData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchStock();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-900">
          株価チェッカー
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alpha Vantage APIキー
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="APIキーを入力"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              APIキーは{" "}
              <a
                href="https://www.alphavantage.co/support/#api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                こちら
              </a>
              から無料で取得できます
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              銘柄コード（例: AAPL, GOOGL, MSFT）
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="例: AAPL"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
              <button
                onClick={searchStock}
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "検索中..." : "検索"}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {stockData && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {stockData.symbol}
              </h2>
              <p className="text-sm text-gray-500">{stockData.timestamp}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">現在値</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${stockData.price.toFixed(2)}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">変動額</p>
                  <p
                    className={`text-xl font-semibold ${
                      stockData.change >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stockData.change >= 0 ? "+" : ""}
                    {stockData.change.toFixed(2)} (
                    {stockData.changePercent.toFixed(2)}%)
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">高値</p>
                  <p className="text-xl font-semibold text-gray-900">
                    ${stockData.high.toFixed(2)}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">安値</p>
                  <p className="text-xl font-semibold text-gray-900">
                    ${stockData.low.toFixed(2)}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">出来高</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {stockData.volume.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
