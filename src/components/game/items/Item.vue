<template>
  <div class="item" v-if="data" v-on="bubbleEvents">
    <div
      class="main-icon"
      :draggable="isDraggable"
      @dragstart="startDragging($event)"
      @dragend="stopDragging($event)"
      @touchstart.prevent="startTouchDragging($event)"
      @mousedown="mouseDown($event)"
      @mouseup="mouseUp($event)"
      @touchend="stopTouchDragging($event)"
      @touchcancel="stopTouchDragging($event)"
    >
      <ItemIcon
        v-on="hasClick ? { click: emitClick } : { click: openDetails }"
        :icon="data.icon"
        :size="size"
        :amount="data.amount"
        :quality="data.quality"
        :condition="data.durabilityStage"
        :isEquipped="isEquipped"
        :topRightText="topRightText"
      >
        <template v-slot:textTopRight>
          <slot name="textTopRight"></slot>
        </template>
      </ItemIcon>
    </div>
    <Modal dialog large v-if="showDetails" @close="showDetails = false">
      <template v-slot:title> <RichText :value="data.name" /> ({{ data.amount }}) </template>
      <template v-slot:contents>
        <LoadingPlaceholder v-if="!dataWithDetails" />
        <div v-else>
          <Horizontal class="item-details">
            <Vertical class="flex-grow">
              <div>
                <LabeledValue label="Weight">
                  {{ roundWeight(dataWithDetails.unitWeight * dataWithDetails.amount) }}kg ({{
                    dataWithDetails.unitWeight
                  }}kg)
                </LabeledValue>
                <LabeledValue v-if="dataWithDetails.durabilityStageName" label="Condition">
                  {{ dataWithDetails.durabilityStageName }}
                </LabeledValue>
                <LabeledValue v-if="dataWithDetails.qualityName" label="Quality">
                  <span :class="'quality quality-' + dataWithDetails.quality">
                    {{ dataWithDetails.qualityName }}
                  </span>
                </LabeledValue>
                <LabeledValue v-if="dataWithDetails.maxDurability" label="Maximum Durability">
                  x{{ dataWithDetails.maxDurability }}
                </LabeledValue>
              </div>
              <div v-if="dataWithDetails.nutritionPercentage !== undefined">
                <Header alt2>Food</Header>
                <LabeledValue label="Nutrition" v-if="dataWithDetails.nutritionPercentage">
                  {{ dataWithDetails.nutritionPercentage }}%
                </LabeledValue>
                <DisplayImpacts :impacts="dataWithDetails.foodImpacts" />
              </div>
              <div v-if="dataWithDetails.impacts">
                <Header alt2>Equipment</Header>
                <DisplayImpacts :impacts="dataWithDetails.impacts" />
              </div>
              <div v-if="dataWithDetails.decorImpacts">
                <Header alt2>Decoration</Header>
                <LabeledValue label="Slots">
                  {{ dataWithDetails.decorSlots.join(', ') }}
                </LabeledValue>
                <DisplayImpacts :impacts="dataWithDetails.decorImpacts" />
              </div>
              <div v-if="dataWithDetails.toolEfficiency">
                <Header alt2>Tool</Header>
                <LabeledValue
                  v-for="(efficiency, tool) in dataWithDetails.toolEfficiency"
                  :key="tool"
                  :label="tool"
                >
                  {{ efficiency }}%
                </LabeledValue>
              </div>
              <Vertical v-if="dataWithDetails.combatMoves && dataWithDetails.combatMoves.length">
                <Header alt2>Combat abilities</Header>
                <CombatMoves
                  wrap
                  noSpacing
                  showDetailsOnClick
                  :moves="dataWithDetails.combatMoves"
                />
              </Vertical>
            </Vertical>
            <div class="item-icon-wrapper">
              <ItemIcon
                :icon="dataWithDetails.icon"
                :size="8"
                :amount="dataWithDetails.amount"
                :quality="dataWithDetails.quality"
                :condition="dataWithDetails.durabilityStage"
              />
            </div>
          </Horizontal>
          <Vertical class="clear-both">
            <Spaced v-if="includeActions">
              <Actions :target="dataWithDetails" @action="showDetails = false" />
            </Spaced>
            <div v-if="includeCrafts && crafts && crafts.length">
              <Header alt2>Crafts</Header>
              <Spaced>
                <HorizontalWrap>
                  <div v-for="craft in crafts" :key="craft.craftId">
                    <Icon
                      :src="craft.icon"
                      :size="5"
                      class="interactive"
                      @click="selectCraft(craft)"
                    />
                  </div>
                </HorizontalWrap>
              </Spaced>
            </div>
            <div v-if="dataWithDetails.description">
              <hr />
              <Description>
                <RichText :value="dataWithDetails.description" html />
              </Description>
            </div>
          </Vertical>
        </div>
      </template>
    </Modal>
  </div>
  <div v-else>
    <Icon :size="size" />
  </div>
</template>

<script>
import CombatMoves from '../CombatMoves'
export default {
  props: {
    data: {},
    includeActions: {
      default: true,
      type: Boolean,
    },
    dragSource: {},
    isDraggable: {
      default: false,
      type: Boolean,
    },
    includeCrafts: {
      default: false,
      type: Boolean,
    },
    isEquipped: {
      default: false,
    },
    size: {
      default: 5,
    },
    topRightText: {},
  },

  data: () => ({
    showDetails: false,
  }),

  computed: {
    bubbleEvents() {
      return bubbleEvents(this.$listeners, ['dragstart', 'dragend', 'touchstart', 'touchend'])
    },
    hasClick() {
      return !!this.$listeners.click
    },
  },

  subscriptions() {
    const mainEntity = GameService.getRootEntityStream()
    return {
      crafts: this.$stream('includeCrafts').switchMap((includeCrafts) =>
        includeCrafts
          ? Rx.combineLatest([GameService.getCraftsStream(), this.$stream('data')]).map(
              ([crafts, data]) =>
                crafts?.filter(
                  (craft) =>
                    data && craft.materials.some((material) => material.publicId === data.publicId),
                ),
            )
          : [],
      ),
      dataWithDetails: this.$stream('showDetails')
        .filter((showDetails) => showDetails)
        .switchMap(() =>
          this.$stream('data')
            .pluck('id')
            .distinctUntilChanged()
            .switchMap((id) => GameService.getEntityStream(id, ENTITY_VARIANTS.DETAILS, true)),
        ),
      canAddQuickAction: Rx.combineLatest(
        this.$stream('showDetails'),
        GameService.getInventoryStream(mainEntity),
        this.$stream('data'),
      ).map(([showDetails, inventory, item]) => {
        if (!showDetails) {
          return false
        }
        if (!item.actions?.length) {
          return false
        }
        return inventory.some((i) => i.id === item.id)
      }),
    }
  },

  methods: {
    startDragging($event) {
      if ($event.dataTransfer) {
        $event.dataTransfer.dropEffect = 'move'
        $event.dataTransfer.effectAllowed = 'move'
      }
      ControlsService.triggerControlEvent('draggingInventory', this.dragSource)
      ControlsService.triggerControlEvent('draggingItem', this.data)
    },

    startTouchDragging($event) {
      ControlsService.triggerControlEvent('draggingInventory', this.dragSource)
      ControlsService.triggerControlEvent('draggingItem', this.data)

      document.body.addEventListener('touchcancel', this.touchUp)
      document.body.addEventListener('touchend', this.touchUp)
      this.pressAndHoldTimeout = setTimeout(() => {
        this.longClicked = true
        this.$emit('longClick')
        this.touchUp()
      }, 500)
    },

    touchUp() {
      document.body.removeEventListener('touchcancel', this.touchUp)
      document.body.removeEventListener('touchend', this.touchUp)
      clearTimeout(this.pressAndHoldTimeout)
    },

    stopDragging($event) {
      ControlsService.triggerControlEvent('draggingInventory', null)
    },

    mouseDown() {
      this.longClicked = false
      document.body.addEventListener('mouseup', this.mouseUp)
      this.pressAndHoldTimeout = setTimeout(() => {
        this.longClicked = true
        this.$emit('longClick')
        this.mouseUp()
      }, 500)
    },

    mouseUp() {
      document.body.removeEventListener('mouseup', this.mouseUp)
      clearTimeout(this.pressAndHoldTimeout)
    },

    created() {
      this.touchCancelHandler = () => {
        this.stopDragging()
      }
      document.addEventListener('touchcancel', this.touchCancelHandler)
    },

    beforeDestroy() {
      document.removeEventListener('touchcancel', this.touchCancelHandler)
    },

    stopTouchDragging($event) {
      let target
      if ($event.clientX) {
        target = document.elementFromPoint($event.clientX, $event.clientY)
      } else {
        target = document.elementFromPoint(
          $event.changedTouches[0].clientX,
          $event.changedTouches[0].clientY,
        )
      }
      if (target) {
        if (target === $event.target) {
          target.click()
        } else {
          target.dispatchEvent(new Event('drop'))
        }
      }
      ControlsService.triggerControlEvent('draggingInventory', null)
    },

    roundWeight(value) {
      return Math.round(value * 100) / 100
    },

    openDetails() {
      this.showDetails = true
    },

    emitClick() {
      if (!this.longClicked) {
        this.$emit('click')
      }
    },

    selectCraft(craft) {
      this.showDetails = false
      GameService.request(REQUEST_CODES.ACTION_START_CRAFT, {
        craftId: craft.craftId,
      })
    },
  },
}
</script>

<style scoped lang="scss">
@import '../../../utils.scss';

.item {
  .main-icon {
    @include interactive();
  }
}

.item-details {
  .item-icon-wrapper {
    margin: 0 0 1rem 1rem;
  }

  .quality {
    &.quality-0 {
      @include text-outline(#3a3a3a, #565656);
    }
    &.quality-1 {
      @include text-outline(#562e00, #bdb76b);
    }
    &.quality-2 {
      @include text-outline(#4f4f4f, #e3e3e3);
    }
    &.quality-3 {
      @include text-outline(#705d00, #ffd700);
    }
  }

  //0: ["#3a3a3a", "#565656", "#3a3a3a"],
  //1: ["#b76800", "#bdb76b", "#b76800"],
  //2: ["#a6a6a6", "#e3e3e3", "#999999"],
  //3: ["#ffd700", "#fff0a9", "#ffd700"],
}
</style>
