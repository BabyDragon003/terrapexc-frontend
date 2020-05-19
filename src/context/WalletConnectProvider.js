import {
  WalletProvider,
  getChainOptions,
} from "@terra-money/wallet-provider"
import { useEffect, useState } from "react"
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
