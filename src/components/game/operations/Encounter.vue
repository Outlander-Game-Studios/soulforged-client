<template>
  <div class="encounter-operation">
    <Collapsible>
      <template v-slot:header>
        Hostile encounter
        <Help @click.stop title="Hostile encounter">
          You are in an Encounter. You will have to either <em>Engage</em> or <em>Back Away</em> to
          resolve it.<br />
          During this time other players can join you to fight the enemies. Once you Engage and the
          combat starts no other player can join.<br />
          You can also try and use items you have in your inventory to toss them to the enemy
          possibly triggering some behaviours. The items used will be consumed in the process.
        </Help>
      </template>
      <template v-slot:content>
        <div v-if="!operation.context.canBackAway" class="empty-text">
          A hostile creature approached you
        </div>
        <Vertical>
          <div>
            <Container
              class="participants"
              borderType="alt3"
              backgroundType="alt3"
              :borderSize="1.2"
              spaced
            >
              <div class="vs-wrapper">
                <Container>
                  <div class="vs-label">VS</div>
                </Container>
              </div>
              <div class="friendly">
                <div>
                  <Container>
                    <header>Friendly</header>
                  </Container>
                </div>
                <div class="creatures-icons">
                  <LoadingPlaceholder v-if="!friendlies" :size="6" />
                  <CreatureIcon
                    v-for="(friendly, idx) in friendlies"
                    :key="friendly.id"
                    :creature="friendly"
                    class="interactive friendly-creature"
                    :class="{ ready: friendly.operationInfo && friendly.operationInfo.isReady }"
                    @click="selectedCreatureId = friendly.id"
                  />
                </div>
              </div>
              <div class="hostile">
                <div>
                  <Container>
                    <header>Hostile</header>
                  </Container>
                </div>
                <div class="creatures-icons">
                  <LoadingPlaceholder v-if="!hostiles" :size="6" />
                  <CreatureIcon
                    v-for="(hostile, idx) in hostiles"
                    :key="hostile.id"
                    :creature="hostile"
                    class="interactive"
                    @click="selectedCreatureId = hostile.id"
                  />
                </div>
              </div>
            </Container>
          </div>
          <div v-if="inCombatCheck && !operation.context.canAttack" class="in-combat-message">
            Some creatures are engaged in combat, you must wait for it to be resolved before you're
            able to engage
          </div>
          <HorizontalCenter v-else-if="operation.context.showReady">
            <Checkbox :value="operation.context.isReady" @input="setReadiness($event)">
              Ready
            </Checkbox>
          </HorizontalCenter>
          <HorizontalFill
            v-if="(!hostiles || hostiles.length) && operation.context.hasAliveHostiles"
          >
            <Vertical>
              <Button :disabled="!operation.context.canAttack" @click="commence()"> Engage </Button>
              <Button :disabled="!operation.context.canBackAway" @click="action('backAway')">
                Back away
              </Button>
            </Vertical>
            <div class="quick-info">
              <LabeledValue flex label="Weapon">
                <Item v-if="weapon" :data="weapon" :size="2.5" />
                <div v-else>None</div>
              </LabeledValue>
              <LabeledValue flex label="Utilities">
                <Horizontal v-if="utilities && utilities.length" tight>
                  <Item v-for="(util, idx) in utilities" :key="idx" :data="util" :size="2.5" />
                </Horizontal>
                <div v-else>None</div>
              </LabeledValue>
              <div>
                <LabeledValue
                  v-for="armor in mainEntity.combatStats.armor"
                  :label="armor.label"
                  :icon="armor.icon"
                  :key="armor.label"
                >
                  {{ armor.value }}
                </LabeledValue>
              </div>
            </div>
          </HorizontalFill>
          <div v-else>
            <Button @click="action('backAway')"> Leave </Button>
          </div>
        </Vertical>
        <CreatureDetailsModal :creatureId="selectedCreatureId" @close="selectedCreatureId = null" />
      </template>
    </Collapsible>
  </div>
</template>

<script>
const OperationEncounter = rxComponent({
  props: {
    operation: {},
  },

  data: () => ({
    selectedCreatureId: null,
  }),

  watch: {
    operation() {
      this.updateConsideredAP()
    },
  },

  subscriptions() {
    const operationStream = this.$stream('operation')
    const combatEngagementStream = operationStream
      .pluck('context')
      .pluck('combatEngagement')
      .switchMap((id) => GameService.getEntityStream(id))
    const creaturesStream = combatEngagementStream
      .pluck('creatures')
      .switchMap((ids) => GameService.getEntitiesStream(ids))
      .map((creatures) => creatures.filter((c) => !c.dead))
    const friendliesStream = creaturesStream.map((creatures) => creatures.filter((c) => !c.hostile))
    const hostilesStream = creaturesStream.map((creatures) => creatures.filter((c) => !!c.hostile))
    return {
      mainEntity: GameService.getRootEntityStream(),
      combatEngagement: combatEngagementStream,
      friendlies: friendliesStream,
      hostiles: hostilesStream,
      consideredAP: ControlsService.getConsideredAPStream(),
      weapon: GameService.getWeaponStream(),
      utilities: GameService.getUtilitiesStream(),
      inCombatCheck: creaturesStream
        .map((creatures) =>
          creatures.map(
            (creature) => !!(creature.operationInfo && creature.operationInfo.name === 'In Combat'),
          ),
        )
        .distinctUntilChanged(undefined, JSON.stringify)
        .tap(() => {
          GameService.getRootEntityStream()
            .first()
            .subscribe((entity) => {
              GameService.getEntityStream(entity.id, ENTITY_VARIANTS.DETAILS, true)
            })
        })
        .map((inCombat) => inCombat.reduce((acc, i) => acc || i, false)),
    }
  },

  mounted() {
    this.updateConsideredAP()
    GameService.checkQuickActions()
  },

  beforeUnmount() {
    ControlsService.updateConsideredAP(0)
    GameService.checkQuickActions()
  },

  methods: {
    setReadiness(value) {
      this.action('setReady', { ready: value })
    },

    commence() {
      GameService.request(REQUEST_CODES.COMMENCE_OPERATION, {
        startEncounter: true,
      }).then(({ statusChanges = [] } = {}) => {
        ToastNotify(statusChanges)
      })
    },

    action(action, params = {}) {
      GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
        updateType: 'action',
        action,
        ...params,
      })
    },

    cancel() {
      GameService.request(REQUEST_CODES.CANCEL_OPERATION)
    },

    updateConsideredAP() {
      ControlsService.updateConsideredAP(this.operation.context.unitCost)
    },
  },
})
window.OperationEncounter = OperationEncounter
export default OperationEncounter
</script>

<style scoped lang="scss">
@use '../../../utils.scss';

.encounter-operation {
  width: 35rem;
}

.participants {
  position: relative;
  display: flex;

  header {
    padding: 0.5rem;
    @include utils.text-outline();
  }

  .creatures-icons {
    display: flex;
    flex-wrap: wrap;
  }

  .friendly {
    max-width: 50%;
    flex-grow: 1;

    header {
      padding-right: 4rem;
      background: #11af11;
    }

    .friendly-creature {
      &:not(.ready) {
        opacity: 0.5;
        @include utils.filter(brightness(0.75) saturate(0.5));
      }
    }
  }

  .hostile {
    max-width: 50%;
    flex-grow: 1;

    header {
      padding-left: 4rem;
      background: #880000;
      text-align: right;
    }

    .creatures-icons {
      justify-content: flex-end;
    }
  }

  .vs-wrapper {
    position: absolute;
    z-index: 2;
    left: 50%;
    top: 1.86rem;
    width: 5rem;
    margin-left: -2.5rem;
    text-align: center;

    .vs-label {
      font-size: 70%;
    }
  }
}

.in-combat-message {
  font-style: italic;
  font-size: 90%;
  padding: 0 10% 1rem;
  text-align: center;
}

.quick-info {
  max-width: 50%;
  font-size: 70%;
}
</style>
