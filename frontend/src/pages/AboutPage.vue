<template>
  <q-page class="q-pa-lg">
    <q-card bordered elevated class="my-card q-mx-auto">
      <q-img src="images/about.jpg">
        <div class="text-h5 absolute-bottom text-right">About</div>
      </q-img>
      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon name="article" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline>ABOUT</q-item-label>
              <q-item-label>Dashy</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="info" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline>VERSION</q-item-label>
              <q-item-label>0.1.0</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline>DESCRIPTION</q-item-label>
              <q-item-label>Dashy is personal command center and dashboard. It is personal hobby project by <a
                  href="mailto:radek.zitek@proton.me">Radek Zítek.</a></q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-separator inset class="q-ma-md" />
        It si built with the following technologies:
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-img src="images/vue.webp" style="width: 24px" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline>Vue 3</q-item-label>
              <q-item-label><a href="https://vuejs.org/" target="_top">Vue 3</a> is a progressive JavaScript framework
                for building user interfaces.</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-img src="images/quasar.png" style="width: 24px" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline>Quasar</q-item-label>
              <q-item-label><a href="https://quasar.dev/" target="_top">Quasar</a> is an MIT licensed open-source Vue.js
                based framework, which allows you as a web developer to quickly create responsive++ websites/apps in
                many flavours.</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-img src="images/django.png" style="width: 24px" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline>Django</q-item-label>
              <q-item-label><a href="https://www.djangoproject.com/" target="_top">Django</a> is a high-level Python web
                framework that encourages rapid development and clean, pragmatic design.</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
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
        '',
    }
  },
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
