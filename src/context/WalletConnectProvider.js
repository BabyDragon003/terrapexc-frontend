import {
  WalletProvider,
  getChainOptions,
} from "@terra-money/wallet-provider"
import { useEffect, useState } from "react"
import WalletModal, { useModal } from "../components/WalletModal";
import { ConnectModalProvider } from "./useConnectModal";
import { NetworkProvider } from "./useClient"
import { ContractProvider } from "./useContract"

const WalletConnectProvider = ({
  children,
}) => {
  const modal = useModal()

  const [chainOptions, setChainOptions] = useState()

  useEffect(() => {
    getChainOptions().then((chainOptions) => setChainOptions(chainOptions))
  }, [])

  return chainOptions ? (
    <WalletProvider {...chainOptions}>
      <NetworkProvider>
        <ContractProvider>
          <ConnectModalProvider value={modal}>
            <WalletModal {...modal} isCloseBtn />
            {children}
          </ConnectModalProvider>
        </ContractProvider>
      </NetworkProvider>
    </WalletProvider>
  ) : (
    <></>
  )
}
export default WalletConnectProvider
