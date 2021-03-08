<template>
  <div>
    <v-row justify="center" align="center">
      <v-col class="videos" v-for="video in Videos" cols="12" sm="8" md="6">
        {{ video }}
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-text-field label="VideoName" v-model="search">
      </v-text-field>
      <v-btn color="blue" @click="search_()">SEARCH</v-btn>
    </v-row>
    <v-row>
      <v-col v-for="video in result" cols="12" sm="8" md="6">
        {{ video }}
      </v-col>
    </v-row>
  </div>

</template>

<script lang="ts">
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import {Context} from "@nuxt/types";
import {api} from '~/plugins/YoutubeMusicAPI'
import {BrowseData, BrowseDataEntry, parseBrowseData} from "standard-youtube-music-api/src/dist/BrowseData";
import {Video, VideoDetail} from "standard-youtube-music-api/src/dist/Video";
import {sha1} from "~/plugins/SHA1";
import {parseSearchData, SearchEntry} from "standard-youtube-music-api/src/dist/Search";

export default {
  components: {
    Logo,
    VuetifyLogo
  },
  data() {
    return {
      Videos: [],
      search: "",
      result: []
    }
  },
  methods: {
    pushVideo(data: BrowseDataEntry) {
      //@ts-ignore
      this.$data.Videos.push(data)
    },
    async search_() {
      //@ts-ignore
      let res = await this.$axios.get('http://localhost:8858/api/search/' + this.$data.search)
      let data: Array<SearchEntry> = parseSearchData(res['data'])
      data
        .forEach((it) => {
          it.getItems().filter((i) => {
            i.isVideo()
          }).forEach((i) => {
            //@ts-ignore
            this.$data.result.push(`${i.getTitle()}:${i.getVideoID()}`)
          })
        })
    }
  },
  async fetch() {
    //@ts-ignore
    let res = await this.$axios.get('http://localhost:8858/api/browse/')
    let browse = parseBrowseData(res['data'])
    browse.contents.forEach((it) => {
      //@ts-ignore
      this.Videos.push(it.getTitle())
    })
  }
}
</script>
