import { FaChevronDown } from 'react-icons/fa';

const MarketOrderDropdown = ({ text, visibleItem, setVisibleItem }) => {

  const handleClick = (v) => {
      <ul className="dropdown-menu market-visible !tw-left-0 !tw-w-24">
        <li className={`dropdown-item ${visibleItem === true ? 'active' : ''}`} onClick={() => handleClick(true)}>
          Amount
        </li>
        <li className={`dropdown-item ${visibleItem === false ? 'active' : ''}`} onClick={() => handleClick(false)}>
          Total
        </li>
      </ul>
    </div>
  )
}

export default MarketOrderDropdown;