<template>
  <ListItem :iconSrc="plan.icon" @click="showDetails = true">
    <template v-slot:title>
      <RichText :value="plan.name" />
    </template>
    <template v-slot:subtitle>
      <Horizontal tight>
        <ItemIcon
          v-for="(material, idx) in plan.materials"
          :key="'material' + idx"
          :icon="material.itemDef.icon"
          :amount="material.amount"
          :size="3"
        />
      </Horizontal>
      <Modal v-if="showDetails" dialog large @close="showDetails = false">
        <template v-slot:title>
          <RichText :value="plan.name" />
        </template>
        <template v-slot:contents>
          <div class="info-panel-with-icon">
            <Vertical class="info">
              <LoadingPlaceholder v-if="!showDetailsInfo" />
              <template v-else>
                <div v-if="showDetailsInfo.properties">
                  <Header alt2>Properties</Header>
                  <LabeledValue
                    v-for="(value, label) in showDetailsInfo.properties"
                    :key="label"
                    :label="label"
                  >
                    {{ value }}
                  </LabeledValue>
                </div>
                <div v-if="showDetailsInfo.buildingMaterials">
                  <Header alt2>Construction materials</Header>
                  <Horizontal tight>
                    <ItemIcon
                      v-for="(material,
                      idx) in showDetailsInfo.buildingMaterials"
                      :key="'item' + idx"
                      :icon="material.itemDef.icon"
                      :amount="material.amount"
                      :size="5"
                    />
                  </Horizontal>
                </div>
                <div v-if="showDetailsInfo.maintenanceMaterials">
                  <Header alt2>Average monthly maintenance</Header>
                  <Horizontal tight>
                    <ItemIcon
                      v-for="(material,
                      idx) in showDetailsInfo.maintenanceMaterials"
                      :key="'item' + idx"
                      :icon="material.itemDef.icon"
                      :amount="material.amount"
                      :size="5"
                    />
                  </Horizontal>
                </div>
                <div v-if="showDetailsInfo.climateInsulation">
                  <Header alt2>Environment protections</Header>
                  <LabeledValue
                    v-for="(value, label) in showDetailsInfo.climateInsulation"
                    :key="label"
                    :label="label"
                  >
                    {{ value }}
                  </LabeledValue>
                </div>
                <div alt2 v-if="showDetailsInfo.toolUtility">
                  <Header alt2>Tool</Header>
                  <LabeledValue
                    v-for="(efficiency, tool) in showDetailsInfo.toolUtility"
                    :key="tool"
                    :label="tool"
                  >
                    {{ efficiency
                    }}{{ typeof efficiency === "number" ? "%" : "" }}
                  </LabeledValue>
                </div>
                <HorizontalCenter>
                  <Button @click="startPlan(plan)">Start</Button>
                </HorizontalCenter>
              </template>
            </Vertical>
            <div class="icon">
              <Icon :src="plan.icon" :size="11" />
            </div>
          </div>
        </template>
      </Modal>
    </template>
    <template v-slot:buttons>
      <Button @click="startPlan(plan)">Start</Button>
    </template>
  </ListItem>
</template>

<script>
export default {
  props: {
    plan: {},
  },

  data: () => ({
    showDetails: false,
  }),

  subscriptions() {
    return {
      showDetailsInfo: this.$stream("showDetails")
        .filter((show) => !!show)
        .switchMap(() =>
          this.$stream("plan").switchMap((plan) =>
            GameService.getInfoStream("Building", {
              publicId: plan.publicId,
            })
          )
        ),
    };
  },

  methods: {
    startPlan(plan) {
      this.showDetails = false;
      this.$emit("action");
      GameService.request(REQUEST_CODES.ACTION_START_PLAN, {
        planId: plan.planId,
      });
    },
  },
};
</script>
