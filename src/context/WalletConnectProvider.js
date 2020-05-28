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

    </WalletProvider>
  ) : (
    <></>
  )
}
export default WalletConnectProvider
