<template>
  <div>
    <v-row class="d-flex justify-center">
      <v-col class="d-flex justify-center" cols="8">
        <div style="width:100%">
          <v-card v-if="this.$data.success" style="width: 100%">
            <video ref="video" controls loop style="width: 100%">
              <source :src="url" type="video/mp4"/>
            </video>
            <v-card-title>
              <v-col>
                <a :href="url">{{ VideoID }}</a>
              </v-col>
              <v-col>
                <v-chip-group>
                  <v-chip
                    v-for="volume in VolumeSet"
                    :key="volume['Text']"
                    @click="changeVolume(volume['Value'])"
                  >
                    {{ volume['Text'] }}
                  </v-chip>
                </v-chip-group>
                <v-spacer></v-spacer>
                {{ Math.round(nowVolume * 100) }}%
              </v-col>
            </v-card-title>
          </v-card>
          <div v-else>
            ERROR OCCURRED!
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {Context} from "@nuxt/types";

export default {
  name: "play",
  async asyncData(ctx: Context): Promise<void | object> {
    let videoID: string | (string | null)[] = ctx.query.VideoID
    if (typeof videoID === 'string') {
      let res = await ctx.$axios.get(`http://localhost:8858/api/format/${videoID}`)
      let url = res['data']['url']
      if (url === undefined || url === 'undefined') {
        return {
          VideoID: videoID,
          url: ``,
          success: false
        }
      }

      let uuid = await ctx.$axios.post(`http://localhost:8858/api/get/`, {'url': url})

      return {
        VideoID: videoID,
        url: `http://localhost:8858/api/stream/${uuid['data']['uuid']}`,
        success: true
      }
    } else {
      ctx.redirect('/playError')
    }
  },

  methods: {
    async play(id: string) {
      console.log('Playing!')
      console.log(`ID:${id}`)
      //@ts-ignore
      let res = await this.$axios.get(`http://localhost:8858/api/format/${id}`)
      let url = res['data']['url']
      //@ts-ignore
      // this.$data.url = url
      //@ts-ignore
      // let html = await this.$axios.post(`http://localhost:8858/api/get`,{'url':url})
      //@ts-ignore
      // this.$data.html = html['data']['html']
    },
    changeVolume(amount:number){
      //@ts-ignore
      let volume = Math.min(Math.max(this.$refs.video.volume + amount,0),1)
      //@ts-ignore
      this.$refs.video.volume = volume
      //@ts-ignore
      this.$data.nowVolume = volume
    }
  },

  fetch() {
    //@ts-ignore
    // this.play(this.$data.VideoID)
  },

  data(){
    return {
      VolumeSet:[
        {'Text':'+10%','Value':0.1},
        {'Text':'+1%','Value':0.01},
        {'Text':'-10%','Value':-0.1},
        {'Text':'-1%','Value':-0.01},
      ],
      nowVolume:1
    }
  }
}
</script>

<style scoped>

</style>
