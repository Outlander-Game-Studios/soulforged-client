<template>
  <div>
    <CloseButton class="close-button" @click="cancel()" />
    <div v-if="resource === undefined && resourceGone === undefined">
      <LoadingPlaceholder />
    </div>
    <Vertical v-else>
      <Header>Gather resource</Header>
      <Vertical v-if="resource">
        <div>
          <div class="icon-container">
            <div class="flex-grow">
              <LabeledValue v-if="resourceGone" label="Density"> Exhausted </LabeledValue>
              <div v-else>
                <LabeledValue label="Density">
                  {{ ucFirst(resource.densityName) }}
                  <IndicatorResourceDensity :density="resource.density" highRes />
                  &nbsp;
                  <HelpResourceDensity :resource="resource" />
                </LabeledValue>
                <SkillInfoDisplay :operation="operation" />
              </div>
            </div>
            <div class="icon">
              <ItemCollectAnimation
                ref="resourceIcon"
                :icon="resource.produceIcon || resource.icon"
                :size="8"
              />
            </div>
          </div>
        </div>
        <div v-if="!resourceGone">
          <OperationToolSelector :operation="operation" />
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
      </Vertical>
      <div v-else>Resource was exhausted.</div>
      <HorizontalCenter v-if="!resourceGone">
        <Button
          @click="commence()"
          :processing="processing"
          :disabled="!resource || !amount"
          ref="submit"
        >
          Commence
        </Button>
      </HorizontalCenter>
    </Vertical>
  </div>
</template>

<script>
export default window.OperationGather = {
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
      resource: this.$stream('operation')
        .filter((operation) => !!operation.context.resource)
        .switchMap((operation) =>
          GameService.getEntityStream(operation.context.resource, ENTITY_VARIANTS.DETAILS),
        )
        .distinctUntilChanged(null, JSON.stringify)
        .tap(() => GameService.getRootEntityStream(false, true)),
      resourceGone: this.$stream('operation').map((operation) => !operation.context.resource),
    }
  },

  computed: {
    consideredAP() {
      ControlsService.updateConsideredAP(this.amount * this.unitCost)
    },

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
    this.componentDestroyed = true
    ControlsService.updateConsideredAP(0)
  },

  methods: {
    ucFirst,

    commence() {
      const orderedAmount = this.amount
      const expectedDensity = this.resource.densityName
      this.processing = true
      GameService.request(REQUEST_CODES.COMMENCE_OPERATION, {
        amount: orderedAmount,
        density: expectedDensity,
      }).then(({ amount = orderedAmount, results = [], statusChanges }) => {
        this.consideredAPOverride = amount * this.unitCost
        this.updateConsideredAP()
        results = results.map((result) => ({
          [result ? 'gain' : 'loss']: 1,
        }))
        this.$refs.resourceIcon.apiAddCollected({ results, failPrefix: 'Fail x' }).subscribe(
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
      if (!this.componentDestroyed) {
        ControlsService.updateConsideredAP(this.consideredAPOverride || this.amount * this.unitCost)
      }
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../../utils.scss';

.density-help {
  max-width: 45rem;
}

.icon-container {
  display: flex;
  position: relative;

  .icon {
    margin-left: 1rem;
  }
}
</style>
