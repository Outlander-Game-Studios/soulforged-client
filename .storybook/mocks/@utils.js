import sampleMapImage from './assets/map.jpg'
import '../../common/utils/static.js'
import { Rx } from '../../src/rx.js'
import flatten from 'lodash/flatten.js'

const CONTROL_TYPES = {
  string: 'text',
  boolean: 'boolean',
}
const pluginParamsMap = {}
const pluginParams = flatten(
  (window.allPlugins || []).map((def) => {
    if (!def.enabled || def.error) {
      return []
    }
    const key = `Plugin ${def.name}: Enabled`
    pluginParamsMap[key] = [def.id, 'enabled']
    return [
      {
        key,
        value: false,
        spec: {
          control: { type: 'boolean' },
        },
      },
      ...(def.settings || []).map((setting) => {
        const key = `Plugin ${def.name}: ${setting.name}`
        pluginParamsMap[key] = [def.id, setting.id]
        return {
          key,
          value: null,
          spec: {
            control: { type: CONTROL_TYPES[setting.type] },
            if: { arg: `Plugin ${def.name}: Enabled`, truthy: true },
          },
        }
      }),
    ]
  }),
)

global.loremIpsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

global.IDS = {}
global.idToIdentifier = {}
global.entitiesMocks = {}

let ids = 90000
let idsGenerated = false
global.mockEntity = (identifier, definitionFn) => {
  const id = ids++
  onIdsGenerated(() => {
    entitiesMocks[identifier] = {
      ...entitiesMocks[identifier],
      ...definitionFn(),
    }
  })
  idToIdentifier[id] = identifier
  return (entitiesMocks[identifier] = {
    ...(entitiesMocks[identifier] || {}),
    id,
  })
}
const entityGenerators = []
global.onIdsGenerated = (callback) => {
  if (!idsGenerated) {
    entityGenerators.push(callback)
  } else {
    callback()
  }
}
global.allIdsGenerated = () => {
  console.log(`Generating ${entityGenerators.length} entities payloads...`)
  entityGenerators.forEach((callback) => callback())
  idsGenerated = true
  console.log('Payloads ready')
}

global.mockEntityId = (identifier) => {
  if (!entitiesMocks[identifier]) {
    throw new Error(
      `Invalid entityId ${identifier}, available: ${Object.keys(entitiesMocks).join(', ')}`,
    )
  }
  return entitiesMocks[identifier].id
}
let entityStreams = {}
const stream = (id) => {
  if (!entityStreams[id]) {
    entityStreams[id] = new Rx.ReplaySubject(1)
    entityStreams[id].next(entitiesMocks[idToIdentifier[id]])
  }
  return entityStreams[id]
}
global.mockComponent = (
  definition,
  onMounted = () => {},
  onCreate = () => {},
  onDestroyed = () => {},
) => {
  const storyFunction = (args) => {
    const updatedPluginSettings = {}
    Object.keys(args || {}).forEach((key) => {
      if (pluginParamsMap[key]) {
        const [plugin, setting] = pluginParamsMap[key]
        if (!updatedPluginSettings[plugin]) {
          updatedPluginSettings[plugin] = {}
        }
        updatedPluginSettings[plugin][setting] = args[key]
      }
    })
    PluginService.mockUpdateSettingStream(updatedPluginSettings)

    entityStreams = {}
    GameService.mock({
      getLocationImgPath: () => sampleMapImage,
      getEntityStream: (id) => stream(id),
      getRootEntityStream: () => stream(entitiesMocks['mainEntity'].id),
      getLocationStream: () => stream(entitiesMocks['location'].id),
      getKnowledgeBaseStream: () => stream(entitiesMocks['knowledgeBase'].id),
      getQuickActionsStream: () => Rx.Observable.of([]),
    })

    onCreate()

    // Vue.prototype.$router = {
    //   push: () => {},
    //   currentRoute: {
    //     query: {},
    //   },
    // };
    // Vue.prototype.$route = {
    //   query: {},
    // };

    return {
      mounted() {
        onMounted(this)
      },

      beforeUnmount() {
        onDestroyed(this)
      },

      ...definition,
    }
  }

  storyFunction.args = pluginParams.toObject(
    (def) => def.key,
    (def) => def.value,
  )
  storyFunction.argTypes = pluginParams.toObject(
    (def) => def.key,
    (def) => def.spec,
  )

  return storyFunction
}

export const modifyEntity = (entityId, object) => {
  const id = entitiesMocks[entityId]?.id || entityId
  stream(id)
    .first()
    .subscribe((current) => {
      console.log('UPDATED', id, object)
      stream(id).next({
        ...current,
        ...object,
      })
    })
}

export const cloneEntityPayloadId = (entityId, extras = {}) => {
  const id = ids++
  entitiesMocks[id] = {
    ...entitiesMocks[entityId],
    id,
    ...extras,
  }
  idToIdentifier[id] = id
  return id
}
