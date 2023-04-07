<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {loadDonut} from "@/components/observable/donut";
import {onLargeScreen, trimLeaderboard} from "@/famjams/stats";
import type {UserValue} from '@/famjams/stats'

const props = defineProps<{
  title: string,
  subtitle: string,
  
  values: UserValue[]
}>()

let donutDivRef = ref<HTMLDivElement | null>(null)

const largeScreen = onLargeScreen()

onMounted(() => {
  loadDonut(donutDivRef.value!, props.values)
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
          <tr v-for="(userValue, i) in trimLeaderboard(props.values)"
              class="text-2xl"
              :class="{
                  'text-slate-200': ((i === 0) || (props.values[i].value === props.values[0].value)),
                  'text-2xl': ((i === 0) || (props.values[i].value === props.values[0].value))
              }"
              :key="userValue.user.id">
            <td><div class="pr-4">{{ userValue.displayValue ? userValue.displayValue : userValue.value }}</div></td>
            <td>{{ userValue.user.display_name }}</td>
            <td v-if="largeScreen && userValue.image">
              <img :src="userValue.image" class="w-8 ml-4 mr-4" alt="[leaderboard image]"/>
            </td>
            <td v-if="largeScreen && userValue.miscText">{{ userValue.miscText }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
