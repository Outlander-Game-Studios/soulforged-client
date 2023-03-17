<template>
  <div class="relative">
    <Header veryLarge> Power Group: {{ powerGroup.name }} </Header>
    <Container borderType="base" backgroundType="alt3">
      <div class="instructions">
        You can select only one power from this group
      </div>
      <Spaced>
        <Vertical>
          <PowerItem
            v-for="power in powerGroup.powers"
            :key="power.powerId"
            :power="power"
            :purchasedPowers="purchasedPowers"
            @purchasingPower="$emit('purchasingPower', power)"
          />
        </Vertical>
      </Spaced>
    </Container>
  </div>
</template>

<script>
export default {
  props: {
    powerGroup: {},
    purchasedPowers: {},
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.instructions {
  @include text-outline();
  text-align: center;
  padding: 1rem 2rem 0;
}
</style>
