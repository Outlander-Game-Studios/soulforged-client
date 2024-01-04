<template>
  <HorizontalCenter>
    <Container>
      <Spaced>{{ location.id }} </Spaced> <!--Should add some indicator if resources/inventory not loaded... but of well for now. -->
      <Spaced>
        <Button
          @click="ButtonClick()"
        >
        Copy To Clipboard
        </Button>
      </Spaced>
    </Container>
  </HorizontalCenter>
</template>

<script>
  export default {
    props: {
      location: {},
      settings: {},
    },
	data: function() {
		return {
			dataDict: {'inv':{},'cre':{},'loc':{},'res':{},'path':{}, 'op':{}}
		}
	},
    subscriptions() {
      
      const operationStream = GameService.getRootEntityStream().pluck("operation");
      const locationStream = GameService.getLocationStream();
	  const pathStream = locationStream
              .map(({ id, paths }) => ({ id, paths }))
              .distinctUntilChanged(null, JSON.stringify)
              .switchMap(({ paths }) =>
                GameService.getEntitiesStream(paths, ENTITY_VARIANTS.BASE, true)
              )
	  const resourceStream = locationStream
              .map(({ id, resources }) => ({ id, resources }))
              .distinctUntilChanged(null, JSON.stringify)
              .switchMap(({ resources }) =>
                GameService.getEntitiesStream(resources)
              )
	  const creatureStream = locationStream
              .map(({ id, creatures }) => ({ id, creatures }))
              .distinctUntilChanged(null, JSON.stringify)
              .switchMap(({ creatures }) =>
                GameService.getEntitiesStream(creatures, ENTITY_VARIANTS.BASE, true)
              )
      return {
        locationInventory: GameService.getInventoryStream(locationStream).tap((inventory) => inventory.forEach((item) => {
			this.dataDict['inv'][item.id] = {};
			this.dataDict['inv'][item.id]['name'] = item['name'];
			this.dataDict['inv'][item.id]['icon'] = item['icon'];
			this.dataDict['inv'][item.id]['durabilityStageName'] = item['durabilityStageName'];
			this.dataDict['inv'][item.id]['amount'] = item['amount'];
			})
		),
        creatures: creatureStream.tap((creatures) => creatures.forEach((cre) => {
			this.dataDict['cre'][cre.id] = {};
			this.dataDict['cre'][cre.id]['icon'] = cre['icon'];
			this.dataDict['cre'][cre.id]['hostile'] = cre['hostile'];
			this.dataDict['cre'][cre.id]['nonAggressive'] = cre['nonAggressive'];
			})
		), //Only log if hostile?
		locationDetails: locationStream.tap((loc) => {
			this.dataDict['loc'][loc.id] = {};
			this.dataDict['loc'][loc.id]["spacing"] = loc["spacing"];
			this.dataDict['loc'][loc.id]["paths"] = loc["paths"];
			this.dataDict['loc'][loc.id]["creatures"] = loc["creatures"];
			this.dataDict['loc'][loc.id]["resources"] = loc["resources"];
			this.dataDict['loc'][loc.id]["inventory"] = loc["inventory"];
			this.dataDict['loc'][loc.id]["structures"] = loc["structures"];
			this.dataDict['loc'][loc.id]["timestamp"] = new Date().getTime();
		}),
		resources: resourceStream.tap((resources) => resources.forEach((resource) => {
			this.dataDict['res'][resource.id] = {};
			this.dataDict['res'][resource.id]['name'] = resource['name'];
			this.dataDict['res'][resource.id]['icon'] = resource['icon'];
			this.dataDict['res'][resource.id]['density'] = resource['density'];
			})
		),
		paths: pathStream.tap((paths) => paths.forEach((path) => {	
			this.dataDict['path'][path.id] = path;})
		),
		operation: operationStream.tap((operation) => {
			if (operation && operation['type'] === 'TravelOperation' && operation.context && operation.context.pathId) {
				this.dataDict['op'][operation['context']['pathId']] = operation['context'];
				this.dataDict['op'][operation['context']['pathId']]["timestamp"] = new Date().getTime();
			}
		}),
	  };
    },
    methods: {
      ButtonClick() {
        try {
			navigator.clipboard.writeText(JSON.stringify(this.dataDict, null, 2));
			console.log('Content copied to clipboard');
		} catch (err) {
			console.error('Failed to copy: ', err);
		}
      },
    },
  };
  </script>
