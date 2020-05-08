import React, { useState } from 'react';
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