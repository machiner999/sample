// 株価データの型定義

// 現在の株価データ
export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  timestamp: string;
}

// チャート用の履歴データ
export interface StockHistoryData {
  date: string; // YYYY-MM-DD形式
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// API レスポンス
export interface StockHistoryResponse {
  symbol: string;
  data: StockHistoryData[];
  lastRefreshed: string;
}

// 期間選択の型
export type ChartPeriod = "1W" | "1M" | "3M" | "6M" | "1Y";

// 期間設定
export interface PeriodConfig {
  key: ChartPeriod;
  days: number;
  labelKey: string; // translations のキー
}
