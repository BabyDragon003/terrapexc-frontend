import React, { useState } from 'react';
import clsx from 'clsx';
import { FiChevronDown } from 'react-icons/fi';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import { IoMdSend } from 'react-icons/io';

const Walletbar = () => {
  const [show, setShow] = useState(false);

  return (
    <nav className={clsx('tw-w-[350px] tw-fixed tw-top-0 tw-h-full tw-bg-slate-800 tw-transition-all tw-ease-in-out tw-duration-300 tw-z-50', show ? 'tw-right-0' : '-tw-right-[350px]')}>
      <header className='tw-px-8 tw-pb-2 tw-pt-12 tw-text-center !tw-bg-transparent'>
        <span className="tw-text-white tw-text-xl">Portfolio Value</span>
        <div className="tw-flex tw-items-end tw-mt-4 tw-justify-center">
          <span className="tw-text-white tw-text-4xl">$&nbsp;0.</span>
          <span className="tw-text-white tw-text-2xl">00</span>
        </div>
      </header>
      <div
        className={clsx("tw-absolute tw-cursor-pointer tw-rounded-t-lg tw-top-[120px] -tw-rotate-90 tw-px-4 tw-py-1 tw-bg-slate-800 hover:tw-bg-slate-600 tw-flex tw-justify-center tw-gap-2 tw-items-center tw-transition-all tw-duration-200 ", show ? "-tw-left-[42px]" : "-tw-left-[65px]")}
        onClick={() => setShow(!show)}
      >
        {show ? (
          <FiChevronDown color='white' size={22} />
        ) : (
          <>
            <MdOutlineAccountBalanceWallet color="white" size={18} />
            <span className="tw-text-white tw-pt-1">Wallet</span>
          </>
        )}
      </div>
      <div className="tw-flex tw-justify-evenly tw-py-4" style={{ borderBottom: 'solid 2px #415068' }}>
        <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-1">
          <button className="tw-rounded-full tw-bg-blue-700 hover:tw-bg-blue-800 tw-transition-all tw-w-10 tw-h-10 tw-border-none -tw-rotate-90">
            <IoMdSend color="white" size={22} />
          </button>
          <span className="tw-text-white">SEND</span>
        </div>
        <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-1">
          <button className="tw-rounded-full tw-bg-gray-600 hover:tw-bg-gray-700 tw-transition-all tw-w-10 tw-h-10 tw-border-none tw-rotate-90">
            <IoMdSend color="white" size={22} />
          </button>
          <span className="tw-text-white">RECEIVE</span>
        </div>
      </div>
      <div className="tw-flex tw-flex-col tw-px-4 tw-py-2">
        <div className="tw-flex tw-justify-between tw-items-center">
          <span className="tw-text-white tw-text-lg">Assets</span>
          <span className="tw-text-white tw-cursor-pointer hover:tw-text-gray-300 tw-transition-all">Manage Assets</span>
        </div>
        <section className="py-4">
          <div className="tw-flex tw-items-center tw-justify-between py-2">
            <div className='tw-flex tw-gap-2 tw-items-center'>
              <div className="tw-flex tw-justify-center tw-items-center tw-w-10 tw-h-10 tw-bg-gray-600 tw-rounded-full">
                <img src="/img/icon/lunc.png" alt="tLUNC" width={22} height={22} />
              </div>
              <div className="tw-flex tw-flex-col">
                <span className='tw-text-white tw-text-[18px]'>tLUNC</span>
                <span className='tw-text-white tw-text-[15px]'>0.00%</span>
              </div>
            </div>
            <div className="tw-flex tw-flex-col tw-items-end">
              <span className='tw-text-white tw-text-[18px]'>$-</span>
              <span className='tw-text-white tw-text-[15px]'>0.00 tLUNC</span>
            </div>
          </div>
          <div className="tw-flex tw-items-center tw-justify-between py-2">
            <div className='tw-flex tw-gap-2 tw-items-center'>
              <div className="tw-flex tw-justify-center tw-items-center tw-w-10 tw-h-10 tw-bg-gray-600 tw-rounded-full">
                <img src="/img/icon/cust.png" alt="CUST" width={22} height={22} />
              </div>
              <div className="tw-flex tw-flex-col">
                <span className='tw-text-white tw-text-[18px]'>CUST</span>
                <span className='tw-text-white tw-text-[15px]'>0.00%</span>
              </div>
            </div>
            <div className="tw-flex tw-flex-col tw-items-end">
              <span className='tw-text-white tw-text-[18px]'>$-</span>
              <span className='tw-text-white tw-text-[15px]'>0.00 CUST</span>
            </div>
          </div>
          <div className="tw-flex tw-items-center tw-justify-between py-2">
            <div className='tw-flex tw-gap-2 tw-items-center'>
              <div className="tw-flex tw-justify-center tw-items-center tw-w-10 tw-h-10 tw-bg-gray-600 tw-rounded-full">
                <img src="/img/icon/tlf.png" alt="TLF" width={22} height={22} />
              </div>
              <div className="tw-flex tw-flex-col">
                <span className='tw-text-white tw-text-[18px]'>TLF</span>
                <span className='tw-text-white tw-text-[15px]'>0.00%</span>
              </div>
            </div>
            <div className="tw-flex tw-flex-col tw-items-end">
              <span className='tw-text-white tw-text-[18px]'>$-</span>
              <span className='tw-text-white tw-text-[15px]'>0.00 TLF</span>
            </div>
          </div>
        </section>
      </div>
    </nav>
  )
}

export default Walletbar; 