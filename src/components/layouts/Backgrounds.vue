<script>
global.BACKGROUNDS = [
  'none',
  'base',
  'alt',
  'alt2',
  'alt3',
  'self',
  'danger',
  'danger-low',
  'severity--5',
  'severity--4',
  'severity--3',
  'severity--2',
  'severity--1',
  'severity-0',
  'severity-1',
  'severity-2',
  'severity-3',
  'severity-4',
  'severity-5',
]

export default {}
</script>

<style lang="scss">
@use 'sass:map';
@use '../../utils.scss';

@mixin effect-sev-background($color, $second: black) {
  background-image: radial-gradient($color, $second);
}

@keyframes effect-max-severity {
  0% {
    background-size: 100% 100%;
  }
  50% {
    background-size: 200% 200%;
  }
  100% {
    background-size: 100% 100%;
  }
}

.background-none {
  background: transparent;
}
.background-base {
  @include utils.theme-background();
}
.background-alt {
  @include utils.theme-background-alt();
}
.background-alt2 {
  @include utils.theme-background-alt-2();
}
.background-alt3 {
  @include utils.theme-background-alt-3();
}
.background-self {
  @include utils.theme-background-self();
}
.background-danger {
  @include utils.theme-background-danger();
}
.background-danger-low {
  @include utils.theme-background-danger-low();
}
.background-important {
  @include utils.theme-background-important();
}
.background-severity--5 {
  @include effect-sev-background(#19cb00);
}
.background-severity--4 {
  @include effect-sev-background(#00a123);
}
.background-severity--3 {
  @include effect-sev-background(#008b41);
}
.background-severity--2 {
  @include effect-sev-background(#52cc94);
}
.background-severity--1 {
  @include effect-sev-background(#469eb0);
}
.background-severity-0 {
  @include effect-sev-background(#787c7b);
}
.background-severity-1 {
  @include effect-sev-background(tan);
}
.background-severity-2 {
  @include effect-sev-background(darkorange);
}
.background-severity-3 {
  @include effect-sev-background(red);
}
.background-severity-4 {
  @include effect-sev-background(red, #810000);
  //background-color: black;
  //background-repeat: no-repeat;
  //background-image: utils.ui-asset("/backgrounds/severity-blink.gif");
  //background-position: center center;
  //background-size: 100%;
  //border-radius: 0 !important;
}
</style>
