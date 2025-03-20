<template>
  <div class="edit-button" @click="$emit('click')" />
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.edit-button {
  min-width: 1em;
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: bottom;
  background-image: url(ui-asset('/icons/edit.png'));
  background-size: 100% 100%;
  cursor: pointer;

  &:hover {
    @include utils.filter(brightness(1.2));
  }
}
</style>
