<template>
  <div v-if="mainEntity">
    <Header>Attributes</Header>
    <Spaced>
      <Vertical>
        <LabeledValue label="Age">
          {{ mainEntity.age }}
        </LabeledValue>
        <div>
          <LabeledValue
            v-for="(data, stat) in mainEntity.statistics"
            :key="stat"
            class="interactive clear-both"
            @click="showStatDetails = stat"
          >
            <template v-slot:label>
              <Icon
                :src="data.icon"
                backgroundType="alt"
                class="float-left"
                :size="2.5"
              />
              {{ stat }}
            </template>
            <template>
              {{ data.value }}
            </template>
          </LabeledValue>
        </div>
        <LabeledValue label="Mortal Wounds">
          {{ mainEntity.mortalWounds.current }} /
          {{ mainEntity.mortalWounds.max }}
          <Help title="Mortal Wounds">
            Mortal wounds are caused by serious injury. Once you reach the limit
            of Mortal Wounds, any further serious injury will cause character
            death.
          </Help>
        </LabeledValue>
      </Vertical>
    </Spaced>
    <Header>
      Skills
      <Help title="Skills">
        <p>
          Skills are increased while performing any action that is using this
          skill. The <em>skill experience</em> gained depends most notably on
          the difficulty of the task. Performing fairly challenging actions
          grants the most <em>skill experience</em>, while doing those that are
          almost impossible or trivial grants less <em>skill experience</em>.
        </p>
        <p>
          You can click on any skill bar to display additional information about
          the skill.
        </p>
      </Help>
    </Header>
    <div v-if="noSkills" class="empty-text">None</div>
    <Spaced>
      <template v-if="!showAllSkills">
        <SkillBar
          v-for="skill in topSortedSkills"
          :key="skill.skillName + '_top'"
          :skillName="skill.skillName"
          :skillLevel="skill.level"
        />
      </template>
      <template v-else>
        <SkillBar
          v-for="skill in sortedSkills"
          :key="skill.skillName"
          :skillName="skill.skillName"
          :skillLevel="skill.level"
        />
      </template>
      <HorizontalCenter v-if="topSortedSkills.length !== sortedSkills.length">
        <Button @click="showAllSkills = !showAllSkills">
          {{ showAllSkills ? "Show fewer" : "Show all" }}
        </Button>
      </HorizontalCenter>
    </Spaced>
    <Header>Combat</Header>
    <Spaced>
      <Vertical>
        <Header alt2>
          Abilities
          <Help title="Abilities">
            <HelpAttackStats />
          </Help>
        </Header>
        <div>
          <CombatMoves noSpacing showDetailsOnClick wrap />
        </div>
        <Header alt2>
          Defense
          <Help title="Defense">
            <HelpDefenseStats />
          </Help>
        </Header>
        <div>
          <LabeledValue label="Defense rating">
            {{ mainEntity.combatStats.defense }}
          </LabeledValue>
          <LabeledValue
            v-for="armor in mainEntity.combatStats.armor"
            :label="armor.label"
            :icon="armor.icon"
            :key="armor.label"
          >
            {{ armor.value }}
          </LabeledValue>
        </div>
      </Vertical>
    </Spaced>
    <Header id="effects-section">Effects</Header>
    <Effects :effects="mainEntity.effects" />
    <Effects :effects="mainEntity.environment" />
    <Modal
      v-if="showStatDetails"
      dialog
      large
      @close="showStatDetails = false"
      :title="showStatDetails"
    >
      <StatDetails :stat="showStatDetails" />
    </Modal>
  </div>
</template>

<script>
import CombatMoves from "../CombatMoves";
export default {
  data: () => ({
    showStatDetails: false,
    showAllSkills: false,
  }),

  components: { CombatMoves },
  subscriptions() {
    const mainEntityStream = GameService.getRootEntityStream();

    return {
      mainEntity: mainEntityStream,
      sortedSkills: mainEntityStream.map((mainEntity) =>
        mainEntity.skills
          ? Object.keys(mainEntity.skills)
              .sort((a, b) => {
                const diff = mainEntity.skills[b] - mainEntity.skills[a];
                return diff || compareStrings(a, b);
              })
              .map((skillName) => ({
                skillName,
                level: mainEntity.skills[skillName],
              }))
          : Rx.Observable.empty()
      ),
    };
  },

  computed: {
    noSkills() {
      return this.sortedSkills && !Object.keys(this.sortedSkills).length;
    },
    topSortedSkills() {
      return this.sortedSkills?.slice(0, 5);
    },
  },
};
</script>
