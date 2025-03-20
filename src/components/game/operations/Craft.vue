<template>
  <div>
    <CloseButton class="close-button" @click="cancel()" />
    <Vertical>
      <Header><RichText v-if="craft" :value="craft.name" /></Header>
      <SkillInfoDisplay :operation="operation" />
      <OperationToolSelector :operation="operation" />
      <HorizontalCenter>
        <CraftDiagram
          :craft="craft"
          :amount="amount"
          :size="5"
          ref="diagram"
          includeInventory
          showSearchButton
          wrap
        />
      </HorizontalCenter>
      <div>
        <div>How many attempts?</div>
        <Input
          type="number"
          v-model="amount"
          :min="1"
          :max="maxAmount"
          @enter="$refs.submit.click()"
          autoFocus
        />
      </div>
      <HorizontalCenter>
        <Button @click="commence()" :processing="processing" :disabled="!maxAmount" ref="submit">
          Commence
        </Button>
      </HorizontalCenter>
    </Vertical>
  </div>
</template>

<script>
const OperationCraft = rxComponent({
  props: {
    operation: {},
  },

  data: () => ({
    amount: 1,
    processing: false,
  }),

  subscriptions() {
    return {
      currentAP: GameService.getRootEntityStream().pluck('actionPoints'),
      craftId: this.$stream('operation')
        .pluck('context', 'craftId')
        .distinctUntilChanged()
        .tap((craftId) => GameService.fetchCraftDetails(craftId)),
      craft: this.$stream('operation').switchMap((operation) =>
        GameService.getCraftsStream().map((crafts) =>
          crafts.find((craft) => craft.craftId === operation.context.craftId),
        ),
      ),
    }
  },

  computed: {
    maxAmount() {
      return 20
    },

    unitCost() {
      return this.operation.context.unitCost || 0
    },
  },

  watch: {
    operation() {
      this.updateConsideredAP()
    },
    amount() {
      this.updateConsideredAP()
    },
  },

  mounted() {
    this.updateConsideredAP()
  },

  beforeDestroy() {
    ControlsService.updateConsideredAP(0)
  },

  methods: {
    commence() {
      const orderedAmount = this.amount
      this.processing = true
      GameService.request(REQUEST_CODES.COMMENCE_OPERATION, {
        amount: orderedAmount,
      }).then(({ amount = orderedAmount, results = [], statusChanges }) => {
        this.consideredAPOverride = amount * this.unitCost
        this.updateConsideredAP()
        this.$refs.diagram.apiAddCollected({ results, failPrefix: '-' }).subscribe(
          () => {
            this.amount -= 1
          },
          () => {},
          () => {
            this.processing = false
            ToastNotify(statusChanges)
            this.consideredAPOverride = null
            this.updateConsideredAP()
          },
        )
      })
    },

    cancel() {
      GameService.request(REQUEST_CODES.CANCEL_OPERATION)
    },

    updateConsideredAP() {
      ControlsService.updateConsideredAP(
        this.consideredAPOverride || this.amount * this.operation.context.unitCost,
      )
    },
  },
})
window.OperationCraft = OperationCraft
export default OperationCraft
</script>

<style scoped lang="scss"></style>
