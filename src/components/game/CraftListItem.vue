<template>
  <ListItem
    :iconSrc="craft.icon"
    class="craft-list-item"
    @click="showDetails = true"
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
          <HorizontalCenter>
            <CraftDiagram :craft="craft" tight :size="8" @action="actioned()" />
          </HorizontalCenter>
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
