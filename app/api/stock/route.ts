import { NextRequest, NextResponse } from "next/server";

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
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("株価データの取得に失敗しました");
    }

    const data = await response.json();

    if (data["Error Message"]) {
      return NextResponse.json(
        { error: "無効な銘柄コードです" },
        { status: 404 }
      );
    }

    if (data["Note"]) {
      return NextResponse.json(
        { error: "API呼び出し制限に達しました。しばらく待ってから再試行してください。" },
        { status: 429 }
      );
    }

    const quote = data["Global Quote"];

    if (!quote || Object.keys(quote).length === 0) {
      return NextResponse.json(
        { error: "株価データが見つかりません" },
        { status: 404 }
      );
    }

    const stockData = {
      symbol: quote["01. symbol"],
      price: parseFloat(quote["05. price"]),
      change: parseFloat(quote["09. change"]),
      changePercent: parseFloat(quote["10. change percent"].replace("%", "")),
      high: parseFloat(quote["03. high"]),
      low: parseFloat(quote["04. low"]),
      volume: parseInt(quote["06. volume"]),
      timestamp: quote["07. latest trading day"],
    };

    return NextResponse.json(stockData);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return NextResponse.json(
      { error: "株価データの取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
