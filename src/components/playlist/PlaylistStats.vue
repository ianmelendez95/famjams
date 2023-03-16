<script setup lang="ts">
// import type {UserProfile} from '@/spotify/types'
import type {Track, UserProfile} from "@/spotify/types";
import {getUsersToTracks} from "@/famjams/playlist";
import {onMounted, ref} from "vue";
import {DonutChart} from "@/components/observable/donut";
import {replaceDivBody} from "@/famjams/util";
import {useRoute, useRouter} from "vue-router";

const router = useRouter()
const route = useRoute()

const accessToken = sessionStorage.getItem("accessToken") as string
if (accessToken == null) {
  router.push("/")
}

let d3DonutDiv = ref<HTMLDivElement | null>(null)

const userTracks: Map<UserProfile, Track[]> = await getUsersToTracks(accessToken, route.params.id as string)
const userTrackCounts: [UserProfile, number][] = [...userTracks.entries()].map(([u, ts]) => [u, ts.length])

const chartData = userTrackCounts
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .sort(([_1, c1], [_2, c2]) => c2 - c1)
    .map(([user, count]) => ({ user, value: count }))

onMounted(() => {
  replaceDivBody(d3DonutDiv.value!, DonutChart(chartData))
})
</script>

<template>
  <div ref="d3DonutDiv"></div>
</template>

<style scoped>
  .count-chart {
    background-color: #ddd
  }
</style>
