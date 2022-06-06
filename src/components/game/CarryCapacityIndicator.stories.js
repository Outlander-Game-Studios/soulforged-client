export default {
  title: "Game UI/Carry Capacity",
};

function mockMainEntity(weight) {
  GameService.mock({
    getRootEntityStream: () =>
      Rx.Observable.of({
        carryCapacity: {
          thresholds: [20, 32, 40],
          current: weight,
        },
      }),
  });
}

export const empty = () => {
  mockMainEntity(0);
  return {
    template: `
<CarryCapacityIndicator />
`,
  };
};

export const little = () => {
  mockMainEntity(15);
  return {
    template: `
<CarryCapacityIndicator />
`,
  };
};

export const burdened = () => {
  mockMainEntity(22);
  return {
    template: `
<CarryCapacityIndicator />
`,
  };
};

export const heavyBurdened = () => {
  mockMainEntity(35);
  return {
    template: `
<CarryCapacityIndicator />
`,
  };
};

export const full = () => {
  mockMainEntity(40);
  return {
    template: `
<CarryCapacityIndicator />
`,
  };
};

export const overburdened = () => {
  mockMainEntity(80);
  return {
    template: `
<CarryCapacityIndicator />
`,
  };
};
