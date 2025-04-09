<template>
  <div>
    <LabeledValue label="Space available">{{ location.spacing }}</LabeledValue>
  </div>
</template>

<script>
export default rxComponent({
  subscriptions() {
    return { location: GameService.getLocationStream() }
  },
})
</script>

<style scoped lang="scss"></style>
