<template>
  <div v-if="carryCapacity">
    <ProgressBar
      :fills="carryCapacityFill"
      @click="showDetails = true"
      class="interactive"
    >
      <div class="text-display">
        <div
          class="icon"
          :class="{ yellow: isYellow, orange: isOrange, red: isRed }"
        />
        <div class="flex-grow" />
        <div class="numbers">
          {{ carryCapacity.current }} / {{ carryCapacity.thresholds.last() }}
        </div>
      </div>
    </ProgressBar>
    <Modal v-if="showDetails" dialog large @close="showDetails = false">
      <template v-slot:title>Carry capacity</template>
      <template v-slot:contents>
        <LabeledValue label="Current weight">
          {{ carryCapacity.current }}
        </LabeledValue>
        <LabeledValue label="Burdened at">
          <span class="weight-1">
            {{ carryCapacity.thresholds[0] }}
          </span>
        </LabeledValue>
        <LabeledValue label="Heavily Burdened at">
          <span class="weight-2">
            {{ carryCapacity.thresholds[1] }}
          </span>
        </LabeledValue>
        <LabeledValue label="Overburdened at">
          <span class="weight-3">
            {{ carryCapacity.thresholds[2] }}
          </span>
        </LabeledValue>
        <hr />
        <Description>
          Carry capacity is determined by your Strength attribute
        </Description>
      </template>
    </Modal>
  </div>
</template>

<script>
import Description from "../interface/Description";
import LabeledValue from "../interface/LabeledValue";
export default {
  components: { LabeledValue, Description },
  props: {
    modifier: {
      default: 0,
    },
  },

  data: () => ({
    showDetails: false,
  }),

  subscriptions() {
    const carryCapacityStream = Rx.combineLatest(
      GameService.getRootEntityStream().pluck("carryCapacity"),
      this.$stream("modifier")
    )
      .filter(([carryCapacity]) => !!carryCapacity)
      .map(([carryCapacity, modifier]) => ({
        ...carryCapacity,
        current: Math.round(100 * (carryCapacity.current + modifier)) / 100,
      }));
    return {
      carryCapacity: carryCapacityStream,
      carryCapacityFill: carryCapacityStream.map(({ thresholds, current }) => {
        const max = thresholds.last();
        if (current > max) {
          return {
            red: 100,
          };
        }
        const colors = ["green", "yellow", "orange"];
        let soFar = 0;
        return thresholds.toObject(
          (threshold, idx) => colors[idx],
          (threshold) => {
            const value = Math.min(threshold, current) - soFar;
            soFar += value;
            return (100 * value) / max;
          }
        );
      }),
    };
  },

  computed: {
    isYellow() {
      return !!this.carryCapacityFill?.yellow;
    },
    isOrange() {
      return !!this.carryCapacityFill?.orange;
    },
    isRed() {
      return !!this.carryCapacityFill?.red;
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.text-display {
  display: flex;
  text-align: right;
  margin: 0.3rem 1rem 0;

  .numbers {
    font-size: 80%;
    @include text-outline();
  }

  .icon {
    font-size: 200%;
    width: 1rem;
    height: 1rem;
    position: absolute;
    border-radius: 50%;
    top: -0.3rem;
    right: -0.3rem;
    box-shadow: 0.2rem 0.2rem 0.4rem #222;
    border: 1px solid #222;

    background: lime;

    &.yellow {
      background: yellow;
    }
    &.orange {
      background: orange;
    }
    &.red {
      background: red;
    }
  }
}

.weight-1 {
  @include text-outline(#363600, yellow);
}
.weight-2 {
  @include text-outline(#412c00, orange);
}
.weight-3 {
  @include text-outline(#460000, red);
}
</style>
