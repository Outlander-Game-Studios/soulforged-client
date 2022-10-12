<template>
  <div class="inventory-wrapper">
    <slot />
    <div v-if="!inventory">
      <LoadingPlaceholder :size="5" />
    </div>
    <HorizontalWrap
      tight
      v-else-if="inventory.length > 0"
      class="inventory-items"
    >
      <Item
        v-for="(item, idx) in sortedInventory"
        class="draggable"
        :ref="'item' + item.id"
        :id="'item' + item.id"
        :key="item.id"
        :data="item"
        :isEquipped="equipmentMap && equipmentMap[item.id]"
        :includeCrafts="includeCrafts"
        v-on="hasClick ? { click: () => $emit('click', item) } : {}"
        isDraggable
        :dragSource="_uid"
      />
    </HorizontalWrap>
    <div v-else class="empty-text">Empty</div>
    <div class="droppable-frames" v-if="draggingOther">
      <template v-if="draggingSource !== 'equipmentDrag'">
        <div
          droppable
          class="droppable one"
          @drop="onDrop($event, 1)"
          @dragover.prevent
          @dragenter.prevent
        >
          1
        </div>
        <div
          droppable
          class="droppable some"
          @drop="onDrop($event)"
          @dragover.prevent
          @dragenter.prevent
        >
          Some
        </div>
        <div
          droppable
          class="droppable all"
          @drop="onDrop($event, Infinity)"
          @dragover.prevent
          @dragenter.prevent
        >
          All
        </div>
      </template>
      <div
        v-for="action in unequipDropTargets"
        droppable
        class="droppable"
        @drop="onActionDrop($event, action.actionId)"
        @dragover.prevent
        @dragenter.prevent
      >
        {{ action.label }}
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  props: {
    includeCrafts: {
      default: false,
      type: Boolean,
    },
    includeUnequipDrop: {
      default: false,
      type: Boolean,
    },
    inventory: {
      type: Array,
    },
    label: {},
  },

  computed: {
    sortedInventory() {
      return [...this.inventory].filter((item) => !!item).sort(this.itemSorter);
    },

    hasClick() {
      return !!this.$listeners.click;
    },
  },

  subscriptions() {
    const draggedItemStream = ControlsService.getDraggedItemStream();

    return {
      itemSorter: GameService.getItemSorterStream(),
      equipmentMap: GameService.getEquipmentMapStream(),
      draggingSource: ControlsService.getControlEventStream(
        "draggingInventory"
      ).map(([source]) => source),
      draggingOther: ControlsService.getControlEventStream(
        "draggingInventory"
      ).map(([uid]) => uid && uid !== this._uid),
      draggedItem: draggedItemStream,
      unequipDropTargets: draggedItemStream
        .filter((item) => !!item)
        .map(
          (item) =>
            this.includeUnequipDrop &&
            item.actions.filter(
              (a) => a.actionId.substring(0, 9) === "un_equip_"
            )
        ),
    };
  },

  methods: {
    onActionDrop($event, selectedActionId) {
      const item = this.draggedItem;
      const action = item.actions.find(
        ({ actionId }) => actionId === selectedActionId
      );
      GameService.performAction(item, action);
    },

    onDrop($event, amount) {
      const item = this.draggedItem;
      const action = item.actions.find(({ actionId }) =>
        ["pickup", "drop"].includes(actionId)
      );

      if (amount) {
        amount = Math.min(amount, item.amount);
        GameService.performAction(item, action, {
          amount,
        });
      } else {
        document
          .getElementById("item" + item.id)
          ?.querySelector(".item-icon")
          ?.click();
        setTimeout(() => {
          let times = 200;
          const attemptInterval = setInterval(() => {
            const button = document.querySelector(
              `.modal button.action-button.${action.actionId}`
            );
            if (button) {
              clearInterval(attemptInterval);
              button.click();
              setTimeout(() => {
                const inputs = document.querySelectorAll(
                  ".modal-wrapper + .modal-wrapper input"
                );
                const input = [...inputs].last();
                if (input) {
                  input.value = Math.ceil(item.amount / 2);
                  input.dispatchEvent(new Event("input"));
                }
              });
            } else {
              times--;
              if (times <= 0) {
                clearInterval(attemptInterval);
              }
            }
          }, 10);
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../utils.scss";

.inventory-wrapper {
  position: relative;
}

.inventory-items {
  @include touch-scroll-space();
}
</style>
