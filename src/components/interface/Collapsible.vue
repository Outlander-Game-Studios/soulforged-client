<template>
  <div>
    <Header @click="toggle()" class="interactive">
      <div class="header-wrapper">
        <div class="flex-grow">
          <slot name="header" />
        </div>
        <div class="indicator" :class="{ collapsed: collapsed }" />
      </div>
    </Header>
    <slot v-if="!collapsed" name="content" />
  </div>
</template>

<script>
export default {
  data: () => ({ collapsed: false }),

  methods: {
    toggle() {
      this.collapsed = !this.collapsed;
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";
.header-wrapper {
  display: flex;
}

.indicator {
  width: 1em;
  height: 1em;
  background-image: url(ui-asset("/misc/arrow_right.png"));
  background-size: 100% 100%;
  background-repeat: no-repeat;
  @include filter-fix();
  transform: rotate(90deg);
  transition: all 0.1s ease-in-out;
  transition-property: filter, transform;
  @include filter(drop-shadow(0.05em -0.05em 0.05em black));

  &.collapsed {
    transform: rotate(0deg);
    @include filter(drop-shadow(0.1em 0.05em 0.05em black));
  }
}
</style>
