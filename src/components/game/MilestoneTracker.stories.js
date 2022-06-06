import "./MilestoneTracker.vue";

export default {
  title: "Game UI/MilestoneTracker",
};

const factory = (message, callback) => {
  return mockComponent(
    {
      template: `
<MilestoneTracker />
  `,
    },
    () => {
      storyMocks.modifyEntity("mainEntity", {
        objective: {
          key: "story",
          text: message,
        },
      });
      callback?.();
    }
  );
};

export const base = factory("Acquire 8 stones");
base.parameters = {
  storyshotsScope: "extended",
};

export const long = factory(loremIpsum);
long.parameters = {
  storyshotsScope: "extended",
};

const objectives = [
  "Attempt to cross the brambled path",
  "Acquire 4 stones",
  "Research how to make sharp stone",
  "Acquire a sharp stone",
  "Cross the brambled path",
  "Run past the creature in the cave",
  "Leave the cave",
  "Attune to the portal",
];
export const completing = factory("Initial", () => {
  setInterval(() => {
    storyMocks.modifyEntity("mainEntity", {
      objective: {
        key: "story",
        text: random.randomItem(objectives),
      },
    });
  }, 2500);
});
completing.parameters = {
  storyshots: { disable: true },
};

export const theSameObjective = factory("Initial", () => {
  setInterval(() => {
    storyMocks.modifyEntity("mainEntity", {
      objective: {
        key: "same",
        text: "Same",
      },
    });
  }, 1500);
});
theSameObjective.parameters = {
  storyshots: { disable: true },
};

export const swappingTracked = factory("Initial", () => {
  setInterval(() => {
    storyMocks.modifyEntity("mainEntity", {
      objective: random.randomItem([
        {
          key: "sample",
          text: "Sample",
        },
        {
          key: "other",
          text: "Other",
        },
      ]),
    });
  }, 1500);
});
swappingTracked.parameters = {
  storyshots: { disable: true },
};
