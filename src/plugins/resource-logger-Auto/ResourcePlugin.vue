<template>
  <HorizontalCenter>
    <Container v-if = "!settings.hideDisplay">
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
      fetch(this.settings.website.replace(/\/$/, "") + "/GetNodeDict") //Replace is supposed to remove trailing slash from input.
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
        fetch(settings.website.replace(/\/$/, "") + "/SubmitNodeData", { //Replace is supposed to remove trailing slash from input.
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
    const rootStream = GameService.getRootEntityStream(); //Its kinda wierd to pluck operation, but not environment, but environment doesn't have node id within it.
    //Maybe better to eventually have the rootstream process both instead of being seperate.
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
    var LocInv = "";
    var CreData = "";
    var LocData = "";
    var OpData = "";
    var ResData = "";
    var EnvData = "";
    var LocInvArray = [];
    var CreDataArray = [];
    var ResDataArray = [];
    var currentNodeID = -1;

    return {
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
        currentNodeID = loc.id;
        LocInvArray = loc["inventory"];
        CreDataArray = loc["creatures"];
        ResDataArray = loc["resources"];
        if( JSON.stringify(SendData) != LocData) {
          LocData = JSON.stringify(SendData);
          SendDataToServer(SendData, this.settings, this.errorsDict);
        }
      }),
      locationInventory: GameService.getInventoryStream(locationStream).tap((inventory) => {
        if(inventory.length != LocInvArray.length) {
            return;
        }
        //Not sure what to do about trophies still, or anything with multiple of the same icon. This could cause items to be replaced if icon is used for the update.
        let SendData = {
          node: currentNodeID,
          dataType: "Inventory",
          sender: this.settings.userName,
        };
        let dataDict = {};
        for (const item of inventory) {
          if(!LocInvArray.includes(item.id)) {
              return;
          }
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
        }
        SendData["data"] = dataDict;
        if( JSON.stringify(SendData) != LocInv) {
          LocInv = JSON.stringify(SendData);
          SendDataToServer(SendData, this.settings, this.errorsDict);
        }
      }),
      creatures: creatureStream.tap((creatures) => {
        if(creatures.length != CreDataArray.length) {
            return;
        }
        let SendData = {
          node: currentNodeID,
          dataType: "Creatures",
          sender: this.settings.userName,
        };
        let dataDict = {};
        let eliteDict = {};
        for (const cre of creatures) {
          if(!CreDataArray.includes(cre.id)) {
              return;
          }
          if(cre.eliteIcon){
              eliteDict[cre.id] = cre;
              continue;
          }
          if(dataDict[cre.icon]) {
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
        }
        SendData["data"] = dataDict;
        SendData["elite"] = eliteDict;
        if( JSON.stringify(SendData) != CreData) {
          CreData = JSON.stringify(SendData);
          SendDataToServer(SendData, this.settings, this.errorsDict);
        }
      }),
      resources: resourceStream.tap((resources) => {
        if(resources.length != ResDataArray.length) {
            return;
        }
        let SendData = {
          node: currentNodeID,
          dataType: "Resource",
          sender: this.settings.userName,
        };
        let dataDict = {};
        for (const resource of resources) {
          if(!ResDataArray.includes(resource.id)) {
              return;
          }
          dataDict[resource.name] = {
            icon: resource.icon,
            density: resource.density,
          };
        }
        SendData["data"] = dataDict;
        if( JSON.stringify(SendData) != ResData) {
          ResData = JSON.stringify(SendData);
          SendDataToServer(SendData, this.settings, this.errorsDict);
        }
      }),
      operation: operationStream.tap((operation) => {
        if (
          operation &&
          operation["type"] === "TravelOperation" &&
          operation.context &&
          operation.context.pathId
        ) {
          let SendData = {
            node: currentNodeID,
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
      environment: rootStream.tap((root) => {
        if (
          root &&
          root["environment"]
        ) {
          let SendData = {
            node: root["location"],
            dataType: "Environment",
            sender: this.settings.userName,
            data: root["environment"],
          };
          if( JSON.stringify(SendData) != EnvData) {
            EnvData = JSON.stringify(SendData);
            SendDataToServer(SendData, this.settings, this.errorsDict);
          }
        }
      }),
    };
  },
  methods: {},
};
</script>
