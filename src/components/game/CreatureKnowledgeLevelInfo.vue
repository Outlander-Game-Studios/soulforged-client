<template>
  <div>
    <Header alt>Knowledge level: {{ mobInfo.mobExpLevel }}</Header>
    <ProgressBar
      :size="1.8"
      color="yellow"
      :current="mobInfo.maxLevel ? 100 : mobInfo.expProgress"
    >
      <div class="exp-needed">
        {{
          mobInfo.maxLevel
            ? "max level"
            : "Progress: " + mobInfo.expProgress + "%"
        }}
      </div>
    </ProgressBar>
    <Spaced>
      <Header alt2>Offense</Header>
      <div v-if="mobInfo.combatMoves === undefined" class="empty-text">
        Unknown
      </div>
      <Spaced v-else>
        <Vertical>
          <LabeledValue label="Hit Rating (base)">{{
            mobInfo.hitRating
          }}</LabeledValue>
          <CombatMoves
            noSpacing
            showDetailsOnClick
            :moves="mobInfo.combatMoves"
          />
        </Vertical>
      </Spaced>
      <Spaced v-if="creature">
        <ImpactsSummary
          :creature="creature"
          :impacts="['Hit Rating', 'Efficiency', 'Damage', 'Damage multiplier']"
        />
      </Spaced>
      <Header alt2>Defense</Header>
      <div v-if="mobInfo.defenseRating === undefined" class="empty-text">
        Unknown
      </div>
      <Spaced v-else>
        <LabeledValue label="Defense Rating (base)">
          {{ mobInfo.defenseRating }}
        </LabeledValue>
        <LabeledValue
          v-for="(value, armour) in mobInfo.armour"
          :label="armour"
          :key="armour"
        >
          {{ value }}
        </LabeledValue>
      </Spaced>
      <Spaced v-if="creature">
        <ImpactsSummary
          :creature="creature"
          :impacts="[
            'Defense Rating',
            'Cut Resistance',
            'Blunt Resistance',
            'Pierce Resistance',
          ]"
        />
      </Spaced>
      <Header alt2>Usable items</Header>
      <div v-if="!mobInfo.items" class="empty-text">Unknown</div>
      <div v-else-if="!mobInfo.items.length" class="empty-text">None</div>
      <Spaced v-else>
        <HorizontalWrap>
          <ItemIcon v-for="icon in mobInfo.items" :key="icon" :icon="icon" />
        </HorizontalWrap>
      </Spaced>
    </Spaced>
  </div>
</template>

<script>
import CombatMoves from "./CombatMoves";
import LabeledValue from "../interface/LabeledValue";
import Vertical from "../layouts/Vertical";
export default {
  components: { Vertical, LabeledValue, CombatMoves },
  props: {
    creature: {},
    mobInfo: {},
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.exp-needed {
  text-align: center;
  font-size: 55%;
  @include text-outline();
}
</style>
