<template>
  <div v-if="impacts">
    <div v-for="(impact, idx) in impacts" :key="idx">
      <LabeledValue :inline="inline" :wrap="wrap">
        <template v-slot:label>
          <RichText :value="impact.name || impact" />
        </template>
        <template v-slot:default>
          <span
            class="impact-value"
            :class="{ good: impact.good === true, bad: impact.good === false }"
          >
            {{ impact.value }}
          </span>
        </template>
      </LabeledValue>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    impacts: {},
    inline: { type: Boolean },
    wrap: { type: Boolean },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.impact-value {
  letter-spacing: 0.02em;
  @include text-outline();
}
.good {
  @include text-good();
}
.bad {
  @include text-bad();
}
</style>
