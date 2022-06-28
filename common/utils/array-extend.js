import uniq from "lodash/uniq.js";

Array.prototype.toObject = function (
  keyGetter = (i) => i,
  valueGetter = (i) => i
) {
  const object = {};
  this.forEach((i, idx) => {
    object[keyGetter(i, idx)] = valueGetter(i, idx);
  });
  return object;
};

Array.prototype.remove = function (itemOrCallback, check = true) {
  const index =
    typeof itemOrCallback === "function"
      ? this.findIndex(itemOrCallback)
      : this.indexOf(itemOrCallback);
  if (index === -1) {
    if (check) {
      throw new Error("Unable to remove item from an array, item not present");
    }
  } else {
    this.splice(index, 1);
  }
};

Array.prototype.first = function () {
  return this[0];
};

Array.prototype.last = function () {
  return this[this.length - 1];
};

Array.prototype.uniq = function () {
  return uniq(this);
};

Array.prototype.asyncForEach = async function (predicate) {
  await Promise.all(this.map(predicate));
};

Array.prototype.asyncMap = async function (predicate) {
  const results = await Promise.all(this.map(predicate));
  return this.map((_, index) => results[index]);
};

Array.prototype.asyncFilter = async function (predicate) {
  const results = await Promise.all(this.map(predicate));
  return this.filter((_, index) => results[index]);
};

Array.prototype.someAsync = async function (predicate) {
  const results = await Promise.all(this.map(predicate));
  return this.some((_, index) => results[index]);
};

Array.create = (size) => Array.apply(null, Array(size));
