<template>
  <div>
    <DisplayImpacts :impacts="impactsToDisplay" inline wrap />
  </div>
</template>

<script>
import flatten from "lodash/flatten.js";

export default {
  props: {
    creature: {},
    impacts: {},
  },

  computed: {
    impactsToDisplay() {
      const impactFilter = this.impacts?.toObject((name) => name);
      return flatten(this.creature.effects.map((e) => e.impacts))
        .filter((i) => !impactFilter || impactFilter[i.name])
        .reduce((acc, i) => {
          if (acc[i.name]) {
            const isMult = i.value[0] === "x";
            if (isMult) {
              const newValue = i.value.substr(1) * acc[i.name].value.substr(1);
              acc[i.name].value = `x${Math.round(100 * newValue) / 100}`;
              acc[i.name].good =
                newValue > 1 === i.value > 1 ? i.good : !i.good;
            } else {
              const newValue = +i.value + +acc[i.name].value;
              acc[i.name].value = `${newValue >= 0 ? "+" : ""}${newValue}`;
              acc[i.name].good =
                newValue > 0 === i.value > 0 ? i.good : !i.good;
            }
          } else {
            acc[i.name] = { ...i };
          }
          return acc;
        }, {});
    },
  },
};
</script>

<style scoped lang="scss"></style>
