<template>
  <div>
    <div class="research-panel">
      <TopZIndex>
        <transition name="slide">
          <div
            v-if="selectedResearch && !selectedResearch.completed"
            :key="selectedResearchId"
            class="item-selection-wrapper"
          >
            <Container
              borderType="alt"
              :borderSize="1.2"
              class="item-selection"
            >
              <Header>
                <RichText :value="selectedResearch.title" />
              </Header>
              <Description>
                <Spaced>
                  <RichText :value="selectedResearch.description" />
                </Spaced>
              </Description>
              <Checkbox
                :disabled="processingFav"
                @input="toggleFav($event)"
                :value="selectedResearch.fav"
              >
                Favourite
              </Checkbox>
              <Header alt2>
                Use items (x{{ selectedResearch.difficulty }})
              </Header>
              <HorizontalWrap
                tight
                v-if="playerInventory && playerInventory.length > 0"
              >
                <ItemCollectAnimation
                  v-for="(item, idx) in playerInventory"
                  :ref="'item_' + item.id"
                  :key="'item_' + item.id"
                  class="item"
                  :class="{
                    invalid: invalidItems[item.publicId] || item.isRuined,
                    interactive: !invalidItems[item.publicId] && !item.isRuined,
                  }"
                  :icon="item.icon"
                  :amount="item.amount"
                  :quality="item.quality"
                  :condition="item.durabilityStage"
                  :isEquipped="equipmentMap && equipmentMap[item.id]"
                  :size="5"
                  gainPrefix="-"
                  v-on="
                    invalidItems[item.publicId] || item.isRuined
                      ? {}
                      : { click: () => selectItem(item) }
                  "
                />
              </HorizontalWrap>
              <div v-else class="empty-text">Inventory Empty</div>
              <Header alt2>Attempted items</Header>
              <div v-if="!selectedResearch.failedItems.length">
                <div class="empty-text">None</div>
              </div>
              <div v-else>
                <HorizontalWrap tight>
                  <ItemIcon
                    v-for="(item, idx) in selectedResearch.failedItems"
                    :key="idx"
                    :icon="item.icon"
                    :amount="selectedResearch.difficulty"
                    quality="bad"
                  />
                </HorizontalWrap>
              </div>
            </Container>
          </div>
        </transition>
      </TopZIndex>
      <div class="researches">
        <Header>Research</Header>
        <Radio v-model="displayMode" option="favourites">
          Only favourites
        </Radio>
        <Radio v-model="displayMode" option="wip"> In Progress </Radio>
        <Radio v-model="displayMode" option="completed"> Completed </Radio>
        <Spaced>
          <div v-if="!researches"><LoadingPlaceholder /></div>
          <div v-else-if="!researches.length" class="empty-text">None</div>
          <div v-else>
            <Vertical>
              <ResearchCard
                v-for="research in researches"
                :key="research.researchId"
                class="research-item"
                :class="[
                  'research-' + research.researchId,
                  {
                    selected: research.researchId === selectedResearchId,
                  },
                ]"
                @click="selectResearch(research)"
                :research="research"
              />
            </Vertical>
          </div>
        </Spaced>
      </div>
    </div>
    <Modal dialog v-if="selectingItem" @close="selectingItem = null">
      <template v-slot:title>
        Use
        <RichText :value="selectingItem.name" />
        ({{ selectedResearch.difficulty }})
      </template>
      <template v-slot:contents>
        <Vertical>
          <Horizontal>
            <ItemIcon
              :icon="selectingItem.icon"
              :amount="'x' + selectedResearch.difficulty"
            />
            <div>Are you sure you want to use this item?</div>
          </Horizontal>
          <Button @click="confirmSelectingItem()">Confirm</Button>
        </Vertical>
      </template>
    </Modal>
    <Modal dialog large v-if="discovery" @close="discoveryId = null">
      <template v-slot:title> New discovery! </template>
      <template v-slot:contents>
        <Vertical>
          <ResearchCard
            class="research-item"
            :research="discovery"
            animateRewards
            @action="discoveryId = null"
          />
          <HorizontalCenter>
            <Button @click="discoveryId = null"> Continue </Button>
          </HorizontalCenter>
        </Vertical>
      </template>
    </Modal>
  </div>
</template>

<script>
import exclamationIcon from "../../../assets/ui/cartoon/icons/exclamation.png";

export default {
  data: () => ({
    displayMode: null,
    selectedResearchId: null,
    viewMissed: null,
    discoveryId: null,
    processingFav: false,
    forceUpdate: false,
    appliedMaterials: {},
    selectingItem: false,
  }),

  subscriptions() {
    const mainEntity = GameService.getRootEntityStream();
    const delay = 800;
    const inventoryStream = GameService.getInventoryStream(mainEntity);
    const researchesStream = GameService.getResearchesStream();

    return {
      playerInventory: Rx.Observable.merge(
        inventoryStream.first(),
        inventoryStream.delay(delay)
      ).map((items) => items.filter((item) => !!item).sort(itemSorter)),
      allResearches: researchesStream,
      researches: Rx.combineLatest([
        this.$stream("displayMode"),
        Rx.Observable.merge(
          researchesStream.first(),
          researchesStream.switchMap((researches) => {
            if (this.forceUpdate) {
              this.forceUpdate = false;
              return Rx.Observable.of(researches);
            } else {
              return Rx.Observable.of(researches).delay(delay);
            }
          })
        ),
      ]).map(([displayMode, researches]) =>
        researches
          .filter(
            (r) =>
              (displayMode === "completed" && !!r.completed) ||
              (displayMode === "wip" && !r.completed) ||
              (displayMode === "favourites" && !!r.fav)
          )
          .reverse()
          .sort((a, b) => {
            if (a.fav !== b.fav) {
              return a.fav ? -1 : 1;
            }
            return 0;
          })
      ),
      equipmentMap: GameService.getEquipmentMapStream(),
    };
  },

  watch: {
    displayMode() {
      LocalStorageService.setItem("ResearchDisplayMode", this.displayMode);
    },
  },

  computed: {
    discovery() {
      const discovery =
        this.discoveryId &&
        this.allResearches &&
        this.allResearches.find((r) => r.researchId === this.discoveryId);
      if (discovery && discovery.completed) {
        return discovery;
      }
      return null;
    },

    selectedResearch() {
      const research =
        this.selectedResearchId &&
        this.researches &&
        this.researches.find((r) => r.researchId === this.selectedResearchId);
      if (research && research.completed) {
        this.selectedResearchId = null;
        return null;
      }
      return research;
    },

    invalidItems() {
      return [
        ...(this.selectedResearch?.passedItems || []),
        ...(this.selectedResearch?.failedItems || []),
      ].toObject(
        (item) => item.publicId,
        () => true
      );
    },
  },

  created() {
    this.displayMode = LocalStorageService.getItem(
      "ResearchDisplayMode",
      "wip"
    );
  },

  methods: {
    selectItem(item) {
      this.selectingItem = item;
    },

    confirmSelectingItem() {
      this.applyMaterial({
        itemId: this.selectingItem.id,
      });
      this.selectingItem = null;
    },

    selectResearch(research) {
      const { researchId } = research;
      if (this.selectedResearchId === researchId) {
        this.selectedResearchId = null;
      } else if (!research.completed) {
        this.selectedResearchId = researchId;
        if (!research.seen) {
          GameService.request(REQUEST_CODES.RESEARCH_MARK_SEEN, {
            researchId,
          }).then(() => {
            GameService.fetchResearchUpdate(researchId);
          });
        }
      }
    },

    toggleFav(value) {
      if (this.selectedResearch.fav === value) {
        return;
      }
      const researchId = this.selectedResearch.researchId;
      this.processingFav = true;
      GameService.request(REQUEST_CODES.RESEARCH_MARK_FAV, {
        researchId: researchId,
        fav: value,
      })
        .then(() => {
          GameService.fetchResearchUpdate(researchId);
          this.forceUpdate = true;
          this.processingFav = false;
          if (value) {
            setTimeout(() => {
              this.scrollToResearch(researchId);
            }, 80);
          }
        })
        .catch(() => {
          this.processingFav = false;
        });
    },

    scrollToResearch(researchId) {
      document.querySelector(`.research-${researchId}`).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },

    applyMaterial({ itemId }) {
      const researchId = this.selectedResearchId;
      this.applyMaterialOnce({
        itemId,
        researchId,
      });
    },
    applyMaterialOnce({ itemId, researchId }) {
      const key = `${itemId}:${researchId}`;
      if (this.appliedMaterials[key]) {
        return;
      }
      this.appliedMaterials[key] = true;
      GameService.request(REQUEST_CODES.RESEARCH, {
        itemId,
        researchId,
      }).then((result) => {
        if (result.ok === false) {
          ToastNotify({
            icon: exclamationIcon,
            text: "Action Interrupted",
            subtext: result.message,
          });
          return;
        }
        const selector = result.match
          ? `.research-${researchId} .item-icon.unknown`
          : `.research-${researchId} .bin-icon`;
        this.$refs["item_" + itemId].first().apiAddCollected(
          {
            results: Array.create(this.selectedResearch.difficulty).map(() => ({
              gain: 1,
              targetSize: 1,
            })),
          },
          selector
        );
        GameService.fetchResearchUpdate(researchId);
        if (result.completed) {
          ControlsService.setAnimationTimeout(() => {
            this.discoveryId = researchId;
          }, 800);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../utils.scss";

.research-panel {
  display: flex;

  @media (orientation: portrait) {
    min-height: calc(0.4 * var(--app-height));
  }

  .researches {
    flex-grow: 1;

    @media (orientation: portrait) {
      width: auto;
    }
  }
}

.item-selection-wrapper {
  position: fixed;
  z-index: 20;
  opacity: 1;

  .item.invalid {
    pointer-events: none;
    z-index: 5;
    @include filter(saturate(0));
  }
  .item-selection {
    overflow: visible;
    transform: translateZ(0);
  }

  @media (orientation: portrait) {
    margin-bottom: -1rem;
    bottom: 40rem;
    left: 0;

    .item-selection {
      margin-bottom: 1rem;
      max-height: calc(0.35 * var(--app-height));
      overflow: auto;
    }

    &.slide-enter,
    &.slide-leave-to {
      margin-bottom: -5rem;
      opacity: 0;
    }
  }

  @media (orientation: landscape) {
    margin-right: -1rem;
    margin-top: 4rem;
    min-width: 34rem;
    max-width: 34rem;
    right: 40rem;
    top: 0;

    .item-selection {
      margin-right: 1rem;
      max-height: calc(0.45 * var(--app-height));
      overflow: auto;
    }

    &.slide-enter,
    &.slide-leave-to {
      margin-right: -5rem;
      opacity: 0;
    }
  }

  &.slide-enter-active,
  &.slide-leave-active {
    transition: margin 0.3s, opacity 0.3s;
  }
}

.diagram-wrapper {
  overflow: hidden;
}
.inventory-list {
  display: flex;
}
</style>
