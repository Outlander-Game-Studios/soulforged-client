<template>
  <div class="research-card">
    <div
      :class="{
        interactive: !research.completed,
      }"
      @click="mouseClick"
    >
      <Container
        borderType="alt3"
        :backgroundType="research.completed ? 'alt2' : 'alt3'"
        :borderSize="1"
      >
        <div>
          <div>
            <div class="fav-research-badge" v-if="research.fav"></div>
            <transition name="fade">
              <div class="new-research-badge" v-if="!research.seen">
                <Header>
                  <div class="text">New</div>
                </Header>
              </div>
            </transition>
            <Header><RichText :value="research.title" /></Header>
          </div>
          <Vertical v-if="research.completed" class="diagram-wrapper">
            <Header alt2>Rewards</Header>
            <transition-group name="reward-transition" tag="div">
              <CraftListItem
                v-for="(craft, idx) in rewardCrafts"
                :key="'Craft_' + craft.craftId"
                :craft="craft"
                class="reward"
                @action="$emit('action')"
              />
              <PlanListItem
                v-for="(plan, idx) in rewardPlans"
                :key="'Plan_' + plan.planId"
                :plan="plan"
                class="reward"
                @action="$emit('action')"
              />
            </transition-group>
          </Vertical>
          <Horizontal v-else tight>
            <HorizontalWrap tight>
              <ItemIcon
                v-for="(item, idx) in items"
                :key="idx"
                :icon="(item && item.icon) || unknownImg"
                :amount="research.difficulty"
                :class="{ unknown: !item || !item.icon }"
                :quality="item ? 'good' : 'dark'"
              />
            </HorizontalWrap>
            <div class="flex-grow"></div>
            <div class="bin-icon">
              <ItemIcon class="view-missed" :icon="crossImg" :amount="failedCount" quality="dark" />
            </div>
          </Horizontal>
        </div>
      </Container>
    </div>
  </div>
</template>

<script>
import unknownImg from '../../assets/ui/cartoon/icons/unknown_nobg.png'
import crossImg from '../../assets/ui/cartoon/icons/cross_nobg.png'
import buttonClickSound from '../../assets/sounds/button-click.mp3'

export default rxComponent({
  props: {
    research: {},
    animateRewards: {
      type: Boolean,
    },
  },

  data: () => ({
    unknownImg,
    crossImg,
  }),

  subscriptions() {
    const researchStream = this.animateRewards
      ? this.$stream('research').delay(200)
      : this.$stream('research')

    return {
      rewardCrafts: researchStream
        .pluck('rewardCraftIds')
        .distinctUntilChanged(null, JSON.stringify)
        .switchMap((rewardCraftIds) =>
          GameService.getCraftsStream().map((crafts) =>
            crafts.filter((c) => (rewardCraftIds || []).includes(c.craftId)),
          ),
        ),
      rewardPlans: researchStream
        .pluck('rewardPlanIds')
        .distinctUntilChanged(null, JSON.stringify)
        .switchMap((rewardPlanIds) =>
          GameService.getPlansStream().map((plans) =>
            plans.filter((p) => (rewardPlanIds || []).includes(p.planId)),
          ),
        ),
      craftsById: GameService.getCraftsStream().map((crafts) => crafts.toObject((c) => c.craftId)),
      plansById: GameService.getPlansStream().map((plans) => plans.toObject((p) => p.planId)),
    }
  },

  computed: {
    failedCount() {
      return Object.keys(this.research?.failedItems || {}).length
    },

    items() {
      return [
        ...this.research.passedItems,
        ...Array.create(this.research?.itemsNeededCount - this.research?.passedItems.length),
      ]
    },
  },

  methods: {
    mouseClick(event) {
      event.stopPropagation()
      if (!this.research.completed) {
        this.$emit('click')
        SoundService.playSound(buttonClickSound)
      }
    },
  },
})
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.research-card {
  position: relative;
  transition: all 0.1s ease-out;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: 0 0 0 black;
  padding: 0.3rem;

  &.selected {
    $shift: 0.3rem;
    top: -$shift;
    left: -$shift;
    box-shadow: 0.3rem 0.3rem 0.3rem black;
  }

  .bin-icon {
    z-index: 2;
  }

  .bin-icon-placeholder {
    visibility: hidden;
  }
}

.research-description {
  font-size: 90%;
  padding: 0.5rem;
  font-style: italic;
  color: #402009;
}

.reward {
  max-height: 6rem;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.fav-research-badge {
  z-index: 12;
  position: absolute;
  width: 3rem;
  height: 3rem;
  right: 1.5rem;
  top: 1.4rem;
  background-image: utils.ui-asset('/icons/star.png');
  background-size: 100%;
}

.new-research-badge {
  position: absolute;
  z-index: 12;
  right: 0;
  transform: rotate(25deg);
  @include utils.filter(saturate(1.8));

  .text {
    text-transform: uppercase;
    font-size: 60%;
    padding: 0 3rem 0 1rem;
    text-align: left;

    &::after {
      content: '';
      position: absolute;
      width: 3.8rem;
      height: 3.8rem;
      background-image: utils.ui-asset('/icons/quest_t.png');
      background-size: 130%;
      background-position: center;
      top: -0.5rem;
      right: -0.5rem;
    }
  }
}
</style>
