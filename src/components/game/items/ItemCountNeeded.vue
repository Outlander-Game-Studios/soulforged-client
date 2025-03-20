<template>
  <div>
    <div class="amount" :class="{ insufficient: !noFlash && insufficientAmount }">
      {{ displayAmount }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    needed: {},
    publicId: {},
    noFlash: {
      type: Boolean,
      default: false,
    },
  },

  subscriptions() {
    return {
      itemCountsByPublicId: GameService.getItemCountsByPublicIdStream(),
    }
  },

  computed: {
    insufficientAmount() {
      return (
        this.itemCountsByPublicId && (this.itemCountsByPublicId[this.publicId] || 0) < this.needed
      )
    },

    displayAmount() {
      return this.itemCountsByPublicId
        ? this.needed + ' (' + formatNumber(this.itemCountsByPublicId[this.publicId] || 0) + ')'
        : this.needed
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../../utils.scss';

@keyframes saturationBlink {
  0% {
    filter: brightness(1) saturate(1);
  }

  50% {
    filter: brightness(1.7) saturate(1.5);
  }

  100% {
    filter: brightness(1) saturate(1);
  }
}

.amount {
  font-size: 75%;
  text-align: right;
  float: right;
  width: 100%;

  &.insufficient {
    color: darkorange;
    animation: saturationBlink 1s infinite;
    @include utils.filter-fix();
  }
}
</style>
