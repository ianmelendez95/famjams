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
  DoughnutController,
  ArcElement,
  BarController
} from 'chart.js'
import {DATA, DonutChart} from "@/components/observable/donut";

ChartJS.register(DoughnutController, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const RED    = 'rgba(255, 99, 132, 0.5)'
const BLUE   = 'rgba(54, 162, 235, 0.2)'
const YELLOW = 'rgba(255, 206, 86, 0.2)'
const GREEN  = 'rgba(75, 192, 192, 0.2)'
const ORANGE  = 'rgba(255, 86, 0, 0.2)'

const accessToken = localStorage.getItem("accessToken") as string
const playlistId = localStorage.getItem("playlistId") as string

const userTrackCounts: Map<string, number> = await getUsernamesToTrackCount(accessToken, playlistId)

let countChart = ref<HTMLCanvasElement | null>(null)
let d3DonutDiv = ref<HTMLDivElement | null>(null)

const d3DonutSvg = DonutChart(DATA, d => d.name, d => d.value)

onMounted(() => {
  const entries = [...userTrackCounts.entries()].sort((e1, e2) => e2[1] - e1[1])

  const labels = entries.map(e => e[0])
  const data = entries.map(e => e[1])

  new ChartJS(countChart.value as HTMLCanvasElement, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        label: '# of tracks',
        data,
        borderWidth: 1,
        backgroundColor: [
          RED,
          BLUE,
          YELLOW,
          GREEN,
          ORANGE
        ]
      }]
    },
    options: {
      elements: {
      }
    }
  })

  d3DonutDiv.value!.appendChild(d3DonutSvg)
})
</script>

<template>
  <div v-for="[username, count] in userTrackCounts" :key="username">
    {{ username }}: {{ count }}
  </div>
  <div>
    <canvas id="count-chart" class="count-chart" ref="countChart"></canvas>
  </div>
  <div ref="d3DonutDiv"></div>
</template>

<style scoped>
  .count-chart {
    background-color: #ddd
  }
</style>
