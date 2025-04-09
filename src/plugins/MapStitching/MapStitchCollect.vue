<template></template>
<script>
export default rxComponent({
  props: {
    location: {},
    settings: {},
  },
  subscriptions() {
    var nodeDB = {}
    const webAddress = this.settings.webAddress?.replace(/\/$/, '') //Remove trailing slash if present
    const locationStream = GameService.getLocationStream()

    async function SendImage(NodeID) {
      const imgRequest = new Request(`/api/locationGFX/${NodeID}`) //Request this location image.
      const locImg = await fetch(imgRequest)

      const imgBlob = await locImg.blob() // convert to a binary blob.
      const imgAsArray = await imgBlob.arrayBuffer()

      const hashBuffer = await crypto.subtle.digest('SHA-256', imgAsArray) //hash the image
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const imgHash = hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('')

      //Check if Image is needed
      const isImageNeededCORS = await fetch(webAddress + '/hashLink', {
        method: 'POST',
        body: JSON.stringify({ id: NodeID, hash: imgHash }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      })
      const isImageNeeded = await isImageNeededCORS.json()

      if (isImageNeeded == 'NEED') {
        //If image is needed, send to server.
        let formData = new FormData() //Prep the image to be sent
        formData.append('ufile', imgBlob, NodeID + '.jpg')
        fetch(webAddress + '/uploadLink', {
          //And upload.
          method: 'POST',
          body: formData,
        })
      }
    }

    return {
      locationChange: locationStream.tap((loc) => {
        if (webAddress == undefined || nodeDB[loc.id] || loc['indoors']) {
          return //If settings not defined, or node already visited, or indoors, return
        }
        nodeDB[loc.id] = true //Note that we have been at this node now
        SendImage(loc.id)
      }),
    }
  },
})
</script>
