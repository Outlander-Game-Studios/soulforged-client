<template>
  <span class="indicator-presence" />
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
@use '../../../utils.scss';

.indicator-presence {
  display: inline-block;
  vertical-align: text-bottom;
  background-image: url(ui-asset('/icons/indicators/presence.png', '../'));
  width: 1em;
  height: 1em;
  background-size: 100% 100%;
}
</style>
