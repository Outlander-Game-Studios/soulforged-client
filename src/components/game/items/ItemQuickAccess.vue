<template>
  <Horizontal tight>
    <Item
      v-for="item in useableItems"
      :key="item.id"
      :data="item"
      @click="useItem(item)"
    />
  </Horizontal>
</template>

<script>
const USEABLES = ["use"];

export default {
  subscriptions() {
    const mainEntityStream = GameService.getRootEntityStream();
    return {
      useableItems: GameService.getInventoryStream(
        mainEntityStream
      ).map((items) => items.filter((item) => this.getUseableAction(item))),
    };
  },

  methods: {
    getUseableAction(item) {
      return item.actions.find((action) => USEABLES.includes(action.actionId));
    },

    useItem(item) {
      const action = this.getUseableAction(item);
      GameService.performAction(item, action, { amount: 1 });
    },
  },
};
</script>

<style scoped lang="scss"></style>
