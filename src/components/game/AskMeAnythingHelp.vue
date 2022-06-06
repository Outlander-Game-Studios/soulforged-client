<template>
  <Help title="AMA Questions">
    This feature allows you to communicate in an open-ended way with many
    Non-Player Characters.<br />
    You can type your questions which will be received by the game team who will
    provide in-character response at the earliest opportunity.<br />
    <br />
    Once you submit your question you can leave the location and once the
    response is provided you will get a notification and you'll be able to see
    the response no matter where your character is at the time.<br />
    <br />
    Additionally, as you type your question you will be provided with a list of
    similar, previously submitted questions allowing you to see the responses to
    these questions immediately.<br />
    <br />
    Please note that you can have up to
    {{ MAX_PENDING_OPEN_QUESTIONS }} questions pending at any one time.
  </Help>
</template>

<script>
export default {
  data: () => ({
    MAX_PENDING_OPEN_QUESTIONS,
  }),
};
</script>
