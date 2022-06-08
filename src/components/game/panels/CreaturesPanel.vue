<template>
  <div v-if="creatures">
    <CreatureDetailsModal
      :creatureId="showDetailsId"
      @close="showDetailsId = null"
      @action="
        showDetailsId = null;
        showingList = false;
      "
    />
    <Header v-if="!hideHeader" class="interactive" @click="showList()"
      >Creatures</Header
    >
    <LoadingPlaceholder v-if="!loadedCreatures" :size="6" />
    <div v-else-if="!loadedCreatures.length" class="empty-text">None</div>
    <HorizontalWrap v-else tight class="scroll-spacing">
      <CreatureIcon
        v-for="(stackedCreature, idx) in stackedCreatures"
        :key="idx"
        :creature="stackedCreature"
        @click="showList(stackedCreature)"
      />
    </HorizontalWrap>
    <Modal v-if="showingList" dialog large @close="showingList = false">
      <template v-slot:title> Creatures </template>
      <template v-slot:contents>
        <LoadingPlaceholder v-if="!filteredCreatures" />
        <div v-else-if="!filteredCreatures.length" class="empty-text">None</div>
        <div v-for="creature in filteredCreatures">
          <ListItem
            :lazyLoad="() => getCreatureDetailsStream(creature)"
            @click="clickHandler(creature)"
            v-if="creature"
          >
            <template v-slot:icon="{ lazyData: creatureDetails }">
              <CreatureIcon :creature="creatureDetails" />
            </template>
            <template v-slot:title="{ lazyData: creatureDetails }">
              <RichText :value="creatureDetails.name" />
            </template>
            <template v-slot:subtitle="{ lazyData: creatureDetails }">
              <Effects row :effects="allEffects(creatureDetails)" :size="3" />
            </template>
            <template v-slot:buttons="{ lazyData: creatureDetails }">
              <slot name="actions" :creature="creatureDetails" />
              <Actions
                v-if="!$slots.actions && !$scopedSlots.actions"
                :target="creatureDetails"
                @action="onAction($event)"
                noWrap
              />
            </template>
          </ListItem>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import { Rx } from "@/rx.js";
import omit from "lodash/omit.js";
import LoadingPlaceholder from "../../interface/LoadingPlaceholder";

export default {
  components: { LoadingPlaceholder },
  props: {
    header: {},
    creatures: {},
    hideHeader: {
      type: Boolean,
    },
  },

  data: () => ({
    showingList: false,
    showDetailsId: null,
  }),

  subscriptions() {
    const loadedCreaturesStream = Rx.combineLatest(
      this.$stream("creatures"),
      GameService.getRootEntityStream()
    )
      .map(([ids, mainEntity]) => ids.filter((id) => id !== mainEntity.id))
      .switchMap((ids) => GameService.getEntitiesStream(ids))
      .map((loadedCreatures) =>
        loadedCreatures.filter((c) => !c.dead).sort(creaturesSort)
      );
    return {
      loadedCreatures: loadedCreaturesStream,
    };
  },

  computed: {
    filteredCreatures() {
      return this.loadedCreatures?.filter(
        (creature) =>
          this.showingList === true ||
          this.getCreatureId(creature) === this.showingList
      );
    },
    stackedCreatures() {
      return this.deduplicateCreatures(this.loadedCreatures);
    },

    hasClick() {
      return !!this.$listeners.click;
    },
  },

  methods: {
    onAction({ result: { instant } = {} } = {}) {
      if (!instant) {
        this.showingList = false;
      }
    },

    getCreatureDetailsStream(creature) {
      return GameService.getEntityStream(creature.id, ENTITY_VARIANTS.DETAILS);
    },

    showList(stackedCreature) {
      if (stackedCreature) {
        if (stackedCreature.number === 1) {
          this.clickHandler(stackedCreature);
        } else {
          this.showingList = stackedCreature.stackId;
        }
      } else {
        this.showingList = true;
      }
    },

    clickHandler(creature) {
      this.showDetailsId = creature.id;
    },

    allEffects(creature) {
      return [...(creature.tracks || []), ...(creature.effects || [])];
    },

    getCreatureId(creature, extras = {}) {
      return JSON.stringify({
        icon: creature.icon,
        dead: creature.dead,
        ...extras,
      });
    },

    deduplicateCreatures(loadedCreatures) {
      if (!loadedCreatures) {
        return;
      }
      const LIMIT = 10;
      let splitAvatars = 0;
      let lastAvatar = -1;
      const mapped = loadedCreatures
        .map((creature, idx) => {
          if (!creature.avatar) {
            return creature;
          }
          splitAvatars++;
          if (splitAvatars < LIMIT) {
            return creature;
          }
          if (splitAvatars === LIMIT) {
            lastAvatar = { ...creature };
            return lastAvatar;
          }
          if (splitAvatars > LIMIT) {
            delete lastAvatar.avatar;
            delete lastAvatar.operationInfo;
          }
          return omit(creature, ["avatar", "operationInfo"]);
        })
        .reduce((acc, creature) => {
          const creatureId = this.getCreatureId(
            creature,
            creature.avatar
              ? {
                  uniqueId: creature.avatar,
                }
              : {}
          );
          if (!acc[creatureId]) {
            acc[creatureId] = {
              ...creature,
              number: 0,
              stackId: creatureId,
            };
          }
          acc[creatureId].number += 1;
          return acc;
        }, {});

      return Object.values(mapped);
    },
  },
};
</script>
