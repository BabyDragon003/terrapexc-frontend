import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Dropdown, Button } from 'react-bootstrap';
import { Link } from '@reach/router';
import clsx from 'clsx';
import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import { ThemeConsumer } from '../context/ThemeContext';
import ConnectWallet from './ConnectWallet';
import { useConnectModal } from '../context/useConnectModal';
import { getShortAddress } from '../utils/utils';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const connectModal = useConnectModal();
  const { status, network, wallets, disconnect } = useWallet();

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleWallet = () => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      connectModal.open2();
    } else {
      connectModal.open();
    }
    setShowDropdown(false);
  }

  const handleDisconnect = () => {
    disconnect();
    setShowDropdown(false);
  }

  useEffect(() => {
    document.body.classList.remove('dark');
    document.body.classList.add('dark');
    let el = document.querySelector('#darkTheme');
    if (el) {
      el.addEventListener('click', function () {
        document.body.classList.toggle('dark');
      });
    }
  }, [])

  return (
    <>
      <header className="light-bb">
        <Navbar expand="lg">
          <Link className="navbar-brand" to="/">
            <ThemeConsumer>
              {({ data }) => {
                return data.theme === 'light' ? (
                  <img src={'/img/logo.png'} alt="logo" />
                ) : (
                  <img src={'/img/logo.png'} alt="logo" />
                );
              }}
            </ThemeConsumer>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="navbar-nav ml-auto">
              <Dropdown className="header-custom-icon">
                {/* <ThemeConsumer>
                  {({ data, update }) => (
                    <Button variant="default" onClick={update} id="darkTheme">
                      {data.theme === 'light' ? (
                        <i className="icon ion-md-moon"></i>
                      ) : (
                        <i className="icon ion-md-sunny"></i>
                      )}
                    </Button>
                  )}
                </ThemeConsumer>
                <Dropdown.Toggle variant="default">
                  <i className="icon ion-md-notifications"></i>
                  <span className="circle-pulse"></span>
                </Dropdown.Toggle> */}
                <Dropdown.Menu>
                  <div className="dropdown-header d-flex align-items-center justify-content-between">
                    <p className="mb-0 font-weight-medium">
                      Notifications
                    </p>
                    <a href="#!" className="text-muted">
                      Clear all
                    </a>
                  </div>
                  <div className="dropdown-body">
                    <a href="#!" className="dropdown-item">
                      <div className="content tw-text-center !tw-m-0">
                        <p>No Data</p>
                      </div>
                    </a>
                    {/*<a href="#!" className="dropdown-item">
                        <div className="icon">
                          <i className="icon ion-md-lock"></i>
                        </div>
                        <div className="content">
                          <p>Account password change</p>
                          <p className="sub-text text-muted">5 sec ago</p>
                        </div>
                      </a>
                      <a href="#!" className="dropdown-item">
                        <div className="icon">
                          <i className="icon ion-md-alert"></i>
                        </div>
                        <div className="content">
                          <p>Solve the security issue</p>
                          <p className="sub-text text-muted">10 min ago</p>
                        </div>
                      </a>
                      <a href="#!" className="dropdown-item">
                        <div className="icon">
                          <i className="icon ion-logo-android"></i>
                        </div>
                        <div className="content">
                          <p>Download android app</p>
                          <p className="sub-text text-muted">1 hrs ago</p>
                        </div>
                      </a>
                      <a href="#!" className="dropdown-item">
                        <div className="icon">
                          <i className="icon ion-logo-bitcoin"></i>
                        </div>
                        <div className="content">
                          <p>Bitcoin price is high now</p>
                          <p className="sub-text text-muted">2 hrs ago</p>
                        </div>
                      </a>
                      <a href="#!" className="dropdown-item">
                        <div className="icon">
                          <i className="icon ion-logo-usd"></i>
                        </div>
                        <div className="content">
                          <p>Payment completed</p>
                          <p className="sub-text text-muted">4 hrs ago</p>
                        </div>
                      </a> */}
                  </div>
                  <div className="dropdown-footer d-flex align-items-center justify-content-center">
                    <a href="#!">View all</a>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown className="header-img-icon" show={showDropdown} onToggle={handleDropdown}>
                {status === WalletStatus.WALLET_CONNECTED ? (
                  <div className="tw-flex tw-items-center tw-gap-1 tw-h-full tw-pl-2">
                    <span className="tw-flex tw-items-center">
                      <div className={clsx("dot", network?.isClassic ? "tw-bg-[#53f3c3]" : "tw-bg-[#f3536c]")}></div>
                      <span className="tw-text-white tw-text-sm tw-px-2 tw-pt-0.5">{network?.name?.toUpperCase()}</span>
                    </span>
                    <Dropdown.Toggle className='!tw-px-0' variant="default">
                      <MdOutlineAccountBalanceWallet color="#fff" />
                      <span className="tw-text-white tw-pl-1">{wallets.length > 0 && getShortAddress(wallets[0].terraAddress)}</span>
                    </Dropdown.Toggle>
                  </div>
                ) : (
                  <ConnectWallet />
                )}
                {status === WalletStatus.WALLET_CONNECTED && (
                  <Dropdown.Menu>
                    <div className="dropdown-body">
                      <ul className="profile-nav">
                        <li className="nav-item">
                          <span className="nav-link tw-cursor-pointer" onClick={handleWallet}>
                            <i className="icon ion-md-wallet tw-text-white"></i>
                            <span className='tw-text-white'>My Wallet</span>
                          </span>
                        </li>
                        <li className="nav-item">
                          <span className="nav-link tw-cursor-pointer">
                            <i className="icon ion-md-settings tw-text-white"></i>
                            <span className='tw-text-white'>Settings</span>
                          </span>
                        </li>
                        <li className="nav-item">
                          <span className="nav-link tw-cursor-pointer" onClick={handleDisconnect}>
                            <i className="icon ion-md-power tw-text-white"></i>
                            <span className='tw-text-white'>Disconnect</span>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </Dropdown.Menu>
                )}
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
    </>
  )
}

export default Header;