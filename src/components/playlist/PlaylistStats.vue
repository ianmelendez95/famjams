<script setup lang="ts">
// import type {UserProfile} from '@/spotify/types'
import type {Track, UserPlaylist, UserProfile} from "@/spotify/types";
import {getCurrentUserPlaylists, getUsersToTracks} from "@/famjams/playlist";
import {ref, onMounted} from "vue";
import {DonutChart} from "@/components/observable/donut";

const accessToken = localStorage.getItem("accessToken") as string
const playlistId = localStorage.getItem("playlistId") as string

const playlists: UserPlaylist[] = await getCurrentUserPlaylists(accessToken)

const userTracks: Map<UserProfile, Track[]> = await getUsersToTracks(accessToken, playlistId)
const userTrackCounts: [UserProfile, number][] = [...userTracks.entries()].map(([u, ts]) => [u, ts.length])

let d3DonutDiv = ref<HTMLDivElement | null>(null)

const chartData = userTrackCounts
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .sort(([_1, c1], [_2, c2]) => c2 - c1)
    .map(([user, count]) => ({ user, value: count }))

const d3DonutSvg = DonutChart(chartData)

onMounted(() => {
  d3DonutDiv.value!.appendChild(d3DonutSvg)
})
</script>

<template>
<!--  <div v-for="[user, count] in userTrackCounts" :key="user">-->
<!--    {{ user.display_name }}: {{ count }}-->
<!--  </div>-->
  <div>
    <select name="selected_playlist">
      <option :value="playlist.id" v-for="playlist in playlists" :key="playlist.id">
        {{ playlist.name }}
      </option>
    </select>
  </div>
  <div ref="d3DonutDiv"></div>
</template>

<style scoped>
  .count-chart {
    background-color: #ddd
  }
</style>
