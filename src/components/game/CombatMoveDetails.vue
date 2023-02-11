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
    moveDetails: {},
    noIcon: { type: Boolean },
  },
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
</style>
