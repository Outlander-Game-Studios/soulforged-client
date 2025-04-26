/**
 * This is an automatically generated file, do not edit it directly
 */

import PLUGIN_MapStitching___map_location from './MapStitching/MapStitchCollect.vue'
import PLUGIN_location_finder___map_location from './location-finder/Box.vue'
import PLUGIN_mock___map_location from './mock/Box.vue'
import PLUGIN_resource_logger___map_location from './resource-logger/Box.vue'
import PLUGIN_resource_logger_Auto___map_location from './resource-logger-Auto/ResourcePlugin.vue'

export const loadPlugins = (app) => {
app.component('PLUGIN_MapStitching___map_location', PLUGIN_MapStitching___map_location)
app.component('PLUGIN_location_finder___map_location', PLUGIN_location_finder___map_location)
app.component('PLUGIN_mock___map_location', PLUGIN_mock___map_location)
app.component('PLUGIN_resource_logger___map_location', PLUGIN_resource_logger___map_location)
app.component('PLUGIN_resource_logger_Auto___map_location', PLUGIN_resource_logger_Auto___map_location)
}

window.allPlugins = {
  "Map Stitch Image Collector": {
    "name": "Map Stitch Image Collector",
    "author": "Simbu",
    "enabled": true,
    "settings": [
      {
        "id": "webAddress",
        "name": "Website Address",
        "type": "string"
      }
    ],
    "additions": {
      "map-location": "MapStitchCollect.vue"
    },
    "id": "MapStitching",
    "componentNames": {
      "map-location": "PLUGIN_MapStitching___map_location"
    }
  },
  "Location ID Display and Download": {
    "name": "Location ID Display and Download",
    "author": "Simbu",
    "enabled": true,
    "settings": [],
    "additions": {
      "map-location": "Box.vue"
    },
    "id": "location-finder",
    "componentNames": {
      "map-location": "PLUGIN_location_finder___map_location"
    }
  },
  "Sample Plugin": {
    "name": "Sample Plugin",
    "author": "Ethnar",
    "enabled": false,
    "settings": [
      {
        "id": "text",
        "name": "Extra text",
        "type": "string"
      },
      {
        "id": "boop",
        "name": "Extra Boop",
        "type": "boolean"
      },
      {
        "id": "text2",
        "name": "Extra text 2",
        "type": "string"
      }
    ],
    "additions": {
      "map-location": "Box.vue"
    },
    "id": "mock",
    "componentNames": {
      "map-location": "PLUGIN_mock___map_location"
    }
  },
  "Resource Logger": {
    "name": "Resource Logger",
    "author": "Simbu",
    "enabled": true,
    "settings": [],
    "additions": {
      "map-location": "Box.vue"
    },
    "id": "resource-logger",
    "componentNames": {
      "map-location": "PLUGIN_resource_logger___map_location"
    }
  },
  "Resource Logger Auto": {
    "name": "Resource Logger Auto",
    "author": "Simbu",
    "enabled": true,
    "settings": [
      {
        "id": "userName",
        "name": "User Name",
        "type": "string"
      },
      {
        "id": "website",
        "name": "Website Domain",
        "type": "string"
      },
      {
        "id": "hideDisplay",
        "name": "Hide Plugin",
        "type": "boolean"
      }
    ],
    "additions": {
      "map-location": "ResourcePlugin.vue"
    },
    "id": "resource-logger-Auto",
    "componentNames": {
      "map-location": "PLUGIN_resource_logger_Auto___map_location"
    }
  }
}