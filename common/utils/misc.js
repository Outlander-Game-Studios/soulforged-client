import crypto from "crypto";

const hash = (method) => (string) =>
  crypto.createHash(method).update(string).digest("hex");

const md5 = hash("md5");

const sum = (acc, i) => acc + i;

function parseCookies(cookiesString) {
  if (typeof cookiesString === "object") {
    return cookiesString;
  }
  return (cookiesString || "")
    .split(";")
    .map((item) => item.trim().split("="))
    .reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {});
}

function formatFloatPoint(number, base = 1000, ranges = []) {
  let stage = 0;
  let float = +number;
  while (float > (950 * base) / 1000 && stage < ranges.length - 1) {
    float = float / base;
    stage += 1;
  }
  if (float < 100 && stage > 0) {
    float = Math.floor(float * 10) / 10;
  } else {
    if (float < 100 && float - Math.floor(float) !== 0) {
      float = Math.floor(float * 10) / 10;
    } else {
      float = Math.floor(float);
    }
  }
  return float + ranges[stage];
}

function formatSize(number) {
  return formatFloatPoint(number, 1024, ["B", "kB", "MB", "GB", "TB"]);
}

function formatNumber(number) {
  return formatFloatPoint(number, 1000, ["", "k", "m", "b", "t"]);
}

function ordinal(number) {
  const lastDigit = `${number}`.substring(-1);
  let ending;
  switch (lastDigit) {
    case "1":
      ending = "st";
      break;
    case "2":
      ending = "nd";
      break;
    case "3":
      ending = "rd";
      break;
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "0":
      ending = "th";
      break;
    default:
      ending = "";
  }
  return `${number}${ending}`;
}

function dynamicPluralize(word, count) {
  if (count === 1) {
    return word;
  }
  return pluralize(word);
}
function pluralize(word) {
  const endsWith = (ending) =>
    word.slice(word.length - ending.length) === ending;
  switch (true) {
    case word.length > 4 && endsWith("us"):
      return `${word.slice(0, word.length - 2)}i`;
    case word.length > 4 && endsWith("on"):
      return `${word.slice(0, word.length - 2)}a`;
    case word.length > 4 && endsWith("ix"):
    case word.length > 4 && endsWith("ex"):
      return `${word.slice(0, word.length - 2)}ices`;
    case endsWith("sis"):
      return `${word.slice(0, word.length - 3)}ses`;
    case endsWith("s"):
    case endsWith("ch"):
    case endsWith("x"):
      return `${word}es`;
    case endsWith("y"):
      return `${word.slice(0, word.length - 1)}ies`;
    default:
      return `${word}s`;
  }
}

function preposition(word) {
  const startsWith = (starting) => word.slice(0, starting.length) === starting;
  const startsWithCapital = word[0].toLowerCase() !== word[0];
  word = word.toLowerCase();
  switch (true) {
    case startsWith("a"):
    case startsWith("e"):
    case startsWith("i"):
    case startsWith("o"):
    case startsWith("u"):
    case startsWith("y"):
      return `${startsWithCapital ? "A" : "a"}n ${word}`;
    default:
      return `${startsWithCapital ? "A" : "a"} ${word}`;
  }
}

global.symbols = {};
function defineSymbol(identifier) {
  if (global.symbols[identifier]) {
    throw new Error(`Duplicate symbol identifier ${identifier}`);
  }
  global.symbols[identifier] = Symbol(identifier);
  return global.symbols[identifier];
}

export {
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
};
