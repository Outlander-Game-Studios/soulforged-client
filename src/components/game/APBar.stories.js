import { Rx } from "@/rx.js";

export default {
  title: "Game UI/APBar",
};

const factory = (actionPoints, actionPointsMax, consideredAP = 0) => () => {
  ControlsService.mock({
    getConsideredAPStream: () => Rx.Observable.of(consideredAP),
  });
  GameService.mock({
    getRootEntityStream: () =>
      Rx.Observable.of({
        nextAP: {
          gain: 15,
          nextTickSeconds: 15,
        },
        actionPoints,
        actionPointsMax,
      }),
  });
  return {
    template: "<APBar />",
  };
};

export const Empty = factory(0, 36000);
export const Third = factory(12000, 36000);
export const Half = factory(18000, 36000);
export const Full = factory(36000, 36000);

export const PendingPart = factory(10000, 36000, 4000);
export const PendingPartLow = factory(3000, 36000, 2900);
export const PendingPartHigh = factory(35800, 36000, 2900);
export const PendingPartTiny = factory(10000, 36000, 400);
export const PendingPartTinyLow = factory(500, 36000, 400);
export const PendingPartTinyHigh = factory(35800, 36000, 400);
export const PendingAll = factory(10000, 36000, 10000);
export const PendingOverTiny = factory(10000, 36000, 10001);
export const PendingOver = factory(10000, 36000, 12000);
export const PendingOverFull = factory(36000, 36000, 40000);
export const PendingInfinity = factory(10000, 36000, Infinity);
