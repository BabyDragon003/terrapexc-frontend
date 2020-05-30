import React from "react";
import { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import axios from "axios";
import { networks, NET_NAME, API_URL } from "../utils/networks";
import { PAIR_LIST } from "../utils/constants";
import { Rectangle } from "@mui/icons-material";
import { useContract } from '../context/useContract';

export default function OrderBook({ pair_id }) {
  const [buy_orders, setBuyOrders] = useState([]);
  const [sell_orders, setSellOrders] = useState([]);
  const [buy_top, setBuyTop] = useState(0);
  const [sell_top, setSellTop] = useState(0);
  const [recent_orders, setRecentOrders] = useState([]);
  const from = PAIR_LIST[pair_id].from;
  const to = PAIR_LIST[pair_id].to;
  const { setClickedPrice } = useContract();

  useEffect(() => {
    let timerId = setInterval(() => {
      getBuyOrders();
      getBuyTopOrder();
      getSellOrders();
      getSellTopOrder();
      getRecentOrders();
    }, 10000);

    return () => clearInterval(timerId);
  }, [pair_id]);

  const handleClickOrder = (price) => {
    setClickedPrice(price);
  }

  const getBuyOrders = async () => {
    const resp = await axios.post(API_URL + "/get_orderBook", {
      pair_id: pair_id,
      is_buy: true,
      type: 0,
      limit: 15,
    });
    if (resp.data.status === 100) {
      setBuyOrders(resp.data.order_list);
    }
  };

  const getBuyTopOrder = async () => {
    const resp = await axios.post(API_URL + "/get_topOrder", {
      pair_id: pair_id,
      is_buy: true,
      type: 0,
    });
    if (resp.data.status === 100) {
      setBuyTop(resp.data.top_order);
    }
  };

  const getSellOrders = async () => {
    const resp = await axios.post(API_URL + "/get_orderBook", {
      pair_id: pair_id,
      is_buy: false,
      type: 0,
      limit: 13,
    });
    if (resp.data.status === 100) {
      setSellOrders(resp.data.order_list);
    }
  };

  const getSellTopOrder = async () => {
    const resp = await axios.post(API_URL + "/get_topOrder", {
      pair_id: pair_id,
      is_buy: false,
      type: 0,
    });
    if (resp.data.status === 100) {
      setSellTop(resp.data.top_order);
    }
  };

  const getRecentOrders = async () => {
    const resp = await axios.post(API_URL + "/get_recentOrders", {
      pair_id: pair_id,
      type: 0,
      limit: 30
    });
    if (resp.data.status === 100) {
      setRecentOrders(resp.data.data);
    }
  };

  return (
    <>
      <div className="order-book mb15">
        <Tabs defaultActiveKey="order-book">
          <Tab eventKey="order-book" title="Order Book">
            <table className="table">
              <thead className="sell-heading">
                <tr>
                  <th>Price({from?.symbol})</th>
                  <th>Amount({to?.symbol})</th>
                  <th>Total({from?.symbol})</th>
                </tr>
              </thead>
              <tbody className="sell-body">
                {sell_orders?.map((order) => (
                  <tr key={order._id.price} style={{position:'relative', cursor:'pointer'}} onClick={() => handleClickOrder(order._id.price)}>
                    <td className="red">{order._id.price}</td>
                    <td>{order.total}</td>
                    <td>{order.total * order._id.price}</td>
                    <div style={{position:'absolute', content:'', top:'0', right:'0', width: `${order.total/sell_top * 100}%`, height:'100%', backgroundColor:'#ff231f63'}} className=""></div>
                  </tr>
                ))}
              </tbody>
              <thead className="buy-heading">
                <tr>
                  <th>
                    <span>Last Price</span>
                    <br />
                    <span className="tw-text-white">0.020367</span>
                  </th>
                  <th>
                    <span>USD</span>
                    <br />
                    <span className="tw-text-white">148.65</span>
                  </th>
                  <th className="red">
                    <span>Change</span>
                    <br />
                    <span>-0.51%</span>
                  </th>
                </tr>
              </thead>
              <tbody className="buy-body">
                {buy_orders?.map((order) => (
                  <tr key={order._id.price} style={{position:'relative', cursor:'pointer'}} onClick={() => handleClickOrder(order._id.price)}>
                    <td className="green">{order._id.price}</td>
                    <td>{order.total}</td>
                    <td>{order.total * order._id.price}</td>
                    <div style={{position:'absolute', content:'', top:'0', right:'0', width: `${order.total/buy_top * 100}%`, height:'100%', backgroundColor:'#26de8163'}} className=""></div>
                  </tr>
                ))}
              </tbody>
            </table>
          </Tab>
          <Tab eventKey="recent-trades" title="Recent Trades">
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Price(from?.symbol)</th>
                  <th>Amount(to?.symbol)</th>
                </tr>
              </thead>
              <tbody>
                {recent_orders?.map((order) => {
                  const createdAt = new Date(order.createdAt);
                  const localCreatedAt = createdAt.toLocaleString();
                  return (
                    <tr>
                      <td>{localCreatedAt}</td>
                      <td className={order.is_buy ? "green" : "red"}>{order.price}</td>
                      <td>{order.current_stock_amount}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
