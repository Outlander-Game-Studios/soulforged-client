<template>
  <div v-if="!cards" class="empty-category">
    <LoadingPlaceholder />
  </div>
  <div v-else-if="!cards.length">You have not discovered this category yet</div>
  <div v-else class="card-display">
    <Horizontal>
      <div class="flex-grow">
        <Horizontal>
          <Checkbox v-model="onlyCollected"> Show only collected </Checkbox>
        </Horizontal>
        <div>
          <LabeledValue label="Collected">
            {{ collectedCount }} / {{ allCount }}
          </LabeledValue>
        </div>
      </div>
      <div>
        <Select v-model="chapterSelected" :options="chapters" />
      </div>
    </Horizontal>
    <div class="cards">
      <CollectionCard
        v-for="(item, idx) in shownCards"
        class="single-card"
        :key="idx"
        :cardInfo="item"
      />
    </div>
    <HorizontalCenter v-if="collectedCount || (!onlyCollected && allCount)">
      <OptionSelector
        :label="'Page: ' + (page + 1) + ' / ' + maxPages"
        v-model="page"
        :options="pages"
      />
    </HorizontalCenter>
  </div>
</template>

<script>
export default {
  props: {
    categoryIdx: {},
    landscape: {
      default: false,
    },
  },

  data: () => ({
    onlyCollected: null,
    page: 0,
    chapterSelected: "",
    chapters: {
      0: "All Chapters",
      ...Array.create(2).toObject(
        (_, idx) => idx + 1,
        (_, idx) => `Chapter ${idx + 1}`
      ),
    },
  }),

  watch: {
    onlyCollected() {
      LocalStorageService.setItem("onlyCollected", this.onlyCollected);
    },
    chapterSelected() {
      LocalStorageService.setItem("collections-chapter", this.chapterSelected);
    },
  },

  computed: {
    chapterCards() {
      const chapterSelected = +this.chapterSelected;
      return this.cards.filter(
        (c) => !chapterSelected || c.chapter === chapterSelected
      );
    },
    collectedCards() {
      return this.chapterCards.filter((c) => !!c.name);
    },
    filteredCards() {
      return this.onlyCollected ? this.collectedCards : this.chapterCards;
    },
    collectedCount() {
      return this.collectedCards.length;
    },
    allCount() {
      return this.chapterCards.length;
    },
    perPage() {
      return this.landscape ? 10 : 9;
    },
    pages() {
      const pages = Array.create(
        Math.ceil((this.filteredCards?.length || 1) / this.perPage)
      ).map((_, idx) => idx);
      this.page = Math.max(0, Math.min(this.page, pages.length - 1));
      return pages;
    },
    maxPages() {
      return this.pages?.length;
    },
    shownCards() {
      return this.filteredCards
        ?.slice(
          this.page * this.perPage,
          this.page * this.perPage + this.perPage
        )
        .map(
          (c) =>
            c && {
              ...c,
              collectibleDetails: c.collectibleDetails
                ? JSON.parse(c.collectibleDetails)
                : null,
            }
        );
    },
  },

  subscriptions() {
    return {
      cards: this.$stream("categoryIdx").switchMap((categoryIdx) =>
        GameService.getInfoStream("Collectible", { categoryIdx }, true)
      ),
    };
  },

  created() {
    this.onlyCollected = LocalStorageService.getItem("onlyCollected", true);
    this.chapterSelected = LocalStorageService.getItem(
      "collections-chapter",
      0
    );
  },
};
</script>

<style scoped lang="scss">
.card-display {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  .cards {
    flex-grow: 1;

    margin: 0 auto;

    .single-card {
      display: inline-block;
      margin: 0 1em;
    }

    @media (orientation: landscape) {
      width: calc(1.1 * var(--app-min-size));

      .single-card {
        margin: 1em 0.5em;
      }
    }

    @media (orientation: portrait) {
      width: calc(0.72 * var(--app-width));
      justify-content: start;
      margin: 0 auto;
    }
  }
}

.empty-category {
  font-size: 130%;
  text-align: center;
  padding: 3rem;
  font-style: italic;
}
</style>
