<script lang="ts" setup>
import type {UserProfile} from "@/spotify/types";
import {onMounted, ref} from "vue";
import {loadDonut, prepareUserChartData} from "@/components/observable/donut";
import {useI18n} from "vue-i18n";

const props = defineProps<{
  counts: [UserProfile, number][]
}>()

const { t } = useI18n()

let donutDivRef_count = ref<HTMLDivElement | null>(null)

onMounted(() => {
  loadDonut(donutDivRef_count.value!, prepareUserChartData(props.counts))
})
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="pb-10">
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
    <div class="md:flex flex-row items-center justify-center">
      <div class="flex flex-row justify-center pb-6 pr-6">
        <div ref="donutDivRef_count" class="max-w-full w-[320px]"></div>
      </div>
      <div class="p-4 border-slate-400 border-2 rounded-lg text-slate-400">
        <table>
          <tr v-for="([user, count], i) in props.counts.slice(0, 3)"
              class="text-2xl"
              :class="{
              'text-slate-200': ((i === 0) || (props.counts[i][1] === props.counts[0][1])),
              'text-2xl': ((i === 0) || (props.counts[i][1] === props.counts[0][1]))
            }"
              :key="user.id">
            <td><div class="pr-4">{{ count }}</div></td>
            <td>{{ user.display_name }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>