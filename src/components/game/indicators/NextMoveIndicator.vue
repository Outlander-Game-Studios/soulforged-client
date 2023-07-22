<template>
  <transition name="fade">
    <div v-if="moveData" :key="moveData.icon">
      <Icon :src="moveData.icon" :size="4" round />
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    moveData: {},
  },
};
</script>

<style scoped lang="scss"></style>
