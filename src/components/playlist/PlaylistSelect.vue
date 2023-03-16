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
    <div v-for="playlist in playlists"
         :key="playlist.id"
         @click="selectPlaylist(playlist.id)"
         class="flex-row p-4 border-b border-slate-500 cursor-pointer">
      <div class="inline-block pr-4">
        <img v-if="playlist.images[0]" v-bind:src="playlist.images[0].url" class="w-16" alt="[Playlist Image]"/>
      </div>
      <div class="inline-block">{{ playlist.name }}</div>
    </div>
  </div>
</template>

<!--<style scoped>-->

<!--</style>-->