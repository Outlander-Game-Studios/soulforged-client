<template>
  <span class="indicator-construction" />
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
@import "../../../utils.scss";

.indicator-construction {
  display: inline-block;
  vertical-align: text-bottom;
  background-image: url(ui-asset(
    "/icons/indicators/under-construction.png",
    "../"
  ));
  width: 1em;
  height: 1em;
  background-size: 100% 100%;
}
</style>
