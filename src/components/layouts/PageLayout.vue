<template>
  <div class="page-layout">
    <div class="status" v-if="!fullscreenOperation">
      <slot name="status" />
    </div>
    <div class="main">
      <div class="bg-image" :style="backdropImage" />
      <DungeonScene :location="location" />
      <EnvironmentOverlay />
      <slot name="main" />
    </div>
    <div class="controls" v-if="!fullscreenOperation">
      <slot name="controls" />
    </div>
    <div class="actions-container" v-if="!fullscreenOperation">
      <slot name="actions" />
    </div>
    <div class="help-container" v-if="!fullscreenOperation">
      <slot name="help" />
    </div>
  </div>
</template>

<script>
export default rxComponent({
  subscriptions() {
    return {
      location: GameService.getLocationStream(),
      backdropImage: GameService.getBackdropStyleStream(),
      fullscreenOperation: ControlsService.getFullscreenOperationStream(),
    }
  },
})
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.page-layout {
  display: flex;
  overflow: hidden;
  height: 100%;

  //.actions-container,
  //.status,
  //.controls {
  //  @include utils.filter(drop-shadow(0.3rem 0.3rem 0.3rem black));
  //}

  .status {
    position: fixed;
    z-index: 4;
  }

  .controls {
    pointer-events: none;
    position: fixed;
    right: 0;
    flex-grow: 1;
    z-index: 6;

    @media (orientation: portrait) {
      right: initial;
      bottom: 0;
      left: 0;
    }
  }

  .actions-container {
    position: fixed;
    z-index: 1;

    @media (orientation: landscape) {
      bottom: 0;
      left: 0;
    }

    @media (orientation: portrait) {
      right: 0;
      top: 0;
      text-align: right;
    }
  }

  .main {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
    height: 100%;
    background-color: #b19d84;
    background-size: cover;
    background-position: center center;

    .bg-image {
      position: absolute;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center center;
      filter: blur(0.05rem) saturate(0.95) brightness(1.1) contrast(0.9);
    }
  }

  .help-container {
    position: fixed;
    bottom: 0.3rem;
    right: 0.3rem;
    z-index: 6;

    @media (orientation: portrait) {
      display: flex;
      flex-direction: row;

      > * {
        display: flex;
      }
    }
  }
}
</style>
