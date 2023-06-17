<template>
  <div>
    <template v-if="moveDetails">
      <div v-if="moveDetails.missingReqMessage" class="requirement">
        {{ moveDetails.missingReqMessage }}
      </div>
      <div v-if="!noIcon" class="details-move-icon">
        <Icon :src="moveDetails.icon" :size="11" />
      </div>
      <Vertical>
        <div>
          <LabeledValue label="Odds of landing a hit" v-if="odds !== undefined">
            <span :class="'odds-color-' + (ODDS_CLASS[odds] || odds)">
              {{ ODDS_TEXT[odds] }}
            </span>
          </LabeledValue>
          <LabeledValue v-if="!moveDetails.stopsFleeing">
            Useable while fleeing
            <Help title="Useable while fleeing">
              Using this ability while fleeing does not reset the fleeing
              progress.
            </Help>
          </LabeledValue>
          <LabeledValue v-if="moveDetails.isCounter">
            Used as counter
          </LabeledValue>
          <LabeledValue v-if="moveDetails.triggersCounter">
            Triggers counter
          </LabeledValue>
          <LabeledValue label="Cooldown (turns)" v-if="moveDetails.cooldownMax">
            {{ moveDetails.cooldownMax }}
          </LabeledValue>
          <LabeledValue label="Skill" v-if="moveDetails.skill">
            {{ moveDetails.skill }}
          </LabeledValue>
          <LabeledValue
            label="Skill level required"
            v-if="moveDetails.skillLevelRequired"
          >
            {{ moveDetails.skillLevelRequired }}
          </LabeledValue>
          <LabeledValue
            label="Hit Rating"
            v-if="moveDetails.hitRating !== undefined"
          >
            {{ moveDetails.hitRating }}
          </LabeledValue>
          <template v-if="moveDetails.raw">
            <SubLabeledValue label="Move Base">
              {{ moveDetails.raw.hitRating }}
            </SubLabeledValue>
            <SubLabeledValue label="Skill & Effects">
              <Plused
                :value="+moveDetails.hitRating - +moveDetails.raw.hitRating"
              />
            </SubLabeledValue>
          </template>
        </div>
        <div v-if="moveDetails.damage">
          <Header alt2 small>Damage</Header>
          <div v-for="(value, damage) in moveDetails.damage" :key="damage">
            <LabeledValue :label="damage">
              {{ value }}
            </LabeledValue>
            <template v-if="moveDetails.raw">
              <SubLabeledValue label="Move Base">
                {{ moveDetails.raw.damage[damage] || 0 }}
              </SubLabeledValue>
              <SubLabeledValue label="Attributes & Effects">
                <Plused
                  :value="+value - (+moveDetails.raw.damage[damage] || 0)"
                />
              </SubLabeledValue>
            </template>
          </div>
        </div>
      </Vertical>
    </template>
    <hr />
    <div v-if="moveDetails && moveDetails.description" class="clear-both">
      <Description pre
        ><RichText :value="moveDetails.description" html
      /></Description>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    odds: {},
    moveDetails: {},
    noIcon: { type: Boolean },
  },

  data: () => ({
    ODDS_CLASS: {
      "n/a": "n-a",
    },
    ODDS_TEXT: {
      "n/a": "Self-applied",
      4: "Excellent",
      3: "Great",
      2: "Good",
      1: "Fine",
      0: "Average",
      "-1": "Poor",
      "-2": "Bad",
      "-3": "Awful",
      "-4": "Abysmal",
    },
  }),
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.requirement {
  @include big-warning();
}

.details-move-icon {
  float: right;
  margin-left: 1rem;
  margin-bottom: 1rem;
}

hr:first-child,
hr:last-child,
hr + hr {
  display: none;
}

.odds-color-n-a {
  @include text-outline(#102679, #3b79d9);
}
.odds-color-4 {
  @include text-outline(#022902, green);
}
.odds-color-3 {
  @include text-outline(#062f06, #29a429);
}
.odds-color-2 {
  @include text-outline(#093209, limegreen);
}
.odds-color-1 {
  @include text-outline(#182200, #93e838);
}
.odds-color-0 {
  @include text-outline(#181800, yellow);
}
.odds-color--1 {
  @include text-outline(#322200, orange);
}
.odds-color--2 {
  @include text-outline(#541111, red);
}
.odds-color--3 {
  @include text-outline(#520b0b, #de2222);
}
.odds-color--4 {
  @include text-outline(#4f0808, firebrick);
}
</style>
