<script setup lang="ts">
/* eslint-disable no-undef */
import {onMounted} from "vue";
import {fetchUserTracks} from "@/famjams/tracks";

onMounted(() => {
  const accessToken = localStorage.getItem("accessToken") as string
  const playlistId = localStorage.getItem("playlistId") as string

  const userTracks: Map<string, Track[]> = await fetchUserTracks(accessToken, playlistId)

  console.log("TRACKS: ", userTracks)
})
</script>

<template>
  <div>
    Analyzing playlist...
  </div>
</template>
