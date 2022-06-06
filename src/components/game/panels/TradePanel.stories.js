export default {
  title: "Game UI/Trade Panel",
};

const factory = (onCreated) =>
  mockComponent(
    {
      template: `
<Container>
  <TradePanel />
</Container>
`,
    },
    undefined,
    onCreated
  );

export const sample = factory();
export const noItems = factory(() => {
  storyMocks.modifyEntity("trade", {
    me: {
      ...entitiesMocks.trade.me,
      items: [],
    },
    them: {
      ...entitiesMocks.trade.them,
      items: [],
    },
  });
});

export const lotsOfItems = factory(() => {
  const item = entitiesMocks.trade.me.items[0];
  storyMocks.modifyEntity("trade", {
    me: {
      ...entitiesMocks.trade.me,
      items: Array.create(40).map(() => item),
    },
    them: {
      ...entitiesMocks.trade.them,
      items: Array.create(40).map(() => item),
    },
  });
});

export const blockAcceptance = factory(() => {
  storyMocks.modifyEntity("trade", {
    canAccept: false,
  });
});

export const blockUpdate = factory(() => {
  storyMocks.modifyEntity("trade", {
    canUpdate: false,
  });
});

export const meAccepted = factory(() => {
  storyMocks.modifyEntity("trade", {
    me: {
      ...entitiesMocks.trade.me,
      accepted: true,
    },
  });
});

export const themAccepted = factory(() => {
  storyMocks.modifyEntity("trade", {
    them: {
      ...entitiesMocks.trade.them,
      accepted: true,
    },
  });
});

export const bothAccepted = factory(() => {
  storyMocks.modifyEntity("trade", {
    canUpdate: false,
    me: {
      ...entitiesMocks.trade.me,
      accepted: true,
    },
    them: {
      ...entitiesMocks.trade.them,
      accepted: true,
    },
  });
});

export const errorsReported = factory(() => {
  storyMocks.modifyEntity("trade", {
    errors: [
      `Bobby doesn't have all of the items.`,
      `Jane doesn't have enough essence.`,
    ],
  });
});

export const cancellingTrade = factory(() => {
  setTimeout(() => {
    document.querySelector("button.type-reject").click();
  });
});

export const addingItem = factory(() => {
  setTimeout(() => {
    document.querySelector(".add-item-icon").click();
  });
});

export const addingItemSelected = factory(() => {
  setTimeout(() => {
    document.querySelector(".add-item-icon").click();
    setTimeout(() => {
      document.querySelectorAll(".modal .item-button")[1].click();
    });
  });
});

export const removingItem = factory(() => {
  setTimeout(() => {
    document.querySelectorAll(".item-icon.interactive")[1].click();
  });
});

export const setEssence = factory(() => {
  setTimeout(() => {
    document.querySelector(".currency-value.flipped").click();
  });
});

export const cancelled = factory(() => {
  storyMocks.modifyEntity("trade", {
    cancelled: true,
    canUpdate: false,
  });
});

export const completed = factory(() => {
  storyMocks.modifyEntity("trade", {
    completed: true,
    canUpdate: false,
    me: {
      ...entitiesMocks.trade.me,
      accepted: true,
    },
    them: {
      ...entitiesMocks.trade.them,
      accepted: true,
    },
  });
});
