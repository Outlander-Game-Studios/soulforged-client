import rand from "random-seed";

const BASE_SEED = 22334455;
const SEED_MODULO = 1.2676506002282294e15;

function nextSeed(seed) {
  return random.number(0, Number.MAX_SAFE_INTEGER, seed);
}

const random = {
  SEED_MODULO,

  baseRandom(seed) {
    return rand(seed);
  },

  roundValue(value) {
    const integer = Math.floor(value);
    const chance = value - integer;
    const surplus = random.chance(chance * 100, 5) ? 1 : 0;
    return integer + surplus;
  },

  chance(percentage, times = 1, precision = 1, seed = null) {
    const multiplier = Math.pow(10, precision);
    const chance = 100 - Math.pow((100 - percentage) / 100, times) * 100;
    return random.number(1, 100 * multiplier, seed) <= chance * multiplier;
  },

  number(from, to, seed) {
    if (to === undefined || from === to) {
      return from;
    }
    if (seed) {
      if (typeof seed === "string") {
        seed = random.getWordBasedSeed(seed);
      }
      return random.baseRandom(seed + BASE_SEED).intBetween(from, to);
    }
    return random.baseRandom().intBetween(from, to);
  },

  numberGaussian(from, to, seed, degree = 4) {
    let sum = 0;
    for (let i = 0; i < degree; i++) {
      sum += random.number(from, to, seed);
      seed = nextSeed(seed);
    }
    return Math.round(sum / degree);
  },

  randomizeArray(arr, seed) {
    const result = [];
    const source = [...arr];

    while (source.length) {
      const idx = random.number(0, source.length - 1, seed);
      if (seed) {
        seed = nextSeed(seed);
      }
      const el = source.splice(idx, 1);
      result.push(el.pop());
    }

    return result;
  },

  scrambleArray(orgArr, seed) {
    const arr = [...orgArr];
    const result = [];
    while (arr.length) {
      let index = 0;
      while (index < arr.length - 1 && random.chance(35, 1, 1, seed)) {
        seed = nextSeed(seed);
        index += 1;
      }
      seed = nextSeed(seed);
      const element = arr[index];
      result.push(element);
      arr.splice(index, 1);
    }
    return result;
  },

  randomItem(arr, seed) {
    let idx;
    if (seed) {
      if (typeof seed === "string") {
        seed = random.getWordBasedSeed(seed);
      }
      idx = rand(seed + BASE_SEED).intBetween(0, arr.length - 1);
    } else {
      idx = random.number(0, arr.length - 1);
    }
    return arr[idx];
  },

  getWordBasedSeed(word) {
    return word
      .toLowerCase()
      .split("")
      .reduce((acc, l) => (acc + acc + l.charCodeAt(0)) % SEED_MODULO, 0);
  },

  randomMaterial(materials) {
    const totalMatsCount = Object.values(materials).reduce(sum, 0);
    let roll = random.number(1, totalMatsCount);
    const rolledItem = Object.keys(materials).find((item) => {
      roll -= materials[item];
      return roll <= 0;
    });
    return rolledItem;
  },
};

export { random };
