<template>
  <div>
    <v-row justify="center" align="center">
      <v-col class="videos" v-for="video in Videos" cols="12" lg="8" md="6">
        {{ video }}
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-text-field label="VideoName" v-model="search">
      </v-text-field>
      <v-btn color="blue" @click="search_()" :loading="loading">SEARCH</v-btn>
    </v-row>
    <v-row>
      <v-col v-for="video in result" cols="12" lg="4" sm="8" md="6">
        <v-card>
          <NuxtLink :to="'/play?VideoID='+video['ID']">
            <v-img
              :src="video['Thumbnail']"
              :alt="`${video['Title']}のサムネイル`"
              height="300"
            />
          </NuxtLink>
          <v-card-title style="overflow: hidden ;">
            {{ video['Title'] }}
          </v-card-title>
          <v-card-text>
            {{ video['SubTitle'] }}
          </v-card-text>
        </v-card>
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
      search: "マオ",
      result: [],
      loading : false
    }
  },
  methods: {
    pushVideo(data: BrowseDataEntry) {
      //@ts-ignore
      this.$data.Videos.push(data)
    },
    async search_() {
      //@ts-ignore
      this.$data.result = []
      //@ts-ignore
      this.$data.loading = true
      //@ts-ignore
      let res = await this.$axios.get('http://localhost:8858/api/search/' + this.$data.search)
      //@ts-ignore
      res['data']['Entries'].forEach((e) => {
        //@ts-ignore
        e['Videos'].forEach((it) => {
          //@ts-ignore
          this.$data.result.push({'Title': it['title'],'SubTitle':it['subTitle'], 'ID': it['id'], 'Thumbnail': it['thumbnail'][0]['url']})
        })
      })

      //@ts-ignore
      this.$data.loading = false
    }
  }/*,
  async fetch() {
    //@ts-ignore
    let res = await this.$axios.get('http://localhost:8858/api/browse/')
    let browse = parseBrowseData(res['data'])
    browse.contents.forEach((it) => {
      //@ts-ignore
      this.Videos.push(it.getTitle())
    })
  }*/
}
</script>
