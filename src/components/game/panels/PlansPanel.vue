<template>
  <div>
    <Header>Construction</Header>
    <div v-if="!plans">
      <LoadingPlaceholder />
    </div>
    <div v-else-if="!plans.length" class="empty-text">None</div>
    <div v-for="plan in plans">
      <PlanListItem :plan="plan" />
    </div>
  </div>
</template>

<script>
export default {
  subscriptions() {
    return {
      plans: GameService.getPlansStream(),
    };
  },
};
</script>
