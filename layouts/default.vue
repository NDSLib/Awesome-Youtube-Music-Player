<template>
  <v-app dark class="v-app">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      class="v-navigation-drawer"
    >
      <v-list class="v-list">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
          class="v-list-item"
        >
          <v-list-item-action class="v-list-item-action">
            <v-img class="img" contain width="5vh" :src="get(item.icon)" :alt="item.icon"/>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"/>
      <v-spacer/>
    </v-app-bar>


    <v-main>
      <v-container>
        <nuxt/>
      </v-container>
    </v-main>


    <v-navigation-drawer
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
export default {
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: true,
      items: [
        {
          icon: 'icon/home.svg',
          title: 'Home',
          to: '/'
        },
        {
          icon: 'icon/people.svg',
          title: 'PlayList',
          to: '/playlist'
        }
      ],
      miniVariant: false,
      right: true,
      title: 'Awesome Youtube Music Player'
    }
  },
  methods: {
    get(str: string) {
      return require("../static/" + str)
    }
  }
}
</script>

<style lang="scss">
.v-app{
  .v-navigation-drawer{
    .v-list{
      .v-list-item{
        .v-list-item-action{
          .img{
            //height: 5vh;
          }
        }
      }
    }
  }
}
</style>
