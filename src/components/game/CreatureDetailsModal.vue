<template>
  <Modal v-if="creatureId" dialog large @close="$emit('close')">
    <template v-slot:title>
      <div v-if="!creature">Loading...</div>
      <div v-else>
        <RichText :value="creature.name" />
        <ReportButton
          class="report-name-button"
          v-if="creature.avatar"
          title="Report name"
          :description="'Report player name <em>' + creature.name + '</em> as inappropriate.'"
          type="name"
          :refId="creature.id"
        />
      </div>
    </template>
    <template v-slot:contents>
      <Vertical>
        <LoadingPlaceholder v-if="!creature" />
        <DynamicLayout v-else>
          <Vertical>
            <Vertical>
              <div class="creature-icon-wrapper">
                <Avatar v-if="creature.avatar" :creature="creature" size="large" />
                <CreatureIcon v-else :creature="creature" size="large" />
              </div>
              <div v-if="creature.nextMove">
                <Vertical>
                  <Header alt2 small>Next move</Header>
                  <HorizontalCenter>
                    <ListItem flexible>
                      <template v-slot:icon>
                        <NextMoveIndicator :moveData="creature.nextMove" />
                      </template>
                      <template v-slot:title>
                        {{ creature.nextMove.name }}
                      </template>
                      <template v-slot:subtitle>
                        Targeting
                        <span class="target-text">{{ targetText }}</span>
                      </template>
                    </ListItem>
                  </HorizontalCenter>
                </Vertical>
              </div>
              <div v-if="creature.operationInfo">
                <Vertical>
                  <Header alt2 small>Current action</Header>
                  <HorizontalCenter>
                    <Container>
                      <Horizontal tight class="overflow-hidden">
                        <Icon :src="creature.operationInfo.icon" size="6" />
                        <div
                          class="operation-name"
                          :class="{
                            'without-context': !creature.operationInfo.subtext,
                          }"
                        >
                          {{ creature.operationInfo.name }}
                          <div v-if="creature.operationInfo.subtext" class="subtext">
                            {{ creature.operationInfo.subtext }}
                          </div>
                        </div>
                        <Button
                          v-if="creature.operationInfo.action"
                          @click="operationAction(creature.operationInfo)"
                        >
                          {{ creature.operationInfo.action.name }}
                        </Button>
                        <CreaturesPanel
                          v-if="creature.operationInfo.creatures"
                          :creatures="creature.operationInfo.creatures"
                          hideHeader
                        />
                      </Horizontal>
                    </Container>
                  </HorizontalCenter>
                </Vertical>
              </div>
              <Actions :target="creature" @action="$emit('action')" />
              <div class="creature-effects">
                <Effects :effects="creature.effects" :filter="combatEffects" />
                <Effects :effects="creature.tracks" />
                <Effects :effects="creature.effects" :filter="nonCombatEffects" />
              </div>
            </Vertical>
            <div v-if="creature.description">
              <hr />
              <Description>
                <RichText :value="creature.description" />
              </Description>
            </div>
          </Vertical>
          <div v-if="creature.hostile">
            <LoadingPlaceholder v-if="!mobInfo" />
            <div v-else>
              <CreatureKnowledgeLevelInfo :creature="creature" :mobInfo="mobInfo" />
            </div>
          </div>
          <div v-if="creature.id === mainEntity.id">
            <div>
              <MainEntityKnowledgeLevelInfo />
            </div>
          </div>
        </DynamicLayout>
      </Vertical>
    </template>
  </Modal>
</template>

<script>
export default rxComponent({
  props: {
    creatureId: {},
  },

  data: () => ({
    combatEffects: (effect) => effect.combat,
    nonCombatEffects: (effect) => !effect.combat,
  }),

  subscriptions() {
    const creatureStream = this.$stream('creatureId').switchMap((creatureId) =>
      creatureId
        ? GameService.getEntityStream(creatureId, ENTITY_VARIANTS.DETAILS)
        : Rx.Observable.of(null),
    )
    return {
      mainEntity: GameService.getRootEntityStream(),
      creature: creatureStream,
      targetText: Rx.combineLatest(
        creatureStream.pluck('nextMove', 'targetId'),
        GameService.getRootEntityStream(),
      ).switchMap(([creatureId, mainEntity]) =>
        creatureId === mainEntity.id
          ? Rx.Observable.of('you')
          : GameService.getEntityStream(creatureId, ENTITY_VARIANTS.DETAILS).map((c) => c?.name),
      ),
      mobInfo: creatureStream
        .filter((creature) => !!creature && creature.hostile)
        .pluck('publicId')
        .switchMap((publicId) =>
          Rx.fromPromise(
            GameService.request(REQUEST_CODES.MOB_INFO, {
              publicId,
            }),
          ),
        ),
    }
  },

  methods: {
    operationAction(operationInfo) {
      GameService.performAction(
        {
          id: operationInfo.action.targetId,
        },
        {
          actionId: operationInfo.action.actionId,
        },
      ).then(() => {
        this.$emit('close')
      })
    },
  },
})
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.creature-icon-wrapper {
  margin: 0 auto;
}

.report-name-button {
  margin-left: 1rem;
  font-size: 100%;
}

.operation-name {
  padding: 0.5rem;

  &.without-context {
    padding: 1.8rem 2.5rem;
  }

  .subtext {
    font-style: italic;
    font-size: 75%;
  }
}

.target-text {
  font-weight: bold;
}

.creature-effects {
  max-width: 40rem;
}
</style>
