import './@utils.js'
import './@location.js'
import './@avatar.js'
import { effects } from './@effects.js'
import bashMoveIcon from './assets/moves/bash.jpg'
import fadeMoveIcon from './assets/moves/fade.jpg'
import fleeMoveIcon from './assets/moves/flee.png'
import punchMoveIcon from './assets/moves/punch.jpg'
import iconStrength from './assets/stats/stats_strength.jpg'
import iconDexterity from './assets/stats/stats_dexterity.jpg'
import iconEndurance from './assets/stats/stats_endurance.jpg'
import iconPerception from './assets/stats/stats_perception.jpg'
import iconIntelligence from './assets/stats/stats_intelligence.jpg'

const statistics = {
  Strength: {
    value: 100,
    icon: iconStrength,
  },
  Dexterity: {
    value: 100,
    icon: iconDexterity,
  },
  Endurance: {
    value: 100,
    icon: iconEndurance,
  },
  Perception: {
    value: 100,
    icon: iconPerception,
  },
  Intelligence: {
    value: 100,
    icon: iconIntelligence,
  },
}

mockEntity(
  'mainEntity',
  () => ({
    actions: [],
    location: mockEntityId('location'),
    avatar: mockEntityId('avatar'),
    environment: [],
    effects: [effects.woundCut, effects.wouldBruise, effects.hunger, effects.moodOk],
    mortalWounds: {
      current: 0,
      max: 3,
    },
    statistics,
    nextAP: {
      gain: 15,
      nextTickSeconds: 15,
    },
    skills: {
      Foraging: 0.1,
      Pathfinding: 0.2,
      Crafting: 0,
      'Combat: unarmed': 0,
      Doctoring: 0,
    },
    actionPoints: 57600 / 3,
    actionPointsMax: 57600,
    inventory: [
      mockEntityId('itemTool'),
      mockEntityId('itemFood1'),
      mockEntityId('itemMaterial'),
      mockEntityId('itemFood2'),
    ],
    carryCapacity: { thresholds: [40, 64, 80], current: 2.5 },
    equipment: { Weapon: mockEntityId('itemWeapon') },
    dead: false,
    trades: [mockEntityId('trade')],
    combatStats: {
      moves: [
        {
          moveId: 'attack',
          name: 'Strike',
          icon: punchMoveIcon,
        },
        {
          moveId: 'attack2',
          name: 'Bash',
          icon: bashMoveIcon,
          cooldown: 3,
          cooldownMax: 5,
        },
        {
          moveId: 'flee',
          name: 'Flee',
          secondary: true,
          icon: fleeMoveIcon,
        },
        {
          moveId: 'attack3',
          name: 'Fade',
          icon: fadeMoveIcon,
        },
      ],
      defense: 0,
    },
    name: 'Bobby',
  }),
  [ENTITY_VARIANTS.BASE, ENTITY_VARIANTS.SELF],
)

mockEntity(
  'mainEntity2',
  () => ({
    actions: [
      {
        actionId: 'trade',
        label: 'Trade',
        actionPoints: 0,
        parameters: [],
      },
    ],
    location: mockEntityId('location'),
    avatar: mockEntityId('avatar2'),
    effects: [effects.woundCut, effects.wouldBruise, effects.hunger, effects.moodOk],
    statistics,
    skills: {
      Foraging: 0.1,
      Pathfinding: 0.2,
      Crafting: 0,
      'Combat: unarmed': 0,
      Doctoring: 0,
    },
    actionPoints: 57600 / 3,
    actionPointsMax: 57600,
    inventory: [mockEntityId('itemCorpse')],
    carryCapacity: { thresholds: [40, 64, 80], current: 2.5 },
    equipment: { Weapon: mockEntityId('itemWeapon') },
    dead: false,
    trades: [],
    combatStats: {
      moves: [
        {
          moveId: 'attack',
          name: 'Strike',
          icon: punchMoveIcon,
        },
        {
          moveId: 'attack2',
          name: 'Bash',
          icon: bashMoveIcon,
          cooldown: 3,
          cooldownMax: 5,
        },
        {
          moveId: 'flee',
          name: 'Flee',
          secondary: true,
          icon: fleeMoveIcon,
        },
        {
          moveId: 'attack3',
          name: 'Fade',
          icon: fadeMoveIcon,
        },
      ],
      defense: 0,
    },
    name: 'Wannabelle VIII',
  }),
  [ENTITY_VARIANTS.BASE, ENTITY_VARIANTS.SELF, ENTITY_VARIANTS.TRADE],
)

GameService.mockRequest(REQUEST_CODES.GET_INFO, (params) => {
  return {}
})
