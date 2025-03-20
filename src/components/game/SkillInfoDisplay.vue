<template>
  <div v-if="internalSkillData">
    <div v-if="skillLevel !== undefined">
      <SkillBar
        :skillName="skill"
        :skillLevel="skillLevel"
        :extras="expGainMultiplier ? '(x' + expGainMultiplier + ' exp)' : ''"
      />
    </div>
    <div v-if="successChance !== undefined">
      <LabeledValue label="Success">
        <span class="interactive" @click="explain = 'success'">
          <span :class="'rate rate-color-' + successChance">
            {{ CHANCE_LABEL[successChance] }}
          </span>
        </span>
      </LabeledValue>
    </div>
    <div v-if="accidentChance !== undefined">
      <LabeledValue label="Accident">
        <span class="interactive" @click="explain = 'accident'">
          <span :class="'rate rate-color-' + (5 - accidentChance)">
            {{ CHANCE_LABEL[accidentChance] }}
          </span>
          <span v-if="accidentChance"> / </span>
          <span v-if="accidentChance" :class="'rate rate-color-' + (5 - accidentSeverity)">
            {{ SEVERITY_LABEL[accidentSeverity] }}
          </span>
        </span>
      </LabeledValue>
    </div>
    <div v-if="finalSpeed !== undefined && finalSpeed !== null">
      <LabeledValue label="Speed">
        <span class="interactive" @click="explain = 'speed'">
          <span class="rate" :class="speedClass">{{ finalSpeed || 0 }}%</span>
          <span class="highlight-problem" v-if="finalSpeed <= 0" />
        </span>
      </LabeledValue>
    </div>
    <div v-else-if="baseSpeed !== undefined && finalSpeed !== null">
      <LabeledValue label="Base speed"> {{ baseSpeed }}% </LabeledValue>
    </div>
    <slot />
    <Modal dialog v-if="explain === 'speed'" @close="explain = null">
      <template v-slot:title> Speed </template>
      <template v-slot:contents>
        <Description prominent>
          Speed determines how many Action Points are used to perform an action.<br />
          Having higher speed means you spend fewer Action Points.<br />
        </Description>
        <div v-if="speedModifiers">
          <hr />
          <Description prominent>
            For your current action the speed is determined based on:
          </Description>
          <LabeledValue v-for="(value, mod) in speedModifiers" :key="mod" :label="mod">
            {{ value }}%
            <div v-if="mod === 'Efficiency'" class="stats-icons">
              <Effects
                class="efficiency-effects"
                row
                :effects="mainEntity.effects"
                :filter="efficiencyEffectFilter"
                :size="2.5"
              />
              <Effects
                class="efficiency-effects"
                row
                :effects="mainEntity.environment"
                :filter="efficiencyEffectFilter"
                :size="2.5"
              />
            </div>
            <div v-if="mod === 'Attributes' && !!skillDetails" class="stats-icons">
              <StatIcon
                v-for="stat in relatedStatsSorted"
                :key="stat"
                :stat="stat"
                :size="2.5"
                class="stats-icon"
              />
            </div>
          </LabeledValue>
        </div>
        <hr />
        <LabeledValue label="Final Speed">
          <span class="rate" :class="speedClass">{{ finalSpeed || 0 }}%</span>
          <span class="highlight-problem" v-if="finalSpeed <= 0" />
        </LabeledValue>
      </template>
    </Modal>
    <Modal dialog v-if="explain === 'accident'" @close="explain = null">
      <template v-slot:title> Accidents </template>
      <template v-slot:contents>
        <Description prominent>
          Performing most actions may result in an accident.<br />
          An accident is independent to whether the action succeeds.
        </Description>
        <hr />
        <LabeledValue label="Accident Chance">
          <span :class="'rate rate-color-' + (5 - accidentChance)">
            {{ CHANCE_LABEL[accidentChance] }}
          </span>
        </LabeledValue>
        <Description prominent>
          Accident chance depends on the difficulty of the task and your skill.<br />
        </Description>
        <hr />
        <LabeledValue label="Accident Severity">
          <span :class="'rate rate-color-' + (5 - accidentSeverity)">
            {{ SEVERITY_LABEL[accidentSeverity] }}
          </span>
        </LabeledValue>
        <Description prominent>
          Accident severity determines how big an injury you may sustain if an accident happens.<br />
          It depends on the difficulty of the task, your skill, base Action Point cost and other
          factors.
        </Description>
      </template>
    </Modal>
    <Modal dialog v-if="explain === 'success'" @close="explain = null">
      <template v-slot:title> Success </template>
      <template v-slot:contents>
        <Description prominent>
          Performing most actions may only have a chance for a success.<br />
          What success means depends on the specific task being performed.
        </Description>
        <hr />
        <LabeledValue label="Success">
          <span :class="'rate rate-color-' + successChance">
            {{ CHANCE_LABEL[successChance] }}
          </span>
        </LabeledValue>
        <Description prominent>
          Success chance depends on the difficulty of the task, your skill and other factors.
        </Description>
      </template>
    </Modal>
  </div>
</template>

<script>
const CHANCE_LABEL = {
  0: 'Impossible',
  1: 'Unlikely',
  2: 'Doubtful',
  3: 'Fair',
  4: 'Likely',
  5: 'Certain',
}
const SEVERITY_LABEL = {
  0: 'None',
  1: 'Trivial',
  2: 'Minor',
  3: 'Serious',
  4: 'Severe',
  5: 'Grievous',
}

export default {
  props: {
    operation: {},
    skillData: {},
  },

  data: () => ({
    explain: null,
    efficiencyEffectFilter: (effect) => effect?.impacts?.some((i) => i.name === 'Efficiency'),
    CHANCE_LABEL,
    SEVERITY_LABEL,
  }),

  subscriptions() {
    return {
      mainEntity: GameService.getRootEntityStream(),
      skillDetails: this.$stream('operation')
        .pluck('context', 'skillInfo', 'skill')
        .switchMap((skillName) =>
          GameService.getInfoStream('SKILLS', { skillName: skillName }, true),
        ),
    }
  },

  computed: {
    relatedStatsSorted() {
      if (!this.skillDetails || !this.skillDetails.relatedStats) {
        return []
      }
      return [...this.skillDetails.relatedStats].sort()
    },
    speedClass() {
      switch (true) {
        case this.finalSpeed < 25:
          return 'rate-color-0'
        case this.finalSpeed < 50:
          return 'rate-color-1'
        case this.finalSpeed < 75:
          return 'rate-color-2'
        case this.finalSpeed < 100:
          return 'rate-color-3'
        case this.finalSpeed < 120:
          return 'rate-color-4'
        default:
          return 'rate-color-5'
      }
    },
    internalSkillData() {
      return this.skillData || this.operation?.context?.skillInfo
    },
    finalSpeed() {
      return this.internalSkillData?.finalSpeed
    },
    baseSpeed() {
      return this.internalSkillData?.baseSpeed
    },
    speedModifiers() {
      return this.internalSkillData?.speedModifiers
    },
    skill() {
      return this.internalSkillData?.skill
    },
    successChance() {
      return this.internalSkillData?.successChance
    },
    accidentChance() {
      return this.internalSkillData?.accidentChance
    },
    accidentSeverity() {
      return this.internalSkillData?.accidentSeverity
    },
    expGainMultiplier() {
      return this.internalSkillData?.skillGainMult
    },
    skillLevel() {
      return this.internalSkillData?.skillLevel
    },
  },
}
</script>

<style scoped lang="scss">
@import '../../utils.scss';

.efficiency-effects {
  display: inline-block;
  vertical-align: bottom;
}

.stats-icons {
  display: inline-block;
  vertical-align: bottom;
  height: 2.5rem;

  .stats-icon {
    display: inline-block;
  }
}

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
