#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

const PLUGINS_PATH = './src/plugins'
const pluginsFolderNames = fs.readdirSync(PLUGINS_PATH)

const allPlugins = {}
const importsList = []
const componentList = []

pluginsFolderNames.forEach((pluginsFolderName) => {
  const pluginFolderPath = path.join(PLUGINS_PATH, pluginsFolderName)
  if (!fs.lstatSync(pluginFolderPath).isDirectory()) {
    return
  }
  const specFile = path.join(PLUGINS_PATH, pluginsFolderName, 'spec.json')
  console.log('Checking plugin spec', specFile)
  const spec = JSON.parse(fs.readFileSync(specFile).toString())
  spec.id = pluginsFolderName.replace(/^.\//, '').replace(/\/$/, '').replace(/\//g, '_')

  if (allPlugins[spec.name]) {
    spec.error = `Conflicting plugin name: ${spec.name}, found in:\n${specFile}`
  } else {
    spec.componentNames = {}
    Object.keys(spec.additions).forEach((slot) => {
      const file = spec.additions[slot]
      try {
        const componentName = `PLUGIN_${spec.id}___${slot}`.replace(/-/g, '_')
        importsList.push(`import ${componentName} from './${pluginsFolderName}/${file}'`)
        componentList.push(`app.component('${componentName}', ${componentName})`)
        spec.componentNames[slot] = componentName
      } catch (e) {
        spec.error = `Error in ${file}: ${e.toString()}`
        console.warn(`Failed to load plugin ${specFile}: ${spec.error}`)
      }
    })
    allPlugins[spec.name] = spec
  }
})

let output = `/**
 * This is an automatically generated file, do not edit it directly
 */

`

output += importsList.join('\n')

output += '\n\n'

output += `export const loadPlugins = (app) => {
${componentList.join('\n')}
}

`

output += `window.allPlugins = ${JSON.stringify(allPlugins, null, 2)}`

fs.writeFileSync(path.join(PLUGINS_PATH, 'loader.js'), output)
