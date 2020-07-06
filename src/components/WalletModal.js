import Modal from 'react-bootstrap/Modal';
import { Tooltip, IconButton } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { WalletStatus } from '@terra-money/wallet-types';
import { ConnectType, useWallet } from '@terra-money/wallet-provider';
import { IoIosWarning } from 'react-icons/io';
import { getShortAddress, copyToClipboard } from '../utils/utils';
import { networks, NET_NAME } from '../utils/networks';
import Swal from 'sweetalert2';

const WalletModal = (props) => {
  const { wallets, status, network, connect, disconnect } = useWallet();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (status === WalletStatus.WALLET_NOT_CONNECTED) {
      return;
    }
    if (status !== WalletStatus.INITIALIZING && network.chainID !== networks[NET_NAME].chainID) {
      Swal.fire({
        title: '<strong class="tw-text-black>Sucess</strong>',
        icon: 'warning',
        html:
          `<p class="tw-text-black">Wrong network connection</p>
        <span class="tw-text-black tw-text-[16px]">Your wallet is connected to <b>${network.name}(${network.chainID})</b>.</span><br/>
        <span class="tw-text-black tw-text-[16px]">Please change the network to <b>Terra Classic(${networks[NET_NAME].chainID})</b>.</span>
        `,
        showCancelButton: false,
        confirmButtonColor: '#0d6efd',
      })
    }
  }, [status, network])

  const handleTerraConnect = () => {
    connect(ConnectType.EXTENSION);
    props.close();
  }

  const handleWalletConnect = () => {
    connect(ConnectType.WALLETCONNECT);
    props.close();
  }

  const handleDisconnect = () => {
    disconnect();
    props.close2();
  }

  const handleCopyClick = (e) => {
    copyToClipboard(wallets[0].terraAddress);

    e.stopPropagation();
    setOpen(true);
    setTimeout(handleClose, 1000);
  }

  return (
    <>
      <Modal show={props.isOpen} onHide={props.close} centered variant="dark">
        <Modal.Body className='p-4 pt-4'>
          <Modal.Header closeButton className='pb-4 pt-1 border-0'>
            <Modal.Title className='tw-text-black fs-5'>Connect Wallet</Modal.Title>
          </Modal.Header>
          <div className="tw-p-4 tw-cursor-pointer">
            <div className="tw-flex tw-items-center tw-gap-4" onClick={handleWalletConnect}>
              <img src="/img/icon/walletconnect.png" alt="" className="img-fluid" />
              <span className="tw-text-black tw-text-lg tw-opacity-80 hover:tw-opacity-100">
                WalletConnect
              </span>
            </div>
          </div>
          <div className="tw-p-4 tw-cursor-pointer">
            <div className="tw-flex tw-items-center tw-gap-4" onClick={handleTerraConnect}>
              <img src="/img/icon/TerraStation.png" alt="" className="img-fluid" />
              <span className="tw-text-black tw-text-lg tw-opacity-80 hover:tw-opacity-100">
                Terra Station
              </span>
            </div>
          </div>
        </Modal.Body>

      </Modal >
      <Modal dialogClassName='tw-max-w-[400px]' show={props.isOpen2} onHide={props.close2} centered variant="dark">
        <Modal.Body className='p-4 pt-4'>
          <Modal.Header closeButton className='px-0 border-0'>
            <Modal.Title className='tw-text-black'>My Wallet</Modal.Title>
          </Modal.Header>
          <div className="tw-flex tw-flex-col">
            <div className="tw-flex tw-justify-between tw-items-center mt-4">
              <div>
                <p className="tw-text-black mb-0 tw-text-lg tw-font-semibold">
                  {wallets?.length > 0 && getShortAddress(wallets[0].terraAddress)}
                </p>
              </div>
              <div className='tw-flex tw-gap-3 tw-items-center'>
                <div className='tw-cursor-pointer'>
                  <Tooltip
                    arrow
                    open={open}
                    title="Copied!">
                    <IconButton onClick={handleCopyClick} className='!tw-p-0'>
                      <ContentCopyIcon className='tw-text-gray-600' />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="tw-p-4 tw-my-4 tw-border tw-border-solid tw-border-yellow-400 tw-bg-yellow-50 tw-rounded-lg">
              <div className="tw-flex tw-items-center">
                <IoIosWarning className='tw-text-yellow-400' size={20} />
                <span className='tw-text-black tw-font-semibold tw-pt-1 tw-pl-2'>tLUNC Balance Low</span>
              </div>
              <span className='tw-text-black tw-pl-7'>You need tLUNC for transaction fees.</span>
            </div>
            <div className="tw-flex tw-flex-col tw-gap-2">
              <div className="tw-flex tw-justify-between">
                <div className="tw-flex tw-gap-1">
                  <img src="/img/icon/lunc.png" width={20} height={20} alt="tLUNC"></img>
                  <span className='tw-text-black'>tLUNC</span>
                </div>
                <span className='tw-text-black'>0.0</span>
              </div>
              <div className="tw-flex tw-justify-between">
                <div className="tw-flex tw-gap-1">
                  <img src="/img/icon/cust.png" width={20} height={20} alt="CUST"></img>
                  <span className='tw-text-black'>CUST</span>
                </div>
                <span className='tw-text-black'>0.0</span>
              </div>
              <div className="tw-flex tw-justify-between">
                <div className="tw-flex tw-gap-1">
                  <img src="/img/icon/tlf.png" width={20} height={20} alt="TLF"></img>
                  <span className='tw-text-black'>TLF</span>
                </div>
                <span className='tw-text-black'>0.0</span>
              </div>
            </div>
            <div className="tw-flex tw-w-full tw-justify-center tw-mt-4">
              <div className="btn tw-w-1/2 btn-primary px-3 py-2 text-white tw-cursor-pointer tw-text-[16px]" onClick={handleDisconnect}>
                Disconnect Wallet
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default WalletModal

/* modal */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpen2, setIsOpen2] = useState(false)
  return {
    isOpen,
    isOpen2,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    open2: () => setIsOpen2(true),
    close2: () => setIsOpen2(false)
  }
}
