export const UST = "UST"

export const ULUNA = "uluna"
export const UUSD = "uusd"


export const TX_STATE = {
  INIT: 'init',
  START: 'start',
  PENDING: 'pending',
  COMPLETE: 'complete',
  ERROR: 'error'
}

export const TX_TYPE = {
  NONE: 0,
  BUY: 1,
  SELL: 2,
  CANCEL: 3,
}

export const tokenInfos = new Map([
  [
    ULUNA,
    {
      contract_addr: ULUNA,
      symbol: LUNA,
      name: ULUNA,
      decimals: 6,
      asset: "assets/icons/tLUNC.png",
    },
  ],
  [
    UUSD,
    {
      contract_addr: UUSD,
      symbol: UST,
      name: UUSD,
      decimals: 6,
      asset: "assets/icons/UST.png",
    },
  ]
])

export const SORT_TYPE = {
  NONE: 'none',
  ASC: 'asc',
  DESC: 'desc'
}

export const ORDER_TYPE = {
  ALL: 0,
  LIMIT: 1,
  MARKET: 2,
}

export const ORDER_SIDE = {
  ALL: 'all',
  BUY: 'buy',
  SELL: 'sell'
}

export const STATUS_TYPE = {
  ALL: 0,
  OPEN: 1,
  COMPLETED: 2,
  CANCELED: 3
}

export const TOKEN_LIST = {
  tLUNC: {
    symbol: 'tLUNC',
    contract_addr: 'terra17wcv6xejhuleh2y644y4kh0k9yz5hznyfyl7eg',
    decimals: 6,
    asset: "/img/icon/lunc.png",
  },
  CUST: {
    symbol: 'CUST',
    contract_addr: 'terra1zrsnlm5q2gld3gqa83ffghukhq80syhh7ncekw',
    decimals: 6,
    asset: "/img/icon/cust.png",
  },
  TLF: {
    symbol: 'TLF',
    contract_addr: 'terra18e0wz7gc5y6l26c4yyqj2sj7crau878jy8case',
    decimals: 6,
    asset: "/img/icon/tlf.png",
  }
}

export const PAIR_LIST = [
  {
    from: TOKEN_LIST.CUST,
    to: TOKEN_LIST.tLUNC,
  },
  {
    from: TOKEN_LIST.TLF,
    to: TOKEN_LIST.tLUNC,
  },
  {
    from: TOKEN_LIST.TLF,
    to: TOKEN_LIST.CUST,
  }
]

export const RETURN_STATUS = {
  SUCCESS: 100,
  ADD: 101,
  UPDATE: 102,
  REMOVE: 103,
  ADD_REMOVE: 104,
  UPDATE_REMOVE: 105,
  ERROR: 200,
}
