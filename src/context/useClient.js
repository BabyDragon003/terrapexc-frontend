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

const NetworkProvider = ({ children }) => {
  const network = networks[NET_NAME];
  const terraClient = useMemo(() => {
    if (network) {
      return buildClient(network);
    }
  }, [network]);

  const value = { terraClient, network };
  if (network) {
