<script setup lang="ts">
// import type {UserProfile} from '@/spotify/types'
import type {Track, UserPlaylist, UserProfile} from "@/spotify/types";
import {getCurrentUserPlaylists, getUsersToTracks} from "@/famjams/playlist";
import {ref, onMounted} from "vue";
import {DonutChart} from "@/components/observable/donut";
import {clearDivBody, replaceDivBody} from "@/famjams/util";
import {useRouter} from "vue-router";

const router = useRouter()

const accessToken = sessionStorage.getItem("accessToken")
if (accessToken == null) {
  router.push("/")
}

const playlists: UserPlaylist[] = await getCurrentUserPlaylists(accessToken)

let d3DonutDiv = ref<HTMLDivElement | null>(null)

let selectedPlaylistId = ref<string>('')
async function renderSelectedStats() {
  if (!selectedPlaylistId.value) {
    clearDivBody(d3DonutDiv.value!)
    return
  }

  const userTracks: Map<UserProfile, Track[]> = await getUsersToTracks(accessToken, selectedPlaylistId.value)
  const userTrackCounts: [UserProfile, number][] = [...userTracks.entries()].map(([u, ts]) => [u, ts.length])

  const chartData = userTrackCounts
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .sort(([_1, c1], [_2, c2]) => c2 - c1)
      .map(([user, count]) => ({ user, value: count }))

  replaceDivBody(d3DonutDiv.value!, DonutChart(chartData))
}

onMounted(() => {
  renderSelectedStats()
})
</script>

<template>
<!--  <div v-for="[user, count] in userTrackCounts" :key="user">-->
<!--    {{ user.display_name }}: {{ count }}-->
<!--  </div>-->
  <div>
    <select name="selected_playlist" v-model="selectedPlaylistId" @change="renderSelectedStats">
      <option value=""></option>
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
