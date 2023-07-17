<template>
  <div class="milestone-tracker-component">
    <div class="tracker-wrapper clickable" v-if="display">
      <Transition name="objective">
        <MilestoneObjective
          v-if="currentObjective"
          :key="currentObjective.text"
          :text="currentObjective.text"
          iconRight
          :completed="
            nextObjective &&
            currentObjective &&
            nextObjective.key === currentObjective.key &&
            nextObjective.text !== currentObjective.text
          "
          @click="showMilestoneDetails()"
        />
      </Transition>
    </div>
    <Modal v-if="showDetails" dialog large @close="showDetails = false">
      <template v-slot:title>
        Milestone<span v-if="milestoneInfo"
          >: {{ milestoneInfo.milestoneName }}</span
        >
      </template>
      <template v-slot:contents>
        <Vertical>
          <div>
            <LoadingPlaceholder v-if="!milestoneInfo" :size="5" />
            <MilestoneInfo v-else :milestoneInfo="milestoneInfo" />
          </div>
          <HorizontalCenter>
            <Button @click="showMilestones()">View all milestones</Button>
          </HorizontalCenter>
        </Vertical>
      </template>
    </Modal>
  </div>
</template>

<script>
import fanfareSound from "../../assets/sounds/fanfare.mp3";
import pageSound from "../../assets/sounds/page.mp3";

window.MILESTONES_IDX = 1;

export default {
  data: () => ({
    showDetails: false,
    nextObjective: null,
  }),

  computed: {
    display() {
      return (
        this.currentObjective &&
        this.currentObjective.text &&
        !this.fullscreenOperation
      );
    },
  },

  subscriptions() {
    return {
      currentObjective: GameService.getCurrentObjectiveStream()
        .tap((newObjective) => {
          this.nextObjective = newObjective;
          if (
            this.display &&
            this.currentObjective &&
            this.nextObjective &&
            this.nextObjective.key === this.currentObjective.key &&
            this.nextObjective.text !== this.currentObjective.text
          ) {
            SoundService.playSound(fanfareSound, {
              unique: "objectiveTracker",
              throttle: 1000,
            });
          }
          if (!newObjective) {
            this.showDetails = false;
          }
        })
        .delay(500),
      fullscreenOperation: ControlsService.getFullscreenOperationStream(),
      milestoneInfo: this.$stream("showDetails").switchMap((showDetails) =>
        showDetails
          ? GameService.getInfoStream(
              "Collectible",
              { categoryIdx: MILESTONES_IDX },
              true
            ).map((data) =>
              data
                .filter((d) => d?.collectibleDetails)
                .map((d) =>
                  d.collectibleDetails
                    ? JSON.parse(d.collectibleDetails).milestoneInfo
                    : {}
                )
                .find((d) => d.tracked)
            )
          : Rx.Observable.empty()
      ),
    };
  },

  methods: {
    showMilestoneDetails() {
      SoundService.playSound(pageSound);
      this.showDetails = true;
    },
    showMilestones() {
      this.showDetails = false;
      ControlsService.triggerControlEvent("openMilestones", {
        categoryIdx: MILESTONES_IDX,
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.tracker-wrapper {
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  position: fixed;
  z-index: 2;
  //@include filter(drop-shadow(0.3rem 0.3rem 0.3rem black));

  @media (orientation: landscape) {
    right: 6rem;
    bottom: 0.5rem;
  }

  @media (orientation: portrait) {
    right: 0.5rem;
    bottom: 6rem;
  }

  &:hover {
    cursor: pointer;
    @include filter(brightness(1.2));
    //@include filter(drop-shadow(0.3rem 0.3rem 0.3rem black) brightness(1.2));
  }
}

.objective-enter-active,
.objective-leave-active {
  transition: all 1s ease-in;
  max-height: 5rem;
  overflow: hidden;
}
.objective-enter {
  max-height: 0;
}
.objective-leave-to {
  opacity: 0;
}
</style>
