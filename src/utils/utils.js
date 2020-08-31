import BigNumber from "bignumber.js";
import { ceil, min, times } from "./math"
import { LUNA, ULUNA, UST, UUSD, tokenInfos } from "./constants"

export function fromWei(amount, decimal = 6) {
  if (typeof amount === 'string') {
    amount = Number(amount)
  }
  amount = amount / (10 ** decimal)
  return isNaN(amount) ? 0 : amount
}

export function toWei(amount, decimal = 6) {
  if (typeof amount === 'string') {
    amount = Number(amount)
  }
  amount = amount * 10 ** decimal
  return isNaN(amount) ? '0' : String(amount).split('.')[0];
}

export function convertFromMicroDenom(denom) {
  return denom?.substring(1).toUpperCase()
}

export function convertToFixedDecimals(amount) {
  if (typeof amount === 'string') {
    amount = Number(amount)
  }
  if (amount > 0.01) {
    return amount.toFixed(2)
  } else return String(amount)
}

export function float2int(value) {
  return parseInt(value.toFixed(0));
}

export function parseDecimalFloat(value, count = 3) {
  return parseFloat(value.toFixed(count));
}

export const zeroVotingCoin = {
  amount: '0',
  denom: 'ucredits',
}

export const zeroStakingCoin = {
  amount: '0',
  denom: process.env.REACT_APP_PUBLIC_STAKING_DENOM || 'ujuno',
}

export const numberWithCommas = (x, digits = 3) => {
  if (isEmpty(x)) return '0';
  return Number(x).toLocaleString(undefined, { maximumFractionDigits: digits });
}

export const parseNumber = (n, digits = 3) => {
  if (isNaN(n)) return 0;
  return parseInt((n * 10 ** digits).toString()) / 10 ** digits;
}

export const getShortAddress = (address, short = false) => {
  if (isEmpty(address)) return '';
  return address.slice(0, short ? 5 : 10) + '...' + address.slice(address.length - 5, address.length);
}

export const isValid = address => {
  // check the string format:
  // - starts with "terra1"
  // - length == 44 ("terra1" + 38)
  // - contains only numbers and lower case letters
  return /(terra1[a-z0-9]{38})/g.test(address);
}

export const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

export const parseErrorMsg = (errMsg) => {
  if (isEmpty(errMsg)) return "";
  var returStr = "";
  let startPos = JSON.stringify(errMsg).search("submessages:");
  if (startPos >= 0) {
    let subStr = errMsg.substring(startPos + 12, errMsg.length)
    returStr = subStr;
  } else returStr = errMsg;
  return returStr;
}


export function isAssetInfo(object) {
  return "token" in object
}

export function isNativeInfo(object) {
  return "native_token" in object
}

export const getContract = (asset) => {
  if (isNativeInfo(asset)) {
    return asset?.native_token?.denom;
  } else {
    return asset?.token?.contract_addr;
  }
}

export const calcTax = (amount, taxCap, taxRate) => {
  if (taxCap === "") {
    return ceil(times(amount, taxRate))
  }

  return ceil(min([times(amount, taxRate), taxCap]))
}

export const getSymbol = (key) => {
  switch (key) {
    case LUNA:
      return ULUNA
    case UST:
      return UUSD
    default:
      return ""
  }
}

export const hasTaxToken = (contract_addr) => {
  if (contract_addr.startsWith("terra")) {
    return false
  }

  return true
}

export const findTokenInfoBySymbolOrContractAddr = (contract_addr) => {
  return tokenInfos.get(
    Array.from(tokenInfos.entries(), ([key, value]) => ({
      key,
      value,
    })).find(({ key, value }) => {
      return value?.symbol === contract_addr || key === contract_addr
    })?.key || ""
  )
}

export const dp = (contract_addr) => {
  if (contract_addr) {
    const tokenInfo = findTokenInfoBySymbolOrContractAddr(contract_addr)
    return tokenInfo?.decimals || 6
  }
  return 6
}

export const toAmount = (value, contract_addr) => {
  let decimals = 6
  if (contract_addr) {
    const tokenInfo = findTokenInfoBySymbolOrContractAddr(contract_addr)
    if (tokenInfo) {
      decimals = tokenInfo.decimals
    }
  }

  const e = Math.pow(10, decimals)
  return value ? new BigNumber(value).times(e).integerValue().toString() : "0"
}

export const copyToClipboard = (data) => {
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method'
    return navigator.clipboard.writeText(data);
  } else {
    var textField = document.createElement('textarea')
    textField.innerText = data;
    textField.style.position = "fixed";
    textField.style.left = "-999999px";
    textField.style.top = "-999999px";
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }
}
