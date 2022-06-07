<template>
  <transition name="fade-slide">
    <div v-if="mainEntity && mainEntity.dead" class="dead-container">
      <Container :borderSize="1" borderType="alt" backgroundType="alt2">
        <div class="dead-indicator flex">
          <Icon
            round
            :size="6"
            :src="deadIcon"
            backgroundType="alt"
            class="dead-icon"
          />
          <Description>
            <div class="dead-text">
              You died<br />
              {{ mainEntity.deathReason }}
            </div>
          </Description>
        </div>
        <HorizontalCenter class="button-wrapper">
          <Button @click="onClick()">Create new character</Button>
        </HorizontalCenter>
      </Container>
    </div>
  </transition>
</template>

<script>
import deadIcon from "../../assets/ui/cartoon/icons/dead.jpg";

export default {
  data: () => ({
    deadIcon,
  }),

  subscriptions() {
    return {
      mainEntity: GameService.getRootEntityStream(),
    };
  },

  methods: {
    onClick() {
      GameService.request(REQUEST_CODES.CONFIRM_DEATH).then(() => {
        location.reload(true);
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.dead-container {
  @include filter-fix();
  display: flex;
  width: 100%;
  top: 15rem;
  left: 1rem;
  position: fixed;
  z-index: 90009000;
  pointer-events: none;
  > * {
    pointer-events: all;
  }

  &.fade-slide-enter-active {
    transition-duration: 0.8s;
  }
  &.fade-slide-leave-active {
    transition-duration: 0.2s;
  }
}

.dead-indicator {
  .dead-icon {
    padding: 0.5rem;
  }
}

.dead-text {
  text-align: center;
  font-weight: bold;
  padding: 1rem;
  font-size: 110%;
  line-height: 2.4rem;
}

.button-wrapper {
  margin-bottom: 0.5rem;
}
</style>
