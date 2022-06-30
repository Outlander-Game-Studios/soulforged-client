<template>
  <div v-if="operation.context.skillInfo">
    <div>
      <SkillBar
        :skillName="skill"
        :skillLevel="skillLevel"
        :extras="'(x' + expGainMultiplier + ' exp)'"
      />
    </div>
    <div v-if="successChance !== undefined">
      <LabeledValue label="Success">
        <span :class="'rate rate-color-' + successChance">
          {{ CHANCE_LABEL[successChance] }}
        </span>
      </LabeledValue>
    </div>
    <div v-if="accidentChance !== undefined">
      <LabeledValue label="Accident">
        <span :class="'rate rate-color-' + (5 - accidentChance)">
          {{ CHANCE_LABEL[accidentChance] }}
        </span>
        <span v-if="accidentChance"> / </span>
        <span
          v-if="accidentChance"
          :class="'rate rate-color-' + (5 - accidentSeverity)"
        >
          {{ SEVERITY_LABEL[accidentSeverity] }}
        </span>
      </LabeledValue>
    </div>
    <div v-if="finalSpeed !== undefined">
      <LabeledValue label="Speed">
        {{ finalSpeed }}%
        <span class="highlight-problem" v-if="!finalSpeed" />
      </LabeledValue>
    </div>
    <div v-else-if="baseSpeed !== undefined">
      <LabeledValue label="Base speed"> {{ baseSpeed }}% </LabeledValue>
    </div>
  </div>
</template>

<script>
const CHANCE_LABEL = {
  0: "Impossible",
  1: "Unlikely",
  2: "Doubtful",
  3: "Fair",
  4: "Likely",
  5: "Certain",
};
const SEVERITY_LABEL = {
  0: "None",
  1: "Trivial",
  2: "Minor",
  3: "Serious",
  4: "Severe",
  5: "Grievous",
};

export default {
  props: {
    operation: {},
  },

  data: () => ({
    CHANCE_LABEL,
    SEVERITY_LABEL,
  }),

  computed: {
    finalSpeed() {
      return this.operation?.context?.skillInfo?.finalSpeed;
    },
    baseSpeed() {
      return this.operation?.context?.skillInfo?.baseSpeed;
    },
    skill() {
      return this.operation?.context?.skillInfo?.skill;
    },
    successChance() {
      return this.operation?.context?.skillInfo?.successChance;
    },
    accidentChance() {
      return this.operation?.context?.skillInfo?.accidentChance;
    },
    accidentSeverity() {
      return this.operation?.context?.skillInfo?.accidentSeverity;
    },
    expGainMultiplier() {
      return this.operation?.context?.skillInfo?.skillGainMult;
    },
    skillLevel() {
      return this.operation?.context?.skillInfo?.skillLevel;
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.rate {
  text-align: right;
  font-weight: bold;
  font-style: italic;
  letter-spacing: 0.035em;

  &.rate-color-0 {
    @include text-outline(#4f0808, firebrick);
  }
  &.rate-color-1 {
    @include text-outline(#541111, red);
  }
  &.rate-color-2 {
    @include text-outline(#322200, orange);
  }
  &.rate-color-3 {
    @include text-outline(#181800, yellow);
  }
  &.rate-color-4 {
    @include text-outline(#093209, limegreen);
  }
  &.rate-color-5 {
    @include text-outline(#022902, green);
  }
}
</style>
