<template>
  <div>
    <Modal @close="$emit('close')" dialog large>
      <template v-slot:title>
        Use Essence
        <Help title="Essence">
          <HelpEssence />
        </Help>
      </template>
      <template v-slot:contents>
        <LoadingPlaceholder v-if="!powersInfo" />
        <div v-else>
          <Vertical>
            <Container
              :borderSize="0.5"
              class="currency-display"
              backgroundType="alt"
            >
              <CurrencyDisplay
                label="Current essence"
                :value="knowledgeBase.essence"
              />
            </Container>
            <div
              v-if="availablePowers && !availablePowers.length"
              class="empty-text"
            >
              No powers available for purchase
            </div>
            <Container
              borderType="alt3"
              v-for="power in availablePowers"
              :key="power.powerId"
            >
              <Spaced>
                <ListItem class="craft-list-item" flexible>
                  <template v-slot:icon>
                    <Icon
                      class="power-icon"
                      :src="power.icon"
                      backgroundType="alt"
                      :size="6"
                    />
                  </template>
                  <template v-slot:title>
                    <RichText :value="power.name" />
                  </template>
                  <template v-slot:subtitle>
                    <div class="power-description">
                      <DisplayImpacts :impacts="power.impacts" />
                      <DisplayImpacts :impacts="power.description" />
                    </div>
                  </template>
                  <template v-slot:buttons>
                    <Button @click="purchasingPower(power)">
                      <div class="purchase-button">
                        <!--<div class="static-text">Purchase for</div>-->
                        <CurrencyDisplay :value="power.price" />
                      </div>
                    </Button>
                  </template>
                </ListItem>
              </Spaced>
            </Container>
          </Vertical>
        </div>
      </template>
    </Modal>
    <Modal v-if="purchasing" dialog large @close="purchasing = null">
      <template v-slot:title>
        <RichText :value="purchasing.name" />
      </template>
      <template v-slot:contents>
        <Vertical class="purchase-dialog">
          <Icon
            class="power-icon"
            :src="purchasing.icon"
            backgroundType="alt"
          />
          <Header alt2>Bonuses</Header>
          <div>
            <DisplayImpacts :impacts="purchasing.impacts" />
            <DisplayImpacts :impacts="purchasing.description" />
          </div>
          <Header alt2>Cost breakdown</Header>
          <div>
            <LabeledValue label="Base power cost" flex>
              <CurrencyDisplay
                :value="purchasing.price - powersInfo.currentTax"
              />
            </LabeledValue>
            <LabeledValue label="" flex>
              <template v-slot:label>
                Added cost
                <Help title="Stacking powers">
                  <HelpStackingPowers />
                </Help>
              </template>
              <template v-slot:value>
                <CurrencyDisplay :value="powersInfo.currentTax" />
              </template>
            </LabeledValue>
            <hr />
            <LabeledValue label="Total cost" flex>
              <CurrencyDisplay :value="purchasing.price" />
            </LabeledValue>
          </div>
          <Header alt2>Your essence</Header>
          <div>
            <LabeledValue label="Current essence" flex>
              <CurrencyDisplay :value="knowledgeBase.essence" short />
            </LabeledValue>
            <LabeledValue label="Total cost" flex>
              <CurrencyDisplay :value="purchasing.price" />
            </LabeledValue>
            <hr />
            <LabeledValue label="Your essence after purchase" flex>
              <CurrencyDisplay
                :value="knowledgeBase.essence - purchasing.price"
                short
              />
            </LabeledValue>
          </div>
          <Button @click="confirmPurchase()" :processing="processing">
            Purchase
          </Button>
        </Vertical>
      </template>
    </Modal>
  </div>
</template>

<script>
export default {
  data: () => ({
    purchasing: null,
    processing: false,
    reFetchPowers: 0,
  }),

  subscriptions() {
    const powersInfoStream = this.$stream("reFetchPowers").switchMap(() =>
      Rx.fromPromise(GameService.requestPowersInfo())
    );
    return {
      knowledgeBase: GameService.getKnowledgeBaseStream(),
      powersInfo: powersInfoStream,
      availablePowers: powersInfoStream.map((powersInfo) =>
        powersInfo.availablePowers.filter(
          (power) => !powersInfo.selectedPowers.includes(power.powerId)
        )
      ),
    };
  },

  methods: {
    purchasingPower(power) {
      this.purchasing = power;
    },

    confirmPurchase() {
      this.processing = true;
      const purchasing = this.purchasing;
      GameService.request(REQUEST_CODES.BUY_POWER, {
        powerId: purchasing.powerId,
      }).then((response) => {
        if (response.ok) {
          this.reFetchPowers++;
          ToastNotify({
            icon: purchasing.icon,
            text: "Power acquired",
            subtext: purchasing.name,
          });
          this.purchasing = null;
        } else {
          ToastError(response.message);
        }
        this.processing = false;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.purchase-button {
  display: flex;

  .static-text {
    margin-right: 0.5rem;
  }
}

.currency-display {
  overflow: hidden;
  display: flex;
  padding: 0.35rem 0.5rem;
}

.purchase-dialog {
  min-width: 30rem;
}

.power-icon {
  margin: 0 auto;
}

.power-description {
  white-space: normal;
}
</style>
