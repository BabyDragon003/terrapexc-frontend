import { useConnectModal } from '../context/useConnectModal';

const ConnectWallet = ({ className = '' }) => {
  const connectModal = useConnectModal();
  const { status } = useWallet();

  const handleWallet = () => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      connectModal.open2();
    } else {
      connectModal.open();
    }
  }

  return (
    <button
      className={`${className ? className : 'tw-bg-[#0089ff] tw-h-full hover:tw-bg-[#4ca1eb] tw-transition-all tw-duration-200 tw- tw-rounded-full tw-outline-none tw-text-white !tw-px-4 !tw-pt-1.5 !tw-pb-1 tw-border-none'}`}
      onClick={handleWallet}
    >
      Connect Wallet
    </button>
  )
}

export default ConnectWallet;