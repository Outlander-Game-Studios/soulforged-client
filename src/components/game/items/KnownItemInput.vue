<template>
  <div class="known-item-input">
    <ListItem>
      <template v-slot:icon>
        <ItemIcon
          v-if="internalValue"
          :icon="internalValue.icon"
          :size="6"
          :quality="internalValue.quality"
          :condition="internalValue.durabilityStage"
          class="interactive"
          @click="startSelecting()"
        />
        <ItemIcon v-else class="interactive" @click="startSelecting()" />
      </template>
      <template v-slot:title>
        <div v-if="!internalValue">None<br />selected</div>
        <RichText v-else :value="internalValue.name" />
      </template>
      <template v-slot:subtitle> </template>
      <template v-slot:buttons>
        <Button @click="startSelecting()">Select</Button>
      </template>
    </ListItem>
    <Modal dialog large v-if="selecting" @close="selecting = false">
      <template v-slot:title> Select item </template>
      <template v-slot:contents>
        <Vertical v-if="!selectedResult">
          <Input
            v-model:value="search"
            ref="itemSearchInput"
            placeholder="Search for item..."
            @input="queueSearchItems()"
          />
          <LoadingPlaceholder v-if="!results" />
          <div v-else-if="!search" class="empty-text">Enter search text to see results</div>
          <div v-else-if="!results.length" class="empty-text">No results</div>
          <ListItem v-else v-for="result in results" :key="result.publicId" :iconSrc="result.icon">
            <template v-slot:title>
              <RichText :value="result.name" />
            </template>
            <template v-slot:subtitle> </template>
            <template v-slot:buttons>
              <Button @click="selectedResult = result">Select</Button>
            </template>
          </ListItem>
          <div v-if="results && results.length >= 10" class="empty-text">
            Only up to 10 items are shown.<br />
            You may need to refine your search to find the item.
          </div>
        </Vertical>
        <Vertical v-else>
          <Horizontal>
            <Vertical>
              <ItemIcon
                :icon="selectedResult.icon"
                :size="10"
                :quality="selectedResult.qualityNames ? quality : 1"
                :condition="selectedResult.durabilityNames && durabilityStage"
              />
              <Button @click="clearResult()">Change</Button>
            </Vertical>
            <Vertical class="flex-grow">
              <Vertical v-if="selectedResult.durabilityNames">
                <Header alt2>Minimum Durability</Header>
                <div>
                  {{ selectedResult.durabilityNames[durabilityStage] }}
                </div>
                <Slider v-model:value="wornStage" :min="0" max="3" :step="1"></Slider>
              </Vertical>
              <Vertical v-if="selectedResult.qualityNames">
                <Header alt2>Minimum Quality</Header>
                <div>
                  {{ selectedResult.qualityNames[quality] }}
                </div>
                <Slider v-model:value="quality" :min="0" max="3" :step="1"></Slider>
              </Vertical>
            </Vertical>
          </Horizontal>
          <Spaced>
            <HorizontalCenter>
              <Button @click="confirmItemSelection()" :disabled="!selectedResult"> Confirm </Button>
            </HorizontalCenter>
          </Spaced>
        </Vertical>
      </template>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      default: 8,
    },
    label: {},
  },

  data: () => ({
    selectedResult: null,
    results: [],
    quality: 1,
    wornStage: 3,
    search: '',
    selecting: false,
    internalValue: null,
  }),

  computed: {
    durabilityStage() {
      return 3 - this.wornStage
    },
  },

  methods: {
    focusSearch() {
      setTimeout(() => {
        if (this.$refs.itemSearchInput) {
          this.$refs.itemSearchInput.focus()
        }
      })
    },

    startSelecting() {
      this.selecting = true
      this.focusSearch()
    },

    clearResult() {
      this.selectedResult = null
      this.focusSearch()
    },

    confirmItemSelection() {
      const value = {
        publicId: this.selectedResult.publicId,
      }
      if (this.selectedResult.qualityNames) {
        value.quality = this.quality
      }
      if (this.selectedResult.durabilityNames) {
        value.durabilityStage = this.durabilityStage
      }
      this.internalValue = {
        ...value,
        icon: this.selectedResult.icon,
        name: this.selectedResult.name,
      }
      this.$emit('update:value', value)
      this.selecting = null
    },

    queueSearchItems() {
      this.selectedResult = null
      this.results = null
      clearTimeout(this.searchTimeout)

      if (!this.search) {
        this.results = []
        return
      }

      this.searchTimeout = setTimeout(() => {
        this.searchItems()
      }, 800)
    },

    searchItems() {
      this.selectedResult = null
      this.results = null
      GameService.request(REQUEST_CODES.SEARCH_KNOWN_ITEMS, {
        query: this.search,
      }).then((results) => {
        this.results = results
      })
    },

    selectedItem(item) {
      this.internalValue = item
      this.$emit('selected', item)
      this.$emit('update:value', item)
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../../utils.scss';

.item-button {
  @include utils.interactive();

  &.selected {
    z-index: 3;
    @include utils.filter(saturate(1.1) brightness(1.5) drop-shadow(0.2rem 0.2rem 0.2rem black));
  }
}
</style>
