<script lang="ts" setup>
import type {UserProfile} from "@/spotify/types";
import {onMounted, ref} from "vue";
import {loadDonut, prepareUserChartData} from "@/components/observable/donut";
import {trimLeaderboard} from "@/famjams/stats";

const props = defineProps<{
  values: [UserProfile, number][],
  title: string,
  subtitle: string,
  
  /**
   * The values to show in the leaderboard.
   * If undefined, will simply show the values themselves.
   */
  leaderboardValues?: any[],
}>()

let donutDivRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  loadDonut(donutDivRef.value!, prepareUserChartData(props.values))
})
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="pb-10">
      <h1 class="font-bold text-5xl text-center text-slate-300 pb-4">
        {{ props.title }}
      </h1>
      <p class="text-base text-center text-slate-400">
        {{ props.subtitle }}
      </p>
    </div>
    <div class="md:flex flex-row items-center justify-center">
      <div class="flex flex-row justify-center pb-6 md:pr-6">
        <div ref="donutDivRef" class="max-w-full w-[320px]"></div>
      </div>
      <div class="p-4 border-slate-400 border-2 rounded-lg text-slate-400">
        <table>
          <tr v-for="([user, value], i) in trimLeaderboard(props.values)"
              class="text-2xl"
              :class="{
              'text-slate-200': ((i === 0) || (props.values[i][1] === props.values[0][1])),
              'text-2xl': ((i === 0) || (props.values[i][1] === props.values[0][1]))
            }"
              :key="user.id">
            <td><div class="pr-4">{{ props.leaderboardValues ? props.leaderboardValues[i] : value }}</div></td>
            <td>{{ user.display_name }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
