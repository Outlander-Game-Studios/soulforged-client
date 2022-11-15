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
          :description="
            'Report player name <em>' +
            creature.name +
            '</em> as inappropriate.'
          "
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
                <CreatureIcon :creature="creature" size="large" />
              </div>
              <div v-if="creature.operationInfo">
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
                        <div
                          v-if="creature.operationInfo.subtext"
                          class="subtext"
                        >
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
              </div>
              <Actions :target="creature" @action="$emit('action')" />
              <div>
                <Effects :effects="creature.tracks" />
                <Effects :effects="creature.effects" />
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
              <CreatureKnowledgeLevelInfo
                :creature="creature"
                :mobInfo="mobInfo"
              />
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
export default {
  props: {
    creatureId: {},
  },

  subscriptions() {
    const creatureStream = this.$stream("creatureId").switchMap((creatureId) =>
      creatureId
        ? GameService.getEntityStream(creatureId, ENTITY_VARIANTS.DETAILS)
        : Rx.Observable.of(null)
    );
    return {
      mainEntity: GameService.getRootEntityStream(),
      creature: creatureStream,
      mobInfo: creatureStream
        .filter((creature) => !!creature && creature.hostile)
        .pluck("publicId")
        .switchMap((publicId) =>
          Rx.fromPromise(
            GameService.request(REQUEST_CODES.MOB_INFO, {
              publicId,
            })
          )
        ),
    };
  },

  methods: {
    operationAction(operationInfo) {
      GameService.performAction(
        {
          id: operationInfo.action.targetId,
        },
        {
          actionId: operationInfo.action.actionId,
        }
      ).then(() => {
        this.$emit("close");
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

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
</style>
