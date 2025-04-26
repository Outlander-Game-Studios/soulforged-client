<template>
  <div class="game-title">
    <div class="logo" />
    <div class="text">Soulforged</div>
    <!--    <div class="early-access">-->
    <!--      <Header alt2>-->
    <!--        Early access-->
    <!--        <Help title="About Early Access">-->
    <!--          <HelpEarlyAccess />-->
    <!--        </Help>-->
    <!--      </Header>-->
    <!--    </div>-->
  </div>
</template>

<style scoped lang="scss">
@use '../../utils.scss';

.game-title {
  display: flex;
  width: 7.5em;
  background: utils.ui-asset('/game-title/background.png') center center no-repeat;
  background-size: 100% auto;
  position: relative;
}

.early-access {
  position: absolute;
  right: 0.5em;
  bottom: 0.05em;
  font-size: 90%;
}

.logo {
  height: 2.6em;
  width: 2.5em;
  background: utils.ui-asset('/game-title/logo.png') center center no-repeat;
  background-size: auto 100%;
  z-index: 2;
  position: relative;
}

.text {
  height: 2.6em;
  line-height: 2.6em;
  padding-right: 2rem;
  @include utils.text-outline();
}
</style>
