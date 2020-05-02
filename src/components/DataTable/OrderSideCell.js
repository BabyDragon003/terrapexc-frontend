import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { ORDER_SIDE } from '../../utils/constants';

const OrderSideCell = ({ text, setItem }) => {
  const [active, setActive] = useState(ORDER_SIDE.ALL);

  const handleClick = (v) => {
    setActive(v);
    setItem(v);
  }

  return (
    <div className="selectbox dropdown">
      <span>{text} <FaChevronDown /></span>
      <ul className="dropdown-menu">
        <li className={`dropdown-item ${active === ORDER_SIDE.ALL ? 'active' : ''}`} onClick={() => handleClick(ORDER_SIDE.ALL)}>
          All
        </li>
        <li className={`dropdown-item ${active === ORDER_SIDE.BUY ? 'active' : ''}`} onClick={() => handleClick(ORDER_SIDE.BUY)}>
          Buy
        </li>
        <li className={`dropdown-item ${active === ORDER_SIDE.SELL ? 'active' : ''}`} onClick={() => handleClick(ORDER_SIDE.SELL)}>
          Sell
        </li>
      </ul>
    </div>
  )
}

export default OrderSideCell;