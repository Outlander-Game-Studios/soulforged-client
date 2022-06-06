<template>
  <div
    @click="$emit('click', $event)"
    class="objective"
    :class="{ completed: completed, right: iconRight }"
  >
    <div v-if="!iconRight" class="objective-icon left" />
    <Vertical>
      <div class="objective-text">
        {{ text }}
      </div>
      <Description v-show="!completed">{{ description }}</Description>
    </Vertical>
    <div v-if="iconRight" class="objective-icon right" />
  </div>
</template>

<script>
export default {
  props: {
    text: {},
    description: {},
    iconRight: {
      type: Boolean,
    },
    completed: {
      type: Boolean,
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";
$size: 3.5rem;

.objective {
  display: flex;

  &.completed {
    .objective-text {
      color: forestgreen !important;
      text-decoration: line-through;
    }
    .objective-icon {
      background-image: url(ui-asset("/icons/check-true.png"));
    }
  }

  &.right {
    justify-content: flex-end;
    .objective-text {
      padding-right: 0;
      padding-left: 1rem;
    }
  }

  .objective-text {
    padding-right: 1rem;
  }
}

.objective-text {
  @include text-outline(black, #ffa83b);
  display: inline-block;
  line-height: 2.5rem;
  padding-top: 0.75rem;
  vertical-align: top;
}

.objective-icon {
  background-image: url(ui-asset("/icons/check-false.png"));
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: inline-block;
  width: $size;
  min-width: $size;
  height: $size;

  &.left {
    margin-right: 0.5rem;
  }
  &.right {
    margin-left: 0.5rem;
  }
}
</style>
