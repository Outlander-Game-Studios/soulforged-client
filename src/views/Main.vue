<template>
  <div class="main-component">
    <AutoSizer />
    <DisconnectIndicator />
    <MilestoneTracker />
    <PageLayout>
      <template v-slot:overlay> </template>
      <template v-slot:status>
        <Status />
      </template>
      <template v-slot:main>
        <Location v-if="!fullscreenOperation">
          <Operation />
        </Location>
        <Operation v-else />
      </template>
      <template v-slot:controls>
        <Controls />
      </template>
      <template v-slot:actions>
        <Horizontal>
          <Spaced class="actions">
            <Actions :target="location" vertical />
          </Spaced>
        </Horizontal>
      </template>
      <template v-slot:help>
        <OpenQuestionList />
        <GameHelpModule />
      </template>
    </PageLayout>
  </div>
</template>

<script>
export default {
  subscriptions() {
    const location = GameService.getLocationStream();
    return {
      location,
      fullscreenOperation: ControlsService.getFullscreenOperationStream(),
    };
  },
};
</script>

<style scoped lang="scss">
@import "../utils.scss";

.main-component {
  height: 100%;
}
.actions {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
</style>
