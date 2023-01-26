<script>
console.log("App styles included");
</script>

<style lang="scss">
@import "../../utils.scss";

@font-face {
  font-family: Booter;
  src: url("../../assets/fonts/booter/BOOTERFZ.ttf");
}

html,
html * {
  font-family: serif;
}

pre {
  margin: 0;
}

a,
a.visited {
  color: saddlebrown;
}

:root {
  --app-height: 100vh;
  --app-width: 100vw;
  --app-min-size: 100vmin;
}

html,
body {
  overflow: hidden; // prevent bounce on iOS
  width: 100vw;
  height: 100vh;
  height: var(--app-height);
  position: relative;
}

html {
  font-size: 12px;

  @include touch-device() {
    cursor: none;
  }
}

body {
  margin: 0;
  font-size: 2rem;
  cursor: default;

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

.nowrap {
  white-space: nowrap;
}

.interactive {
  @include interactive();
}
.interactive-alt:hover {
  cursor: pointer;
  @include filter(brightness(1.2));
}

.relative {
  position: relative;
}
.flex {
  display: flex;
}
.flex-grow {
  flex-grow: 1;

  &.shrink {
    height: 0;
  }
}

.empty-text {
  text-align: center;
  padding: 1rem;
  font-style: italic;
}

.important-text {
  text-align: center;
  font-style: italic;
}

.clear-both {
  clear: both;
}

@keyframes blink {
  0% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(2);
  }
  100% {
    filter: brightness(1);
  }
}

.half-screen {
  height: 100%;
  width: 40rem;
  right: 0;
  position: absolute;
  z-index: 10;

  @media (orientation: portrait) {
    width: 100%;
    left: auto;
    bottom: 0;
    height: 40rem;
  }
}

.error-text {
  padding: 1rem 0;
  font-size: 80%;
  font-style: italic;
  color: darkred;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-in;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease-in;
  margin-top: 0;
}
.fade-slide-enter,
.fade-slide-leave-to {
  opacity: 0;
  margin-top: -2rem;
}

.fade-expand-enter-active,
.fade-expand-leave-active {
  transition: opacity 1s ease-in, max-height 2s ease-in;
  max-height: var(--app-height);
  overflow: hidden;
}
.fade-expand-enter,
.fade-expand-leave-to {
  opacity: 0;
  max-height: 0;
}

label {
  display: block;
  padding: 0.3rem 0.1rem;
}

.reward-transition-enter-active,
.reward-transition-leave-active {
  transition: all 0.5s ease-out;
  counter-increment: section;
  @for $i from 0 through 20 {
    &:nth-child(#{$i}) {
      transition-delay: calc(0.4s * #{$i - 1});
    }
  }
}
.reward-transition-enter,
.reward-transition-leave-to {
  opacity: 0;
  max-height: 0;
}

.no-wrap {
  white-space: nowrap;
}

.info-panel-with-icon {
  display: flex;

  .info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  > .icon {
    margin-left: 1rem;
  }
}

.scroll-spacing {
  @include touch-scroll-space();
}

.text-good {
  @include text-good();
}
.text-neutral {
  @include text-outline();
}
.text-bad {
  @include text-bad();
}

@keyframes shine {
  0% {
    background-position: 4.5rem;
  }
  20% {
    background-position: -4.5rem;
  }
  100% {
    background-position: -4.5rem;
  }
}

.droppable-frames {
  z-index: 50;
  position: absolute;
  @include fill();
  display: flex;

  .droppable {
    flex-grow: 1;
    margin: 0.3rem;
    border: 0.4rem dashed #725208;
    outline: 1px solid black;
    background: rgba(193, 141, 107, 0.8);
    border-radius: 1rem;
    @include text-outline(black, goldenrod);
    font-size: 125%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &:hover {
      @include filter(saturate(1.2) brightness(1.2));
    }
  }
}

.float-left {
  float: left;
  margin-right: 1rem;
}

.header-button {
  font-size: 1.5rem;
  line-height: 2rem;
  height: 2rem;
  padding: 0 0.5rem;
  display: block;
}

.highlight-problem {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-top;
  background-image: url(ui-asset("/icons/problem.png"));
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.big-warning {
  @include big-warning();
}

.overflow-hidden {
  overflow: hidden;
}
</style>
