<template>
  <div
    class="labeled-value"
    :class="{ inline: inline, flex: flex, wrap: wrap }"
    @click="$emit('click')"
  >
    <div class="label">
      <img v-if="icon" :src="icon" class="label-icon" />
      {{ label }}
      <slot name="label" />
    </div>
    <div class="flex-grow" v-if="flex"></div>
    <div class="value" :class="{ invalid: invalid, 'no-label': !label }">
      <slot />
      <slot name="value" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {},
    icon: {},
    inline: { type: Boolean, default: false },
    flex: { type: Boolean, default: false },
    wrap: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.label-icon {
  display: inline-block;
  margin-top: 0.1em;
  $size: 1.2em;
  $color: #402300;
  width: $size;
  height: $size;
  min-width: $size;
  min-height: $size;
  background: $color;
  box-sizing: border-box;
  border: 2px dotted $color;
  vertical-align: text-bottom;
}

.labeled-value {
  //white-space: nowrap;

  &.inline {
    display: inline;
  }
  &.flex {
    display: flex;
  }
  &.wrap {
    .label,
    .value {
      white-space: normal;
    }
  }

  .label,
  .value {
    display: inline;
  }

  .label {
    font-style: italic;
    color: #5f5344;
  }

  .value {
    &.invalid {
      @include text-bad();
    }

    &.no-label {
      font-style: italic;
    }
  }

  .flex-grow {
    min-width: 1rem;
  }
}
</style>
