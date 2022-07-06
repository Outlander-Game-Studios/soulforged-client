<template>
  <div class="relative">
    <Header class="interactive" @click="showList()">Equipment</Header>
    <div v-if="!equipment" class="empty-text">None</div>
    <div class="droppable-frames" v-if="draggingOther">
      <div
        v-for="action in dropTargets"
        droppable
        class="droppable"
        @drop="onDrop($event, action.actionId)"
        @dragover.prevent
        @dragenter.prevent
      >
        {{ action.label }}
      </div>
    </div>
    <HorizontalWrap tight>
      <Item
        v-for="(equipmentSlot, idx) in equipment"
        :key="idx"
        :data="equipmentSlot.item"
        :size="5"
        :isEquipped="true"
        isDraggable
        dragSource="equipmentDrag"
      />
    </HorizontalWrap>
    <Modal v-if="showingList" dialog large @close="closeList()">
      <template v-slot:title> Equipment </template>
      <template v-slot:contents>
        <ListItem v-for="(equipmentSlot, idx) in equipment" :key="idx">
          <template v-slot:icon>
            <ItemIcon
              :icon="equipmentSlot.item.icon"
              :size="6"
              :quality="equipmentSlot.item.quality"
              :condition="equipmentSlot.item.durabilityStage"
            />
          </template>
          <template v-slot:title>
            <div><RichText :value="equipmentSlot.item.name" /></div>
          </template>
          <template v-slot:subtitle>
            {{ equipmentSlot.slotName }}
          </template>
        </ListItem>
      </template>
    </Modal>
  </div>
</template>

<script>
export default {
  data: () => ({
    showingList: false,
  }),

  subscriptions() {
    const draggedItemStream = ControlsService.getDraggedItemStream();
    return {
      draggingOther: ControlsService.getControlEventStream(
        "draggingInventory"
      ).map(([uid]) => uid && uid !== "equipmentDrag"),
      draggedItem: draggedItemStream,
      dropTargets: draggedItemStream
        .filter((item) => !!item)
        .map((item) =>
          item.actions.filter((a) => a.actionId.substring(0, 6) === "equip_")
        ),
      equipment: GameService.getRootEntityStream()
        .pluck("equipment")
        .switchMap((equipment) =>
          Object.values(equipment || {}).length
            ? Rx.combineLatest(
                Object.keys(equipment).map((slotName) =>
                  GameService.getEntityStream(equipment[slotName]).map(
                    (item) => ({
                      slotName,
                      item,
                    })
                  )
                )
              )
            : Rx.Observable.of(null)
        ),
    };
  },

  methods: {
    onDrop($event, selectedActionId) {
      const item = this.draggedItem;
      const action = item.actions.find(
        ({ actionId }) => actionId === selectedActionId
      );
      GameService.performAction(item, action);
    },

    showList() {
      this.showingList = true;
    },

    closeList() {
      this.showingList = false;
    },
  },
};
</script>
