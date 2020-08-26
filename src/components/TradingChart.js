import React from 'react';
import { AdvancedChart } from 'react-tradingview-embed';

export default function TradingChart() {
  return (
    <>
      <div className="main-chart mb15">
        <AdvancedChart
          widgetProps={{
            theme: 'light',
