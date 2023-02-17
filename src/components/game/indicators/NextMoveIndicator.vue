<template>
  <div v-if="moveData">
    <Icon :src="moveData.icon" :size="4" round />
  </div>
</template>

<script>
export default {
  props: {
    moveData: {},
  },
};
</script>

<style scoped lang="scss">
.test {
}
</style>
