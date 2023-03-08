<script setup lang="ts">
import {getUsernamesToTrackCount} from "@/famjams/playlist";

const accessToken = localStorage.getItem("accessToken") as string
const playlistId = localStorage.getItem("playlistId") as string

const userTrackCounts: Map<string, number> = await getUsernamesToTrackCount(accessToken, playlistId)
</script>

<template>
  <div v-for="[username, count] in userTrackCounts" :key="username">
    {{ username }}: {{ count }}
  </div>
</template>
