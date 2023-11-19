<template>
  <HorizontalCenter>
    <Container>
      <Spaced><a :href="DownloadLink()" ref="LocationImageDownloadLink" style="display:none" :download="location.id + '.jpg'"></a></Spaced>
      <Spaced>{{ location.id }} </Spaced>
      <Spaced>
        <Button
          @click="ButtonClick()"
          :disabled="location.indoors"
        >
        Download
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
    methods: {
      ButtonClick() {
        console.log( this.location )
        if(this.location.id && (this.location.indoors == undefined)) {
          this.$refs.LocationImageDownloadLink.click()
        }
      },
      DownloadLink() {
        return GameService.getLocationImgPath(this.location);
      }
    },
  };
  </script>
