<template>
  <ItemIcon
    v-if="structure"
    :icon="structure.icon"
    :size="size"
    :condition="structure.condition"
    :isEquipped="structure.own"
    :amount="structure.number"
    class="structure-icon"
    :class="{ ruin: structure.ruin }"
  >
    <template v-slot:textTopRight>
      <slot name="textTopRight"></slot>
    </template>
    <IndicatorPresence class="presence" v-if="!!structure.presence" />
    <IndicatorConstruction class="under-construction" v-if="!structure.operational" />
  </ItemIcon>
</template>

<script>
export default {
  props: {
    structure: {},
    size: {
      default: 5,
    },
  },

  data: () => ({}),
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.presence {
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 140%;
}

.under-construction {
  position: absolute;
  top: 5%;
  left: 5%;
}

.ruin {
  @include utils.filter(saturate(0));
}
</style>
