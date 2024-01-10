import padEnd from "lodash/padEnd.js";

Math.logBase = (base, n) => Math.log(n) / Math.log(base);
Math.limit = (value, min, max) => Math.min(max, Math.max(min, value));
Math.floorFraction = (value, decimals) => {
  const sign = Math.sign(value);
  const abs = Math.abs(value);
  const int = Math.floor(abs);
  const str = `${abs}`.replace(
    new RegExp(`[0-9]*\.([0-9]{0,${decimals}})[0-9]*`),
    "$1"
  );
  return sign * +`${int}${padEnd(str, decimals, "0")}`;
};
