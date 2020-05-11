
const useAddress = () => {
  const connectedWallet = useConnectedWallet()
  return connectedWallet?.terraAddress ?? ""
}

export default useAddress
