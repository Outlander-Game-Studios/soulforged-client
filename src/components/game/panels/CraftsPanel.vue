<template>
  <div>
    <div class="craft-filters-wrapper">
      <Container borderType="alt" :borderSize="1.2">
        <Collapsible>
          <template v-slot:header="{ collapsed: collapsed }">
            <span v-if="!collapsed">Filters</span>
          </template>
          <template v-slot:content>
            <div class="craft-filters">
              <Spaced>
                <Vertical>
                  <Input placeholder="Text search..." v-model:value="textFilter" />
                  <Select label="Skill" :options="availableSkills" v-model:value="skillFilter" />
                  <Select label="Sort" :options="sortOptions" v-model:value="sortOrder" />
                </Vertical>
              </Spaced>
            </div>
          </template>
        </Collapsible>
      </Container>
    </div>
    <Header>Crafts</Header>
    <div v-if="!crafts">
      <LoadingPlaceholder />
    </div>
    <div v-else-if="!crafts.length" class="empty-text">None</div>
    <div v-else-if="!sortedFilteredCrafts.length" class="empty-text">No results found</div>
    <div v-else v-for="craft in sortedFilteredCrafts">
      <CraftListItem :craft="craft" />
    </div>
  </div>
</template>

<script>
const NO_FILTER = '_'
const SORTING = [
  {
    label: 'Default',
  },
  {
    label: 'Difficulty',
    sorter: (a, b) => b.difficulty - a.difficulty,
  },
  {
    label: 'Skill',
    sorter: (a, b) => compareStrings(a.skill, b.skill),
  },
  {
    label: 'Name',
    sorter: (a, b) =>
      compareStrings(GameService.stripRichText(a.name), GameService.stripRichText(b.name)),
  },
]

export default rxComponent({
  data: () => ({
    collapsed: true,
    sortOptions: SORTING.map((s) => s.label),
    textFilter: '',
    skillFilter: NO_FILTER,
    sortOrder: 0,
  }),

  subscriptions() {
    return {
      crafts: GameService.getCraftsStream(),
    }
  },

  computed: {
    availableSkills() {
      return {
        [NO_FILTER]: 'Any',
        ...(this.crafts || [])
          .map((c) => c.skill)
          .filter((skill) => !!skill)
          .uniq()
          .sort()
          .toObject(),
      }
    },
    sortedFilteredCrafts() {
      let result = [...this.crafts]
      if (!result) {
        return
      }
      if (this.skillFilter !== NO_FILTER) {
        result = result.filter((craft) => craft.skill === this.skillFilter)
      }
      if (this.textFilter) {
        const textFilter = this.textFilter.toLowerCase()
        result = result.filter((craft) =>
          GameService.stripRichText(craft.name).toLowerCase().includes(textFilter),
        )
      }
      const { sorter } = SORTING[this.sortOrder]
      if (sorter) {
        result.sort(sorter)
      }
      return result
    },
  },
})
</script>

<style scoped lang="scss">
@use '../../../utils.scss';

.craft-filters-wrapper {
  display: flex;
  justify-content: flex-end;
  @include utils.main-tab-extra();
}
</style>
