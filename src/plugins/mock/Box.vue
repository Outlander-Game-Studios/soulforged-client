<template>
  <HorizontalCenter>
    <Container>
      <Spaced>{{ location.id }} </Spaced>
      <Spaced>{{ settings.text }} </Spaced>
    </Container>
  </HorizontalCenter>
</template>
<script>
export default {
  props: {
    location: {},
    settings: {},
  },
};
</script>
