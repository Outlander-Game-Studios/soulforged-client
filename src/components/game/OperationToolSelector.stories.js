import "./Location.vue";

export default {
  title: "Game UI/OperationToolSelector",
};

const factory = (onMounted, onCreate) => {
  return mockComponent(
    {
      data: () => ({
        operation: storyMocks.operations.craft,
      }),

      template: `
<div>
  <OperationToolSelector :operation="operation" />
</div>
  `,
    },
    onMounted,
    onCreate
  );
};

export const base = factory();
export const selectingItems = factory((vm) => {
  vm.$el.querySelector(".icon-wrapper").click();
});
export const selectingItemsEmpty = factory(
  (vm) => {
    vm.$el.querySelector(".icon-wrapper").click();
  },
  () => {
    GameService.mock({
      getLocationStream: () =>
        Rx.Observable.of({
          ...entitiesMocks.location,
          structures: [],
        }),
      getRootEntityStream: () =>
        Rx.Observable.of({
          ...entitiesMocks.mainEntity,
          inventory: [],
        }),
    });
  }
);
