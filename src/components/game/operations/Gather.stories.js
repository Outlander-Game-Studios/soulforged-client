import stoneHammerIcon from '../../../../.storybook/mocks/assets/stone-hammer.png'
import appleIcon from '../../../../.storybook/mocks/assets/apple.png'
import bruiseIcon from '../../../../.storybook/mocks/assets/bruise.png'
import inventoryIcon from '../../../assets/ui/cartoon/icons/tabs/items.png'
import OperationGather from './Gather.vue'
import { clickAndRespond, operationWrapper } from '../../../../.storybook/story-utils.js'
import { GameService } from '../../../services/game'

export default {
  title: 'Operations/Gather',
}

const resource = {
  id: 'E::1::none',
  name: 'Apples',
  icon: appleIcon,
  density: 3,
  densityName: 'plenty',
  densitySpeed: 2,
}
const startingAP = 18000
const costAP = 240
const rootEntityStream = new Rx.ReplaySubject(1)

const factory =
  (onMounted = () => {}, onDestroyed = () => {}, resourceData = resource) =>
  () => {
    GameService.mockRequest(REQUEST_CODES.COMMENCE_OPERATION, () => commenceResult)
    GameService.mock({
      getEntityStream: () => Rx.Observable.of(resourceData),
      getRootEntityStream: () => rootEntityStream,
    })

    rootEntityStream.next({
      actionPoints: startingAP,
      actionPointsMax: 36000,
    })

    return {
      data: () => ({
        inventoryIcon,
        operation: {
          type: 'GatherOperation',
          context: {
            resource: resource.id,
            craftId: '4ccf1f',
            unitCost: costAP,
            tools: ['Hammering'],
            toolsSelected: {
              Hammering: {
                icon: stoneHammerIcon,
                efficiency: 100,
                toolType: 'Hammering',
              },
            },
            skillInfo: {
              skill: 'Crafting',
              skillLevel: 0,
              skillGainMult: 4,
              successChance: 3,
              accidentChance: 2,
              accidentSeverity: 1,
            },
          },
        },
      }),

      components: {
        OperationGather,
      },

      mounted() {
        onMounted(this)
      },

      beforeUnmount() {
        onDestroyed(this)
      },

      template: operationWrapper(`<OperationGather ref="operation" :operation="operation" />`),
    }
  }

export const base = factory()
export const noTool = factory((vm) => {
  vm.operation.context.tools = []
  vm.operation.context.toolsSelected = {}
})
export const noToolSelected = factory((vm) => {
  vm.operation.context.toolsSelected = {
    Hammering: {
      toolType: 'Hammering',
    },
  }
})

export const execution = factory(
  (vm) => {
    const starting = 17
    const results = [0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]
    const performedAmount = results.length
    vm.$refs.operation.amount = starting
    clearInterval(vm.interval)
    vm.interval = setInterval(() => {
      rootEntityStream.next({
        actionPoints: startingAP,
        actionPointsMax: 36000,
      })
      vm.$refs.operation.amount = starting
      setTimeout(() => {
        clickAndRespond(vm, {
          orderedAmount: starting,
          amount: starting - performedAmount,
          item: {
            icon: appleIcon,
          },
          results: [...results],
          statusChanges: [
            {
              icon: bruiseIcon,
              text: 'Injury',
              subtext: 'Bruise',
            },
          ],
        })
        rootEntityStream.next({
          actionPoints: startingAP - costAP * performedAmount,
          actionPointsMax: 36000,
        })
      }, 1000)
    }, 4000)
  },
  (vm) => {
    clearInterval(vm.interval)
  },
)
execution.parameters = {
  storyshots: { disable: true },
}

export const executionExhausted = factory(
  (vm) => {
    const starting = 17
    const results = [0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]
    const performedAmount = results.length
    vm.$refs.operation.amount = starting
    clearInterval(vm.interval)
    vm.interval = setInterval(() => {
      rootEntityStream.next({
        actionPoints: startingAP,
        actionPointsMax: 36000,
      })
      vm.$refs.operation.amount = starting
      setTimeout(() => {
        clickAndRespond(vm, {
          orderedAmount: starting,
          amount: starting - performedAmount,
          item: {
            icon: appleIcon,
          },
          results: [...results],
          statusChanges: [
            {
              icon: bruiseIcon,
              text: 'Injury',
              subtext: 'Bruise',
            },
          ],
        })
        rootEntityStream.next({
          actionPoints: startingAP - costAP * performedAmount,
          actionPointsMax: 36000,
        })
        setTimeout(() => {
          vm.operation.context.resource = null
          vm.operation = { ...vm.operation }
        }, 500)
      }, 1000)
    }, 4000)
  },
  (vm) => {
    clearInterval(vm.interval)
  },
)
executionExhausted.parameters = {
  storyshots: { disable: true },
}

export const resourceExhausted = factory(
  () => {},
  () => {},

  null,
)
