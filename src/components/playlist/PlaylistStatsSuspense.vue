<script setup lang="ts">
import PlaylistStats from "@/components/playlist/PlaylistStats.vue";
</script>

<template>
  <Suspense>
    <template #default>
      <PlaylistStats/>
    </template>
    <template #fallback>
      <div>Analyzing Playlist...</div>
    </template>
  </Suspense>
</template>