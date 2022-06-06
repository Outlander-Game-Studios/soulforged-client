<template>
  <div class="tab-wrapper" v-if="visible" :key="header" :class="{ flex: flex }">
    <div class="tab">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    header: {},
    title: {},
    indicator: {},
    indicatorStyle: {},
    flex: {
      type: Boolean,
    },
  },

  data: () => ({
    visible: false,
  }),

  watch: {
    indicator() {
      this.getTabsParent().updateTab(this);
    },
    indicatorStyle() {
      this.getTabsParent().updateTab(this);
    },
  },

  mounted() {
    const nodes = [].slice
      .call(this.$el.parentNode.childNodes)
      .filter((node) => node.nodeType !== node.TEXT_NODE);
    const idx = nodes.indexOf(this.$el);

    this.getTabsParent().registerTab(
      idx,
      this.header,
      this.setVisibility,
      this
    );
  },

  destroyed() {
    this.getTabsParent().unregisterTab(this.header);
  },

  methods: {
    setVisibility(visible) {
      this.visible = visible;
    },

    getTabsParent() {
      return this.$parent.$parent;
    },
  },
};
</script>

<style scoped lang="scss">
.tab-wrapper {
  &.flex {
    &,
    .tab {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
  }
}
</style>
