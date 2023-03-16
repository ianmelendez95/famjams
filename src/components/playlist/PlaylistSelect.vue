<script setup lang="ts">
import {useRouter} from "vue-router";
import type {UserPlaylist} from "@/spotify/types";
import {getCurrentUserPlaylists} from "@/famjams/playlist";

const router = useRouter()

const accessToken = sessionStorage.getItem("accessToken") as string
if (accessToken == null) {
  router.push("/")
}

const playlists: UserPlaylist[] = await getCurrentUserPlaylists(accessToken)

function selectPlaylist(playlistId: string) {
  router.push("/playlist/" + playlistId)
}
</script>

<template>
  <div>
    <div v-for="playlist in playlists" :key="playlist.id" @click="selectPlaylist(playlist.id)">
      {{ playlist.name }}
      <hr/>
    </div>
  </div>
</template>

<!--<style scoped>-->

<!--</style>-->