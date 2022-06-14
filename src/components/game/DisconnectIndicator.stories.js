import Main from "../../views/Main.vue";

export default {
  title: "Game UI/Disconnect",
};

export const shownStage1 = () => {
  GameService.mock({
    getDisconnectionDetectedStream: () => Rx.Observable.of(1),
  });

  return {
    template: `
<div>
  <DisconnectIndicator />
</div>
`,
  };
};

export const shownStage2 = () => {
  GameService.mock({
    getDisconnectionDetectedStream: () => Rx.Observable.of(2),
  });

  return {
    template: `
<div>
  <DisconnectIndicator />
</div>
`,
  };
};

export const hidden = () => {
  GameService.mock({
    getDisconnectionDetectedStream: () => Rx.Observable.of(0),
  });

  return {
    template: `
<div>
  <DisconnectIndicator />
</div>
`,
  };
};
hidden.parameters = {
  storyshots: { disable: true },
};

export const inAndOutStage1 = () => {
  const stream = new Rx.ReplaySubject(1);
  let state = 0;
  stream.next(state);

  setInterval(() => {
    state = 1 - state;
    stream.next(state);
  }, 1000);

  GameService.mock({
    getDisconnectionDetectedStream: () => stream,
  });

  return {
    template: `
<div>
  <DisconnectIndicator />
</div>
`,
  };
};
inAndOutStage1.parameters = {
  storyshots: { disable: true },
};

export const inAndOutStage2 = () => {
  const stream = new Rx.ReplaySubject(1);
  let state = 1;
  stream.next(state);

  setInterval(() => {
    state = 3 - state;
    stream.next(state);
  }, 1000);

  GameService.mock({
    getDisconnectionDetectedStream: () => stream,
  });

  return {
    template: `
<div>
  <DisconnectIndicator />
</div>
`,
  };
};
inAndOutStage2.parameters = {
  storyshots: { disable: true },
};

const factory = (onCreate = () => {}) =>
  mockComponent(
    {
      components: {
        Main,
      },

      template: `
<Main />
`,
    },
    () => {},
    () => {
      GameService.mock({
        request: () => new Promise(() => {}),
      });
      storyMocks.modifyEntity("location", {
        creatures: [
          mockEntityId("mainEntity2"),
          mockEntityId("mainEntity"),
          mockEntityId("mob1"),
          mockEntityId("mob1"),
        ],
      });
      onCreate();
    }
  );

export const withLayoutStage1 = factory(() => {
  GameService.mock({
    getDisconnectionDetectedStream: () => Rx.Observable.of(1),
  });
});
withLayoutStage1.parameters = {
  storyshotsScope: "extended",
};

export const withLayoutStage2 = factory(() => {
  GameService.mock({
    getDisconnectionDetectedStream: () => Rx.Observable.of(2),
  });
});
withLayoutStage2.parameters = {
  storyshotsScope: "extended",
};
