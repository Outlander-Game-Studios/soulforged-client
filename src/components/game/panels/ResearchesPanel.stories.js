import pebbleIcon from '../../../../.storybook/mocks/assets/pebble.png'
import sharpenedStoneIcon from '../../../../.storybook/mocks/assets/sharp-stone.png'
import stoneKnifeIcon from '../../../../.storybook/mocks/assets/stone-knife.png'
import appleIcon from '../../../../.storybook/mocks/assets/apple.png'
import barkRopeIcon from '../../../../.storybook/mocks/assets/bark-rope.png'
import dragonFruitIcon from '../../../../.storybook/mocks/assets/dragonfruit.png'
import tentIcon from '../../../../.storybook/mocks/assets/tent.jpg'

export default {
  title: 'Game UI/Researches Panel',
}

let id = 0
const entity = (def) => {
  id++
  return {
    ...def,
    id: id,
  }
}

const items = [
  entity({
    amount: 2,
    publicId: 'apple',
    name: 'Apple',
    unitWeight: 1,
    actions: [
      {
        actionId: 'drop',
        label: 'Drop',
        actionPoints: 0,
        parameters: [
          {
            paramId: 'amount',
            type: 'integer',
            required: true,
            min: 1,
            max: 1,
          },
        ],
      },
    ],
    icon: appleIcon,
  }),
  entity({
    amount: 9,
    publicId: 'barkRope',
    name: 'Bark Rope',
    actions: [
      {
        actionId: 'drop',
        label: 'Drop',
        actionPoints: 0,
        parameters: [
          {
            paramId: 'amount',
            type: 'integer',
            required: true,
            min: 1,
            max: 9,
          },
        ],
      },
    ],
    icon: barkRopeIcon,
  }),
  entity({
    amount: 55,
    publicId: 'dragonfruit',
    name: 'Dragonfruit',
    unitWeight: 1,
    actions: [
      {
        actionId: 'drop',
        label: 'Drop',
        actionPoints: 0,
        parameters: [
          {
            paramId: 'amount',
            type: 'integer',
            required: true,
            min: 1,
            max: 55,
          },
        ],
      },
    ],
    icon: dragonFruitIcon,
  }),
]

const completedResearch = (researchId = 'Craft_163d2c') => ({
  researchId,
  title: 'Cutting',
  description: 'I need to find some way to cut things.',
  completed: true,
  itemsNeededCount: 1,
  difficulty: 1,
  seen: true,
  passedItems: [
    {
      publicId: 'pebble',
      icon: pebbleIcon,
      unitWeight: 1,
      toolEfficiency: {
        Hammering: 20,
      },
      toolImpacts: {},
    },
  ],
  failedItems: [],
  rewardCraftIds: [storyMocks.crafts[1].craftId, storyMocks.crafts[0].craftId],
  rewardPlanIds: [storyMocks.plans[0].planId],
})
const ongoingResearch = (researchId = 'Craft_163d2c', fav = false, seen = true) => ({
  researchId,
  title: 'Cutting',
  description: 'I need to find some way to cut things.',
  seen,
  fav,
  completed: false,
  itemsNeededCount: 5,
  difficulty: 2,
  passedItems: [
    {
      publicId: 'pebble',
      icon: pebbleIcon,
    },
  ],
  failedItems: [
    { publicId: 'stoneKnife', icon: stoneKnifeIcon },
    { publicId: 'sharpenedStone', icon: sharpenedStoneIcon },
    { publicId: '1c686b', icon: barkRopeIcon },
  ],
})

const factory =
  (onMounted = () => {}, onInit = () => {}) =>
  () => {
    GameService.mock({
      getCraftsStream: () => Rx.Observable.of(storyMocks.crafts),
      getPlansStream: () => Rx.Observable.of(storyMocks.plans),
    })

    onInit()
    mockComponent()()

    return {
      data: () => ({}),

      mounted() {
        onMounted(this)
      },

      template: `
<div>
  <div class="half-screen">
    <Container>
      <ResearchesPanel ref="researchesPanel" />
    </Container>
  </div>
</div>
`,
    }
  }

export const loading = factory(() => {
  GameService.mock({
    getResearchesStream: () => new Rx.Observable.empty(),
  })
})
export const empty = factory(
  () => {},
  () => {
    GameService.mock({
      getResearchesStream: () => Rx.Observable.of([]),
    })
  },
)
const singleOnInit = () => {
  GameService.mock({
    getResearchesStream: () => Rx.Observable.of([ongoingResearch()]),
  })
}
export const single = factory(() => {}, singleOnInit)
export const singleNew = factory(
  () => {},
  () => {
    GameService.mock({
      getResearchesStream: () => Rx.Observable.of([{ ...ongoingResearch(), seen: false }]),
    })
  },
)
export const complex = factory(
  () => {},
  () => {
    GameService.mock({
      getResearchesStream: () =>
        Rx.Observable.of([{ ...ongoingResearch(), itemsNeededCount: 25, difficulty: 25 }]),
    })
  },
)
export const selectItem = factory((vm) => {
  setTimeout(() => {
    vm.$el.querySelector('.interactive').click()
  })
}, singleOnInit)
selectItem.parameters = {
  storyshotsScope: 'extended',
}

export const selectingItem = factory((vm) => {
  setTimeout(() => {
    vm.$el.querySelector('.interactive').click()
    setTimeout(() => {
      document.querySelector('.item-selection-wrapper .item .item-icon').click()
    })
  })
}, singleOnInit)
selectingItem.parameters = {
  storyshotsScope: 'extended',
}

export const listInvalid = factory((vm) => {}, singleOnInit)
export const listInvalidEmpty = factory(
  (vm) => {
    setTimeout(() => {
      vm.$el.querySelector('.view-missed').click()
    })
  },
  () => {
    GameService.mock({
      getResearchesStream: () =>
        Rx.Observable.of([
          {
            ...ongoingResearch(),
            failedItems: [],
          },
        ]),
    })
  },
)
export const completed = factory(
  (vm) => {
    vm.$refs.researchesPanel.displayMode = 'completed'
  },
  () => {
    GameService.mock({
      getResearchesStream: () => Rx.Observable.of([completedResearch()]),
    })
  },
)
export const multiple = factory(
  () => {},
  () => {
    GameService.mock({
      getResearchesStream: () =>
        Rx.Observable.of([
          ongoingResearch(1),
          completedResearch(3),
          ongoingResearch(2),
          ongoingResearch(8, true),
          ongoingResearch(9, false, false),
          completedResearch(4),
          completedResearch(5),
          completedResearch(6),
          completedResearch(7),
        ]),
    })
  },
)

export const justCompleted = factory(
  (vm) => {
    vm.$refs.researchesPanel.showCompleted = false
    vm.$refs.researchesPanel.discoveryId = completedResearch().researchId
  },
  () => {
    GameService.mock({
      getResearchesStream: () => Rx.Observable.of([completedResearch()]),
    })
  },
)

const selectItemAndRespond = (vm, response) => {
  window.GameService.request = () => Promise.resolve(response)
  setTimeout(() => {
    document.querySelector('.item-selection-wrapper .item .item-icon').click()
    setTimeout(() => {
      document.querySelector('.modal button').click()
    })
  })
}

let researchesStream
export const actionMatchingItem = factory(
  (vm) => {
    setTimeout(() => {
      vm.$el.querySelector('.interactive').click()
      setInterval(() => {
        researchesStream.next([ongoingResearch()])
        storyMocks.modifyEntity('mainEntity', {
          inventory: entitiesMocks.mainEntity.inventory,
        })
        setTimeout(() => {
          selectItemAndRespond(vm, {
            match: true,
          })
          storyMocks.modifyEntity('mainEntity', {
            inventory: [
              entitiesMocks.mainEntity.inventory[0],
              ...entitiesMocks.mainEntity.inventory.slice(2),
            ],
          })
          researchesStream.next([
            {
              ...ongoingResearch(),
              passedItems: [
                { publicId: 'pebble', icon: pebbleIcon },
                { publicId: 'apple', icon: appleIcon },
              ],
            },
          ])
        }, 3000)
      }, 5000)
    })
  },
  () => {
    researchesStream = new Rx.ReplaySubject(1)
    researchesStream.next([ongoingResearch()])
    GameService.mock({
      getResearchesStream: () => researchesStream,
    })
  },
)
actionMatchingItem.parameters = {
  storyshots: { disable: true },
}

export const actionNonMatchingItem = factory(
  (vm) => {
    setTimeout(() => {
      vm.$el.querySelector('.interactive').click()
      setInterval(() => {
        researchesStream.next([ongoingResearch()])
        storyMocks.modifyEntity('mainEntity', {
          inventory: entitiesMocks.mainEntity.inventory,
        })
        setTimeout(() => {
          selectItemAndRespond(vm, {
            match: true,
          })
          storyMocks.modifyEntity('mainEntity', {
            inventory: [
              entitiesMocks.mainEntity.inventory[0],
              ...entitiesMocks.mainEntity.inventory.slice(2),
            ],
          })
          researchesStream.next([
            {
              ...ongoingResearch(),
              failedItems: [
                ...ongoingResearch().failedItems,
                { publicId: 'apple', icon: appleIcon },
              ],
            },
          ])
        }, 3000)
      }, 5000)
    })
  },
  () => {
    researchesStream = new Rx.ReplaySubject(1)
    researchesStream.next([ongoingResearch()])
    GameService.mock({
      getResearchesStream: () => researchesStream,
    })
  },
)
actionNonMatchingItem.parameters = {
  storyshots: { disable: true },
}

export const actionMatchingComplete = factory(
  (vm) => {
    setTimeout(() => {
      vm.$el.querySelector('.interactive').click()
      setInterval(() => {
        researchesStream.next([
          {
            ...ongoingResearch(),
            itemsNeededCount: 2,
          },
        ])
        storyMocks.modifyEntity('mainEntity', {
          inventory: entitiesMocks.mainEntity.inventory,
        })
        vm.$refs.researchesPanel.selectedResearchId = 'Craft_163d2c'
        vm.$refs.researchesPanel.discoveryId = null
        setTimeout(() => {
          selectItemAndRespond(vm, {
            match: true,
            completed: true,
          })
          storyMocks.modifyEntity('mainEntity', {
            inventory: [
              entitiesMocks.mainEntity.inventory[0],
              ...entitiesMocks.mainEntity.inventory.slice(2),
            ],
          })
          researchesStream.next([
            {
              ...ongoingResearch(),
              itemsNeededCount: 2,
              completed: true,
              passedItems: [{ icon: pebbleIcon }, { icon: appleIcon }],
              rewardCraftIds: [storyMocks.crafts[1].craftId],
            },
          ])
        }, 3000)
      }, 5000)
    })
  },
  () => {
    researchesStream = new Rx.ReplaySubject(1)
    researchesStream.next([
      {
        ...ongoingResearch(),
        itemsNeededCount: 2,
      },
    ])
    GameService.mock({
      getResearchesStream: () => researchesStream,
    })
  },
  // (vm) => {
  //   setInterval(() => {
  //     knowledgeBaseStream.next({
  //       ...knowledgeBaseTemplate,
  //       researchesIds: [
  //         {
  //           ...ongoingResearch(),
  //           itemsNeededCount: 2,
  //         },
  //       ],
  //     });
  //     vm.$refs.researchesPanel.selectedResearchId = "Craft_163d2c";
  //     vm.$refs.researchesPanel.discoveryId = null;
  //     rootEntityStream.next(rootEntityTemplate);
  //     setTimeout(() => {
  //       selectItemAndRespond(vm, {
  //         match: true,
  //         completed: true,
  //       });
  //       rootEntityStream.next({
  //         ...rootEntityTemplate,
  //         inventory: rootEntityTemplate.inventory.slice(1),
  //       });
  //       knowledgeBaseStream.next({
  //         ...knowledgeBaseTemplate,
  //         researchesIds: [
  //           {
  //             ...ongoingResearch(),
  //             itemsNeededCount: 2,
  //             completed: true,
  //             passedItems: [{ icon: pebbleIcon }, { icon: appleIcon }],
  //             rewardCraftIds: [storyMocks.crafts[1].id],
  //           },
  //         ],
  //       });
  //     }, 2000);
  //   }, 9000);
  // },
  // () => {
  //   rootEntityStream = new Rx.ReplaySubject(1);
  //   knowledgeBaseStream = new Rx.ReplaySubject(1);
  //   rootEntityStream.next(rootEntityTemplate);
  //   knowledgeBaseStream.next({
  //     ...knowledgeBaseTemplate,
  //     researchesIds: [
  //       {
  //         ...ongoingResearch(),
  //         itemsNeededCount: 2,
  //       },
  //     ],
  //   });
  //   const entitiesStreams = {
  //     ...items.toObject(
  //       (i) => i.id,
  //       (i) => Rx.Observable.of(i)
  //     ),
  //     [knowledgeBaseTemplate.id]: knowledgeBaseStream,
  //   };
  //   GameService.mock({
  //     getRootEntityStream: () => rootEntityStream,
  //     getEntityStream: (id) => entitiesStreams[id],
  //   });
  // }
)
actionMatchingComplete.parameters = {
  storyshots: { disable: true },
}
