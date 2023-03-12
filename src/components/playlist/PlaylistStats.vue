<script setup lang="ts">
// import type {UserProfile} from '@/spotify/types'
import type {UserProfile} from "@/spotify/types";
import {getUsersToTrackCount} from "@/famjams/playlist";
import {ref, onMounted} from "vue";
import {DonutChart} from "@/components/observable/donut";

const accessToken = localStorage.getItem("accessToken") as string
const playlistId = localStorage.getItem("playlistId") as string

const userTrackCounts: Map<UserProfile, number> = await getUsersToTrackCount(accessToken, playlistId)

let d3DonutDiv = ref<HTMLDivElement | null>(null)

const chartData = [...userTrackCounts.entries()]
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .sort(([_1, c1], [_2, c2]) => c2 - c1)
    .map(([profile, count]) => ({ user: profile, value: count }))

const d3DonutSvg = DonutChart(chartData)

onMounted(() => {
  d3DonutDiv.value!.appendChild(d3DonutSvg)
})
</script>

<template>
  <div v-for="[user, count] in userTrackCounts" :key="user">
    {{ user.display_name }}: {{ count }}
  </div>
  <div ref="d3DonutDiv"></div>
</template>

<style scoped>
  .count-chart {
    background-color: #ddd
  }
</style>
