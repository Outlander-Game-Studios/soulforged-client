<template>
  <div class="plan-operation" v-if="plan">
    <CloseButton class="close-button" @click="cancel()" />
    <Vertical>
      <div class="flex">
        <Header class="flex-grow">
          Start <RichText :value="plan.name" />
        </Header>
        <Icon class="icon" :src="plan.icon" :size="4" />
      </div>
      <Vertical class="plan-operation">
        <template v-if="operation.context.pathPlacement">
          <Header alt2>Select Direction</Header>
          <div class="location-wrapper">
            <Location
              small
              @selected="selectPath($event)"
              :highlightId="operation.context.placementId"
              :validPathIds="operation.context.validPaths"
            />
          </div>
        </template>
        <Spaced v-else>
          <LabeledValue label="Spacing required">
            {{ operation.context.spacing.required }}
            <Help title="Building spacing">
              <HelpBuildingSpacing />
            </Help>
          </LabeledValue>
          <LabeledValue
            label="Spacing available"
            :invalid="!operation.context.spacing.fits"
          >
            {{ operation.context.spacing.available }}
          </LabeledValue>
        </Spaced>
        <div>
          <HorizontalCenter>
            <Button @click="commence()" :processing="processing">Start</Button>
          </HorizontalCenter>
        </div>
      </Vertical>
    </Vertical>
  </div>
</template>

<script>
import exclamationIcon from "../operation-assets/exclamation.png";

export default window.OperationPlan = {
  props: {
    operation: {},
  },

  data: () => ({
    processing: false,
  }),

  watch: {
    operation() {
      this.updateConsideredAP();
    },
  },

  subscriptions() {
    return {
      currentAP: GameService.getRootEntityStream().pluck("actionPoints"),
      plan: this.$stream("operation").switchMap((operation) =>
        GameService.getPlansStream().map((plans) =>
          plans.find((plan) => plan.planId === operation.context.planId)
        )
      ),
    };
  },

  mounted() {
    this.updateConsideredAP();
  },

  beforeDestroy() {
    ControlsService.updateConsideredAP(0);
  },

  methods: {
    selectPath(path) {
      GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
        updateType: "roadPlacement",
        pathId: path.id,
      }).then((response) => {
        if (response && !response.ok) {
          ToastNotify({
            icon: GameService.getSecureResource(exclamationIcon),
            text: response.message,
          });
        }
      });
    },

    commence() {
      this.processing = GameService.request(
        REQUEST_CODES.COMMENCE_OPERATION,
        {}
      ).then(({ statusChanges }) => {
        ToastNotify(statusChanges);
      });
    },

    cancel() {
      GameService.request(REQUEST_CODES.CANCEL_OPERATION);
    },

    updateConsideredAP() {
      ControlsService.updateConsideredAP(this.operation.context.unitCost);
    },
  },
};
</script>

<style scoped lang="scss">
.location-wrapper {
  padding: 1rem;
}

.flex {
  display: flex;
}

.plan-operation {
  min-width: 22rem;
}
</style>
