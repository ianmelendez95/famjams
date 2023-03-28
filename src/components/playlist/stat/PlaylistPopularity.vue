<script lang="ts" setup>
import type {UserProfile} from "@/spotify/types";
import {onMounted, ref} from "vue";
import {loadDonut, prepareUserChartData} from "@/components/observable/donut";
import {useI18n} from "vue-i18n";

const props = defineProps<{
  averages: [UserProfile, number][]
}>()

const { t } = useI18n()

let donutDivRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  loadDonut(donutDivRef.value!, prepareUserChartData(props.averages))
})
</script>

<template>
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
      <div ref="donutDivRef" class="max-w-full w-[320px]"></div>
    </div>
    <div class="p-4 border-slate-400 border-2 rounded-lg text-slate-400">
      <table>
        <tr v-for="([user, avg], i) in props.averages.slice(0, 3)"
            class="text-2xl"
            :class="{
              'text-slate-200': ((i === 0) || (props.averages[i][1] === props.averages[0][1])),
              'text-2xl': ((i === 0) || (props.averages[i][1] === props.averages[0][1]))
            }"
            :key="user.id">
          <td><div class="pr-4">{{ avg.toFixed(2) }}</div></td>
          <td>{{ user.display_name }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
