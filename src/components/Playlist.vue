<script setup lang="ts">
/* eslint-disable no-undef */
import {onMounted} from "vue";
import {analyzePlaylist} from "@/famjams/playlist";

onMounted(() => {
  analyzePlaylist()
})
</script>

<template>
  <div>
    Analyzing playlist...
  </div>
</template>
