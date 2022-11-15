<template>
  <div>
    <Header class="interactive" @click="showList()">Resources</Header>
    <LoadingPlaceholder v-if="!loadedResources" :size="6" />
    <div v-else-if="!loadedResources.length" class="empty-text">None</div>
    <HorizontalWrap v-else tight class="scroll-spacing">
      <ResourceIcon
        v-for="(resource, idx) in loadedResources"
        :key="idx"
        :resource="resource"
        :size="6"
        class="interactive"
        @click="showDetails = resource"
      />
    </HorizontalWrap>
    <Modal v-if="showingList" dialog large @close="showingList = false">
      <template v-slot:title> Resources </template>
      <template v-slot:contents>
        <div v-if="!loadedResources.length" class="empty-text">None</div>
        <div v-else v-for="resource in loadedResources">
          <ListItem :iconSrc="resource.icon" @click="showDetails = resource">
            <template v-slot:icon>
              <ResourceIcon :resource="resource" :size="6" />
            </template>
            <template v-slot:title>
              <RichText :value="resource.name" /> ({{ resource.densityName }})
            </template>
            <template v-slot:buttons>
              <Actions
                :target="resource"
                @action="showingList = false"
                noWrap
              />
            </template>
          </ListItem>
        </div>
      </template>
    </Modal>
    <Modal v-if="showDetails" dialog large @close="showDetails = false">
      <template v-slot:title>
        <RichText :value="showDetails.name" />
      </template>
      <template v-slot:contents>
        <Vertical>
          <div>
            <div class="icon-wrapper">
              <ResourceIcon :resource="showDetails" size="11" />
            </div>
            <LabeledValue label="Density">
              {{ showDetails.densityName }}
              <IndicatorResourceDensity
                class="density"
                :density="showDetails.density"
                highRes
              />
              &nbsp;
              <HelpResourceDensity :resource="showDetails" />
            </LabeledValue>
          </div>
          <Actions
            :target="showDetails"
            @action="
              showingList = false;
              showDetails = false;
            "
          />
        </Vertical>
      </template>
    </Modal>
  </div>
</template>

<script>
import { Rx } from "@/rx.js";

export default {
  props: {
    resources: {},
  },

  data: () => ({
    showDetails: false,
    showingList: false,
  }),

  subscriptions() {
    return {
      loadedResources: this.$stream("resources")
        .switchMap((ids) => GameService.getEntitiesStream(ids))
        .map((resources) =>
          resources
            .filter((r) => !!r)
            .sort((a, b) => {
              if (a.fight !== b.fight) {
                return a.fight ? 1 : -1;
              }
              return a.id - b.id;
            })
        ),
    };
  },

  methods: {
    showList() {
      this.showingList = true;
    },
  },
};
</script>

<style scoped lang="scss">
.icon-wrapper {
  float: right;
}
</style>
