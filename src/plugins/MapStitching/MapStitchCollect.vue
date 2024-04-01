<template></template>
<script>

export default {
  props: {
    location: {},
    settings: {},
  },
  subscriptions() {
    async function hash(string) {
      const hashBuffer = await crypto.subtle.digest('SHA-256', string);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
      return hashHex;
    }
    var nodeDB = {};
    const hashLink = this.settings.hashLink
    const uploadLink = this.settings.uploadLink
    const locationStream = GameService.getLocationStream();
    return {
      locationChange: locationStream.tap((loc) => { //If settings not defined, or node already visited, or indoors, return
        if(this.settings.hashLink == undefined || this.settings.uploadLink == undefined || nodeDB[loc.id] || loc['indoors']){
            return;
        }
        nodeDB[loc.id] = true; //Note that we have been at this node now
        const myRequest = new Request(`/api/locationGFX/${loc.id}`); //Request this location image.
        fetch(myRequest) //Get the image, and convert to a binary blob.
        .then((response) => response.blob())
        .then((myBlob) => {
          nodeDB['lastBlob'] = myBlob; //Save the blob if need to send later. 
          var a = new FileReader();
          a.readAsArrayBuffer(myBlob); //Read the blob as a file.
          a.onloadend = function () { //After being read
              let hashPromise = hash(a.result); //Hash the image
              hashPromise.then((hash) => { //Send the hash, and the location id to be checked.
                  fetch(hashLink, { 
                      method: "POST",
                      body: JSON.stringify({"id" : loc.id, "hash": hash}),
                      headers: {
                          "Content-type": "application/json; charset=UTF-8",
                      }
                  }).then(response => response.json()) //First response is to the preflight stuff it seems. 
                  .then(data => { //But then you get the actual response.
                      if(data == "NEED"){ //If Server needs data
                          let formData = new FormData(); //Prep the image to be sent
                          formData.append("ufile", nodeDB['lastBlob'], loc.id + '.jpg');   
                          fetch(uploadLink, { //And upload.
                              method: "POST",
                              body: formData
                          })
                      }
                  })
              });
          };
        });
      })
    }
  }
};
</script>