<template>
  <LoadingPlaceholder v-if="!info" />
  <div v-else>
    <div>
      <Icon :src="info.icon" backgroundType="alt" class="float-left" />
      <LabeledValue label="Current Base Value">
        {{ info.baseLevel }}
      </LabeledValue>
      <LabeledValue label="Bonus Value">
        <span :class="bonusClass">
          <span v-if="info.bonuses > 0">+</span>{{ info.bonuses }}
        </span>
      </LabeledValue>
      <LabeledValue label="Multiplier">
        <span :class="bonusClassMult">
          <span v-if="info.mult > 0">x</span>{{ info.mult }}
        </span>
      </LabeledValue>
    </div>
    <LabeledValue label="Known related skills">
      <span v-if="info.relatedSkills && info.relatedSkills.length">
        {{ info.relatedSkills.join(", ") }}
      </span>
      <span v-else> None </span>
    </LabeledValue>
    <div class="clear-both"></div>
    <template v-if="info.description">
      <hr />
      <Description pre>
        {{ info.description }}
      </Description>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    stat: {},
  },

  subscriptions() {
    return {
      info: this.$stream("stat").switchMap((stat) =>
        GameService.getInfoStream("STATISTICS", { stat }, true)
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
    bonusClassMult() {
      switch (true) {
        case this.info.mult > 1:
          return "text-good";
        case this.info.mult < 1:
          return "text-bad";
        default:
          return "text-neutral";
      }
    },
  },
};
</script>

<style scoped lang="scss"></style>
