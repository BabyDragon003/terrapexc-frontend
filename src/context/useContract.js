import { createContext, useCallback, useContext, useState } from 'react';
import { useWallet } from "@terra-money/wallet-provider"
import { Coins, Fee } from "@terra-money/terra.js"
import { toast } from 'react-toastify';
import useAddress from './useAddress';
import { useClient } from './useClient';
import { fromWei, toWei, calcTax, hasTaxToken, toAmount } from '../utils/utils';
import useTax from './useTax';
import { TX_STATE, TX_TYPE, ULUNA, PAIR_LIST } from '../utils/constants';
import { networks, NET_NAME } from '../utils/networks';
import {
  orderMsg,
  increaseAllowanceMsg,
  decreaseAllowanceMsg,
} from './contractMsgs';

const ContractContext = createContext();
const useContract = () => useContext(ContractContext);

const ContractProvider = ({ children }) => {
  const { terraClient } = useClient();
  const [lastTx, setLastTx] = useState({
    state: TX_STATE.INIT, txhash: ''
  });
  const [txType, setTxType] = useState(TX_TYPE.NONE);
  const [tax, setTax] = useState(new Coins())
  const [clickedPrice, setClickedPrice] = useState(0);
  const [updateHistory, setUpdateHistory] = useState(false);
  const connectedWalletAddress = useAddress();
  const wallet = useWallet()
  const { loadTaxInfo, loadTaxRate, loadGasPrice } = useTax()
  const network = networks[NET_NAME];

  //--------------------------------------------//
  //                  QueryMsgs                 //
  //--------------------------------------------//
  const getNativeBalance = useCallback(async (address) => {
    const [balance] = await terraClient.bank.balance(address);
    return balance.toData();
  }, [terraClient])

  const getTokenBalance = useCallback(async (tokenAddress, walletAddress) => {
    try {
      const resp = await terraClient.wasm.contractQuery(
        tokenAddress,
        {
          balance: {
            address: walletAddress
          }
        }
      );
      return resp;
    } catch (error) {
      console.log(error)
      return { balance: -1 };
    }
  }, [terraClient])

  const getContractConfig = useCallback(async (contract) => {
    const resp = await terraClient.wasm.contractQuery(
      contract,
      {
        config: {}
      }
    );

    return resp;
  }, [terraClient])

  const getAllowance = useCallback(async (contract, owner, spender) => {
    const resp = await terraClient.wasm.contractQuery(
      contract,
      {
        allowance: {
          owner,
          spender
        }
      }
    );

    return resp;
  }, [terraClient])

  const getOrderList = useCallback(async (contract, is_buy = true) => {
    const resp = await terraClient.wasm.contractQuery(
      contract,
      {
        list_orders: {
          is_buy
        }
      }
    );

    return resp;
  }, [terraClient])

  //--------------------------------------------//
  //                 ExecuteMsgs                //
  //--------------------------------------------//
  const getTax = useCallback(async (value1, token1, value2, token2, type) => {
    let newTax = tax
    newTax.map((coin) => {
      if (!(coin.denom === token1 || (coin.denom === token2))) {
        newTax.set(coin.denom, 0)
      }
      return true;
    })

    const taxRate = await loadTaxRate()
    if (token1 && hasTaxToken(token1) && taxRate && value1) {
      const taxCap1 = await loadTaxInfo(token1)
      if (taxCap1) {
        const tax1 = calcTax(toAmount(value1), taxCap1, taxRate)
        newTax.set(token1, tax1)
      }
    }
    if (token2 && hasTaxToken(token2) && taxRate && value2) {
      const taxCap2 = await loadTaxInfo(token2)
      if (taxCap2) {
        const tax2 = calcTax(toAmount(value2), taxCap2, taxRate)
        newTax.set(token2, tax2)
      }
    }
    return newTax
  }, [loadTaxInfo, loadTaxRate, tax])


  // Checks up on the tx until it's mined,
  // then update balances and and state
  const trackTx = useCallback(async function (txhash) {
    try {
      // Once the tx has been included on the blockchain,
      // update the balances and state
      const txInfo = await terraClient.tx.txInfo(txhash);
      console.log("<><><><><><><><><><><><><>", txInfo)
      setLastTx({ state: TX_STATE.COMPLETE, txhash });
    } catch {
      // Not on chain yet, try again in 5s
      setTimeout(trackTx, 5000, txhash);
    }
  }, []);

  const executeMsg = useCallback(async (msgs) => {
    try {
      setLastTx({ state: TX_STATE.START, txhash: '' });
      const gasPrice = await loadGasPrice(ULUNA)
      let txOptions = {
        msgs,
        memo: "",
        gasPrices: `${gasPrice}${ULUNA}`,
      }

      const signMsg = await terraClient.tx.create(
        [{ address: connectedWalletAddress }],
        txOptions
      )
      const fee = signMsg.auth_info.fee.amount.add(tax)
      txOptions.fee = new Fee(signMsg.auth_info.fee.gas_limit, fee)
      const { result } = await wallet.post({ ...txOptions }, connectedWalletAddress)
      console.log(">>>>>>>", result)
      setLastTx({ state: TX_STATE.PENDING, txhash: result?.txhash });
      await trackTx(result?.txhash);

    } catch (err) {
      console.log(err);
      toast.error(err?.message)
      setLastTx({ state: TX_STATE.ERROR, txhash: err?.message });
      throw err;
    }
    return true;
  }, [terraClient, tax, connectedWalletAddress, loadGasPrice, loadTaxRate])

  const executeDecreaseAllowance = async (pair_id, amount, price, is_buy) => {
    if (pair_id >= PAIR_LIST.length) return false;
    const pair = PAIR_LIST[pair_id];
    let msgs = [];
    let msg;
    if (is_buy) {
      const res = await getAllowance(pair.from.contract_addr, connectedWalletAddress, network.tradingContract);
      if (fromWei(res.allowance) < Number(amount * price)) {
        toast.error("Insufficient allowance");
        return false;
      }
      msg = decreaseAllowanceMsg(connectedWalletAddress, pair.from.contract_addr, network.tradingContract, toWei(amount * price));
    } else {
      const res = await getAllowance(pair.to.contract_addr, connectedWalletAddress, network.tradingContract);
      if (fromWei(res.allowance) < Number(amount)) {
        toast.error("Insufficient allowance");
        return false;
      }
      msg = decreaseAllowanceMsg(connectedWalletAddress, pair.to.contract_addr, network.tradingContract, toWei(amount));
    }
    msgs.push(msg);
    msgs = msgs.map((msg) => {
      return Array.isArray(msg) ? msg[0] : msg
    })
    console.log(msgs)
    return await executeMsg(msgs);
  }

  const executeOrder = async (pair_id, amount, price, is_buy, add_order = null, update_match_order = null, remove_match_orders = null) => {
    if (pair_id >= PAIR_LIST.length) return false;
    const pair = PAIR_LIST[pair_id];
    let msgs = [];
    let msg;
    if (is_buy) {
      msg = increaseAllowanceMsg(connectedWalletAddress, pair.from.contract_addr, network.tradingContract, toWei(amount * price));
    } else {
      msg = increaseAllowanceMsg(connectedWalletAddress, pair.to.contract_addr, network.tradingContract, toWei(amount));
    }
    msgs.push(msg);
    msg = orderMsg(connectedWalletAddress, network.tradingContract, pair_id.toString(), toWei(amount), toWei(price), is_buy, add_order, update_match_order, remove_match_orders);
    msgs.push(msg);
    msgs = msgs.map((msg) => {
      return Array.isArray(msg) ? msg[0] : msg
    })
    console.log(msgs)
    return await executeMsg(msgs);
  }

  const value = {
    lastTx,
    txType,
    clickedPrice,
    updateHistory,

    setLastTx,
    setTxType,
    setClickedPrice,
    setUpdateHistory,

    getNativeBalance,
    getTokenBalance,
    getContractConfig,
    getAllowance,

    executeOrder,
    executeDecreaseAllowance,
  };
  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};

export { useContract, ContractProvider }
