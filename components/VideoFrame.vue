<template>
  <div class="video_frame">

  </div>
</template>

<script lang="ts">
import {Video} from "standard-youtube-music-api/src/dist/Video";

export default {
name: "VideoFrame",
  props:[
    {isRequired:true,name:'video',type:Video}
  ]
}
</script>

<style scoped>

</style>
