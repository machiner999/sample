import { NextRequest, NextResponse } from "next/server";
import { StockHistoryResponse, StockHistoryData } from "@/app/types/stock";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get("symbol");
  const apiKey = searchParams.get("apiKey");

  if (!symbol) {
    return NextResponse.json(
      { error: "銘柄コードが指定されていません" },
      { status: 400 }
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "APIキーが指定されていません" },
      { status: 400 }
    );
  }

  try {
    // 無料プランではoutputsize=compactのみ利用可能（最新100日分）
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("株価データの取得に失敗しました");
    }

    const data = await response.json();
    console.log(data);

    if (data["Error Message"]) {
      return NextResponse.json(
        { error: "無効な銘柄コードです" },
        { status: 404 }
      );
    }

    if (data["Note"]) {
      return NextResponse.json(
        {
          error:
            "API呼び出し制限に達しました。しばらく待ってから再試行してください。",
        },
        { status: 429 }
      );
    }

    if (data["Information"]) {
      return NextResponse.json(
        {
          error:
            "APIレート制限に達しました。1秒あたり1リクエストまでです。少し待ってから再試行してください。",
        },
        { status: 429 }
      );
    }

    const timeSeries = data["Time Series (Daily)"];

    if (!timeSeries || Object.keys(timeSeries).length === 0) {
      return NextResponse.json(
        { error: "株価データが見つかりません" },
        { status: 404 }
      );
    }

    // データ変換: Alpha Vantage形式 → StockHistoryData[]
    const historyData: StockHistoryData[] = Object.entries(timeSeries)
      .map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values["1. open"]),
        high: parseFloat(values["2. high"]),
        low: parseFloat(values["3. low"]),
        close: parseFloat(values["4. close"]),
        volume: parseInt(values["5. volume"]),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // 新しい順にソート

    const historyResponse: StockHistoryResponse = {
      symbol: data["Meta Data"]["2. Symbol"],
      data: historyData,
      lastRefreshed: data["Meta Data"]["3. Last Refreshed"],
    };

    return NextResponse.json(historyResponse);
  } catch (error) {
    console.error("Error fetching stock history data:", error);
    return NextResponse.json(
      { error: "株価データの取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
