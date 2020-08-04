import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import OpenOrderTab from './OpenOrderTab';
import OrderHistoryTab from './OrderHistoryTab';

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
