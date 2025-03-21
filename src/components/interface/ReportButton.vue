<template>
  <div class="report-button-wrapper">
    <Button v-if="large" type="reject" @click="reporting = true">
      Report
      <div class="report-button" />
    </Button>
    <div v-else class="report-button" @click="reporting = true" />

    <Modal v-if="reporting" dialog large @close="reporting = false">
      <template v-slot:title> {{ title }} </template>
      <template v-slot:contents>
        <Vertical>
          <div v-html="description" />
          <Header alt2>Additional information</Header>
          <TextArea v-model:value="additionalInfo" :disabled="processing" />
          <div class="error-text">{{ error }}</div>
          <HorizontalCenter>
            <Button type="reset" @click="confirm()" :processing="processing" :disabled="!!error">
              Report
            </Button>
          </HorizontalCenter>
        </Vertical>
      </template>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    title: {},
    description: {},
    type: {},
    refId: {},
    large: {
      default: false,
      type: Boolean,
    },
  },

  data: () => ({
    reporting: false,
    additionalInfo: '',
    processing: false,
  }),

  computed: {
    error() {
      return ReportCommentValidator(this.additionalInfo)
    },
  },

  methods: {
    confirm() {
      this.processing = true
      GameService.request(REQUEST_CODES.REPORT, {
        type: this.type,
        refId: this.refId,
        additionalInfo: this.additionalInfo,
      }).then((result) => {
        this.processing = false
        if (!result || !result.ok) {
          ToastError('Report failed')
        } else {
          ToastSuccess('Your report has been received')
          this.reporting = false
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.report-button-wrapper {
  display: inline-block;
}

.report-button {
  vertical-align: top;
  width: 1em;
  height: 1em;
  display: inline-block;
  background-image: utils.ui-asset('/icons/report.png');
  background-size: 100% 100%;
  cursor: pointer;

  &:hover {
    @include utils.filter(brightness(1.2));
  }
}
</style>
