import "./static.js";
import "./array-extend.js";
import "./math-extend.js";
import "./uc-first.js";
import { numberToText } from "./number-to-text.js";
import { random } from "./random.js";
import {
  md5,
  sum,
  parseCookies,
  formatSize,
  formatNumber,
  ordinal,
  dynamicPluralize,
  pluralize,
  preposition,
  defineSymbol,
} from "./misc.js";
import { stacktrace } from "./debug.js";

global.numberToText = numberToText;
global.random = random;
global.md5 = md5;
global.sum = sum;
global.parseCookies = parseCookies;
global.formatSize = formatSize;
global.formatNumber = formatNumber;
global.ordinal = ordinal;
global.dynamicPluralize = dynamicPluralize;
global.pluralize = pluralize;
global.preposition = preposition;
global.defineSymbol = defineSymbol;
