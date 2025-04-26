<template>
  <ProgressBar :size="1.8" color="yellow" :current="mobInfo.maxLevel ? 100 : mobInfo.expProgress">
    <div class="exp-needed">
      {{ mobInfo.maxLevel ? 'max level' : 'Progress: ' + mobInfo.expProgress + '%' }}
    </div>
  </ProgressBar>
</template>

<script>
export default {
  props: {
    mobInfo: {},
  },
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.exp-needed {
  text-align: center;
  font-size: 55%;
  @include utils.text-outline();
}
</style>
