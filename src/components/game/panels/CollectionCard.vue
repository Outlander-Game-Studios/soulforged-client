<template>
  <div
    class="collection-card"
    :class="{
      unknown: !cardInfo || !cardInfo.name,
      faded: cardInfo.faded,
      interactive: cardInfo && cardInfo.collectibleDetails,
    }"
    @click="showDetails = cardInfo && cardInfo.collectibleDetails ? cardInfo : null"
  >
    <div v-if="cardInfo && cardInfo.name">
      <div class="icon" :style="{ backgroundImage: 'url(' + cardInfo.icon + ')' }" />
      <div class="name">
        <RichText :value="cardInfo.name" :nonInteractive="!!cardInfo.collectibleDetails" />
      </div>
      <div class="value" :class="{ stars: cardInfo.style === '3star' }">
        <StarRating
          v-if="cardInfo.style === '3star'"
          :value="cardInfo.value"
          :max="3"
          :animated="false"
        />
        <div v-else-if="cardInfo.value !== undefined" class="text-value">
          {{ cardInfo.value }}
        </div>
      </div>
    </div>
    <Modal v-if="showDetails" dialog @close="showDetails = null">
      <template v-slot:title> <RichText :value="showDetails.name" /> </template>
      <template v-slot:contents>
        <div v-if="showDetails.component">
          <component :is="showDetails.component" v-bind="showDetails.collectibleDetails" />
        </div>
        <div v-else>
          {{ showDetails.collectibleDetails }}
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    cardInfo: {},
  },

  data: () => ({
    showDetails: null,
  }),
}
</script>

<style scoped lang="scss">
@use '../../../utils.scss';

.collection-card {
  font-size: calc(0.02 * var(--app-min-size));
  width: 9.5em;
  height: 13.3em;

  background-image: url(ui-asset('/card/face.png', '../'));
  background-size: 100% 100%;

  position: relative;

  &.faded {
    opacity: 0.6;
  }
  &.unknown {
    background-image: url(ui-asset('/card/back.png', '../'));
    opacity: 0.2;
  }

  .name {
    font-size: 1em;
    position: absolute;
    top: 8em;
    text-align: center;
    width: 8em;
    max-width: 8em;
    margin-left: 0.75em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .value {
    position: absolute;
    top: 10.5em;
    width: 6em;
    margin-left: -3em;
    left: 50%;
    text-align: center;

    &.stars {
      width: 4em;
      margin-left: -2em;
    }

    * {
      font-size: 1.2em;
    }

    .text-value {
      @include utils.text-outline();
    }
  }

  .icon {
    background-size: 100% 100%;
    position: absolute;
    width: 7em;
    height: 7em;
    left: 1.5em;
    top: 1em;
    box-shadow: 0 0 0.5em inset #d6a46d;
    border-radius: 1em;
  }

  .view-button-wrapper {
    font-size: 210%;
  }
}
</style>
