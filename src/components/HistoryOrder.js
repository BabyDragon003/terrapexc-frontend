import { Tabs, Tab } from 'react-bootstrap';
import OpenOrderTab from './OpenOrderTab';
import OrderHistoryTab from './OrderHistoryTab';

export default function HistoryOrder() {
  return (
    <>
      <div className="market-history market-order mt15">
        <Tabs defaultActiveKey="open-orders">
          <Tab eventKey="open-orders" title="Open Orders">
            <OpenOrderTab />
          </Tab>
          <Tab eventKey="order-history" title="Order history">
            <OrderHistoryTab />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
