<template>
  <div class="view-button" @click="$emit('click')" />
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.view-button {
  min-width: 1em;
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: bottom;
  background-image: utils.ui-asset('/icons/view.png');
  background-size: 100% 100%;
  cursor: pointer;

  &:hover {
    @include utils.filter(brightness(1.2));
  }
}
</style>
