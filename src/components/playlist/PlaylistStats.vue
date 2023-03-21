<script setup lang="ts">
// import type {UserProfile} from '@/spotify/types'
import type {Track, UserProfile} from "@/spotify/types";
import {getUsersToTracks} from "@/famjams/playlist";
import {onMounted, ref} from "vue";
import {buildDonut} from "@/components/observable/donut";
import {replaceDivBody} from "@/famjams/util";
import {useRoute, useRouter} from "vue-router";
import {getAccessToken} from "@/spotify/api";

const router = useRouter()
const route = useRoute()

const accessToken = getAccessToken()
if (accessToken == null) {
  router.push("/")
}

let donutDivRef = ref<HTMLDivElement | null>(null)

const userTracks: Map<UserProfile, Track[]> = await getUsersToTracks(accessToken, route.params.id as string)
const userTrackCounts: [UserProfile, number][] = [...userTracks.entries()].map(([u, ts]) => [u, ts.length])

const chartData = userTrackCounts
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .sort(([_1, c1], [_2, c2]) => c2 - c1)
    .map(([user, count]) => ({ user, value: count }))

onMounted(() => {
  const donutDiv = donutDivRef.value!
  const width = donutDiv.getBoundingClientRect().width
  donutDiv.append(buildDonut(chartData, width))
  // replaceDivBody(donutDiv, buildDonut(chartData, width))
})
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="pb-4">
      <h1 class="font-bold text-5xl text-center text-slate-300 pb-4">
        Quantity <span class="font-bold" style="text-decoration: underline">is</span> Quality
      </h1>
      <p class="text-base text-center text-slate-400">
        Number of Tracks Contributed
      </p>
    </div>
    <div class="flex flex-row justify-center pb-6">
      <div ref="donutDivRef" class="max-w-full w-[320px]"></div>
    </div>
    <div class="p-4 border-slate-400 border-2 rounded-lg text-slate-400">
      <table>
        <tr v-for="([user, count], i) in userTrackCounts.slice(0, 3)"
            class="text-2xl"
            :class="{
              'text-slate-200': ((i === 0) || (userTrackCounts[i][1] === userTrackCounts[0][1])),
              'text-2xl': ((i === 0) || (userTrackCounts[i][1] === userTrackCounts[0][1]))
            }">
          <td><div class="pr-4">{{ count }}</div></td>
          <td>{{ user.display_name }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
  .count-chart {
    background-color: #ddd
  }
</style>
