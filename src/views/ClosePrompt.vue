<template>
  <div class="login-wrapper">
    <AutoSizer />
    <div class="spacer"></div>
    <div class="main-layout">
      <HorizontalCenter>
        <Container borderType="alt" :borderSize="1.5">
          <Spaced>
            <div class="main-text">You can close this window now.</div>
          </Spaced>
        </Container>
      </HorizontalCenter>
    </div>
    <div class="spacer"></div>
    <div class="spacer"></div>
  </div>
</template>

<script>
export default {
  name: 'ClosePrompt',

  data: () => ({}),
}
</script>

<style scoped lang="scss">
@use '../utils.scss';

.login-wrapper {
  padding: 3rem;
  box-sizing: border-box;
  height: 100%;
  max-height: 100%;
  overflow: auto;
  background-image: utils.ui-asset('/backdrops/main.jpg', 'src/');
  background-size: cover;
  background-position: center center;
  display: flex;
  flex-direction: column;
}

.main-layout {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.game-title-container {
  font-size: 250%;
  margin-bottom: 1.5rem;
}

.main-text {
  padding: 0.5rem 1.5rem;
  font-size: 125%;
  text-align: center;
}

.login-error-text {
  padding: 0.5rem 1.5rem;
  font-size: 125%;
  @include utils.text-bad();
}

.spacer {
  flex-grow: 1;
}
</style>
