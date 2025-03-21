<template>
  <div class="collection-display-component">
    <TopZIndex>
      <div class="collection-display-wrapper">
        <LoadingPlaceholder v-if="!categories" />
        <template v-else>
          <HorizontalFill tight>
            <Header class="flex-grow">Collections</Header>
            <CloseButton static @click="$emit('close')" />
          </HorizontalFill>
          <Tabs v-if="landscape" placement="left" url="collection" flex ref="tabs">
            <template v-slot:header:Undiscovered>
              <span class="undiscovered-label">Undiscovered</span>
            </template>
            <template v-slot:header:Story_Chapters>
              <span class="community-label">Story Chapters</span>
            </template>
            <Tab :header="label" v-for="(label, value) in categories" :key="value" flex>
              <CollectionCardsDisplay :categoryIdx="value" :landscape="landscape" />
            </Tab>
          </Tabs>
          <div v-else class="vertical-tight">
            <HorizontalFill>
              <Select v-model:value="currentCollection" :options="categories">
                <template v-slot:option="{ label }">
                  <span
                    :class="{
                      'undiscovered-label': label === 'Undiscovered',
                      'community-label': label === 'Story Chapters',
                    }"
                  >
                    {{ label }}
                  </span>
                </template>
              </Select>
            </HorizontalFill>
            <div class="flex-grow shrink">
              <Container>
                <CollectionCardsDisplay
                  :key="currentCollection"
                  :categoryIdx="currentCollection"
                  :landscape="landscape"
                />
              </Container>
            </div>
          </div>
        </template>
      </div>
    </TopZIndex>
  </div>
</template>

<script>
export default rxComponent({
  data: () => ({
    landscape: false,
    currentCollection: null,
  }),

  subscriptions() {
    return {
      categories: GameService.getInfoStream('Collectible', {}, true),
    }
  },

  created() {
    this.handleResize()
    this.handler = this.handleResize.bind(this)
    window.addEventListener('resize', this.handler)
  },

  destroyed() {
    window.removeEventListener('resize', this.handler)
  },

  methods: {
    handleResize() {
      this.landscape = isScreenOrientationLandscape()
    },

    showCategory(categoryIdx) {
      this.$stream('categories')
        .filter((c) => !!c)
        .first()
        .subscribe(() => {
          this.currentCollection = categoryIdx
          if (this.$refs.tabs) {
            this.$refs.tabs.setActive(this.$refs.tabs.tabs[categoryIdx])
          }
        })
    },
  },
})
</script>

<style scoped lang="scss">
@use '../../../utils.scss';

.collection-display-wrapper {
  background: #150a03;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  z-index: 1100;
}

.undiscovered-label {
  opacity: 0.4;
}

.community-label {
  background-image: utils.ui-asset('/icons/story.png', '../');
  padding-left: 2.8rem;
  background-size: auto 100%;
  background-repeat: no-repeat;
}

.vertical-tight {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
</style>
