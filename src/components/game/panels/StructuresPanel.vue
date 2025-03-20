<template>
  <div>
    <Header class="interactive" @click="showList()" v-if="header"> Structures </Header>
    <LoadingPlaceholder v-if="!loadedStructures" :size="6" />
    <div v-else-if="!loadedStructures.length" class="empty-text">None</div>
    <HorizontalWrap v-else tight class="scroll-spacing">
      <StructureIcon
        v-for="(structure, idx) in stackedStructures"
        :key="idx"
        :structure="structure"
        :size="6"
        class="interactive"
        @click="showList(structure)"
      />
    </HorizontalWrap>
    <Modal v-if="showingList" dialog large @close="showingList = false">
      <template v-slot:title> Structures </template>
      <template v-slot:contents>
        <LoadingPlaceholder v-if="!filteredStructures" />
        <div v-else-if="!filteredStructures.length" class="empty-text">None</div>
        <template v-else>
          <div v-for="structure in filteredStructures" :key="structure.id">
            <ListItem
              :lazyLoad="() => getStructureDetailsStream(structure)"
              @click="showDetailsId = structure.id"
              :flexible="flexible"
            >
              <template v-slot:icon="{ lazyData: structureDetails }">
                <StructureIcon :structure="structureDetails" :size="6" />
              </template>
              <template v-slot:title="{ lazyData: structureDetails }">
                <RichText :value="structureDetails.name" />
              </template>
              <template v-slot:subtitle="{ lazyData: structureDetails }">
                <Horizontal tight>
                  <template v-if="structureDetails.materials && structureDetails.materials.length">
                    <ItemIcon
                      v-for="(material, idx) in structureDetails.materials"
                      :key="'material' + idx"
                      :icon="material.itemDef.icon"
                      :amount="material.amount"
                      :size="3"
                    />
                  </template>
                  <template v-else>
                    <div class="progress-bar-wrapper" v-if="!structureDetails.operational">
                      <ProgressBar
                        :size="3"
                        :current="
                          (100 * structureDetails.constructionProgress) / CONSTRUCT_RESOLUTION
                        "
                        color="green"
                      />
                    </div>
                  </template>
                </Horizontal>
              </template>
              <template v-slot:buttons="{ lazyData: structureDetails }">
                <Actions :target="structureDetails" @action="showingList = false" noWrap />
              </template>
            </ListItem>
          </div>
        </template>
      </template>
    </Modal>
    <Modal dialog large v-if="showDetailsId" @close="showDetailsId = null">
      <template v-slot:title>
        <LoadingPlaceholder v-if="!showDetails" :size="4" />
        <RichText v-else :value="showDetails.name" />
      </template>
      <template v-slot:contents>
        <LoadingPlaceholder v-if="!showDetails" />
        <Vertical v-else>
          <div class="info-panel-with-icon">
            <Vertical class="info">
              <Header alt2 v-if="showDetails.name.includes(skull)">
                {{ skull }} Owner dead {{ skull }}
              </Header>
              <Header alt2 v-if="showDetails.name.includes(permanentOwner)">
                {{ permanentOwner }} Ownership will never expire
                <Help title="Ownership will never expire">
                  The owner of this building last died before the update enabling auto-abandoning
                  structures was introduced. Because of this their buildings will not be
                  automatically abandoned.
                </Help>
                {{ permanentOwner }}
              </Header>
              <Header alt2 v-if="!showDetails.operational">
                <IndicatorConstruction />
                Under construction
                <IndicatorConstruction />
              </Header>
              <div v-if="showDetails.materials && showDetails.materials.length">
                <Header alt2>Materials needed</Header>
                <HorizontalWrap tight>
                  <ItemIcon
                    v-for="(material, idx) in showDetails.materials"
                    :key="'material' + idx"
                    :icon="material.itemDef.icon"
                    :amount="material.amount"
                    :size="5"
                  />
                </HorizontalWrap>
              </div>
              <div v-else-if="!showDetails.operational">
                <Header alt2>Construction progress</Header>
                <ProgressBar
                  :size="3"
                  :current="(100 * showDetails.constructionProgress) / CONSTRUCT_RESOLUTION"
                  color="green"
                />
              </div>
              <LoadingPlaceholder v-if="!showDetailsInfo" />
              <Vertical v-else>
                <div v-if="showDetailsInfo.properties">
                  <Header alt2>Properties</Header>
                  <LabeledValue
                    v-for="(value, label) in showDetailsInfo.properties"
                    :key="label"
                    :label="label"
                  >
                    {{ value }}
                  </LabeledValue>
                  <LabeledValue v-if="showDetails.presence !== undefined" label="Someone inside">
                    <span v-if="showDetails.presence"> Yes <IndicatorPresence /> </span>
                    <span v-else>No</span>
                  </LabeledValue>
                  <LabeledValue v-if="showDetails.likeable !== undefined" label="Liked">
                    <span class="text-good">+{{ showDetails.likeable['+'] }}</span>
                    /
                    <span class="text-bad">-{{ showDetails.likeable['-'] }}</span>
                  </LabeledValue>
                  <LabeledValue v-if="showDetails.likeable !== undefined" label="Durability impact">
                    <span :class="showDetails.durabilityMultiplier >= 1 ? 'text-good' : 'text-bad'">
                      {{ (100 * showDetails.durabilityMultiplier).toFixed(0) }}%
                    </span>
                  </LabeledValue>
                </div>
                <div v-if="showDetailsInfo.climateInsulation">
                  <Header alt2>Environment protections (when inside)</Header>
                  <LabeledValue
                    v-for="(value, label) in showDetailsInfo.climateInsulation"
                    :key="label"
                    :label="label"
                  >
                    {{ value }}
                  </LabeledValue>
                </div>
                <div alt2 v-if="hasUtility(showDetailsInfo.toolUtility)">
                  <Header alt2>Tool</Header>
                  <LabeledValue
                    v-for="(efficiency, tool) in showDetailsInfo.toolUtility"
                    :key="tool"
                    :label="tool"
                  >
                    {{ efficiency }}%
                  </LabeledValue>
                </div>
              </Vertical>
            </Vertical>
            <div class="icon">
              <StructureIcon :structure="showDetails" :size="11" />
            </div>
          </div>
          <Actions
            :target="showDetails"
            @action="
              showingList = false
              showDetailsId = null
            "
          />
        </Vertical>
      </template>
    </Modal>
  </div>
</template>

<script>
import { Rx } from '@/rx.js'

export default {
  props: {
    structures: {},
    flexible: {
      type: Boolean,
    },
    header: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
    CONSTRUCT_RESOLUTION,
    showDetailsId: false,
    showingList: false,
    skull: ' ☠️',
    permanentOwner: '📜',
  }),

  subscriptions() {
    return {
      showDetails: this.$stream('showDetailsId').switchMap((showDetailsId) =>
        showDetailsId
          ? GameService.getEntityStream(showDetailsId, ENTITY_VARIANTS.DETAILS)
          : Rx.Observable.of(null),
      ),
      showDetailsInfo: this.$stream('showDetailsId').switchMap((showDetailsId) =>
        showDetailsId
          ? GameService.getInfoStream('Structure', {
              instanceId: showDetailsId,
            })
          : Rx.Observable.of(null),
      ),
      loadedStructures: this.$stream('structures')
        .switchMap((ids) => GameService.getEntitiesStream(ids))
        .map((structures) => [...structures].sort(structureSorter)),
    }
  },

  computed: {
    stackedStructures() {
      const mapped = this.loadedStructures.reduce((acc, structure) => {
        const structureId = this.getStructureId(structure)
        if (!acc[structureId]) {
          acc[structureId] = {
            ...structure,
            number: 0,
            stackId: structureId,
          }
        }
        acc[structureId].number += 1
        return acc
      }, {})

      return Object.values(mapped)
    },

    filteredStructures() {
      return this.loadedStructures?.filter(
        (structure) =>
          this.showingList === true || this.getStructureId(structure) === this.showingList,
      )
    },
  },

  methods: {
    hasUtility(utilities) {
      return utilities && Object.keys(utilities).length
    },

    getStructureDetailsStream(structure) {
      return GameService.getEntityStream(structure.id, ENTITY_VARIANTS.DETAILS)
    },

    showList(stackedStructure) {
      if (stackedStructure) {
        if (stackedStructure.number === 1) {
          this.showDetailsId = stackedStructure.id
        } else {
          this.showingList = stackedStructure.stackId
        }
      } else {
        this.showingList = true
      }
    },

    getStructureId(structure) {
      return JSON.stringify({
        icon: structure.icon,
        own: structure.own,
        presence: structure.presence,
        operational: structure.operational,
        condition: structure.condition,
        ruin: structure.ruin,
      })
    },
  },
}
</script>

<style scoped lang="scss">
.progress-bar-wrapper {
  height: 3rem;
  width: 12rem;
  min-width: 12rem;
  max-width: 50%;
}
</style>
