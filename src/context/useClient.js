import { LCDClient } from '@terra-money/terra.js';
import { createContext, useContext, useMemo } from 'react';
import { networks, NET_NAME } from "../utils/networks";

function buildClient(network) {
  return new LCDClient({
    URL: network.lcd,
    chainID: network.chainID,
    gasPrices: network.gasPrices
  });
}

const NetworkContext = createContext();
const useClient = () => useContext(NetworkContext);

    return (
      <div className="m-10 text-center text-red-500">

      </div>
    );
  }
};

export { useClient, NetworkProvider }
