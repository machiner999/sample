"use client";

import { useState, useEffect } from "react";
import { ChartPeriod } from "@/app/types/stock";

export function useChartPeriod() {
  const [period, setPeriod] = useState<ChartPeriod>("1M"); // デフォルト: 1ヶ月

  useEffect(() => {
    const savedPeriod = localStorage.getItem("chartPeriod") as
      | ChartPeriod
      | null;
    if (savedPeriod && isValidPeriod(savedPeriod)) {
      setPeriod(savedPeriod);
    }
  }, []);

  const setChartPeriod = (newPeriod: ChartPeriod) => {
    setPeriod(newPeriod);
    localStorage.setItem("chartPeriod", newPeriod);
  };

  return {
    period,
    setPeriod: setChartPeriod,
  };
}

function isValidPeriod(value: string): value is ChartPeriod {
  return ["1W", "1M", "3M", "6M", "1Y"].includes(value);
}
