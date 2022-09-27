<template>
  <span>
    <Help title="Density">
      <div class="density-help">
        The density of the resource indicates <em>amount</em> of the resource is
        available and the <em>speed of gathering</em> that resource.<br />
        <LabeledValue label="Current density">
          {{ ucFirst(resource.densityName) }}
          <IndicatorResourceDensity :density="resource.density" />
        </LabeledValue>
        <LabeledValue label="Gathering speed multiplier">
          {{ 100 * resource.densitySpeed }}%
        </LabeledValue>
      </div>
    </Help>
  </span>
</template>

<script>
export default {
  props: {
    resource: {},
  },

  methods: {
    ucFirst,
  },
};
</script>

<style scoped lang="scss">
@import "../../../utils.scss";
</style>
