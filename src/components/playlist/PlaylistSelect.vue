<script setup lang="ts">
import {useRouter} from "vue-router";
import type {UserPlaylist, UserPlaylists} from "@/spotify/types";
import {getCurrentUserPlaylists, getMultiContributorPlaylists} from "@/famjams/playlist";

const router = useRouter()

const accessToken = sessionStorage.getItem("accessToken") as string
if (accessToken == null) {
  router.push("/")
}

const playlists: UserPlaylist[] = await getMultiContributorPlaylists(accessToken)

if (playlists.length == 1) {
  // if only one playlist available, send to that playlist
  selectPlaylist(playlists[0].id)
}

function selectPlaylist(playlistId: string) {
  router.push("/playlist/" + playlistId)
}

function trimLength(string: string, maxLength: number): string {
  if (string.length <= maxLength) {
    return string
  } else {
    return string.substring(0, maxLength - 3) + "..."
  }
}
</script>

<template>
  <div v-if="playlists.length === 0">
    <p>No playlists with multiple contributors found.</p>
    <p>Start a playlist with your friends!</p>
    <p>(Or strangers if you're desperate)</p>
  </div>
  <div v-else>
    <div v-for="playlist in playlists"
         :key="playlist.id"
         @click="selectPlaylist(playlist.id)"
         class="flex flex-row p-4 cursor-pointer">
      <div class="inline-block pr-4">
        <img v-if="playlist.images[0]" v-bind:src="playlist.images[0].url" class="w-16" alt="[Playlist Image]"/>
      </div>
      <div class="inline-block flex flex-col">
        <div class="text-2xl text-slate-50 inline-block">{{ trimLength(playlist.name, 30) }}</div>
        <div class="inline-block text-slate-400">{{ trimLength(playlist.owner.display_name, 35) }}</div>
      </div>
    </div>
  </div>
</template>

<!--<style scoped>-->

<!--</style>-->