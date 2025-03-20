<template>
  <div>
    <CloseButton class="close-button" @click="cancel()" />
    <Vertical>
      <Header>{{ isRepair ? 'Repair' : 'Construct' }}</Header>
      <Container
        borderType="alt3"
        backgroundType="alt3"
        :borderSize="1.2"
        spaced
        v-if="step === 1 || !isRepair"
      >
        <Header alt2>{{ isRepair ? '' : 'Step 1:' }} Supply materials</Header>
        <Vertical tight v-if="step === 1">
          <div v-for="(material, idx) in structure.materials" :key="'material' + idx">
            <Horizontal>
              <ItemIcon :icon="material.itemDef.icon" :size="6">
                <template #amount>
                  <ItemCountNeeded :needed="material.amount" :publicId="material.publicId" />
                </template>
              </ItemIcon>
              <div class="fill" />
              <Button @click="addMaterial(material)">Supply</Button>
            </Horizontal>
          </div>
          <HorizontalCenter v-if="isRepair">
            <Button @click="supplyAll()"> Supply All </Button>
          </HorizontalCenter>
        </Vertical>
        <Modal dialog v-if="addingMaterial" title="Select amount" @close="cancelAddingMaterial()">
          <Vertical>
            <Horizontal>
              <ItemIcon :icon="addingMaterial.itemDef.icon" :size="8" />
              <Input
                type="number"
                :max="addingMaterial.amount"
                v-model="addMaterialAmount"
                @enter="$refs.submit.click()"
                autoFocus
              />
            </Horizontal>
            <HorizontalCenter>
              <Button @click="finishAddingMaterial()" :disabled="!addMaterialAmount" ref="submit">
                Supply
              </Button>
              <Button @click="cancelAddingMaterial()">Cancel</Button>
            </HorizontalCenter>
          </Vertical>
        </Modal>
      </Container>
      <Container borderType="alt3" backgroundType="alt3" :borderSize="1.2" spaced v-if="!isRepair">
        <Header alt2>Step 2: Construction</Header>
        <Vertical v-if="step === 2">
          <OperationToolSelector :operation="operation" />
          <SkillInfoDisplay :operation="operation" />
          <ProgressBar
            :fills="{
              green: (structure.constructionProgress * 100) / CONSTRUCT_RESOLUTION,
              yellow: (workAmount * 100) / CONSTRUCT_RESOLUTION,
            }"
          />
          <Slider
            v-model="workAmount"
            :step="1"
            :min="0"
            :max="CONSTRUCT_RESOLUTION - structure.constructionProgress"
          />
          <HorizontalCenter>
            <Button @click="commence()" :disabled="!workAmount" :processing="processing">
              Commence
            </Button>
          </HorizontalCenter>
        </Vertical>
      </Container>
      <Container v-if="step === 3" borderType="alt3" backgroundType="alt3" :borderSize="1.2" spaced>
        <Header alt2>
          {{ isRepair ? 'Repairs complete!' : 'Construction complete!' }}
        </Header>
        <Spaced>
          <Vertical>
            <HorizontalCenter>
              <Icon :src="structure.icon" />
            </HorizontalCenter>
          </Vertical>
        </Spaced>
      </Container>
    </Vertical>
  </div>
</template>

<script>
const OperationConstruct = {
  props: {
    operation: {},
  },

  data: () => ({
    CONSTRUCT_RESOLUTION: CONSTRUCT_RESOLUTION,
    amount: 1,
    addingMaterial: null,
    addMaterialAmount: 0,
    workAmount: 0,
    processing: false,
  }),

  subscriptions() {
    return {
      currentAP: GameService.getRootEntityStream().pluck('actionPoints'),
      structure: this.$stream('operation').switchMap((operation) =>
        GameService.getEntityStream(operation.context.buildingId, ENTITY_VARIANTS.DETAILS),
      ),
    }
  },

  computed: {
    isRepair() {
      return this.operation.context.isRepair
    },

    step() {
      if (!this.structure) {
        return 0
      }
      if (
        Object.values(this.structure.materials || {})
          .map((i) => i.amount)
          .reduce((acc, i) => acc + i, 0) > 0
      ) {
        return 1
      }
      if (!this.structure.operational) {
        return 2
      }
      return 3
    },

    maxAmount() {
      if (this.operation.context.unitCost === null) {
        return 0
      }
      return Math.max(1, Math.floor(this.currentAP / this.operation.context.unitCost))
    },
  },

  watch: {
    operation() {
      this.updateConsideredAP()
    },
    workAmount() {
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
      this.processing = GameService.request(REQUEST_CODES.COMMENCE_OPERATION, {
        workAmount: this.workAmount,
      }).then(({ workAmount, statusChanges }) => {
        this.workAmount = workAmount
        ToastNotify(statusChanges)
      })
    },

    cancel() {
      GameService.request(REQUEST_CODES.CANCEL_OPERATION)
    },

    updateConsideredAP() {
      ControlsService.updateConsideredAP(this.workAmount * this.operation.context.unitCost)
    },

    addMaterial(material) {
      this.addingMaterial = material
      this.addMaterialAmount = Infinity
    },

    supplyAll() {
      const materials = this.structure.materials
      materials.forEach(({ publicId, amount }) => {
        this.addMaterialRequest(publicId, amount)
      })
    },

    finishAddingMaterial() {
      this.addMaterialRequest(this.addingMaterial.publicId, this.addMaterialAmount).then(() => {
        this.addingMaterial = null
      })
    },

    addMaterialRequest(materialPublicId, amount) {
      return GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
        updateType: 'addMaterials',
        amount,
        materialPublicId,
      }).then(({ results }) => {
        if (results && results.statusChanges) {
          ToastNotify(results.statusChanges)
        }
      })
    },

    cancelAddingMaterial() {
      this.addingMaterial = null
    },
  },
}
window.OperationConstruct = OperationConstruct
export default OperationConstruct
</script>

<style scoped lang="scss">
.fill {
  flex-grow: 1;
}
</style>
