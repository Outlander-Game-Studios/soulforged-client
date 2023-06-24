<template>
  <Vertical>
    <MilestoneObjective
      v-for="(step, idx) in milestoneInfo.steps"
      :key="idx"
      :text="step.text"
      :description="step.info"
      :completed="idx < milestoneInfo.current"
      :inactive="idx > milestoneInfo.current"
    />
    <Checkbox
      v-if="milestoneInfo.current < milestoneInfo.steps.length"
      v-model="tracked"
    >
      Tracked
    </Checkbox>
    <Description
      v-if="milestoneInfo.totalSteps - milestoneInfo.steps.length > 0"
    >
      {{ milestoneInfo.totalSteps - milestoneInfo.steps.length }} follow-up
      objectives to be discovered
    </Description>
    <Vertical v-if="milestoneInfo.rewardText">
      <Header alt2> Reward </Header>
      <div>
        {{ milestoneInfo.rewardText }}
      </div>
    </Vertical>
  </Vertical>
</template>

<script>
export default {
  props: {
    milestoneInfo: {},
  },

  data: () => ({
    tracked: false,
  }),

  watch: {
    milestoneInfo: {
      handler() {
        this.tracked = this.milestoneInfo.tracked;
      },
      immediate: true,
    },
    tracked() {
      GameService.getInfoStream(
        "Human",
        {
          type: "setMilestoneTracker",
          track: this.tracked ? this.milestoneInfo.key : null,
        },
        true
      );
      GameService.getInfoStream(
        "Collectible",
        { categoryIdx: MILESTONES_IDX },
        true
      );
    },
  },
};
</script>
