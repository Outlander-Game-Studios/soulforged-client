<template>
  <div>
    <Header alt>Knowledge level: {{ mobInfo.mobExpLevel }}</Header>
    <CreatureKnowledgeBar :mobInfo="mobInfo" />
    <Spaced>
      <Header alt2>Offense</Header>
      <div v-if="mobInfo.combatMoves === undefined" class="empty-text">Unknown</div>
      <Spaced v-else>
        <Vertical>
          <LabeledValue label="Hit Rating (base)">{{ mobInfo.hitRating }}</LabeledValue>
          <CombatMoves noSpacing showDetailsOnClick :moves="mobInfo.combatMoves" />
        </Vertical>
      </Spaced>
      <Spaced v-if="creature">
        <ImpactsSummary
          :creature="creature"
          :impacts="['Hit Rating', 'Efficiency', 'Damage', 'Damage multiplier']"
        />
      </Spaced>
      <Header alt2>Defense</Header>
      <div v-if="mobInfo.defenseRating === undefined" class="empty-text">Unknown</div>
      <Spaced v-else>
        <LabeledValue label="Defense Rating (base)">
          {{ mobInfo.defenseRating }}
        </LabeledValue>
        <LabeledValue
          v-for="armor in mobInfo.armour"
          :label="armor.label"
          :icon="armor.icon"
          :key="armor.label"
        >
          {{ armor.value }}
        </LabeledValue>
      </Spaced>
      <Spaced v-if="creature">
        <ImpactsSummary
          :creature="creature"
          :impacts="['Defense Rating', 'Cut Resistance', 'Blunt Resistance', 'Pierce Resistance']"
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
export default {
  props: {
    creature: {},
    mobInfo: {},
  },
}
</script>
