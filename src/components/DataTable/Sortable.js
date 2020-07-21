import { useState, useEffect } from 'react';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';
import { SORT_TYPE } from '../../utils/constants';

const Sortable = ({ text, active = false, setSortType }) => {
  const [type, setType] = useState(SORT_TYPE.NONE);

  useEffect(() => {
    if (!active) {
      setType(SORT_TYPE.NONE);
    }
  }, [active])

  const handleToggle = () => {
    if (type === SORT_TYPE.NONE) {
      setType(SORT_TYPE.ASC);
      setSortType(SORT_TYPE.ASC);
    } else if (type === SORT_TYPE.ASC) {
      setType(SORT_TYPE.DESC);
      setSortType(SORT_TYPE.DESC);
    } else {
      setType(SORT_TYPE.NONE);
      setSortType(SORT_TYPE.NONE);
    }
  }

  return (
    <div className='tw-cursor-pointer' onClick={handleToggle}>
      <span>{text}</span>
      <span>
        {type === SORT_TYPE.NONE ? (
          <FaSort />
        ) : type === SORT_TYPE.ASC ? (
          <FaSortUp />
        ) : (
          <FaSortDown />
        )}
      </span>
    </div>
  )
}

export default Sortable;