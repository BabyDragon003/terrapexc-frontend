import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from "axios";
import moment from 'moment';
import { toast } from 'react-toastify';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Sortable from './DataTable/Sortable';
import OrderSideCell from './DataTable/OrderSideCell';
import { API_URL } from "../utils/networks";
import { useContract } from '../context/useContract';
import { getShortAddress } from '../utils/utils';
import { TX_STATE, TX_TYPE, PAIR_LIST, ORDER_TYPE, ORDER_SIDE, SORT_TYPE } from "../utils/constants";
import { networks, NET_NAME } from '../utils/networks';
import useAddress from '../context/useAddress';

const SORT_FIELD = {
  DATE: 'Date',
  TYPE: 'Type',
  PRICE: 'Price',
  AMOUNT: 'Amount',
  EXECUTED: 'Executed',
  TOTAL: 'Total'
}

export default function OpenOrderTab() {
  const [open_orders, setOpenOrders] = useState([]);
  const [sortType, setSortType] = useState(SORT_TYPE.NONE);
  const [sortField, setSortField] = useState(SORT_FIELD.DATE);
  const [orderSide, setOrderSide] = useState(ORDER_SIDE.ALL);
  const { lastTx, setLastTx, txType, setTxType, updateHistory, setUpdateHistory, getAllowance, executeDecreaseAllowance } = useContract();
  const network = networks[NET_NAME];

  const walletAddress = useAddress();
  const START = 0;
  const LIMIT = 10;
  const getOrderHistory = async (field, type, order) => {
    try {
      const resp = await axios.get(API_URL + "/get_order_history", {
        params: {
          address: walletAddress,
          is_open: 1,
          is_buy: order,
          field,
          type,
          start: START,
          last: START + LIMIT
        }
      });

      if (resp.data.status === 100) {
        setOpenOrders(resp.data.list);
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getOrderHistory(sortField, sortType, orderSide);
  }, [walletAddress, sortField, sortType, orderSide, updateHistory])

  const handleSort = (field, type) => {
    setSortField(field);
    setSortType(type);
  }

  const handleCancel = async (item) => {
    try {
      const html = `
        <span class="tw-text-black">Will you really cancel the order?</span><br/>
      `
      Swal.fire({
        title: '<strong class="tw-text-black>Information</strong>',
        icon: 'info',
        html,
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.put(API_URL + "/update_cancel", {
            id: item._id,
            address: walletAddress,
            isCancel: 1
          });
          try {
            const res = await executeDecreaseAllowance(item.pair_id, item.current_stock_amount, item.price, item.is_buy);
            if (res === false) {
              await axios.put(API_URL + "/update_cancel", {
                id: item._id,
                address: walletAddress,
                isCancel: 0
              });
            }
          } catch (err) {
            await axios.put(API_URL + "/update_cancel", {
              id: item._id,
              address: walletAddress,
              isCancel: 0
            });
          }
          setUpdateHistory(!updateHistory);
          setTxType(TX_TYPE.CANCEL);
        }
      })
    } catch (err) {
      console.log(err);
      await axios.put(API_URL + "/update_cancel", {
        id: item._id,
        address: walletAddress,
        isCancel: 0
      });
      toast.error(`Unfortuntaley the canceling an order failed`);
    }
  }

  useEffect(() => {
    if (lastTx?.state === TX_STATE.COMPLETE && txType === TX_TYPE.CANCEL) {
      Swal.fire({
        title: '<strong class="tw-text-black>Success</strong>',
        icon: 'success',
        html:
          `<span class="tw-text-black">Successfully canceled an order.</span>
             <a href=${network.explorer + 'tx/' + lastTx?.txhash} target="_blank">${getShortAddress(lastTx?.txhash)}</a>
            `,
        showCancelButton: false,
        confirmButtonColor: '#0d6efd',
      })
      setLastTx({ state: TX_STATE.INIT, txhash: '' })
      setTxType(TX_TYPE.NONE)
    }
  }, [lastTx, txType])

  return (
    <>
      <ul className="tw-flex justify-content-between market-order-item">
        <li style={{ width: '15%' }}><Sortable text="Date" active={sortField === SORT_FIELD.DATE} setSortType={(v) => handleSort(SORT_FIELD.DATE, v)} /></li>
        <li style={{ width: '14%' }}>Trading Pair</li>
        <li style={{ width: '10%' }}><Sortable text="Type" active={sortField === SORT_FIELD.TYPE} setSortType={(v) => handleSort(SORT_FIELD.TYPE, v)} /></li>
        <li style={{ width: '8%' }}><OrderSideCell text="Order" setItem={setOrderSide} /></li>
        <li style={{ width: '9%' }} className="tw-text-right"><Sortable text="Price" active={sortField === SORT_FIELD.PRICE} setSortType={(v) => handleSort(SORT_FIELD.PRICE, v)} /></li>
        <li style={{ width: '10%' }} className="tw-text-right"><Sortable text="Amount" active={sortField === SORT_FIELD.AMOUNT} setSortType={(v) => handleSort(SORT_FIELD.AMOUNT, v)} /></li>
        <li style={{ width: '12%' }} className="tw-text-right"><Sortable text="Executed" active={sortField === SORT_FIELD.EXECUTED} setSortType={(v) => handleSort(SORT_FIELD.EXECUTED, v)} /></li>
        <li style={{ width: '12%' }} className="tw-text-right"><Sortable text="Total" active={sortField === SORT_FIELD.TOTAL} setSortType={(v) => handleSort(SORT_FIELD.TOTAL, v)} /></li>
        <li style={{ width: '10%' }} className="tw-text-right">Cancel</li>
      </ul>
      <ul className="market-sm-order-item tw-justify-start">
        <li>
          <FormControlLabel
            sx={{
              '&.MuiFormControlLabel-root': {
                margin: '0px'
              },
              '.MuiTypography-root': {
                fontSize: '14px',
                paddingTop: '1px'
              }
            }}
            control={
              <Checkbox
                sx={{
                  '&.MuiCheckbox-root': {
                    padding: '2px'
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#758696',
                    width: '18px',
                    height: '18px'
                  }
                }}
              />
            }
            label="Hide Other Pairs"
          />
        </li>
      </ul>
      {open_orders?.length > 0 ? open_orders.map((item, index) => (
        <ul className="tw-flex justify-content-between market-order-item" key={index}>
          <li style={{ width: '15%' }}>{moment(item.createdAt).format('MM-DD HH:mm:ss')}</li>
          <li style={{ width: '14%' }}><span className="tw-text-white">{PAIR_LIST[item.pair_id]?.to.symbol}</span>/{PAIR_LIST[item.pair_id]?.from.symbol}</li>
          <li style={{ width: '10%' }}>{item.type === ORDER_TYPE.LIMIT ? 'Limit' : 'Market'}</li>
          <li style={{ width: '8%' }}>{item.is_buy ? <span className="green">Buy</span> : <span className="red">Sell</span>}</li>
          <li style={{ width: '9%' }} className="tw-text-white tw-text-right">{item.price}</li>
          <li style={{ width: '10%' }} className="tw-text-white tw-text-right">{item.order_stock_amount}</li>
          <li style={{ width: '12%' }} className="tw-text-white tw-text-right">{item.order_stock_amount - item.current_stock_amount}</li>
          <li style={{ width: '12%' }} className="tw-text-right"><span className="tw-text-white">{(item.order_stock_amount - item.current_stock_amount) * item.price}</span> {PAIR_LIST[item.pair_id]?.from.symbol}</li>
          <li style={{ width: '10%' }} className="tw-text-right"><span className="tw-text-blue-600 hover:tw-text-blue-500 tw-cursor-pointer" onClick={() => handleCancel(item)}>Cancel</span></li>
        </ul>
      )) : (
        <span className="no-data">
          <i className="icon ion-md-document"></i>
          No data
        </span>
      )}
    </>
  );
}
