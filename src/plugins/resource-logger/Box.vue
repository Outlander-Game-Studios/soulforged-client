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
			dataDict: {'inv':{},'cre':{},'loc':{},'res':{},'path':{}}
		}
	},
    subscriptions() {
      
      //const mainEntity = GameService.getRootEntityStream();
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
			this.dataDict['inv'][item.id] = item;
			this.dataDict['inv'][item.id]["timestamp"] = new Date().getTime();})
		),
        creatures: creatureStream.tap((creatures) => creatures.forEach((cre) => {
			this.dataDict['cre'][cre.id] = cre;
			this.dataDict['cre'][cre.id]["timestamp"] = new Date().getTime();})
		), //Only log if hostile?
		locationDetails: locationStream.tap((loc) => {
			this.dataDict['loc'][loc.id] = loc;
			this.dataDict['loc'][loc.id]["timestamp"] = new Date().getTime();
		}),
		resources: resourceStream.tap((resources) => resources.forEach((resource) => {
			this.dataDict['res'][resource.id] = resource;
			this.dataDict['res'][resource.id]["timestamp"] = new Date().getTime();})
		),
		paths: pathStream.tap((paths) => paths.forEach((path) => {	
			this.dataDict['path'][path.id] = path;
			this.dataDict['path'][path.id]["timestamp"] = new Date().getTime();})
		),
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
