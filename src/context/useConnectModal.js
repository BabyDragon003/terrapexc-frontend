import createContext from "./createContext"

const connectModal = createContext("connectWalletModal")
export const [useConnectModal, ConnectModalProvider] = connectModal
