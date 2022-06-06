<template>
  <LabeledValue
    class="sub-labeled-value"
    :label="label"
    :inline="inline"
    :flex="flex"
    :wrap="wrap"
    :invalid="invalid"
  >
    <slot />
    <slot name="value" />
  </LabeledValue>
</template>

<script>
export default {
  props: {
    label: {},
    inline: { type: Boolean, default: false },
    flex: { type: Boolean, default: false },
    wrap: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.sub-labeled-value {
  padding-left: 2rem;
  font-size: 80%;
}
</style>
