import hungerIcon from "../../../.storybook/mocks/assets/hunger.png";

export default {
  title: "Game UI/Creature Details",
};

export const loadingDetails = mockComponent(
  {
    data: () => ({
      mob: entitiesMocks.mob1,
    }),
    template: `<CreatureDetailsModal :creatureId="mob.id" />`,
  },
  () => {},
  () => {
    GameService.mock({
      request: () => new Promise(() => {}),
    });
  }
);

const attackInfo = {
  damage: {
    "Cut damage": "1 ‒ 4",
    "Pierce damage": "1 ‒ 1",
    "Blunt damage": "1 ‒ 2",
  },
  hitRating: 60,
};
const defenseInfo = {
  armour: [
    { label: "Cut Resistance", value: 2 },
    { label: "Blunt Resistance", value: 2 },
    { label: "Pierce Resistance", value: 2 },
  ],
  defenseRating: 10,
};
const items = [hungerIcon];

const factory = (payload = {}) =>
  mockComponent(
    {
      data: () => ({
        mob: entitiesMocks.mob1,
      }),
      template: `<CreatureDetailsModal :creatureId="mob.id" />`,
    },
    () => {},
    () => {
      GameService.mock({
        request: () =>
          Promise.resolve({
            mobExpLevel: 0,
            expProgress: 0,
            ...payload,
          }),
      });
    }
  );

export const level0 = factory();
export const level1 = factory({
  mobExpLevel: 1,
  expProgress: 10,
  ...attackInfo,
});
export const level2 = factory({
  mobExpLevel: 2,
  expProgress: 50,
  ...attackInfo,
  ...defenseInfo,
});
export const level3 = factory({
  mobExpLevel: 3,
  maxLevel: true,
  ...attackInfo,
  ...defenseInfo,
  items,
});
