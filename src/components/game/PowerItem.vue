<template>
  <Container borderType="alt3">
    <Spaced :small="small">
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
          <RichText :value="power.name" />
        </template>
        <template v-slot:subtitle>
          <div class="power-description">
            <DisplayImpacts :impacts="power.impacts" />
            <DisplayImpacts :impacts="power.description" />
            <LabeledValue
              v-if="power.requiredPowers.length"
              label="Requires having"
            >
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
        <template v-slot:buttons>
          <Button
            @click="$emit('purchasingPower')"
            v-if="$listeners.purchasingPower"
          >
            <div class="purchase-button">
              <CurrencyDisplay :value="power.price" />
            </div>
          </Button>
        </template>
      </ListItem>
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
  },
};
</script>
