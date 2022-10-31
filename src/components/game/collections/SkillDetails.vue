<template>
  <LoadingPlaceholder v-if="!info" />
  <div v-else>
    <template v-if="info.baseLevel !== undefined">
      <div>
        <Icon :src="info.icon" backgroundType="alt" class="float-left" />
        <LabeledValue label="Current Base Skill Level">
          {{ info.baseLevel }}
        </LabeledValue>
        <LabeledValue label="Skill Level Bonus">
          <span :class="bonusClass">
            <span v-if="info.bonuses > 0">+</span>{{ info.bonuses }}
          </span>
        </LabeledValue>
        <div v-if="info.highestLevel !== undefined">
          <LabeledValue label="Highest skill level ever">
            {{ info.highestLevel }}
          </LabeledValue>
        </div>
      </div>
      <LabeledValue
        label="Related attributes"
        v-if="info.relatedStats && info.relatedStats.length"
      >
        {{ info.relatedStats.join(", ") }}
      </LabeledValue>
      <div class="clear-both"></div>
      <template v-if="info.explained">
        <hr />
      </template>
    </template>
    <template v-if="info.explained">
      <Description pre>
        {{ info.explained }}
      </Description>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    skillName: {},
  },

  subscriptions() {
    return {
      info: this.$stream("skillName").switchMap((skillName) =>
        GameService.getInfoStream("SKILLS", { skillName: skillName }, true)
      ),
    };
  },

  computed: {
    bonusClass() {
      switch (true) {
        case this.info.bonuses > 0:
          return "text-good";
        case this.info.bonuses < 0:
          return "text-bad";
        default:
          return "text-neutral";
      }
    },
  },
};
</script>

<style scoped lang="scss"></style>
