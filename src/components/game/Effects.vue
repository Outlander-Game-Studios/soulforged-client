<template>
  <component
    :is="wrap ? 'HorizontalWrap' : 'Horizontal'"
    tight
    v-if="row"
    :style="{ height: wrap ? '' : size + 'rem' }"
  >
    <EffectIcon
      v-for="(effect, idx) in sortedEffects"
      :key="idx"
      :effect="effect"
      :size="size"
    />
  </component>
  <div v-else>
    <div v-for="(effect, idx) in sortedEffects" :key="idx">
      <ListItem flexible>
        <template v-slot:icon>
          <EffectIcon :effect="effect" :size="6" />
        </template>
        <template v-slot:title>
          <div class="effect-wrap">
            <RichText
              :value="
                (effect.name || effect.text) + ' ' + displayDuration(effect)
              "
            />
          </div>
        </template>
        <template v-slot:subtitle>
          <DisplayImpacts :impacts="effect.impacts" inline wrap />
          <LabeledValue inline wrap html>
            <template v-slot:label>
              <RichText class="effect-description" :value="effect.desc" html />
            </template>
          </LabeledValue>
        </template>
        <template v-slot:buttons></template>
      </ListItem>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    effects: {},
    size: {
      default: 6,
    },
    filter: {
      type: Function,
      default: () => true,
    },
    row: {
      type: Boolean,
      default: false,
    },
    wrap: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    sortedEffects() {
      return [...(this.effects || [])].filter(this.filter).sort((a, b) => {
        const orderDelta = a.order - b.order;
        if (orderDelta === 0) {
          return (b.severity || 0) - (a.severity || 0);
        }
        return orderDelta;
      });
    },
  },

  methods: {
    displayDuration(effect) {
      let { duration, durationTurns } = effect;
      if (durationTurns) {
        return `(${durationTurns} turn${durationTurns > 1 ? "s" : ""})`;
      }
      if (!duration) {
        return "";
      }
      if (!Array.isArray(duration)) {
        duration = [duration];
      } else {
        if (duration[0] === duration[1]) {
          duration = [duration[0]];
        }
      }
      return "(" + duration.map((d) => `${d} AP`).join(" ~ ") + ")";
    },
  },
};
</script>

<style lang="scss">
@import "../../utils.scss";

.effect-wrap {
  white-space: normal;
}
.effect-description {
  em {
    @include text-bad();
    &.ok {
      @include text-outline();
    }
  }

  .ok {
    em {
      @include text-outline();
    }
  }

  .nameable {
    @include text-outline();
  }
}
</style>
