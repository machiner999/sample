"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  StockHistoryData,
  ChartPeriod,
  PeriodConfig,
} from "@/app/types/stock";
import { useTheme } from "@/app/hooks/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage";
import { translations } from "@/app/i18n/translations";

interface StockChartProps {
  data: StockHistoryData[];
  symbol: string;
  selectedPeriod: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
}

// 期間設定
const PERIOD_CONFIGS: PeriodConfig[] = [
  { key: "1W", days: 7, labelKey: "period1W" },
  { key: "1M", days: 30, labelKey: "period1M" },
  { key: "3M", days: 90, labelKey: "period3M" },
  { key: "6M", days: 180, labelKey: "period6M" },
  { key: "1Y", days: 365, labelKey: "period1Y" },
];

export default function StockChart({
  data,
  symbol,
  selectedPeriod,
  onPeriodChange,
}: StockChartProps) {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];

  // 選択期間に基づいてデータをフィルタリング
  const filteredData = useMemo(() => {
    const config = PERIOD_CONFIGS.find((p) => p.key === selectedPeriod);
    if (!config) return data;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - config.days);

    return data
      .filter((item) => new Date(item.date) >= cutoffDate)
      .reverse(); // チャート表示用に古い順にソート
  }, [data, selectedPeriod]);

  // ダークモード対応の色設定
  const colors = {
    line: isDarkMode ? "#60a5fa" : "#3b82f6", // blue-400 / blue-600
    grid: isDarkMode ? "#374151" : "#e5e7eb", // gray-700 / gray-200
    text: isDarkMode ? "#d1d5db" : "#374151", // gray-300 / gray-700
    tooltip: isDarkMode ? "#1f2937" : "#ffffff", // gray-800 / white
  };

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    return (
      <div
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-3 rounded shadow-lg"
        style={{ backgroundColor: colors.tooltip }}
      >
        <p className="font-medium text-gray-900 dark:text-gray-100">
          {data.date}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t.chartClose}: ${data.close.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t.chartHigh}: ${data.high.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t.chartLow}: ${data.low.toFixed(2)}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
      {/* ヘッダー */}
      <div className="border-b dark:border-gray-700 pb-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {symbol} - {t.chartTitle}
        </h2>
      </div>

      {/* 期間選択ボタン */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {PERIOD_CONFIGS.map((config) => (
          <button
            key={config.key}
            onClick={() => onPeriodChange(config.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod === config.key
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {t[config.labelKey]}
          </button>
        ))}
      </div>

      {/* チャート */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis
            dataKey="date"
            stroke={colors.text}
            tick={{ fill: colors.text }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis
            stroke={colors.text}
            tick={{ fill: colors.text }}
            domain={["auto", "auto"]}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="close"
            stroke={colors.line}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* データポイント数の表示 */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        {t.chartDataPoints}: {filteredData.length}
      </p>
    </div>
  );
}
