<template>
  <div class="combat-moves">
    <Modal v-if="showingMoveId" dialog large @close="showingMoveId = null">
      <template v-slot:title>{{ showingMove.name }}</template>
      <template v-slot:contents>
        <LoadingPlaceholder v-if="showingMoveDetails === 'loading'" />
        <CombatMoveDetails v-else :moveDetails="showingMoveDetails" />
      </template>
    </Modal>
    <component
      :is="wrap ? 'HorizontalWrap' : 'Horizontal'"
      tight
      class="wrapper-component"
    >
      <div
        v-for="move in groupedMoves"
        class="move-button-wrapper"
        v-if="
          (!!move || !noSpacing) &&
          (!autoResolveOnly || (!move.count && !move.cooldownMax))
        "
        :class="{
          'flex-grow': !move,
          'miss-req': move && move.missingReq,
          selected: move && selectedMoveId === move.moveId,
        }"
      >
        <template v-if="!!move">
          <Button
            class="move-button"
            @click="selectMove(move.moveId)"
            noPadding
          >
            <div
              v-if="currentMove && currentMove === move.moveId"
              class="current-move"
              :class="{ active: currentMoveActive }"
            />
            <div class="move-icon-wrapper">
              <img class="move-icon" :src="move.icon" />
              <div class="count-text" v-if="move.count">{{ move.count }}</div>
              <div class="move-text">{{ move.name }}</div>
              <div class="hotkey-text" v-if="hotkeysEnabled">
                {{ hotkeys[move.moveId] }}
              </div>
            </div>
          </Button>
          <div
            class="cooldown-overlay"
            v-if="!showDetailsOnClick && move.cooldown"
          >
            <div
              class="cooldown-fill"
              :style="{
                height: (100 * move.cooldown) / move.cooldownMax + '%',
              }"
            />
            <div class="cooldown-text">
              {{ min(move.cooldown, move.cooldownMax) }}
            </div>
          </div>
        </template>
      </div>
    </component>
  </div>
</template>

<script>
import attackIcon from "../../assets/ui/cartoon/icons/attack2.png";
import fleeIcon from "../../assets/ui/cartoon/icons/flee2.png";

export default {
  props: {
    currentMove: {},
    currentMoveActive: {
      type: Boolean,
    },
    wrap: {
      type: Boolean,
    },
    showDetailsOnClick: {
      type: Boolean,
    },
    noSpacing: {
      type: Boolean,
    },
    autoResolveOnly: {
      type: Boolean,
    },
    selectedMoveId: {},
    moves: {},
  },

  data: () => ({
    showingMoveId: false,
  }),

  subscriptions() {
    const movesStream = this.$stream("moves").switchMap((moves) =>
      moves
        ? Rx.Observable.of(moves)
        : GameService.getRootEntityStream()
            .filter((entity) => entity?.combatStats?.moves)
            .map((entity) => entity.combatStats.moves)
    );
    return {
      loadedMoves: movesStream,
      groupedMoves: movesStream.map((moves) => {
        const primary = [];
        const secondary = [];
        moves.forEach((move) => {
          if (move.secondary) {
            secondary.push(move);
          } else {
            primary.push(move);
          }
        });
        return [...primary, null, ...secondary];
      }),
      showingMoveDetails: this.$stream("showingMove").switchMap((move) => {
        if (!move) {
          return Rx.Observable.of(null);
        } else if (move.details) {
          return Rx.Observable.of(move);
        } else {
          return Rx.Observable.merge(
            ["loading"],
            GameService.getInfoStream(
              "CombatMove",
              {
                moveId: move.moveId,
              },
              true
            )
          );
        }
      }),
    };
  },

  computed: {
    hotkeysEnabled() {
      return !this.showDetailsOnClick && !this.autoResolveOnly;
    },

    hotkeys() {
      if (!this.hotkeysEnabled) {
        return {};
      }
      const remainingMoves = [...this.groupedMoves];
      let availableKeys = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
      ];
      const hotkeyMap = {};
      do {
        const move = remainingMoves.shift();
        if (move === null) {
          remainingMoves.reverse();
          availableKeys = ["p", "o", "i", "u", "y", "t", "r", "e", "w", "q"];
        } else {
          hotkeyMap[move.moveId] = availableKeys.shift();
        }
      } while (remainingMoves.length);
      return hotkeyMap;
    },

    showingMove() {
      if (this.showingMoveId) {
        return this.loadedMoves.find((m) => m.moveId === this.showingMoveId);
      }
      return null;
    },
  },

  mounted() {
    this.keyPressHandler = ($event) => {
      if (this.hotkeysEnabled) {
        const key = $event.key;
        const moveId = Object.keys(this.hotkeys).find(
          (moveId) => this.hotkeys[moveId] === key
        );
        if (moveId) {
          this.selectMove(moveId);
        }
      }
    };
    document.addEventListener("keypress", this.keyPressHandler);
  },

  beforeDestroy() {
    document.removeEventListener("keypress", this.keyPressHandler);
  },

  methods: {
    min: Math.min,

    selectMove(moveId) {
      if (this.showDetailsOnClick) {
        this.showingMoveId = moveId;
      } else {
        this.$emit("selected", moveId);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.combat-moves {
  font-size: 1rem;
}

.wrapper-component {
  margin-bottom: -0.3rem;
}

.move-button-wrapper {
  position: relative;
  display: flex;
  $size: 5em;
  margin-right: 0.3rem;
  margin-bottom: 0.3rem;

  .move-button {
    font-size: 1em;
  }

  &.selected {
    @include filter(brightness(1.5));
  }

  &.miss-req {
    @include filter(saturate(0));

    .move-icon-wrapper {
      &::before {
        content: "";
        position: absolute;
        $expand: 2rem;
        top: calc(-1 * $expand / 2);
        left: calc(-1 * $expand / 2);
        border-radius: 1.2rem;
        height: calc($size + $expand);
        width: calc($size + $expand);
        background: rgba(0, 0, 0, 0.6);
        z-index: 2;
      }
    }
  }

  .move-icon-wrapper {
    height: $size;
    width: $size;
  }

  .move-icon {
    position: absolute;
    $expand: 0.8rem;
    top: calc(-1 * $expand / 2);
    left: calc(-1 * $expand / 2);
    border-radius: 0.6rem;
    height: calc($size + $expand);
    width: calc($size + $expand);
    vertical-align: bottom;
  }
  .hotkey-text {
    position: absolute;
    top: -0.2em;
    left: 0.1em;
    font-size: 2.3em;
    padding-top: 0.2rem;
    z-index: 3;
  }
  .count-text {
    position: absolute;
    top: -0.5rem;
    right: 0;
    font-size: 1.8em;
    padding-top: 0.2rem;
    z-index: 3;
  }
  .move-text {
    position: absolute;
    bottom: -0.5rem;
    width: 100%;
    padding-top: 0.2rem;
    font-size: 1.2em;
    overflow: hidden;
    text-overflow: ellipsis;
    z-index: 3;
  }
}

.cooldown-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
  border-radius: 1rem;
  overflow: hidden;

  .cooldown-fill {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
  }

  .cooldown-text {
    position: absolute;
    @include text-outline();
    font-size: 2.5em;
    text-align: center;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
}

.current-move {
  $size: 3rem;
  width: $size;
  height: $size;
  position: absolute;
  z-index: 3;
  top: -0.5rem;
  left: 50%;
  margin-top: calc($size / -2);
  margin-left: calc($size / -2);
  background-image: url(ui-asset("/misc/current-move.png"));
  background-size: 100% 100%;
  background-repeat: no-repeat;

  opacity: 0.35;

  &.active {
    opacity: 1;
  }
}
</style>
