<script setup lang="ts">
// import type {UserProfile} from '@/spotify/types'
import type {Track, UserProfile} from "@/spotify/types";
import {getUsersToTracks} from "@/famjams/playlist";
import {onMounted, ref} from "vue";
import {buildDonut, prepareUserChartData} from "@/components/observable/donut";
import type { DonutChartData} from "@/components/observable/donut";
import {useRoute, useRouter} from "vue-router";
import {getAccessToken} from "@/spotify/api";
import {useI18n} from "vue-i18n";
import {applySecond, compareSecondNum} from "@/famjams/util";

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const accessToken = getAccessToken()
if (accessToken == null) {
  router.push("/")
}

let donutDivRef_count = ref<HTMLDivElement | null>(null)
let donutDivRef_pop = ref<HTMLDivElement | null>(null)

const userTracks: Map<UserProfile, Track[]> = await getUsersToTracks(accessToken, route.params.id as string)

const userTrackCounts: [UserProfile, number][] = [...userTracks.entries()]
    .map(applySecond(ts => ts.length))
    .sort(compareSecondNum)

const userTrackPop: [UserProfile, number][] = [...userTracks.entries()]
    .map(applySecond(tracks => 
        tracks.reduce((acc, t) => acc + t.track.popularity, 0) / tracks.length))
    .sort(compareSecondNum)

function loadDonut(donutDiv: HTMLDivElement, data: DonutChartData[]) {
  const width = donutDiv.getBoundingClientRect().width
  donutDiv.append(buildDonut(data, width))
}

onMounted(() => {
  loadDonut(donutDivRef_count.value!, prepareUserChartData(userTrackCounts))
  loadDonut(donutDivRef_pop.value!, prepareUserChartData(userTrackPop))
})
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="pb-4">
      <h1 class="font-bold text-5xl text-center text-slate-300 pb-4">
        {{ t('playlistStats.quantity.title1') }}
        <span class="font-bold" style="text-decoration: underline">
          {{ t("playlistStats.quantity.title2") }}
        </span>
        {{ t("playlistStats.quantity.title3") }}
      </h1>
      <p class="text-base text-center text-slate-400">
        {{ t("playlistStats.quantity.subtitle") }}
      </p>
    </div>
    <div class="flex flex-row justify-center pb-6">
      <div ref="donutDivRef_count" class="max-w-full w-[320px]"></div>
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
  <div class="flex flex-col items-center">
    <div class="pb-4">
      <h1 class="font-bold text-5xl text-center text-slate-300 pb-4">
        {{ t('playlistStats.popularity.title') }}
      </h1>
      <p class="text-base text-center text-slate-400">
        {{ t("playlistStats.popularity.subtitle") }}
      </p>
    </div>
    <div class="flex flex-row justify-center pb-6">
      <div ref="donutDivRef_pop" class="max-w-full w-[320px]"></div>
    </div>
    <div class="p-4 border-slate-400 border-2 rounded-lg text-slate-400">
      <table>
        <tr v-for="([user, count], i) in userTrackPop.slice(0, 3)"
            class="text-2xl"
            :class="{
              'text-slate-200': ((i === 0) || (userTrackPop[i][1] === userTrackPop[0][1])),
              'text-2xl': ((i === 0) || (userTrackPop[i][1] === userTrackPop[0][1]))
            }"
            :key="user.id">
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
