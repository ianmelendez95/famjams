<script setup lang="ts">
import {getUsernamesToTrackCount} from "@/famjams/playlist";
import {ref, onMounted} from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  BarController
} from 'chart.js'

ChartJS.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const accessToken = localStorage.getItem("accessToken") as string
const playlistId = localStorage.getItem("playlistId") as string

const userTrackCounts: Map<string, number> = await getUsernamesToTrackCount(accessToken, playlistId)

let countChart = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  const labels = [...userTrackCounts.keys()]
  const data = [...userTrackCounts.values()]

  new ChartJS(countChart.value as HTMLCanvasElement, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: '# of tracks',
        data,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
})
</script>

<template>
  <div v-for="[username, count] in userTrackCounts" :key="username">
    {{ username }}: {{ count }}
  </div>
  <div>
    <canvas id="count-chart" class="count-chart" ref="countChart"></canvas>
  </div>
</template>

<style scoped>
  .count-chart {
    background-color: #ddd
  }
</style>
