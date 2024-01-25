<template>
  <HorizontalCenter>
    <Container>
      <Spaced>{{ FetchErrors }} </Spaced>
      <Spaced>{{ LocationString }} </Spaced>
      <Spaced>{{ location.id }} </Spaced>
    </Container>
  </HorizontalCenter>
</template>

<script>

export default {
  props: {
    location: {},
    settings: {},
  },
  data: function () {
    return {
      nodeDB: {},
      errorsDict: { error: "" },
    };
  },
  computed: {
    LocationString() {
      return this.nodeDB[this.location.id]
        ? "You are at " + this.nodeDB[this.location.id]
        : "Node not found in database";
    },
    FetchErrors() {
      return this.errorsDict["error"] == ""
        ? ""
        : "There was an error: " + this.errorsDict["error"];
    },
  },
  created() {
    if (this.settings.website == null) {
      this.errorsDict["error"] = "No website entered, check Settings";
    } else {
      fetch(this.settings.website + "/GetNodeDict")
        .then((response) => response.json())
        .then((json) => (this.nodeDB = json))
        .catch((error) => (this.errorsDict["error"] = error));
    }
  },
  subscriptions() {
    function SendDataToServer(sendData, settings, errorsDict) {
      if (settings.website == null) {
        errorsDict["error"] = "No website entered, check Settings";
      } else {
        fetch(settings.website + "/SubmitNodeData", {
          method: "POST",
          body: JSON.stringify(sendData),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }).catch((error) => {
          errorsDict["error"] = error;
        });
      }
    }
    const operationStream = GameService.getRootEntityStream().pluck("operation");
    const locationStream = GameService.getLocationStream();
    const pathStream = locationStream
      .map(({ id, paths }) => ({ id, paths }))
      .distinctUntilChanged(null, JSON.stringify)
      .switchMap(({ paths }) =>
        GameService.getEntitiesStream(paths, ENTITY_VARIANTS.BASE, true));
    const resourceStream = locationStream
      .map(({ id, resources }) => ({ id, resources }))
      .distinctUntilChanged(null, JSON.stringify)
      .switchMap(({ resources }) => GameService.getEntitiesStream(resources));
    const creatureStream = locationStream
      .map(({ id, creatures }) => ({ id, creatures }))
      .distinctUntilChanged(null, JSON.stringify)
      .switchMap(({ creatures }) =>
        GameService.getEntitiesStream(creatures, ENTITY_VARIANTS.BASE, true));
    var LocInv = ""
    var CreData = ""
    var LocData = ""
    var OpData = ""
    var ResData = ""

    return {
      locationInventory: GameService.getInventoryStream(locationStream).tap((inventory) => {
        //Not sure what to do about trophies still, or anything with multiple of the same icon. This could cause items to be replaced if icon is used for the update.
        let SendData = {
          node: this.location.id,
          dataType: "Inventory",
          sender: this.settings.userName,
        };
        let dataDict = {};
        inventory.forEach((item) => {
          if (dataDict[item.name]) {
            dataDict[item.name]["amount"] =
              item.durabilityStage == 3
                ? dataDict[item.name]["amount"]
                : dataDict[item.name]["amount"] + item.amount;
          } else {
            dataDict[item.name] = {};
            dataDict[item.name]["amount"] =
              item.durabilityStage == 3 
                ? 0 
                : item.amount;
            dataDict[item.name]["icon"] = item.icon;
          }
        });
        SendData["data"] = dataDict;
        if( JSON.stringify(SendData) != LocInv) {
          LocInv = JSON.stringify(SendData);
          SendDataToServer(SendData, this.settings, this.errorsDict);
        }
      }),
      creatures: creatureStream.tap((creatures) => {
        let SendData = {
          node: this.location.id,
          dataType: "Creatures",
          sender: this.settings.userName,
        };
        let dataDict = {};
        creatures.forEach((cre) => {
          if (dataDict[cre.icon]) {
            if (cre.nonAggressive) {
              dataDict[cre.icon]["nonAggressive"] =
                dataDict[cre.icon]["nonAggressive"] + 1;
            } else {
              dataDict[cre.icon]["aggressive"] =
                dataDict[cre.icon]["aggressive"] + 1;
            }
          } else {
            dataDict[cre.icon] = {
              aggressive: 0,
              nonAggressive: 0,
              hostile: cre.hostile,
            };
            if (cre.nonAggressive) {
              dataDict[cre.icon]["nonAggressive"] =
                dataDict[cre.icon]["nonAggressive"] + 1;
            } else {
              dataDict[cre.icon]["aggressive"] =
                dataDict[cre.icon]["aggressive"] + 1;
            }
          }
        });
        SendData["data"] = dataDict;
        if( JSON.stringify(SendData) != CreData) {
          CreData = JSON.stringify(SendData);
          SendDataToServer(SendData, this.settings, this.errorsDict);
        }
      }), //Only log if hostile?
      locationDetails: locationStream.tap((loc) => {
        let SendData = {
          node: loc.id,
          dataType: "Location",
          sender: this.settings.userName,
        };
        this.location.id = loc.id;
        let dataDict = {};
        dataDict["spacing"] = loc["spacing"];
        dataDict["paths"] = loc["paths"];
        dataDict["structures"] = loc["structures"];
        SendData["data"] = dataDict;
        if( JSON.stringify(SendData) != LocData) {
          LocData = JSON.stringify(SendData);
          SendDataToServer(SendData, this.settings, this.errorsDict);
        }
      }),
      resources: resourceStream.tap((resources) => {
        let SendData = {
          node: this.location.id,
          dataType: "Resource",
          sender: this.settings.userName,
        };
        let dataDict = {};
        resources.forEach((resource) => {
          dataDict[resource.name] = {
            icon: resource.icon,
            density: resource.density,
          };
        });
        SendData["data"] = dataDict;
        if( JSON.stringify(SendData) != ResData) {
          ResData = JSON.stringify(SendData);
          SendDataToServer(SendData, this.settings, this.errorsDict);
        }
      }),
      //paths: pathStream.tap((paths) => {  I am not sure we care about this data any more. I am removing it for now.
      //    SendData = { node: this.location.id, dataType: "Path", sender: this.settings.userName};
      //    dataDict = {};
      //    paths.forEach((path) => {
      //        dataDict[path.id] = path;
      //    });
      //}),
      operation: operationStream.tap((operation) => {
        if (
          operation &&
          operation["type"] === "TravelOperation" &&
          operation.context &&
          operation.context.pathId
        ) {
          let SendData = {
            node: this.location.id,
            dataType: "PathTravelData",
            sender: this.settings.userName,
            data: operation["context"],
          };
          if( JSON.stringify(SendData) != OpData) {
            OpData = JSON.stringify(SendData);
            SendDataToServer(SendData, this.settings, this.errorsDict);
          }
        }
      }),
    };
  },
  methods: {},
};
</script>
