import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { STATUS_TYPE } from '../../utils/constants';

const OrderTypeCell = ({ text, setItem }) => {
  return (
    <div className="selectbox dropdown">
      <span>{text} <FaChevronDown /></span>
      <ul className="dropdown-menu">
        <li className={`dropdown-item ${active === STATUS_TYPE.ALL ? 'active' : ''}`} onClick={() => handleClick(STATUS_TYPE.ALL)}>
          All
        </li>
        <li className={`dropdown-item ${active === STATUS_TYPE.OPEN ? 'active' : ''}`} onClick={() => handleClick(STATUS_TYPE.OPEN)}>
          Open
        </li>
        <li className={`dropdown-item ${active === STATUS_TYPE.COMPLETED ? 'active' : ''}`} onClick={() => handleClick(STATUS_TYPE.COMPLETED)}>
          Completed
        </li>
        <li className={`dropdown-item ${active === STATUS_TYPE.CANCELED ? 'active' : ''}`} onClick={() => handleClick(STATUS_TYPE.CANCELED)}>
          Cancelled
        </li>
      </ul>
    </div>
  )
}

export default OrderTypeCell;