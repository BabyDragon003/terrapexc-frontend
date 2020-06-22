import { Link } from '@reach/router';
import clsx from 'clsx';
import { Navbar, Nav } from 'react-bootstrap';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { BiTransferAlt, BiTrendingUp } from 'react-icons/bi';
import { HiOutlineCircleStack } from 'react-icons/hi2';
import { AiOutlineBank } from 'react-icons/ai';
import { BsMedium, BsTwitter, BsDiscord } from 'react-icons/bs';
import { FaTelegramPlane } from 'react-icons/fa';

const Sidebar = () => {
  const [show, setShow] = useState(false);

  return (
    <nav className={clsx('tw-w-[250px] tw-fixed tw-top-0 tw-h-full tw-bg-[#0c101b] tw-transition-all tw-ease-in-out tw-duration-300 tw-z-50', show ? 'tw-left-0' : '-tw-left-[240px]')}>
      <header className='tw-px-8 tw-py-2 !tw-bg-transparent'>
        <img src={'img/logo.png'} alt="logo" />
      </header>
      <span
        className={clsx("tw-absolute tw-cursor-pointer tw-top-0 tw-bottom-0 tw-my-auto tw-w-[35px] tw-h-[35px] tw-rounded-full tw-bg-slate-800 hover:tw-bg-slate-600 tw-flex tw-justify-center tw-items-center tw-transition-all tw-duration-200", show ? '-tw-right-[15px]' : '-tw-right-[25px]')}
        onClick={() => setShow(!show)}
      >
        {show ? (
          <FiChevronLeft className="tw-mr-[1px]" color='#ccc' size={22} />
        ) : (
          <FiChevronRight color='#ccc' size={22} />
        )}
      </span>
      <div className="tw-flex tw-flex-col tw-justify-between tw-overflow-y-scroll tw-mt-5" style={{ height: 'calc(100% - 100px)' }}>
        <Navbar>
          <Navbar.Collapse>
            <Nav className="tw-flex !tw-flex-col tw-w-full tw-gap-4">
              <Link to="/" className="nav-link tw-w-full !tw-text-[#ccc] !tw-pl-5 hover:tw-bg-[#3a3b3c] tw-rounded-md">
                <BiTrendingUp color="#ccc" size={22} />
                <span className="tw-ml-5 tw-text-[16px]">TRADE</span>
              </Link>
              <Link to="/swap" className="nav-link tw-w-full !tw-text-[#ccc] !tw-pl-5 hover:tw-bg-[#3a3b3c] tw-rounded-md">
                <BiTransferAlt color="#ccc" size={22} />
                <span className="tw-ml-5 tw-text-[16px]">SWAP</span>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div>
          <Navbar>
            <Navbar.Collapse>
              <Nav className="tw-flex !tw-flex-col tw-w-full tw-gap-4">
                <Link to="/" className="nav-link tw-w-full !tw-text-[#ccc] !tw-pl-5 hover:tw-bg-[#3a3b3c] tw-rounded-md">
                  <HiOutlineCircleStack color="#ccc" size={22} />
                  <span className="tw-ml-5 tw-text-[16px]">STAKE</span>
                </Link>
                <Link to="/swap" className="nav-link tw-w-full !tw-text-[#ccc] !tw-pl-5 hover:tw-bg-[#3a3b3c] tw-rounded-md">
                  <AiOutlineBank color="#ccc" size={22} />
                  <span className="tw-ml-5 tw-text-[16px]">GOVERNANCE</span>
                </Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <hr className="tw-bg-white" />
          <div className="tw-flex tw-gap-4 tw-justify-center">
            <span className='tw-cursor-pointer'>
              <BsMedium color="white" size={22} />
            </span>
            <span className='tw-cursor-pointer'>
              <BsTwitter color="white" size={22} />
            </span>
            <span className='tw-cursor-pointer'>
              <BsDiscord color="white" size={22} />
            </span>
            <span className='tw-cursor-pointer'>
              <FaTelegramPlane color="white" size={22} />
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Sidebar;