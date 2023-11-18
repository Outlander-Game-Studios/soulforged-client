<template>
  <HorizontalCenter>
    <Container>
      <Spaced> </Spaced>
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
          let fileUrl = GameService.getLocationImgPath(this.location);
          console.log(fileUrl);

          let fileLink = document.createElement('a');
          fileLink.href = fileUrl;
          fileLink.setAttribute('download', this.location.id+ '.jpg');

          document.body.appendChild(fileLink)
          fileLink.click();
          document.body.removeChild(fileLink);
        }
      }
    },
  };
  </script>
