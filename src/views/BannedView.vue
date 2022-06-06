<template>
  <div class="banned-frame">
    <AutoSizer />
    <div class="banned-text-wrapper">
      <div class="banned-text">
        <div class="banned">You are banned</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BannedView",

  subscriptions() {},

  methods: {},
};
</script>

<style scoped lang="scss">
.banned-frame {
  text-align: center;
  color: red;
  background: black;
  text-transform: uppercase;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99001;

  .banned {
    font-size: 12vmin;
  }

  .banned-text-wrapper {
    padding: 40vh 0 0;
    animation-delay: 4.5s;
  }
}
</style>
