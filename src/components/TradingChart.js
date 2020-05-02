import React from 'react';
import { AdvancedChart } from 'react-tradingview-embed';

export default function TradingChart() {
  return (
    <>
      <div className="main-chart mb15">
        <AdvancedChart
          widgetProps={{
            theme: 'light',
            symbol: 'LUNCUSD', // 'USTCUSD'
            allow_symbol_change: true,
            toolbar_bg: '#fff',
            height: 550,
          }}
        />
      </div>
    </>
  );
}
