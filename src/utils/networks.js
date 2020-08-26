export const NATIVE_TOKEN_DECIMALS = 6;
export const COMMISSION_RATE = 0.003; // 0.3%
export const NET_NAME = 'mainnet';

export const API_URL = 'http://95.164.87.3:5000/api/orders';

export const networks = {
  mainnet: {
    id: "columbus-5",
    name: "classic",
    chainID: "columbus-5",
    lcd: "https://terra-classic-lcd.publicnode.com",
    fcd: "https://terra-classic-fcd.publicnode.com",
    explorer: "https://finder.terra.money/classic/",
    gasPrices: { uusd: 0.15 },
    fee: { gasPrice: 0.15, amount: 100000 }, // 0.1 UST
    factoryContract: "",
    routerContract: "",
    tradingContract: "terra1hxvd43lzml5eete78nknsqavgx9znggsz38k2y"
  },
  testnet: {
    id: "pisco-1",
    name: "testnet",
    chainID: "rebel-2",
    lcd: "https://lcd.terrac.dev",
    fcd: "https://fcd.terrac.dev",
    explorer: "https://finder.terrac.dev/classictestnet/",
    gasPrice: { uluna: 0.0015 },
    fee: { gasPrice: 0.15, amount: 100000 },
  }
}