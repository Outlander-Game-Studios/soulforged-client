<template>
  <HorizontalCenter>
    <Container>
      <Spaced>{{ location.id }} </Spaced>
      <Spaced>
	    <Button
          @click="ButtonClick()"
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
    ButtonClick(){
	  console.log( this.location)
	  if(this.location.id && this.location.indoors == undefined){
	  
	  }
	},
  }
};
</script>
