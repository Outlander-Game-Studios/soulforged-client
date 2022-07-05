<template>
  <span>
    <p>
      Most buildings have spacing requirements. Available spacing determines the
      maximum size of buildings that can be placed in that location.
    </p>
    <p>Constructed buildings <em>do not</em> affect spacing available.</p>
    <p>
      <LabeledValue label="The spacing sizes in order:">
        {{ spacings }}
      </LabeledValue>
    </p>
  </span>
</template>

<script>
export default {
  data: () => ({ spacings: Object.values(window.SPACING_NAMES).join(", ") }),
};
</script>
