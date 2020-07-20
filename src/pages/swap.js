import HistoryOrder from '../components/HistoryOrder';
import MarketHistory from '../components/MarketHistory';
import MarketPairs from '../components/MarketPairs';
import MarketTrade from '../components/MarketTrade';
import OrderBook from '../components/OrderBook';
import TradingChart from '../components/TradingChart';
import TradingChartDark from '../components/TradingChartDark';
import { ThemeConsumer } from '../context/ThemeContext';

export default class exchange extends Component {
  render() {
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
              <MarketTrade />
            </div>
            <div className="col-lg-12 col-xl-3">
              <OrderBook />
            </div>
            <div className="col-xl-12">
              <HistoryOrder />
            </div>
          </div>
        </div>
      </>
    );
  }
}
