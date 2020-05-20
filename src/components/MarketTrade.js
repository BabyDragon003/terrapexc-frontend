import { useState, useEffect, useMemo } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import ConnectWallet from './ConnectWallet';
import useAddress from '../context/useAddress';
import { useContract } from '../context/useContract';
import { networks, NET_NAME, API_URL } from '../utils/networks';
  const [limitBuyAmount, setLimitBuyAmount] = useState(0);
  const [limitBuyTotal, setLimitBuyTotal] = useState(0);
  const [limitBuySlideValue, setLimitBuySlideValue] = useState(0);
  const [limitSellPrice, setLimitSellPrice] = useState(0);
  const [limitSellAmount, setLimitSellAmount] = useState(0);
  const [limitSellTotal, setLimitSellTotal] = useState(0);
  const [limitSellSlideValue, setLimitSellSlideValue] = useState(0);
  const [marketBuyPrice, setMarketBuyPrice] = useState(0);
  const [marketBuyAmount, setMarketBuyAmount] = useState(0);
  const [marketBuyTotal, setMarketBuyTotal] = useState(0);
  const [marketBuySlideValue, setMarketBuySlideValue] = useState(0);
  const [marketSellPrice, setMarketSellPrice] = useState(0);
  const [marketSellAmount, setMarketSellAmount] = useState(0);
  const [marketSellTotal, setMarketSellTotal] = useState(0);
  const [marketSellSlideValue, setMarketSellSlideValue] = useState(0);
  const [fromBalance, setFromBalance] = useState(0);
  const [toBalance, setToBalance] = useState(0);
  const [marketBuyAmountVisible, showMarketBuyAmount] = useState(true);
  const [marketSellAmountVisible, showMarketSellAmount] = useState(true);
  const network = networks[NET_NAME];
  const from = PAIR_LIST[pair_id].from;
  const to = PAIR_LIST[pair_id].to;

  const handleLimitBuyOrder = async () => {
    if (limitBuyPrice <= 0) {
      toast.warning(`Please input ${from?.symbol} price`);
      return;
    }
    if (limitBuyAmount <= 0) {
      toast.warning(`Please input ${to?.symbol} amount`);
      return;
    }

    let status = null, add_order = null, update_match_order = null, remove_match_orders = null;
    try {
      const resp = await axios.post(API_URL + '/match_limit_order', {
        address: walletAddress,
        pair_id,
        order_stock_amount: limitBuyAmount,
        current_stock_amount: limitBuyAmount,
        price: limitBuyPrice,
        is_buy: true,
        type: ORDER_TYPE.LIMIT
      });
      status = resp.data.status;
      if (status !== RETURN_STATUS.ERROR) {
        if (status === RETURN_STATUS.ADD || status === RETURN_STATUS.ADD_REMOVE) {
          add_order = {
            id: resp.data.add_order._id,
            address: resp.data.add_order.address,
            order_stock_amount: toWei(resp.data.add_order.order_stock_amount),
            current_stock_amount: toWei(resp.data.add_order.current_stock_amount),
            pair_id: resp.data.add_order.pair_id.toString(),
            price: toWei(resp.data.add_order.price),
            is_buy: resp.data.add_order.is_buy
          }
        }
        if (status === RETURN_STATUS.UPDATE || status === RETURN_STATUS.UPDATE_REMOVE) {
          update_match_order = {
            id: resp.data.update_match_order._id,
            address: resp.data.update_match_order.address,
            order_stock_amount: toWei(resp.data.update_match_order.order_stock_amount),
            current_stock_amount: toWei(resp.data.update_match_order.current_stock_amount),
            pair_id: resp.data.update_match_order.pair_id.toString(),
            price: toWei(resp.data.update_match_order.price),
            is_buy: resp.data.update_match_order.is_buy
          }
        }
        if (status === RETURN_STATUS.REMOVE || status === RETURN_STATUS.ADD_REMOVE || status === RETURN_STATUS.UPDATE_REMOVE) {
          remove_match_orders = [];
          for (let i = 0; i < resp.data.remove_match_orders.length; i++) {
            const item = resp.data.remove_match_orders[i];
            const data = {
              id: item._id,
              address: item.address,
              order_stock_amount: toWei(item.order_stock_amount),
              current_stock_amount: toWei(item.current_stock_amount),
              pair_id: item.pair_id.toString(),
              price: toWei(item.price),
              is_buy: item.is_buy
            }
            remove_match_orders.push(data);
          }
        }
        console.log("<><><>", add_order, update_match_order, remove_match_orders);
        try {
          const res = await executeOrder(pair_id, limitBuyAmount, limitBuyPrice, true, add_order, update_match_order, remove_match_orders);
          if (res === true) {
            await axios.post(API_URL + '/confirm_order', {
              status: resp.data.status,
              add_order: resp.data.add_order,
              update_match_order: resp.data.update_match_order,
              remove_match_orders: resp.data.remove_match_orders,
              log_order: resp.data.log_order
            });
          }
          // if (res === false) {
          //   await axios.post(API_URL + '/revert_order', {
          //     status: resp.data.status,
          //     add_order: resp.data.add_order,
          //     update_match_order: resp.data.update_match_order,
          //     remove_match_orders: resp.data.remove_match_orders,
          //     log_order: resp.data.log_order
          //   });
          // }
        } catch (err) {
          console.log(err)
          // await axios.post(API_URL + '/revert_order', {
          //   status: resp.data.status,
          //   add_order: resp.data.add_order,
          //   update_match_order: resp.data.update_match_order,
          //   remove_match_orders: resp.data.remove_match_orders,
          //   log_order: resp.data.log_order
          // });
        }

        setUpdateHistory(!updateHistory);
        setIsBuy(true);
        setTxType(TX_TYPE.BUY);
      } else {
        toast.error(resp.data.message);
        return;
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleLimitSellOrder = async () => {
    if (limitSellPrice <= 0) {
      toast.warning(`Please input ${from?.symbol} price`);
      return;
    }
    if (limitSellAmount <= 0) {
      toast.warning(`Please input ${to?.symbol} amount`);
      return;
    }

    let status = null, add_order = null, update_match_order = null, remove_match_orders = null;
    try {
      const resp = await axios.post(API_URL + '/match_limit_order', {
        address: walletAddress,
        pair_id,
        order_stock_amount: limitSellAmount,
        current_stock_amount: limitSellAmount,
        price: limitSellPrice,
        is_buy: false,
        type: ORDER_TYPE.LIMIT
      });
      status = resp.data.status;
      if (status !== RETURN_STATUS.ERROR) {
        if (status === RETURN_STATUS.ADD || status === RETURN_STATUS.ADD_REMOVE) {
          add_order = {
            id: resp.data.add_order._id,
            address: resp.data.add_order.address,
            order_stock_amount: toWei(resp.data.add_order.order_stock_amount),
            current_stock_amount: toWei(resp.data.add_order.current_stock_amount),
            pair_id: resp.data.add_order.pair_id.toString(),
            price: toWei(resp.data.add_order.price),
            is_buy: resp.data.add_order.is_buy
          }
        }
        if (status === RETURN_STATUS.UPDATE || status === RETURN_STATUS.UPDATE_REMOVE) {
          update_match_order = {
            id: resp.data.update_match_order._id,
            address: resp.data.update_match_order.address,
            order_stock_amount: toWei(resp.data.update_match_order.order_stock_amount),
            current_stock_amount: toWei(resp.data.update_match_order.current_stock_amount),
            pair_id: resp.data.update_match_order.pair_id.toString(),
            price: toWei(resp.data.update_match_order.price),
            is_buy: resp.data.update_match_order.is_buy
          }
        }
        if (status === RETURN_STATUS.REMOVE || status === RETURN_STATUS.ADD_REMOVE || status === RETURN_STATUS.UPDATE_REMOVE) {
          remove_match_orders = [];
          for (let i = 0; i < resp.data.remove_match_orders.length; i++) {
            const item = resp.data.remove_match_orders[i];
            const data = {
              id: item._id,
              address: item.address,
              order_stock_amount: toWei(item.order_stock_amount),
              current_stock_amount: toWei(item.current_stock_amount),
              pair_id: item.pair_id.toString(),
              price: toWei(item.price),
              is_buy: item.is_buy
            }
            remove_match_orders.push(data);
          }
        }
        console.log("<><><>", add_order, update_match_order, remove_match_orders);
        try {
          const res = await executeOrder(pair_id, limitSellAmount, limitSellPrice, false, add_order, update_match_order, remove_match_orders);
          if (res === true) {
            await axios.post(API_URL + '/confirm_order', {
              status: resp.data.status,
              add_order: resp.data.add_order,
              update_match_order: resp.data.update_match_order,
              remove_match_orders: resp.data.remove_match_orders,
              log_order: resp.data.log_order
            });
          }
          // if (res === false) {
          //   await axios.post(API_URL + '/revert_order', {
          //     status: resp.data.status,
          //     add_order: resp.data.add_order,
          //     update_match_order: resp.data.update_match_order,
          //     remove_match_orders: resp.data.remove_match_orders,
          //     log_order: resp.data.log_order
          //   });
          // }
        } catch (err) {
          console.log(err);
          // await axios.post(API_URL + '/revert_order', {
          //   status: resp.data.status,
          //   add_order: resp.data.add_order,
          //   update_match_order: resp.data.update_match_order,
          //   remove_match_orders: resp.data.remove_match_orders,
          //   log_order: resp.data.log_order
          // });
        }

        setUpdateHistory(!updateHistory);
        setIsBuy(false);
        setTxType(TX_TYPE.SELL);
      } else {
        toast.error(resp.data.message);
        return;
      }
    } catch (err) {
      console.log(err)
    }

  }

  const handleMarketBuyOrder = async () => {
    if (marketBuyAmount <= 0) {
      toast.warning(`Please input ${to?.symbol} amount`);
      return;
    }

    let status = null, add_order = null, update_match_order = null, remove_match_orders = null;
    try {
      const resp = await axios.post(API_URL + '/match_market_order', {
        address: walletAddress,
        pair_id,
        order_stock_amount: marketBuyAmount,
        current_stock_amount: marketBuyAmount,
        price: marketBuyPrice,
        is_buy: true,
        type: ORDER_TYPE.MARKET
      });
      status = resp.data.status;
      if (status !== RETURN_STATUS.ERROR) {
        if (status === RETURN_STATUS.ADD || status === RETURN_STATUS.ADD_REMOVE) {
          add_order = {
            id: resp.data.add_order._id,
            address: resp.data.add_order.address,
            order_stock_amount: toWei(resp.data.add_order.order_stock_amount),
            current_stock_amount: toWei(resp.data.add_order.current_stock_amount),
            pair_id: resp.data.add_order.pair_id.toString(),
            price: toWei(resp.data.add_order.price),
            is_buy: resp.data.add_order.is_buy
          }
        }
        if (status === RETURN_STATUS.UPDATE || status === RETURN_STATUS.UPDATE_REMOVE) {
          update_match_order = {
            id: resp.data.update_match_order._id,
            address: resp.data.update_match_order.address,
            order_stock_amount: toWei(resp.data.update_match_order.order_stock_amount),
            current_stock_amount: toWei(resp.data.update_match_order.current_stock_amount),
            pair_id: resp.data.update_match_order.pair_id.toString(),
            price: toWei(resp.data.update_match_order.price),
            is_buy: resp.data.update_match_order.is_buy
          }
        }
        if (status === RETURN_STATUS.REMOVE || status === RETURN_STATUS.ADD_REMOVE || status === RETURN_STATUS.UPDATE_REMOVE) {
          remove_match_orders = [];
          for (let i = 0; i < resp.data.remove_match_orders.length; i++) {
            const item = resp.data.remove_match_orders[i];
            const data = {
              id: item._id,
              address: item.address,
              order_stock_amount: toWei(item.order_stock_amount),
              current_stock_amount: toWei(item.current_stock_amount),
              pair_id: item.pair_id.toString(),
              price: toWei(item.price),
              is_buy: item.is_buy
            }
            remove_match_orders.push(data);
          }
        }
        console.log("<><><>", add_order, update_match_order, remove_match_orders);
        try {
          const res = await executeOrder(pair_id, marketBuyAmount, marketBuyPrice, true, add_order, update_match_order, remove_match_orders);
          if (res === true) {
            await axios.post(API_URL + '/confirm_order', {
              status: resp.data.status,
              add_order: resp.data.add_order,
              update_match_order: resp.data.update_match_order,
              remove_match_orders: resp.data.remove_match_orders,
              log_order: resp.data.log_order
            });
          }
          // if (res === false) {
          //   await axios.post(API_URL + '/revert_order', {
          //     status: resp.data.status,
          //     add_order: resp.data.add_order,
          //     update_match_order: resp.data.update_match_order,
          //     remove_match_orders: resp.data.remove_match_orders,
          //     log_order: resp.data.log_order
          //   });
          // }
        } catch (err) {
          console.log(err);
          // await axios.post(API_URL + '/revert_order', {
          //   status: resp.data.status,
          //   add_order: resp.data.add_order,
          //   update_match_order: resp.data.update_match_order,
          //   remove_match_orders: resp.data.remove_match_orders,
          //   log_order: resp.data.log_order
          // });
        }
        setUpdateHistory(!updateHistory);
        setIsBuy(true);
        setTxType(TX_TYPE.BUY);
      } else {
        toast.error(resp.data.message);
        return;
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleMarketSellOrder = async () => {
    if (marketSellAmount <= 0) {
      toast.warning(`Please input ${to?.symbol} amount`);
      return;
    }

    let status = null, add_order = null, update_match_order = null, remove_match_orders = null;
    try {
      const resp = await axios.post(API_URL + '/match_market_order', {
        address: walletAddress,
        pair_id,
        order_stock_amount: marketSellAmount,
        current_stock_amount: marketSellAmount,
        price: marketSellPrice,
        is_buy: false,
        type: ORDER_TYPE.MARKET
      });
      status = resp.data.status;
      if (status !== RETURN_STATUS.ERROR) {
        if (status === RETURN_STATUS.ADD || status === RETURN_STATUS.ADD_REMOVE) {
          add_order = {
            id: resp.data.add_order._id,
            address: resp.data.add_order.address,
            order_stock_amount: toWei(resp.data.add_order.order_stock_amount),
            current_stock_amount: toWei(resp.data.add_order.current_stock_amount),
            pair_id: resp.data.add_order.pair_id.toString(),
            price: toWei(resp.data.add_order.price),
            is_buy: resp.data.add_order.is_buy
          }
        }
        if (status === RETURN_STATUS.UPDATE || status === RETURN_STATUS.UPDATE_REMOVE) {
          update_match_order = {
            id: resp.data.update_match_order._id,
            address: resp.data.update_match_order.address,
            order_stock_amount: toWei(resp.data.update_match_order.order_stock_amount),
            current_stock_amount: toWei(resp.data.update_match_order.current_stock_amount),
            pair_id: resp.data.update_match_order.pair_id.toString(),
            price: toWei(resp.data.update_match_order.price),
            is_buy: resp.data.update_match_order.is_buy
          }
        }
        if (status === RETURN_STATUS.REMOVE || status === RETURN_STATUS.ADD_REMOVE || status === RETURN_STATUS.UPDATE_REMOVE) {
          remove_match_orders = [];
          for (let i = 0; i < resp.data.remove_match_orders.length; i++) {
            const item = resp.data.remove_match_orders[i];
            const data = {
              id: item._id,
              address: item.address,
              order_stock_amount: toWei(item.order_stock_amount),
              current_stock_amount: toWei(item.current_stock_amount),
              pair_id: item.pair_id.toString(),
              price: toWei(item.price),
              is_buy: item.is_buy
            }
            remove_match_orders.push(data);
          }
        }
        console.log("<><><>", add_order, update_match_order, remove_match_orders);
        try {
          const res = await executeOrder(pair_id, marketSellAmount, marketSellPrice, false, add_order, update_match_order, remove_match_orders);
          if (res === true) {
            await axios.post(API_URL + '/confirm_order', {
              status: resp.data.status,
              add_order: resp.data.add_order,
              update_match_order: resp.data.update_match_order,
              remove_match_orders: resp.data.remove_match_orders,
              log_order: resp.data.log_order
            });
          }
          // if (res === false) {
          //   await axios.post(API_URL + '/revert_order', {
          //     status: resp.data.status,
          //     add_order: resp.data.add_order,
          //     update_match_order: resp.data.update_match_order,
          //     remove_match_orders: resp.data.remove_match_orders,
          //     log_order: resp.data.log_order
          //   });
          // }
        } catch (err) {
          console.log(err);
          // await axios.post(API_URL + '/revert_order', {
          //   status: resp.data.status,
          //   add_order: resp.data.add_order,
          //   update_match_order: resp.data.update_match_order,
          //   remove_match_orders: resp.data.remove_match_orders,
          //   log_order: resp.data.log_order
          // });
        }

        setUpdateHistory(!updateHistory);
        setIsBuy(false);
        setTxType(TX_TYPE.SELL);
      } else {
        toast.error(resp.data.message);
        return;
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleChangeInput = async (e) => {
    if (e.target.name === 'limit_buy_price') {
      setLimitBuyPrice(e.target.value);
      setClickedPrice(0);
    } else if (e.target.name === 'limit_buy_amount') {
      let res = limitBuyPrice * e.target.value;
      if (fromBalance >= 0) {
        if (res > fromBalance) {
          toast.warning(`${from?.symbol}'s balance is not enough`);
        } else {
          setLimitBuyAmount(e.target.value);
          setLimitBuyTotal(res);
        }
      }
    } else if (e.target.name === 'limit_buy_total') {
      if (fromBalance >= 0) {
        if (e.target.value > fromBalance) {
          toast.warning(`${from?.symbol}'s balance is not enough`);
        } else {
          setLimitBuyTotal(e.target.value)
          if (limitBuyPrice !== 0) {
            let res = e.target.value / limitBuyPrice;
            setLimitBuyAmount(res);
          }
        }
      }
    } else if (e.target.name === 'limit_sell_price') {
      setLimitSellPrice(e.target.value);
      setClickedPrice(0);
    } else if (e.target.name === 'limit_sell_amount') {
      if (toBalance >= 0) {
        if (e.target.value > toBalance) {
          toast.warning(`${to?.symbol}'s balance is not enough`);
        } else {
          let res = limitSellPrice * e.target.value;
          setLimitSellAmount(e.target.value);
          setLimitSellTotal(res);
        }
      }
    } else if (e.target.name === 'limit_sell_total') {
      if (limitSellPrice !== 0) {
        let res = e.target.value / limitSellPrice;
        if (toBalance >= 0) {
          if (res > toBalance) {
            toast.warning(`${to?.symbol}'s balance is not enough`);
          } else {
            setLimitSellTotal(e.target.value);
            setLimitSellAmount(res);
          }
        }
      }
    } else if (e.target.name === 'market_buy_amount') {
      const value = Number(e.target.value);
      const resp = await axios.post(API_URL + '/estimate_market_price_to', {
        pair_id,
        current_stock_amount: value,
        is_buy: true,
      });
      if (resp.data.status === RETURN_STATUS.SUCCESS) {
        let res = resp.data.market_price * value;
        if (fromBalance >= 0) {
          if (res > fromBalance) {
            toast.warning(`${from?.symbol}'s balance is not enough`);
          } else {
            setMarketBuyPrice(resp.data.market_price);
            setMarketBuyAmount(value);
            setMarketBuyTotal(res);
          }
        }
      }

    } else if (e.target.name === 'market_buy_total') {
      const value = Number(e.target.value);
      const resp = await axios.post(API_URL + '/estimate_market_price_from', {
        pair_id,
        current_stock_total: value,
        is_buy: true,
      });
      if (resp.data.status === RETURN_STATUS.SUCCESS) {
        if (resp.data.market_price !== 0) {
          if (fromBalance >= 0) {
            if (value > fromBalance) {
              toast.warning(`${from?.symbol}'s balance is not enough`);
            } else {
              setMarketBuyPrice(resp.data.market_price);
              setMarketBuyTotal(value)
              let res = value / resp.data.market_price;
              setMarketBuyAmount(res);
            }
          }
        }
      }
    } else if (e.target.name === 'market_sell_amount') {
      const value = Number(e.target.value);
      const resp = await axios.post(API_URL + '/estimate_market_price_to', {
        pair_id,
        current_stock_amount: value,
        is_buy: false,
      });
      if (resp.data.status === RETURN_STATUS.SUCCESS) {
        if (toBalance >= 0) {
          if (value > toBalance) {
            toast.warning(`${to?.symbol}'s balance is not enough`);
          } else {
            let res = resp.data.market_price * value;
            setMarketSellPrice(resp.data.market_price);
            setMarketSellAmount(value);
            setMarketSellTotal(res);
          }
        }
      }
    } else if (e.target.name === 'market_sell_total') {
      const value = Number(e.target.value);
      const resp = await axios.post(API_URL + '/estimate_market_price_from', {
        pair_id,
        current_stock_total: value,
        is_buy: false,
      });
      if (resp.data.status === RETURN_STATUS.SUCCESS) {
        if (resp.data.market_price !== 0) {
          let res = value / resp.data.market_price;
          if (toBalance >= 0) {
            if (res > toBalance) {
              toast.warning(`${to?.symbol}'s balance is not enough`);
            } else {
              setMarketSellPrice(resp.data.market_price);
              setMarketSellTotal(value);
              setMarketSellAmount(res);
            }
          }
        }
      }
    }
  }

  useEffect(() => {
    (async () => {
      if (!walletAddress) return;
      let resp = await getTokenBalance(from?.contract_addr, walletAddress);
      if (resp) {
        setFromBalance(fromWei(resp.balance))
      }
      resp = await getTokenBalance(to?.contract_addr, walletAddress);
      if (resp) {
        setToBalance(fromWei(resp.balance))
      }
    })()
  }, [from, to, walletAddress])

  useEffect(() => {
    if (lastTx?.state === TX_STATE.COMPLETE && (txType === TX_TYPE.BUY || txType === TX_TYPE.SELL)) {
      if (isBuy && txType === TX_TYPE.BUY) {
        Swal.fire({
          title: '<strong class="tw-text-black>Success</strong>',
          icon: 'success',
          html:
            `<span class="tw-text-black">Ordered ${limitBuyAmount} ${to?.symbol} with ${limitBuyTotal} ${from?.symbol}.</span>
             <a href=${network.explorer + 'tx/' + lastTx?.txhash} target="_blank">${getShortAddress(lastTx?.txhash)}</a>
            `,
          showCancelButton: false,
          confirmButtonColor: '#0d6efd',
        })
      } else {
        Swal.fire({
          title: '<strong class="tw-text-black>Success</strong>',
          icon: 'success',
          html:
            `<span class="tw-text-black">Ordered ${limitSellTotal} ${from?.symbol} with ${limitSellAmount} ${to?.symbol}.</span>
             <a href=${network.explorer + 'tx/' + lastTx?.txhash} target="_blank">${getShortAddress(lastTx?.txhash)}</a>
            `,
          showCancelButton: false,
          confirmButtonColor: '#0d6efd',
        })
      }

      setLastTx({ state: TX_STATE.INIT, txhash: '' })
      setTxType(TX_TYPE.NONE);
    }
  }, [lastTx, txType])

  useEffect(() => {
    let total = fromBalance * limitBuySlideValue / 100;
    setLimitBuyTotal(total);
    if (limitBuyPrice !== 0) {
      let amount = total / limitBuyPrice;
      setLimitBuyAmount(amount);
    }
  }, [limitBuySlideValue])

  useEffect(() => {
    let amount = toBalance * limitSellSlideValue / 100;
    setLimitSellAmount(amount);
    if (limitSellPrice !== 0) {
      let total = amount * limitSellPrice;
      setLimitSellTotal(total);
    }
  }, [limitSellSlideValue])

  useEffect(() => {
    (async () => {
      let total = fromBalance * marketBuySlideValue / 100;
      const resp = await axios.post(API_URL + '/estimate_market_price_from', {
        pair_id,
        current_stock_total: total,
        is_buy: true,
      });
      if (resp.data.status === RETURN_STATUS.SUCCESS) {
        if (resp.data.market_price !== 0) {
          if (fromBalance >= 0) {
            if (total > fromBalance) {
              toast.warning(`${from?.symbol}'s balance is not enough`);
            } else {
              setMarketBuyPrice(resp.data.market_price);
              setMarketBuyTotal(total)
              let res = total / resp.data.market_price;
              setMarketBuyAmount(res);
            }
          }
        }
      }
    })()
  }, [marketBuySlideValue])

  useEffect(() => {
    (async () => {
      let amount = toBalance * marketSellSlideValue / 100;
      const resp = await axios.post(API_URL + '/estimate_market_price_to', {
        pair_id,
        current_stock_amount: amount,
        is_buy: false,
      });
      if (resp.data.status === RETURN_STATUS.SUCCESS) {
        if (toBalance >= 0) {
          if (amount > toBalance) {
            toast.warning(`${to?.symbol}'s balance is not enough`);
          } else {
            if (resp.data.market_price > 0) {
              let res = resp.data.market_price * amount;
              setMarketSellPrice(resp.data.market_price);
              setMarketSellAmount(amount);
              setMarketSellTotal(res);
            }
          }
        }
      }
    })()
  }, [marketSellSlideValue])

  useEffect(() => {
    if (clickedPrice > 0) {
      setLimitBuyPrice(clickedPrice);
      setLimitSellPrice(clickedPrice);
    }
  }, [clickedPrice])

  return (
    <>
      <div className="market-trade">
        <Tabs defaultActiveKey="limit">
          <Tab eventKey="limit" title="Limit">
            <div className="d-flex justify-content-between">
              <div className="market-trade-buy">
                <div className="tw-text-gray-400">
                  Available <span className="tw-text-white ml-2">{fromBalance >= 0 ? fromBalance : '--'} {from?.symbol}</span>
                </div>
                <div className="input-group">
                  <input
                    type="number"
                    name="limit_buy_price"
                    value={limitBuyPrice}
                    onChange={handleChangeInput}
                    className="form-control"
                    placeholder="Price"
                    required
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">{from?.symbol}</span>
                  </div>
                </div>
                <div className="input-group">
                  <input
                    type="number"
                    name="limit_buy_amount"
                    value={limitBuyAmount}
                    onChange={handleChangeInput}
                    className="form-control"
                    placeholder="Amount"
                    required
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">{to?.symbol}</span>
                  </div>
                </div>
                <div className="market-trade-list tw-text-center">
                  <Slider setValue={setLimitBuySlideValue} disabled={status !== WalletStatus.WALLET_CONNECTED} />
                </div>
                <div className="input-group">
                  <input
                    type="number"
                    name="limit_buy_total"
                    value={limitBuyTotal}
                    onChange={handleChangeInput}
                    className="form-control"
                    placeholder="Total"
                    required
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">{from?.symbol}</span>
                  </div>
                </div>
                <div className="tw-mt-10">
                  {status === WalletStatus.WALLET_CONNECTED ? (
                    <button className="btn buy" onClick={() => handleLimitBuyOrder()}>
                      Buy {to?.symbol}
                    </button>
                  ) : (
                    <ConnectWallet className='btn connect' />
                  )}
                </div>
              </div>
              <div className="market-trade-sell">
                <div className="tw-text-gray-400">
                  Available <span className="tw-text-white ml-2">{toBalance >= 0 ? toBalance : '--'} {to?.symbol}</span>
                </div>
                <div className="input-group">
                  <input
                    type="number"
                    name="limit_sell_price"
                    value={limitSellPrice}
                    onChange={handleChangeInput}
                    className="form-control"
                    placeholder="Price"
                    required
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">{from?.symbol}</span>
                  </div>
                </div>
                <div className="input-group">
                  <input
                    type="number"
                    name="limit_sell_amount"
                    value={limitSellAmount}
                    onChange={handleChangeInput}
                    className="form-control"
                    placeholder="Amount"
                    required
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">{to?.symbol}</span>
                  </div>
                </div>
                <div className="market-trade-list tw-text-center">
                  <Slider setValue={setLimitSellSlideValue} disabled={status !== WalletStatus.WALLET_CONNECTED} />
                </div>
                <div className="input-group">
                  <input
                    type="number"
                    name="limit_sell_total"
                    value={limitSellTotal}
                    onChange={handleChangeInput}
                    className="form-control"
                    placeholder="Total"
                    required
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">{from?.symbol}</span>
                  </div>
                </div>
                <div className="tw-mt-10">
                  {status === WalletStatus.WALLET_CONNECTED ? (
                    <button className="btn sell" onClick={() => handleLimitSellOrder()}>
                      Sell {to?.symbol}
                    </button>
                  ) : (
                    <ConnectWallet className='btn connect' />
                  )}
                </div>
              </div>
            </div>
          </Tab>
          <Tab eventKey="market" title="Market">
            <div className="d-flex justify-content-between">
              <div className="market-trade-buy">
                <div className="tw-text-gray-400">
                  Available <span className="tw-text-white ml-2">{fromBalance >= 0 ? fromBalance : '--'} {from?.symbol}</span>
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control !tw-text-gray-400"
                    placeholder="Price"
                    value="Most optimal price"
                    disabled
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">{from?.symbol}</span>
                  </div>
                </div>
                <div className={marketBuyAmountVisible ? "input-group" : "input-group tw-hidden"}>
                  <MarketOrderDropdown text="Amount" visibleItem={marketBuyAmountVisible} setVisibleItem={showMarketBuyAmount} />
                  <input
                    type="number"
                    name="market_buy_amount"
                    value={marketBuyAmount}
                    onChange={handleChangeInput}
                    className="form-control"
                    placeholder="Amount"
                    required
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">{to?.symbol}</span>
                  </div>
                </div>
                <div className={marketBuyAmountVisible ? "input-group tw-hidden" : "input-group"}>
                  <MarketOrderDropdown text="Total" visibleItem={marketBuyAmountVisible} setVisibleItem={showMarketBuyAmount} />
                  <input
                    type="number"
                    name="market_buy_total"
                    value={marketBuyTotal}
                    onChange={handleChangeInput}
                    className="form-control"
                    placeholder="Total"
                    required
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">{from?.symbol}</span>
                  </div>
                </div>
                <div className="market-trade-list tw-text-center">
                  <Slider setValue={setMarketBuySlideValue} disabled={status !== WalletStatus.WALLET_CONNECTED} />
                </div>
                <div className="tw-mt-10">
                  {status === WalletStatus.WALLET_CONNECTED ? (
                    <button className="btn buy" onClick={() => handleMarketBuyOrder()}>
                      Buy {to?.symbol}
                    </button>
                  ) : (
                    <ConnectWallet className='btn connect' />
                  )}
                </div>
              </div>
              <div className="market-trade-sell">
                <div className="tw-text-gray-400">
                  Available <span className="tw-text-white ml-2">{toBalance >= 0 ? toBalance : '--'} {to?.symbol}</span>
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control !tw-text-gray-400"
                    placeholder="Price"
                    value="Most optimal price"
                    disabled
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">{from?.symbol}</span>
                  </div>
                </div>
                <div className={marketSellAmountVisible ? "input-group" : "input-group tw-hidden"}>
                  <MarketOrderDropdown text="Amount" visibleItem={marketSellAmountVisible} setVisibleItem={showMarketSellAmount} />
                  <input
                    type="number"
                    name="market_sell_amount"
                    value={marketSellAmount}
                    onChange={handleChangeInput}
                    className="form-control"
                    placeholder="Amount"
                    required
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">{to?.symbol}</span>
                  </div>
                </div>
                <div className={marketSellAmountVisible ? "input-group tw-hidden" : "input-group"}>
                  <MarketOrderDropdown text="Total" visibleItem={marketSellAmountVisible} setVisibleItem={showMarketSellAmount} />
                  <input
                    type="number"
                    name="market_sell_total"
                    value={marketSellTotal}
                    onChange={handleChangeInput}
                    className="form-control"
                    placeholder="Total"
                    required
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">{from?.symbol}</span>
                  </div>
                </div>
                <div className="market-trade-list tw-text-center">
                  <Slider setValue={setMarketSellSlideValue} disabled={status !== WalletStatus.WALLET_CONNECTED} />
                </div>
                <div className="tw-mt-10">
                  {status === WalletStatus.WALLET_CONNECTED ? (
                    <button className="btn sell" onClick={() => handleMarketSellOrder()}>
                      Sell {to?.symbol}
                    </button>
                  ) : (
                    <ConnectWallet className='btn connect' />
                  )}
                </div>
              </div>
            </div>
          </Tab>
          <Tab eventKey="stop-limit" title="Stop Limit">
            <div className="d-flex justify-content-between">
              <div className="market-trade-buy">
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Price"
                    required
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">{from?.symbol}</span>
                  </div>
                </div>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Amount"
                    required
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">{to?.symbol}</span>
                  </div>
                </div>
                <div className="market-trade-list tw-text-center">
                  <Slider disabled={status !== WalletStatus.WALLET_CONNECTED} />
                </div>
                <p>
                  Available: <span>0 tLUNC = 0 CUST</span>
                </p>
                <p>
                  Volume: <span>0 tLUNC = 0 CUST</span>
                </p>
                <p>
                  Margin: <span>0 tLUNC = 0 CUST</span>
                </p>
                <p>
                  Fee: <span>0 tLUNC = 0 CUST</span>
                </p>
                <div className="tw-mt-10">
                  {status === WalletStatus.WALLET_CONNECTED ? (
                    <button className="btn buy">
                      Buy {to?.symbol}
                    </button>
                  ) : (
                    <ConnectWallet className='btn connect' />
                  )}
                </div>
              </div>
              <div className="market-trade-sell">
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Price"
                    required
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">{from?.symbol}</span>
                  </div>
                </div>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Amount"
                    required
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">{to?.symbol}</span>
                  </div>
                </div>
                <div className="market-trade-list tw-text-center">
                  <Slider disabled={status !== WalletStatus.WALLET_CONNECTED} />
                </div>
                <p>
                  Available: <span>0 tLUNC = 0 CUST</span>
                </p>
                <p>
                  Volume: <span>0 tLUNC = 0 CUST</span>
                </p>
                <p>
                  Margin: <span>0 tLUNC = 0 CUST</span>
                </p>
                <p>
                  Fee: <span>0 tLUNC = 0 CUST</span>
                </p>
                <div className="tw-mt-10">
                  {status === WalletStatus.WALLET_CONNECTED ? (
                    <button className="btn sell">
                      Sell {to?.symbol}
                    </button>
                  ) : (
                    <ConnectWallet className='btn connect' />
                  )}
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
