import { useCallback } from "react"
import axios from 'axios'
import { useClient } from './useClient';
import { ULUNA, UUSD } from '../utils/constants';
import { getSymbol } from "../utils/utils";

const useTax = () => {
  const { terraClient, network } = useClient();

  // useTax
  const loadTaxInfo = useCallback(
    async (contract_addr) => {
      if (!contract_addr) {
        return ""
      }

      let taxCap = ""
      try {
        const url = `${network.fcd}/treasury/tax_cap/${contract_addr}`
        const res = (await axios.get(url)).data
        taxCap = res.result
      } catch (error) {
        console.error(error)
      }

      return taxCap
    },
    [network.fcd]
  )

  const loadTaxRate = useCallback(async () => {
    let taxRate = "0"
    try {
      const url = `${network.fcd}/treasury/tax_rate`
      const res = (await axios.get(url)).data
      taxRate = res.result
    } catch (error) {
      console.error(error)
    }

    return taxRate
  }, [network.fcd])

  const loadGasPrice = useCallback(
    async (symbol) => {
      const symbolName = getSymbol(symbol) || symbol
      const url = `${network.fcd}/v1/txs/gas_prices`
      const res = (await axios.get(url)).data

      let gasPrice = "0"
      if (
        [
          UUSD,
          ULUNA,
        ].includes(symbolName)
      ) {
        gasPrice = (res)?.[symbolName]
      }

      return gasPrice
    },
    [network.fcd, getSymbol]
  )

  return {
    loadTaxInfo,
    loadTaxRate,
    loadGasPrice
  }
}

export default useTax
