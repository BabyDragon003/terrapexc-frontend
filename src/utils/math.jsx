import BN from "bignumber.js"
import { isNil } from "ramda"
import { Dec } from '@terra-money/terra.js';
import { NATIVE_TOKEN_DECIMALS } from './networks';

const rm = BN.ROUND_DOWN

/**
 * Calculates the current token price given pool sizes and weights
 *
 * @param {Int} ustPoolSize
 * @param {Int} tokenPoolSize
 * @param {Dec} ustWeight
 * @param {Dec} tokenWeight
 * @param {number} tokenDecimals
 * @returns {Dec} Price
 */
export function calcPrice({ ustPoolSize, tokenPoolSize, ustWeight, tokenWeight, tokenDecimals }) {
  return Dec.withPrec(ustPoolSize, NATIVE_TOKEN_DECIMALS).div(ustWeight).div(
    Dec.withPrec(tokenPoolSize, tokenDecimals).div(tokenWeight)
  )
}

export const plus = (a, b) =>
  new BN(a || 0).plus(b || 0).toString()

export const minus = (a, b) =>
  new BN(a || 0).minus(b || 0).toString()

export const times = (a, b) =>
  new BN(a || 0).times(b || 0).toString()

export const div = (a, b) =>
  new BN(a || 0).div(b || 1).toString()

export const sum = (array) =>
  BN.sum.apply(null, array.filter(isFinite)).toString()

export const min = (array) =>
  BN.min.apply(null, array.filter(isFinite)).toString()

export const max = (array) =>
  BN.max.apply(null, array.filter(isFinite)).toString()

export const ceil = (n) =>
  new BN(n).integerValue(BN.ROUND_CEIL).toString()

export const floor = (n) =>
  new BN(n).integerValue(BN.ROUND_FLOOR).toString()

export const halfUp = (n) =>
  new BN(n).integerValue(BN.ROUND_HALF_UP).toString()

export const abs = (n) => new BN(n).abs().toString()

/* format */
export const number = (n) => new BN(n).toNumber()

/* boolean */
export const gt = (a, b) => new BN(a).gt(b)
export const lt = (a, b) => new BN(a).lt(b)
export const gte = (a, b) => new BN(a).gte(b)
export const lte = (a, b) => new BN(a).lte(b)

export const isFinite = (n) =>
  !isNil(n) && new BN(n).isFinite()

export const isInteger = (n) =>
  !isNil(n) && new BN(n).isInteger()

export const decimal = (value = "0", dp = 6) =>
  new BN(value).decimalPlaces(dp, rm).toString()

export const percent = (value, dp = 2) =>
  isFinite(value) ? decimal(times(value, 100), dp) + " %" : "0 %"
