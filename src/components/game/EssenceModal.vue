<template>
  <div>
    <Modal @close="$emit('close')" dialog large>
      <template v-slot:title>
        Essence
        <Help title="Essence">
          <HelpEssence />
        </Help>
      </template>
      <template v-slot:contents>
        <LoadingPlaceholder v-if="!powersInfo || !knowledgeBase" />
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
            <template v-if="knowledgeBase.pendingEssence">
              <Header alt2> Pending Essence </Header>
              <Spaced>
                <Horizontal>
                  <CurrencyDisplay
                    class="flex-grow pending-essence"
                    label="Pending essence"
                    :value="knowledgeBase.pendingEssence"
                  />
                  <Button @click="collectEssence()" :processing="collecting"
                    >Collect</Button
                  >
                </Horizontal>
              </Spaced>
            </template>
            <Header alt2>Power Counts</Header>
            <Spaced>
              <!--            <Description-->
              <!--              >Unlocked powers: {{ powersInfo.counts.unlocked }} /-->
              <!--              {{ powersInfo.counts.total }}-->
              <!--            </Description>-->
              <LabeledValue label="Purchased Powers">
                {{ powersInfo.counts.purchased }}
              </LabeledValue>
              <LabeledValue label="Discovered Powers">
                {{ powersInfo.counts.unlocked }}
              </LabeledValue>
              <LabeledValue label="Undiscovered Powers">
                {{ powersInfo.counts.total - powersInfo.counts.unlocked }}
              </LabeledValue>
            </Spaced>
            <Header alt2>Purchase Power</Header>
            <Spaced>
              <Vertical>
                <div
                  v-if="availablePowers && !availablePowers.length"
                  class="empty-text"
                >
                  No powers available for purchase
                </div>
                <PowerItem
                  v-for="power in availablePowers"
                  :key="power.powerId"
                  :power="power"
                  :purchasedPowers="purchasedPowers"
                  @purchasingPower="purchasingPower(power)"
                />
                <PowerGroup
                  v-for="powerGroup in availablePowerGroups"
                  :key="powerGroup.name"
                  v-show="!powerGroup.purchased"
                  :powerGroup="powerGroup"
                  :purchasedPowers="purchasedPowers"
                  @purchasingPower="purchasingPower($event)"
                />
              </Vertical>
            </Spaced>
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
            backgroundType="severity--3"
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
          <template v-if="purchasing.groupName">
            <Header alt2>Power Group</Header>
            <Description warning>
              Purchasing this power will make the following powers unavailable
              for this character:
            </Description>
            <PowerItem
              v-for="power in availablePowerGroups[purchasing.groupName].powers"
              :key="power.powerId"
              v-show="power.powerId !== purchasing.powerId"
              :power="power"
              :purchasedPowers="purchasedPowers"
              small
            />
          </template>
          <Button @click="confirmPurchase()" :processing="processing">
            Purchase
          </Button>
        </Vertical>
      </template>
    </Modal>
    <Modal v-if="collected" dialog large @close="collected = null">
      <template v-slot:title> Essence Collected! </template>
      <template v-slot:contents>
        <Vertical>
          <div>
            <LabeledValue label="Essence Previously" flex>
              <CurrencyDisplay
                :value="knowledgeBase.essence - collected.essence"
              />
            </LabeledValue>
            <LabeledValue label="Essence Collected" flex>
              <CurrencyDisplay :value="collected.essence" />
            </LabeledValue>
            <hr />
            <LabeledValue label="Your Essence now" flex>
              <CurrencyDisplay :value="knowledgeBase.essence" />
            </LabeledValue>
          </div>
          <template v-if="collected.topAppreciations.length">
            <Header alt2>
              Top
              {{
                collected.topAppreciations.length > 1
                  ? collected.topAppreciations.length
                  : ""
              }}
              Impacted Player{{
                collected.topAppreciations.length > 1 ? "s" : ""
              }}
            </Header>
            <ListItem
              v-for="(appreciation, idx) in collected.topAppreciations"
              :key="idx"
            >
              <template v-slot:icon>
                <Avatar
                  :avatarAssets="appreciation.avatar"
                  size="small"
                  headOnly
                />
              </template>
              <template v-slot:title>
                <RichText :value="appreciation.name" />
              </template>
            </ListItem>
          </template>
        </Vertical>
      </template>
    </Modal>
  </div>
</template>

<script>
import LabeledValue from "../interface/LabeledValue";
import PowerItem from "./PowerItem";
import Description from "../interface/Description";
export default {
  components: { Description, PowerItem, LabeledValue },
  data: () => ({
    collecting: false,
    collected: null,
    purchasing: null,
    processing: false,
    reFetchPowers: 0,
  }),

  subscriptions() {
    const powersInfoStream = this.$stream("reFetchPowers").switchMap(() =>
      Rx.fromPromise(GameService.requestPowersInfo())
    );
    return {
      purchasedPowers: GameService.getRootEntityStream().map((c) =>
        c.effects.toObject((e) => e.name)
      ),
      knowledgeBase: GameService.getKnowledgeBaseStream(),
      powersInfo: powersInfoStream,
      availablePowers: powersInfoStream.map((powersInfo) => {
        return powersInfo.availablePowers.filter(
          (power) =>
            !powersInfo.selectedPowers.includes(power.powerId) &&
            !power.groupName
        );
      }),
      availablePowerGroups: powersInfoStream.map((powersInfo) => {
        const allGroups = {};
        powersInfo.availablePowers
          .filter((power) => !!power.groupName)
          .forEach((power) => {
            allGroups[power.groupName] = {
              name: power.groupName,
              powers: [...(allGroups[power.groupName]?.powers || []), power],
              purchased: allGroups[power.groupName]?.purchased,
            };
            if (powersInfo.selectedPowers.includes(power.powerId)) {
              allGroups[power.groupName].purchased = true;
            }
          });
        return allGroups;
      }),
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

    collectEssence() {
      this.collecting = true;
      GameService.triggerExecutor("Essence", "claim")
        .then((result) => {
          this.collecting = false;
          this.collected = result;
        })
        .catch(() => {
          this.collecting = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

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

.pending-essence {
  padding-top: 1.25rem;
}

.power-description {
  white-space: normal;
}

.power-group-label {
  @include text-outline();
}
.required-power {
  &:not(.pass) {
    @include text-bad();
  }
  &.pass {
    @include text-good();
  }
}
</style>
