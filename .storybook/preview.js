console.log('Storybook preview.js is being loaded!')
import './mocks/@utils.js'
import '../src/utils.js'
import '../common/utils/index.js'
import '../src/services/game.mock.js'
import '../src/services/local-storage.mock.js'
import '../src/services/chat.mock.js'
import '../src/services/controls.mock.js'
import '../src/services/sound.mock.js'
import '../src/services/plugin.mock.js'
import { loadAll } from '../load-all.js'

import { setup } from '@storybook/vue3'

setup((app) => {
  loadAll(app)
})

/** @type { import('@storybook/vue3').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
