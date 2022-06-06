Array.prototype.toObject = function (keyGetter, valueGetter = (i) => i) {
  const object = {};
  this.forEach((i, idx) => {
    object[keyGetter(i, idx)] = valueGetter(i, idx);
  });
  return object;
};

Array.prototype.remove = function (itemOrCallback) {
  const index =
    typeof itemOrCallback === "function"
      ? this.findIndex(itemOrCallback)
      : this.indexOf(itemOrCallback);
  if (index === -1) {
    throw new Error("Unable to remove item from an array, item not present");
  }
  this.splice(index, 1);
};

Array.prototype.first = function () {
  return this[0];
};

Array.prototype.last = function () {
  return this[this.length - 1];
};

Array.prototype.asyncFilter = async function (predicate) {
  const results = await Promise.all(this.map(predicate));
  return this.filter((_, index) => results[index]);
};

Array.prototype.asyncMap = async function (predicate) {
  const results = await Promise.all(this.map(predicate));
  return this.map((_, index) => results[index]);
};

Array.create = (size) => Array.apply(null, Array(size));
