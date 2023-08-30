<template>
  <ListItem
    :iconSrc="craft.icon"
    class="craft-list-item"
    @click="enableShowDetails()"
    :lazyLoad="true"
  >
    <template v-slot:title>
      <RichText :value="craft.name" />
    </template>
    <template v-slot:subtitle>
      <div class="diagram-nowrap">
        <CraftDiagram :craft="craft" tight nonInteractive />
      </div>
      <Modal v-if="showDetails" dialog large @close="showDetails = false">
        <template v-slot:title>
          <RichText :value="craft.name" />
        </template>
        <template v-slot:contents>
          <Vertical>
            <div>
              <LabeledValue v-if="craft.skill" label="Skill">
                {{ craft.skill }}
              </LabeledValue>
              <LabeledValue
                v-if="craft.difficulty !== undefined"
                label="Difficulty"
              >
                {{ craft.difficulty }}
              </LabeledValue>
              <LabeledValue
                v-if="craft.tools && craft.tools.length"
                label="Tools required"
              >
                {{ craft.tools.join(", ") }}
              </LabeledValue>
            </div>
            <HorizontalCenter>
              <CraftDiagram
                :craft="craft"
                tight
                wrap
                :size="8"
                @action="actioned()"
              />
            </HorizontalCenter>
          </Vertical>
        </template>
      </Modal>
    </template>
    <template v-slot:buttons>
      <Button @click="startCrafting(craft)">Craft</Button>
    </template>
  </ListItem>
</template>

<script>
import exclamationIcon from "../../assets/ui/cartoon/icons/exclamation.png";

export default {
  props: {
    craft: {},
  },

  data: () => ({
    showDetails: false,
  }),

  methods: {
    enableShowDetails() {
      this.showDetails = true;
      GameService.fetchCraftDetails(this.craft.craftId);
    },
    actioned() {
      this.showDetails = false;
      this.$emit("action");
    },
    startCrafting(craft) {
      this.$emit("action");
      this.showDetails = false;
      GameService.request(REQUEST_CODES.ACTION_START_CRAFT, {
        craftId: craft.craftId,
      }).then(({ ok, message }) => {
        if (!ok && !!message) {
          ToastNotify({
            icon: exclamationIcon,
            text: message,
          });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.craft-list-item {
  .subtitle {
    width: 100% !important;
  }
}

.diagram-nowrap {
  width: 0;
}
</style>
