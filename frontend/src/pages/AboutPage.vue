<template>
  <q-page class="q-pa-lg">
    <q-card bordered flat class="my-card q-mx-auto">
      <q-img src="images/about.jpg">
        <div class="text-h5 absolute-bottom text-right">About</div>
      </q-img>
      <q-card-section>
        {{ lorem }}
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
export default {
  setup() {
    return {
      lorem:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi cursus tincidunt condimentum. Sed imperdiet purus sapien, vel cursus massa luctus ac. Nunc ac ipsum magna. Cras et metus mattis, aliquam arcu sit amet, rutrum arcu. Quisque sit amet orci pharetra, eleifend magna ut, lacinia arcu. Donec nec velit tincidunt, placerat dui eu, pharetra ex. Mauris dictum, enim at pretium fermentum, lectus ipsum lacinia ex, sed placerat nisi elit at erat. Etiam sed eros eget neque vestibulum faucibus a sit amet eros. Suspendisse eget sapien ac purus dapibus dictum non in felis. Etiam vel elementum quam, efficitur venenatis augue. Phasellus lectus nibh, interdum eu nisi nec, aliquet volutpat ante. Praesent vestibulum molestie arcu ut venenatis. Sed et orci in magna fermentum faucibus sit amet vel nisl. Maecenas malesuada ex magna, a tristique mi dignissim ac. Donec mattis malesuada erat sed semper. Nam nec bibendum ligula.',
    }
  },
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
