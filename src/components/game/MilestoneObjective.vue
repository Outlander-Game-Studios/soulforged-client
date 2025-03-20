<template>
  <div
    @click="$emit('click', $event)"
    class="objective"
    :class="{ completed: completed, inactive: inactive, right: iconRight }"
  >
    <div v-if="!iconRight" class="objective-icon left" />
    <Vertical>
      <div>
        <span class="objective-text">
          {{ text }}
        </span>
        <span v-if="inactive" class="inactive-text">(Inactive, complete previous step)</span>
      </div>
      <Description v-show="!completed" v-html="description" />
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
    inactive: {
      type: Boolean,
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';
$size: 3.5rem;

.objective {
  display: flex;

  &.completed {
    .objective-text {
      color: forestgreen !important;
      text-decoration: line-through;
    }
    .objective-icon {
      background-image: url(ui-asset('/icons/check-true.png'));
    }
  }

  &.inactive {
    .objective-text,
    .objective-icon {
      opacity: 0.3;
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

.objective-text,
.inactive-text {
  display: inline-block;
  line-height: 2.5rem;
  padding-top: 0.75rem;
  vertical-align: top;
}

.objective-text {
  @include utils.text-outline(black, #ffa83b);
}

.objective-icon {
  background-image: url(ui-asset('/icons/check-false.png'));
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
