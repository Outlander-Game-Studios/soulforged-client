<template>
  <Container borderType="alt3">
    <Spaced :small="small">
      <Vertical>
        <Horizontal>
          <Header large alt class="flex-grow"><RichText :value="power.name" /></Header>
          <Button @click="$emit('purchasingPower')" v-if="$attrs.onPurchasingPower">
            <div class="purchase-button">
              <CurrencyDisplay :value="power.price" short />
            </div>
          </Button>
        </Horizontal>
        <ListItem class="craft-list-item" flexible titleClass="wrap">
          <template v-slot:icon>
            <Icon
              class="power-icon"
              :src="power.icon"
              backgroundType="severity--3"
              :size="small ? 4 : 6"
            />
          </template>
          <template v-slot:title>
            <div class="power-description">
              <DisplayImpacts :impacts="power.impacts" />
              <DisplayImpacts :impacts="power.description" />
              <LabeledValue v-if="power.requiredPowers.length" label="Requires having">
                <span
                  v-for="powerName in power.requiredPowers"
                  class="required-power"
                  :class="{ pass: purchasedPowers[powerName] }"
                >
                  {{ powerName }}
                </span>
              </LabeledValue>
            </div>
          </template>
          <template v-slot:subtitle></template>
          <template v-slot:buttons> </template>
        </ListItem>
        <CurrencyDisplay v-if="basePrice" label="Base cost" :value="basePrice" />
      </Vertical>
    </Spaced>
  </Container>
</template>

<script>
export default {
  props: {
    small: {
      type: Boolean,
    },
    power: {},
    purchasedPowers: {},
    basePrice: {},
  },
}
</script>
