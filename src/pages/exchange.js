import React, { useState, useEffect } from 'react';
import { useLocation } from '@reach/router';
import HistoryOrder from '../components/HistoryOrder';
import MarketHistory from '../components/MarketHistory';
import MarketPairs from '../components/MarketPairs';
import MarketTrade from '../components/MarketTrade';
import OrderBook from '../components/OrderBook';
import TradingChart from '../components/TradingChart';
import TradingChartDark from '../components/TradingChartDark';
import { ThemeConsumer } from '../context/ThemeContext';
import { PAIR_LIST, TOKEN_LIST } from '../utils/constants';

const Exchange = () => {
  const [pair_id, setPairID] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (location) {
      const paths = location.pathname.replace('/exchange/', '');
      const list = paths.split('-');
      if (list.length > 1) {
        setPairID(estimatePairID(TOKEN_LIST[list[1]], TOKEN_LIST[list[0]]));
      }
    }
  }, [location])

  const estimatePairID = (from, to) => {
    for (let i = 0; i < PAIR_LIST.length; i++) {
      if (PAIR_LIST[i].from === from && PAIR_LIST[i].to === to) {
        return i;
      }
    }
    return PAIR_LIST.length;
  }

  console.log(pair_id);

  return (
    <>
      <div className="container-fluid mtb15 no-fluid">
        <div className="row sm-gutters">
          <div className="col-sm-12 col-lg-4 col-xl-3">
            <MarketPairs />
          </div>
          <div className="col-sm-12 col-lg-8 col-xl-6">
            <ThemeConsumer>
              {({ data }) => {
                return data.theme === 'light' ? (
                  <TradingChart />
                ) : (
                  <TradingChartDark />
                );
              }}
            </ThemeConsumer>
            <MarketTrade pair_id = {pair_id}/>
          </div>
          <div className="col-lg-12 col-xl-3">
            <OrderBook pair_id = {pair_id}/>
          </div>
          <div className="col-xl-12">
            <HistoryOrder />
          </div>
        </div>
      </div>
    </>
  )
}

export default Exchange;