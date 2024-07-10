<template>
  <div class="farming-operation">
    <div v-if="!farm">
      <LoadingPlaceholder />
    </div>
    <div class="main-container" v-else>
      <CloseButton class="close-button" @click="cancel()" />
      <div class="farming-wrapper">
        <Header>Farming</Header>
        <div class="farm-plots-wrapper">
          <div class="farm-plots">
            <LoadingPlaceholder v-if="!rows" />
            <div v-else v-for="row in rows" class="farm-plot-row">
              <div
                v-for="(plot, idx) in row"
                class="farm-plot clickable"
                :style="plotStyle(plot, idx)"
                @click="clickPlot(plot, idx)"
              >
                <div
                  class="ground"
                  :style="{
                    backgroundImage: 'url(' + plot.water.image + ')',
                  }"
                />
                <div
                  class="plant"
                  v-if="plot.plant"
                  :style="{
                    backgroundImage: 'url(' + plot.plant.image + ')',
                  }"
                />
                <div class="weed" v-if="plot.weed" :style="weedStyle(plot)" />
                <div class="vermin" v-if="vermin && plot.vermin">
                  <CreatureIcon
                    :creature="vermin[idx]"
                    @click="showCreatureDetails(plot.vermin.id, $event)"
                    size="tiny"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <HorizontalCenter>
            <Vertical>
              <Container
                borderType="alt3"
                class="flex-grow quick-tool-container"
              >
                <div class="current-action-box">
                  <div class="flex-grow action-name">
                    <div class="quick-action-label">
                      {{ ACTION_NAMES[currentAction] }}
                    </div>
                    <SkillInfoDisplay
                      v-if="operation.context.skillInfo"
                      :skillData="{
                        successChance:
                          operation.context.skillInfo.successChance,
                      }"
                    />
                  </div>
                  <div
                    v-if="currentAction === FARMING_ACTIONS.PLANT"
                    class="quick-item"
                  >
                    <FieldItemSelector
                      :itemFilter="seedFilter"
                      :value="operation.context.seedId"
                      @input="selectSeed($event)"
                      :size="4"
                      compact
                      topRightText="Seed"
                    />
                  </div>
                  <div
                    v-if="currentAction === FARMING_ACTIONS.USE_LIQUID"
                    class="quick-item"
                  >
                    <FieldItemSelector
                      :itemFilter="liquidFilter"
                      :value="operation.context.liquidId"
                      @input="selectLiquid($event)"
                      :size="4"
                      compact
                      topRightText="Liquid"
                    />
                  </div>
                  <div
                    v-if="operation.context.tools.length"
                    class="tool-selector-icon"
                  >
                    <OperationToolSelector
                      :operation="operation"
                      iconOnly
                      topRightText="Tool"
                    />
                  </div>
                  <Button v-if="showActionOptions" @click="configureAction()">
                    Info
                  </Button>
                </div>
              </Container>
              <Horizontal>
                <Icon
                  :src="ICONS.NONE"
                  :size="5"
                  class="action"
                  :class="actionClass[FARMING_ACTIONS.NONE]"
                  @click="selectAction(FARMING_ACTIONS.NONE)"
                />
                <Icon
                  :src="ICONS.PLANT"
                  :size="5"
                  class="action"
                  :class="actionClass[FARMING_ACTIONS.PLANT]"
                  @click="selectAction(FARMING_ACTIONS.PLANT)"
                />
                <Icon
                  :src="ICONS.LIQUID"
                  :size="5"
                  class="action"
                  :class="actionClass[FARMING_ACTIONS.USE_LIQUID]"
                  @click="selectAction(FARMING_ACTIONS.USE_LIQUID)"
                />
                <Icon
                  :src="ICONS.HARVEST"
                  :size="5"
                  class="action"
                  :class="actionClass[FARMING_ACTIONS.HARVEST]"
                  @click="selectAction(FARMING_ACTIONS.HARVEST)"
                />
                <Icon
                  :src="ICONS.WEEDOUT"
                  :size="5"
                  class="action"
                  :class="actionClass[FARMING_ACTIONS.WEEDOUT]"
                  @click="selectAction(FARMING_ACTIONS.WEEDOUT)"
                />
                <Icon
                  :src="ICONS.UPROOT"
                  :size="5"
                  class="action"
                  :class="actionClass[FARMING_ACTIONS.UPROOT]"
                  @click="selectAction(FARMING_ACTIONS.UPROOT)"
                />
              </Horizontal>
            </Vertical>
          </HorizontalCenter>
        </div>
      </div>
      <CreatureDetailsModal
        :creatureId="showCreatureDetailsId"
        @close="showCreatureDetailsId = null"
      />
    </div>
    <Modal v-if="viewDetailsIdx" dialog large @close="viewDetailsIdx = null">
      <template v-slot:title> Plot inspection </template>
      <template v-slot:contents>
        <Horizontal>
          <div class="farm-plots">
            <div class="farm-plot-row">
              <div
                class="farm-plot"
                :style="plotStyle(viewDetails, viewDetailsIdx)"
                @click="clickPlot(viewDetails, viewDetailsIdx)"
              >
                <div
                  class="ground"
                  :style="{
                    backgroundImage: 'url(' + viewDetails.water.image + ')',
                  }"
                />
                <div
                  class="plant"
                  v-if="viewDetails.plant"
                  :style="{
                    backgroundImage: 'url(' + viewDetails.plant.image + ')',
                  }"
                />
                <div
                  class="weed"
                  v-if="viewDetails.weed"
                  :style="weedStyle(viewDetails)"
                />
              </div>
            </div>
          </div>
          <div class="flex-grow">
            <LabeledValue label="Plant">
              <RichText
                v-if="viewDetails.plant"
                :value="viewDetails.plant.name"
              />
              <span v-else class="text-none">None</span>
            </LabeledValue>
            <LabeledValue label="Moisture">
              {{ viewDetails.water.label }}
            </LabeledValue>
            <LabeledValue label="Environment">
              <span v-if="viewDetails.environmentSuitability">
                {{ viewDetails.environmentSuitability }}
              </span>
              <span v-else class="text-none">No plant</span>
            </LabeledValue>
            <LabeledValue label="Vermin">
              <RichText
                v-if="vermin[viewDetailsIdx]"
                :value="vermin[viewDetailsIdx].name"
              />
              <span v-else class="text-none">None</span>
            </LabeledValue>
            <LabeledValue label="Weed">
              <RichText
                v-if="viewDetails.weed"
                :value="viewDetails.weed.name"
              />
              <span v-else class="text-none">None</span>
            </LabeledValue>
          </div>
          <div>
            <CreatureIcon
              v-if="viewDetails.vermin"
              :creature="vermin[viewDetailsIdx]"
              @click="showCreatureDetailsId = viewDetails.vermin.id"
              size="large"
            />
          </div>
        </Horizontal>
      </template>
    </Modal>
    <Modal v-if="removingPlant" dialog @close="removingPlant = false">
      <template v-slot:title> Remove plant </template>
      <template v-slot:contents>
        <div class="empty-text">
          Are you sure you want to remove the plant?<br />
          The crop yield will be lost completely.
        </div>
        <HorizontalCenter>
          <Button @click="confirmRemove()">Confirm</Button>
        </HorizontalCenter>
      </template>
    </Modal>
    <Modal v-if="configuring" dialog large @close="configuring = false">
      <template v-slot:title> Info </template>
      <template v-slot:contents>
        <Vertical>
          <APBarCurrent v-if="!!currentAPCost" />
          <Description prominent>
            {{ ACTION_DESCRIPTION[currentAction] }}
          </Description>
          <HorizontalFill>
            <OperationToolSelector :operation="operation" class="not-flex" />
            <div
              v-if="currentAction === FARMING_ACTIONS.USE_LIQUID"
              class="selector-container"
            >
              <Header alt2 small>Liquid</Header>
              <FieldItemSelector
                :itemFilter="liquidFilter"
                :value="operation.context.liquidId"
                @input="selectLiquid($event)"
                :size="5"
              />
            </div>
            <div
              v-if="currentAction === FARMING_ACTIONS.PLANT"
              class="selector-container"
            >
              <Header alt2 small>Seed</Header>
              <FieldItemSelector
                :itemFilter="seedFilter"
                :value="operation.context.seedId"
                @input="selectSeed($event)"
                :size="5"
              />
            </div>
          </HorizontalFill>
          <Spaced>
            <SkillInfoDisplay :operation="operation" />
          </Spaced>
        </Vertical>
      </template>
    </Modal>
    <Modal v-if="weedingOut" dialog large @close="weedingOut = false">
      <template v-slot:title> Cleanup weeds </template>
      <template v-slot:contents>
        <Vertical>
          <APBarCurrent />
          <SkillInfoDisplay :operation="operation" />
          <HorizontalCenter>
            <Button @click="commence()"> Confirm </Button>
          </HorizontalCenter>
        </Vertical>
      </template>
    </Modal>
    <Modal v-if="harvesting" dialog @close="finishHarvest()">
      <template v-slot:title> Harvest </template>
      <template v-slot:contents>
        <Vertical>
          <div v-if="!harvestingProcessing">
            <APBarCurrent />
            <Spaced>
              <SkillInfoDisplay :operation="operation" />
            </Spaced>
            <HorizontalCenter>
              <Button @click="commence()"> Confirm </Button>
            </HorizontalCenter>
          </div>
          <div v-else class="harvest-result">
            <Header alt2>Results</Header>
            <div class="modifiers">
              <div
                v-for="(value, type) in harvestResult
                  ? harvestResult.modifiers
                  : []"
                :key="'mod_' + type"
                class="modifier"
              >
                <div class="name">
                  {{ MODIFIER_NAMES[type] }}
                </div>
                <div class="star-container">
                  <StarRating :value="value" :max="4" :size="1.5" />
                </div>
              </div>
              <div v-if="harvestResult" class="yield" key="yield">
                <div>
                  <Header alt2>Final yield</Header>
                  <ItemIcon
                    class="yield-icon"
                    :class="{ final: harvestResultAmountFinal }"
                    :size="8"
                    :icon="harvestResult.item.icon"
                    :amount="harvestResultAmount"
                  />
                </div>
              </div>
            </div>
            <HorizontalCenter>
              <Button @click="finishHarvest()"> Close </Button>
            </HorizontalCenter>
          </div>
        </Vertical>
      </template>
    </Modal>
  </div>
</template>

<script>
import liquidIcon from "../operation-assets/farm_liquid.jpg";
import plantIcon from "../operation-assets/farm_plant.jpg";
import harvestIcon from "../operation-assets/farm_harvest.jpg";
import uprootIcon from "../operation-assets/farm_uproot.jpg";
import weedoutIcon from "../operation-assets/farm_weedout.jpg";
import inspectIcon from "../operation-assets/farm_lookup.jpg";
import farmingWater from "../../../assets/sounds/farming-water.mp3";

const ACTION_NAMES = {
  [FARMING_ACTIONS.NONE]: "Inspect",
  [FARMING_ACTIONS.UPROOT]: "Remove plant",
  [FARMING_ACTIONS.PLANT]: "Sow",
  [FARMING_ACTIONS.HARVEST]: "Harvest",
  [FARMING_ACTIONS.WEEDOUT]: "Cleanup weeds",
  [FARMING_ACTIONS.USE_LIQUID]: "Use liquid",
};

const ACTION_DESCRIPTION = {
  [FARMING_ACTIONS.NONE]:
    "Inspect a plot to display more information about that plot and plant that might be there.",
  [FARMING_ACTIONS.UPROOT]:
    "Forcibly remove the plant from a plot. This will destroy any produce this plant could yield.",
  [FARMING_ACTIONS.PLANT]:
    "Place the selected seed onto a plot. The difficulty depends on the type of seed select.",
  [FARMING_ACTIONS.HARVEST]:
    "Harvest the plant from a plot. Only fully grown plants can be harvested.",
  [FARMING_ACTIONS.WEEDOUT]: "Remove the weeds from a plot.",
  [FARMING_ACTIONS.USE_LIQUID]:
    "Add liquid to a plot, increasing its watering level.",
};

const MODIFIER_NAMES = {
  ground: "Ground",
  climate: "Environment",
  wateringMinus: "Drought",
  wateringPlus: "Flood",
  vermin: "Vermin control",
  weed: "Weed control",
  plantQuality: "Sowing skill",
  harvestQuality: "Harvest skill",
};

export default window.OperationFarming = {
  props: {
    operation: {},
  },

  data: () => ({
    processing: false,
    showCreatureDetailsId: null,
    selectedItem: null,
    currentAction: FARMING_ACTIONS.NONE,
    viewDetailsIdx: null,
    configuring: false,
    removingPlant: null,
    weedingOut: false,
    harvesting: false,
    harvestingProcessing: false,
    harvestResult: null,
    harvestResultAmount: 0,
    harvestResultAmountFinal: false,
    liquidFilter: (item) =>
      item.actions.some((action) => action.actionId === "drink"),
    seedFilter: (item) => item.category === 350,
    ICONS: {},
    ACTION_NAMES,
    ACTION_DESCRIPTION,
    FARMING_ACTIONS,
    MODIFIER_NAMES,
  }),

  subscriptions() {
    const farmStream = this.$stream("operation")
      .filter((operation) => !!operation.context.farmId)
      .switchMap((operation) =>
        GameService.getEntityStream(
          operation.context.farmId,
          ENTITY_VARIANTS.DETAILS
        )
      );
    const plotsStream = farmStream
      .map((farm) => farm.plots)
      .switchMap((ids) => GameService.getEntitiesStream(ids));
    return {
      currentAPCost: ControlsService.getConsideredAPStream(),
      initAction: this.$stream("operation").tap((operation) => {
        this.currentAction = operation.context.action;
      }),
      backdropImage: GameService.getBackdropStyleStream(),
      farm: farmStream,
      plots: plotsStream,
      vermin: plotsStream
        .map((plots) => plots.map((plot) => plot.vermin && plot.vermin.id))
        .switchMap((verminIds) =>
          Rx.combineLatest(
            verminIds.map((id) =>
              id
                ? GameService.getEntityStream(id, ENTITY_VARIANTS.DETAILS)
                : Rx.Observable.of(null)
            )
          ).map((vermin) => vermin.map((v) => (!!v && !v.dead ? v : null)))
        ),
    };
  },

  computed: {
    showActionOptions() {
      return true;
      // return [
      //   FARMING_ACTIONS.PLANT,
      //   FARMING_ACTIONS.USE_LIQUID,
      //   FARMING_ACTIONS.HARVEST,
      // ].includes(this.currentAction);
    },

    viewDetails() {
      return this.plots[this.viewDetailsIdx];
    },

    actionClass() {
      return {
        [this.currentAction]: ["selected"],
      };
    },

    rows() {
      if (!this.farm || !this.plots) {
        return null;
      }
      const [width, height] = this.farm.farmSize;
      return Array.create(height).map((_, rowIdx) =>
        Array.create(width)
          .map((_, idx) => rowIdx * width + idx)
          .toObject(
            (plotIdx) => plotIdx,
            (plotIdx) => this.plots[plotIdx]
          )
      );
    },

    consideredAP() {
      ControlsService.updateConsideredAP(this.amount * this.unitCost);
    },

    unitCost() {
      return this.operation.context.unitCost;
    },
  },

  watch: {
    operation() {
      this.updateConsideredAP();
    },
    amount() {
      this.updateConsideredAP();
    },
  },

  mounted() {
    this.updateConsideredAP();
    this.ICONS = {
      PLANT: GameService.getSecureResource(plantIcon),
      LIQUID: GameService.getSecureResource(liquidIcon),
      HARVEST: GameService.getSecureResource(harvestIcon),
      UPROOT: GameService.getSecureResource(uprootIcon),
      WEEDOUT: GameService.getSecureResource(weedoutIcon),
      NONE: GameService.getSecureResource(inspectIcon),
    };
  },

  beforeDestroy() {
    ControlsService.updateConsideredAP(0);
  },

  methods: {
    ucFirst,

    showCreatureDetails(verminId, $event) {
      this.showCreatureDetailsId = verminId;
      $event.stopPropagation();
    },

    selectLiquid(liquidItemId) {
      GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
        updateType: "selectLiquid",
        liquidId: liquidItemId,
      }).then((response) => {
        if (!response.ok) {
          ToastError(response.message);
        }
      });
    },
    selectSeed(seedItemId) {
      GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
        updateType: "selectSeed",
        seedId: seedItemId,
      }).then((response) => {
        if (!response.ok) {
          ToastError(response.message);
        }
      });
    },

    configureAction() {
      this.configuring = true;
    },

    clickPlot(plot, idx) {
      switch (this.currentAction) {
        case FARMING_ACTIONS.NONE:
          this.viewDetailsIdx = idx;
          break;
        case FARMING_ACTIONS.UPROOT:
          if (plot.plant) {
            this.selectPlot(idx).then(() => {
              this.removingPlant = true;
            });
          } else {
            ToastError("There is no plant in this plot");
          }
          break;
        case FARMING_ACTIONS.WEEDOUT:
          this.selectPlot(idx).then(() => {
            this.weedingOut = true;
          });
          break;
        case FARMING_ACTIONS.HARVEST:
          if (plot.plant) {
            this.selectPlot(idx).then(() => {
              this.harvesting = true;
            });
          } else {
            ToastError("There is no plant in this plot");
          }
          break;
        default:
          this.commence({ plotIdx: idx });
      }
    },

    selectPlot(plotIdx) {
      return GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
        updateType: "selectPlot",
        plotIdx: plotIdx,
      }).then((response) => {
        if (!response.ok) {
          ToastError(response.message);
        }
        return response;
      });
    },

    commence(params = {}) {
      if (this.currentAction === FARMING_ACTIONS.HARVEST) {
        this.harvestingProcessing = true;
      }
      return GameService.request(REQUEST_CODES.COMMENCE_OPERATION, params).then(
        (response) => {
          if (response && response.statusChanges) {
            ToastNotify(response.statusChanges);
          }
          if (this.currentAction === FARMING_ACTIONS.USE_LIQUID && !response) {
            SoundService.playSound(farmingWater);
          }
          if (this.currentAction === FARMING_ACTIONS.HARVEST) {
            if (response.modifiers) {
              this.harvestResult = response;
              this.harvestResultAmount = 0;
              this.harvestResultAmountFinal = false;
              this.updateHarvestResultAmount();
            } else {
              this.finishHarvest();
            }
          }
          this.weedingOut = false;
          return response;
        }
      );
    },

    updateHarvestResultAmount() {
      if (this.harvestResult) {
        const delta = this.harvestResult.amount - this.harvestResultAmount;
        if (delta > 0) {
          this.harvestResultAmount += Math.floor(Math.max(1, 0.02 * delta));
          const delay = 5 + Math.max(0, 40 - delta) * 2.25;
          ControlsService.setAnimationTimeout(() => {
            this.updateHarvestResultAmount();
          }, delay);
        } else if (this.harvestResultAmount > 0) {
          this.harvestResultAmountFinal = true;
        }
      }
    },

    // harvestResult.amount

    finishHarvest() {
      this.harvesting = false;
      this.harvestingProcessing = false;
      this.harvestResult = null;
    },

    confirmRemove() {
      this.commence().then(() => {
        this.removingPlant = false;
      });
    },

    selectAction(action) {
      GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
        updateType: "action",
        action: action,
      }).then((response) => {
        if (response.ok) {
          this.currentAction = action;
        } else {
          ToastError(response.message);
        }
      });
    },

    plotStyle(plot, idx) {
      return {
        zIndex: idx,
      };
    },

    weedStyle(plot) {
      const base = random.number(1, 1000, plot.id);
      const x = 50 + 25 * Math.sin(base);
      const y = 50 + 25 * Math.abs(Math.cos(base));
      return {
        top: y + "%",
        left: x + "%",
        zIndex: y > 50 ? 4 : 2,
        backgroundImage: "url(" + plot.weed.image + ")",
      };
    },

    cancel() {
      GameService.request(REQUEST_CODES.CANCEL_OPERATION);
    },

    updateConsideredAP() {
      ControlsService.updateConsideredAP(this.unitCost);
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../utils.scss";

.close-button {
  z-index: 10;
}

.farming-wrapper {
  max-height: calc(var(--app-height) - 20rem) !important;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.main-container {
  .farm-plots-wrapper {
    overflow: auto;
    min-height: 10rem;
    flex-grow: 1;
    justify-content: center;
    flex-direction: row;
    display: flex;
  }
}
.quick-item,
.tool-selector-icon {
  padding-top: 0.4rem;
  padding-right: 0.4rem;
}
.farm-plots {
  $plant-height: 16.5rem;
  $plant-width: 10.5rem;
  $size: 8rem;
  padding-top: $plant-height - $size + 1rem;
  padding-bottom: 1.5rem;
  display: flex;
  flex-direction: column;

  .breaker {
    flex-basis: 100%;
  }

  .farm-plot-row {
    display: flex;
    margin-right: 1.5rem;
    margin-left: 1.5rem;
  }

  .farm-plot {
    width: $size;
    min-width: $size;
    height: $size;
    position: relative;

    &.clickable {
      cursor: pointer;

      &:hover {
        filter: brightness(1.3);
      }
    }

    .ground {
      $overlap: 0.25;
      pointer-events: none;
      position: absolute;
      width: (1 + $overlap) * $size;
      height: (1 + $overlap) * $size;
      left: calc(-1 * ($overlap / 2) * $size);
      top: calc(-1 * ($overlap / 2) * $size);
      z-index: 1;
      background-size: 100% 100%;
    }
    .plant {
      $plant-spacing: calc(($size - $plant-width) / 2);
      pointer-events: none;
      width: $plant-width;
      height: $plant-height;
      left: $plant-spacing;
      bottom: $plant-spacing;
      position: absolute;
      z-index: 3;
      background-size: 100% 100%;
    }
    .weed {
      pointer-events: none;
      $weed-size: calc($size / 2);
      width: $weed-size;
      height: $weed-size;
      margin-top: calc($weed-size / -2);
      margin-left: calc($weed-size / -2);
      background-size: 100% 100%;

      position: absolute;
    }
    .vermin {
      position: absolute;
      bottom: 0;
      right: 0;
      z-index: 4;
    }
  }
}

.action {
  padding: 0.3rem;
  @include filter(saturate(1.8) brightness(1.2));

  &:not(.selected) {
    opacity: 0.66;
    @include interactive();
    @include filter(brightness(0.7));
  }
}

.action-name {
  text-align: left;
  padding-left: 2rem;
  font-size: 65%;
  justify-content: center;
  display: flex;
  flex-direction: column;
  height: 4.5rem;

  .quick-action-label {
    font-size: 200%;
    @include text-outline();
  }
}

.text-none {
  opacity: 0.5;
}

@keyframes yield-final {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.3);
    filter: brightness(1.5);
  }
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
}

.harvest-result {
  .modifiers {
    display: flex;
    flex-wrap: wrap;
    max-width: min(90vw, 44rem);
    justify-content: space-around;
    padding-top: 2rem;

    .modifier {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      padding-bottom: 2rem;
      width: 9.5rem;

      .star-container {
        width: 7rem;
        margin: 0 auto;
      }
    }

    .name {
      text-align: center;
      font-size: 90%;
      font-style: italic;
      padding: 0.2rem 0;
      vertical-align: middle;
      justify-content: center;
      display: flex;
      flex-direction: column;
      height: 4.5rem;
    }
  }

  .yield {
    flex-basis: 100%;
    display: flex;
    justify-content: center;
    padding: 1rem;

    .yield-icon {
      margin: 0.5rem auto 0;
      z-index: 5;
      position: relative;

      &.final {
        animation: yield-final 0.8s ease-out forwards;
      }
    }
  }
}

.not-flex {
  display: block !important;
}
.current-action-box {
  display: flex;
}
.selector-container {
  min-width: 20rem;
  margin: 0 auto;
}
.quick-tool-container {
  padding: 0.25rem;
}
</style>
