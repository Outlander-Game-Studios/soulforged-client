<template></template>

<style lang="scss">
@use '../../utils';

$size: 2.5rem;

::-webkit-scrollbar {
  width: $size;
  height: $size;
}

::-webkit-scrollbar-corner {
  background: black;
}

::-webkit-scrollbar-button:single-button {
  height: $size;
  width: $size;
  background-size: 100% 100%;
  cursor: pointer;
}

::-webkit-scrollbar-button:single-button:vertical:decrement {
  background-image: url(ui-asset('/scroll-bar/up.jpg'));
  &:hover {
    background-image: url(ui-asset('/scroll-bar/up_hover.jpg'));
  }
  &:active {
    background-image: url(ui-asset('/scroll-bar/up_active.jpg'));
  }
}
::-webkit-scrollbar-button:single-button:vertical:increment {
  background-image: url(ui-asset('/scroll-bar/down.jpg'));
  &:hover {
    background-image: url(ui-asset('/scroll-bar/down_hover.jpg'));
  }
  &:active {
    background-image: url(ui-asset('/scroll-bar/down_active.jpg'));
  }
}

::-webkit-scrollbar-button:single-button:horizontal:decrement {
  background-image: url(ui-asset('/scroll-bar/left.jpg'));
  &:hover {
    background-image: url(ui-asset('/scroll-bar/left_hover.jpg'));
  }
  &:active {
    background-image: url(ui-asset('/scroll-bar/left_active.jpg'));
  }
}
::-webkit-scrollbar-button:single-button:horizontal:increment {
  background-image: url(ui-asset('/scroll-bar/right.jpg'));
  &:hover {
    background-image: url(ui-asset('/scroll-bar/right_hover.jpg'));
  }
  &:active {
    background-image: url(ui-asset('/scroll-bar/right_active.jpg'));
  }
}

::-webkit-scrollbar-track {
  border-width: 0.45rem;
  border-style: solid;
  border-image: url(ui-asset('/scroll-bar/track.jpg')) 7;
  background: black;
}

::-webkit-scrollbar-thumb {
  border-width: 0.5rem;
  border-style: solid;
  border-image: url(ui-asset('/scroll-bar/knob.jpg')) 8;
  background-image: url(ui-asset('/scroll-bar/knob_bg.jpg'));
  background-size: 100% 100%;
  &:hover {
    border-image: url(ui-asset('/scroll-bar/knob_hover.jpg')) 8;
    background-image: url(ui-asset('/scroll-bar/knob_bg_hover.jpg'));
  }
}
</style>
