<template>
  <div v-if="impacts">
    <div v-for="(impact, idx) in impacts" :key="idx">
      <LabeledValue :inline="inline" :wrap="wrap">
        <template v-slot:label>
          <RichText :value="impact.name || impact" html />
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
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.impact-value {
  letter-spacing: 0.02em;
  @include utils.text-outline();
}
.good {
  @include utils.text-good();
}
.bad {
  @include utils.text-bad();
}
</style>
