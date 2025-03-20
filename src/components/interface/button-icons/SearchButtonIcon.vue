<template>
  <div class="search-icon"></div>
</template>

<style scoped lang="scss">
@use '../../../utils.scss';

.search-icon {
  width: 1.9rem;
  height: 1.9rem;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url(ui-asset('/simple-icons/search.png', '../'));

  &.on {
    background-image: url(ui-asset('/simple-icons/search-cancel.png', '../'));
  }
}
</style>
