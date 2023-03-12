<script setup lang="ts">
import {getUsernamesToTrackCount} from "@/famjams/playlist";
import {ref, onMounted} from "vue";
import {DonutChart} from "@/components/observable/donut";

const accessToken = localStorage.getItem("accessToken") as string
const playlistId = localStorage.getItem("playlistId") as string

const userTrackCounts: Map<string, number> = await getUsernamesToTrackCount(accessToken, playlistId)

let d3DonutDiv = ref<HTMLDivElement | null>(null)

const chartData = [...userTrackCounts.entries()]
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .sort(([_1, c1], [_2, c2]) => c2 - c1)
    .map(([uname, count]) => ({ name: uname, value: count }))

const d3DonutSvg = DonutChart(chartData, d => d.name, d => d.value)

onMounted(() => {
  d3DonutDiv.value!.appendChild(d3DonutSvg)
})
</script>

<template>
  <div v-for="[username, count] in userTrackCounts" :key="username">
    {{ username }}: {{ count }}
  </div>
  <div ref="d3DonutDiv"></div>
</template>

<style scoped>
  .count-chart {
    background-color: #ddd
  }
</style>
