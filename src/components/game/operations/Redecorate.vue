<template>
  <div>
    <Modal v-if="replacingSlot !== null" dialog large @close="stopReplacing()">
      <ItemSelector
        :filter="itemFilter"
        @selected="selectedItem($event)"
        v-slot="{ item }"
        includeLocation
      >
        <LabeledValue label="Slots">
          {{ item.decorSlots && item.decorSlots.join(', ') }}
        </LabeledValue>
        <DisplayImpacts :impacts="item.decorImpacts" />
      </ItemSelector>
    </Modal>
    <CloseButton class="close-button" @click="cancel()" />
    <Vertical v-if="home && items">
      <Header> Redecorate <RichText :value="home.name" /> </Header>
      <template v-for="(slot, idx) in selectedDecor">
        <Header alt2 v-if="slot.slotName"> {{ slot.slotName }} </Header>
        <ListItem v-if="slot.item" :iconSrc="slot.item.icon" flexible>
          <template v-slot:title>
            <RichText :value="slot.item.name" />
          </template>
          <template v-slot:subtitle>
            <DisplayImpacts :impacts="slot.item.decorImpacts" />
          </template>
          <template v-slot:buttons>
            <Button @click="replaceSlot(slot.slotId)">Replace</Button>
          </template>
        </ListItem>
        <ListItem v-else>
          <template v-slot:buttons>
            <Button @click="replaceSlot(slot.slotId)">Select</Button>
          </template>
        </ListItem>
      </template>
      <HorizontalCenter>
        <Button @click="commence()" :processing="processing">Confirm</Button>
      </HorizontalCenter>
    </Vertical>
    <LoadingPlaceholder v-else />
  </div>
</template>

<script>
const OperationRedecorate = rxComponent({
  props: {
    operation: {},
  },

  data: () => ({
    processing: false,
    replacingSlot: null,
  }),

  watch: {
    operation() {
      this.updateConsideredAP()
    },
  },

  computed: {
    itemFilter() {
      const slotName = this.home.decorations[this.replacingSlot].slotName
      return (item) => {
        return item.decorSlots && item.decorSlots.includes(slotName) && !item.isRuined
      }
    },

    selectedDecor() {
      if (!this.home || !this.items || !this.operation) {
        return []
      }
      let lastSlot = null
      return this.home.decorations.map((slot) => ({
        ...slot,
        slotName: lastSlot === slot.slotName ? '' : (lastSlot = slot.slotName),
        item: this.items[this.operation.context.decor[slot.slotId]],
      }))
    },
  },

  subscriptions() {
    const homeStream = this.$stream('operation').switchMap((operation) =>
      GameService.getEntityStream(operation.context.home, ENTITY_VARIANTS.DETAILS),
    )
    return {
      items: GameService.getAllItemsByIdStream(),
      home: homeStream,
    }
  },

  mounted() {
    this.updateConsideredAP()
  },

  beforeDestroy() {
    ControlsService.updateConsideredAP(0)
  },

  methods: {
    cancel() {
      GameService.request(REQUEST_CODES.CANCEL_OPERATION)
    },

    commence() {
      this.processing = GameService.request(REQUEST_CODES.COMMENCE_OPERATION).then(
        ({ statusChanges = [] } = {}) => {
          ToastNotify(statusChanges)
        },
      )
    },

    replaceSlot(slotId) {
      this.replacingSlot = slotId
    },

    stopReplacing() {
      this.replacingSlot = null
    },

    selectedItem(item) {
      GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
        updateType: 'selectDecor',
        itemId: item && item.id,
        slotId: this.replacingSlot,
      }).then(() => {
        this.stopReplacing()
      })
    },

    updateConsideredAP() {
      ControlsService.updateConsideredAP(this.operation.context.unitCost)
    },
  },
})
window.OperationRedecorate = OperationRedecorate
export default OperationRedecorate
</script>

<style scoped lang="scss"></style>
