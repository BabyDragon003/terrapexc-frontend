import { MsgExecuteContract, Coins } from '@terra-money/terra.js';

export function estimateFee(terraClient, msg) {
  // Estimate the fee (gas + stability fee/tax)
  return terraClient.tx.estimateFee(msg.sender, [msg]);
}

export function increaseAllowanceMsg(walletAddress, tokenContract, spender, amount) {
  return new MsgExecuteContract(
    walletAddress,
    tokenContract,
    {
      increase_allowance: {
        spender: spender,
        amount: amount,
        expires: {
          never: {}
        }
      }
    }
  )
}

export function decreaseAllowanceMsg(walletAddress, tokenContract, spender, amount) {
  return new MsgExecuteContract(
    walletAddress,
    tokenContract,
    {
      decrease_allowance: {
        spender: spender,
        amount: amount,
        expires: {
          never: {}
        }
      }
    }
  )
}

export function orderMsg(walletAddress, contract, pair_id, amount, price, is_buy, add_order = null, update_match_order = null, remove_match_orders = null) {
  const resCoins = new Coins([])
  const orderJson = {
    order: {
      id: '',
      address: walletAddress,
      pair_id,
      order_stock_amount: amount,
      current_stock_amount: amount,
      price,
      is_buy
    }
  }
  if (add_order) {
    orderJson.add_order = add_order;
  }
  if (update_match_order) {
    orderJson.update_order = update_match_order;
  }
  if (remove_match_orders) {
    orderJson.remove_orders = remove_match_orders;
  }

  return new MsgExecuteContract(
    walletAddress,
    contract,
    {
      order: orderJson
    },
    resCoins
  )
}