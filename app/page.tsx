"use client";

import { useState } from "react";
import { useTheme } from "./hooks/useTheme";
import { useLanguage } from "./hooks/useLanguage";
import { useChartPeriod } from "./hooks/useChartPeriod";
import { translations } from "./i18n/translations";
import StockChart from "./components/StockChart";
import { StockData, StockHistoryResponse } from "./types/stock";

export default function Home() {
  const [symbol, setSymbol] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // チャートデータ用のstate
  const [chartData, setChartData] = useState<StockHistoryResponse | null>(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState("");

  const { isDarkMode, toggleDarkMode } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { period, setPeriod } = useChartPeriod();
  const t = translations[language];

  // チャートデータ取得関数
  const fetchChartData = async (symbolValue: string, apiKeyValue: string) => {
    setChartLoading(true);
    setChartError("");

    try {
      const response = await fetch(
        `/api/stock/history?symbol=${encodeURIComponent(symbolValue)}&apiKey=${encodeURIComponent(apiKeyValue)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t.errorChartLoad);
      }

      const data: StockHistoryResponse = await response.json();
      setChartData(data);
    } catch (err) {
      setChartError(err instanceof Error ? err.message : t.errorChartLoad);
      setChartData(null);
    } finally {
      setChartLoading(false);
    }
  };

  const searchStock = async () => {
    if (!symbol.trim()) {
      setError(t.errorSymbolRequired);
      return;
    }

    if (!apiKey.trim()) {
      setError(t.errorApiKeyRequired);
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
        throw new Error(t.errorFetchFailed);
      }

      const data = await response.json();
      setStockData(data);

      // 成功したらチャートデータも取得（APIレート制限を避けるため1秒待機）
      setTimeout(() => {
        fetchChartData(symbol.toUpperCase(), apiKey);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorGeneral);
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 dark:text-indigo-300">
            {t.title}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-shadow text-sm font-medium text-gray-700 dark:text-gray-300"
              aria-label="言語切り替え"
            >
              {language === "ja" ? "EN" : "JP"}
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-shadow"
              aria-label="テーマ切り替え"
            >
              {isDarkMode ? (
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition-colors">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.apiKeyLabel}
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t.apiKeyPlaceholder}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t.apiKeyHint}{" "}
              <a
                href="https://www.alphavantage.co/support/#api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {t.apiKeyLinkText}
              </a>
              {t.apiKeyHintSuffix && ` ${t.apiKeyHintSuffix}`}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.symbolLabel}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.symbolPlaceholder}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={searchStock}
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? t.searching : t.searchButton}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              {error}
            </div>
          )}
        </div>

        {stockData && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition-colors">
            <div className="border-b dark:border-gray-700 pb-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {stockData.symbol}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stockData.timestamp}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.currentPrice}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    ${stockData.price.toFixed(2)}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.change}</p>
                  <p
                    className={`text-xl font-semibold ${
                      stockData.change >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.high}</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    ${stockData.high.toFixed(2)}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.low}</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    ${stockData.low.toFixed(2)}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.volume}</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {stockData.volume.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* チャート読み込み中 */}
        {chartLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition-colors">
            <p className="text-center text-gray-600 dark:text-gray-400">
              {t.loadingChart}
            </p>
          </div>
        )}

        {/* チャートエラー */}
        {chartError && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 mb-6">
            {chartError}
          </div>
        )}

        {/* チャート表示 */}
        {chartData && chartData.data.length > 0 && (
          <StockChart
            data={chartData.data}
            symbol={chartData.symbol}
            selectedPeriod={period}
            onPeriodChange={setPeriod}
          />
        )}

        {/* チャートデータなし */}
        {chartData && chartData.data.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
            <p className="text-center text-gray-600 dark:text-gray-400">
              {t.noChartData}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
