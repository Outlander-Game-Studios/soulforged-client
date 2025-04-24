<template>
  <span class="indicator-is-lootable" />
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
@use '../../../utils.scss';

.indicator-is-lootable {
  display: inline-block;
  vertical-align: text-bottom;
  // Source: https://game-icons.net/1x1/lorc/swap-bag.html (Free open-source iconography)
  background-image: utils.ui-asset('/icons/indicators/is-lootable.png', '../');
  width: 1em;
  height: 1em;
  background-size: 100% 100%;
}
</style>
