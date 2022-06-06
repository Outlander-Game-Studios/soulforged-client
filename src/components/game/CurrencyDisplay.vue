<template>
  <div class="currency-value" :class="{ inline: inline, flipped: flipped }">
    <div class="label" v-if="label">{{ label }}</div>
    <div class="flex-grow"></div>
    <div :class="{ negative: value < 0 }" class="value">
      {{ short ? formatNumber(value) : largeNumber(value) }}
    </div>
    <img :src="essenceIcon" />
  </div>
</template>

<script>
import essenceIcon from "../../assets/ui/cartoon/icons/essence.v2.png";
import "../../../common/utils/index.js";

export default {
  props: {
    label: {},
    value: {},
    inline: {
      type: Boolean,
    },
    short: {
      type: Boolean,
    },
    flipped: {
      type: Boolean,
    },
  },

  data: () => ({
    essenceIcon,
  }),

  methods: {
    formatNumber: global.formatNumber,
    largeNumber: (number) =>
      `${number}`
        .split("")
        .reverse()
        .map((d, idx) => (idx % 3 === 2 ? " " + d : d))
        .reverse()
        .join(""),
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.currency-value {
  flex-grow: 1;
  display: flex;
  text-align: right;

  &.inline {
    display: inline-block;
    > * {
      display: inline-block;
      vertical-align: bottom;
    }
  }

  .label {
    text-align: left;
    padding: 0 0.5rem 0 0;
  }

  .value {
    @include text-outline(black, #cedfff);
    white-space: nowrap;
  }

  .negative {
    @include text-bad();
  }

  img {
    margin-left: 0.3rem;
    height: 1.1em;
  }

  &.flipped {
    img {
      margin-left: 0;
      margin-right: 0.3rem;
    }
    .label {
      padding: 0 0 0 0.5rem;
    }
    flex-direction: row-reverse;
  }
}
</style>
